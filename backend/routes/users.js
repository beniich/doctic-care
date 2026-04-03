import express from 'express';
import prisma from '../config/db.js';
import { requireRole, isAdmin } from '../middleware/rbac.js';
import { requireQuota } from '../middleware/planGuard.js';
import crypto from 'crypto';

const router = express.Router();

// 1. Lister les utilisateurs du tenant actuel (ADMIN+)
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { tenantId: req.tenantId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        active: true,
        lastLogin: true,
        createdAt: true
      }
    });

    res.json({ data: users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 2. Inviter un nouvel utilisateur (ADMIN+)
// requireQuota('users') vérifie qu'on ne dépasse pas la limite du plan
router.post('/invite', isAdmin, requireQuota('users'), async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ error: 'Email and role are required' });
    }

    // Vérifier si l'utilisateur existe déjà dans ce tenant
    const existingUser = await prisma.user.findFirst({
      where: { email, tenantId: req.tenantId }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists in this clinic' });
    }

    // Créer un token d'invitation
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expire dans 7 jours

    const invitation = await prisma.invitation.create({
      data: {
        email,
        role,
        token,
        expiresAt,
        tenantId: req.tenantId,
        invitedById: req.user.id
      }
    });

    // TODO: Envoyer l'email d'invitation ici (NodeMailer/SendGrid)
    console.log(`[INVITATION] Link: ${process.env.FRONTEND_URL}/accept-invite/${token}`);

    res.status(201).json({
      message: 'Invitation sent successfully',
      data: { email, role, expiresAt }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// 3. Lister les invitations en attente
router.get('/invitations', isAdmin, async (req, res) => {
  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        tenantId: req.tenantId,
        acceptedAt: null,
        expiresAt: { gt: new Date() }
      }
    });
    res.json({ data: invitations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending invitations' });
  }
});

// 4. Supprimer/Révoquer un utilisateur
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // On ne peut pas se supprimer soi-même
    if (id === req.user.id) {
      return res.status(400).json({ error: 'You cannot remove yourself' });
    }

    // Désactivation au lieu de suppression physique pour garder l'intégrité des logs
    await prisma.user.update({
      where: { id, tenantId: req.tenantId },
      data: { active: false }
    });

    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove user' });
  }
});

// 5. Inverser le statut actif d'un utilisateur
router.patch('/:id/toggle-active', isAdmin, async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, tenantId: req.tenantId }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    await prisma.user.update({
      where: { id: user.id },
      data: { active: !user.active }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

export default router;
