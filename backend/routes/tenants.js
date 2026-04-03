import express from 'express';
import prisma from '../config/db.js';

const router = express.Router();

// Middleware de vérification SUPER_ADMIN
const requireSuperAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ error: 'Accès refusé. SUPER_ADMIN requis.' });
    }
    next();
};

// 1. Lister tous les tenants (Tableau de bord Super Admin)
router.get('/', requireSuperAdmin, async (req, res) => {
    try {
        const tenants = await prisma.tenant.findMany({
            include: {
                _count: {
                    select: { users: true, patients: true, appointments: true, invoices: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ data: tenants });
    } catch (error) {
        console.error('Erreur lister tenants:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des cliniques' });
    }
});

// 2. Créer un nouveau tenant (Clinique)
router.post('/', requireSuperAdmin, async (req, res) => {
    try {
        const { name, slug, plan, adminEmail, adminFirstName, adminLastName } = req.body;
        
        // Transaction: créer tenant + créer son premier admin
        const tenant = await prisma.$transaction(async (tx) => {
            const newTenant = await tx.tenant.create({
                data: { name, slug, plan: plan || 'STARTER' }
            });

            if (adminEmail) {
                await tx.user.create({
                    data: {
                        tenantId: newTenant.id,
                        email: adminEmail,
                        firstName: adminFirstName || 'Admin',
                        lastName: adminLastName || '',
                        role: 'ADMIN', // TENANT_ADMIN dans le plan, on garde ADMIN pour la compatibilité
                        active: true
                    }
                });
            }

            return newTenant;
        });

        res.status(201).json({ data: tenant });
    } catch (error) {
        if (error.code === 'P2002') return res.status(400).json({ error: 'Ce sous-domaine/slug existe déjà' });
        console.error('Erreur création tenant:', error);
        res.status(500).json({ error: 'Erreur lors de la création de la clinique' });
    }
});

// 3. Obtenir les détails d'un tenant spécifique
router.get('/:id', requireSuperAdmin, async (req, res) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.params.id },
            include: { users: true }
        });
        if (!tenant) return res.status(404).json({ error: 'Clinique non trouvée' });
        res.json({ data: tenant });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// 4. Mettre à jour un tenant
router.patch('/:id', requireSuperAdmin, async (req, res) => {
    try {
        const tenant = await prisma.tenant.update({
            where: { id: req.params.id },
            data: req.body
        });
        res.json({ data: tenant });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});

// 5. Supprimer (Désactiver) un tenant
router.delete('/:id', requireSuperAdmin, async (req, res) => {
    try {
        // Au lieu de supprimer physiquement, on désactive
        const tenant = await prisma.tenant.update({
            where: { id: req.params.id },
            data: { active: false, subscriptionStatus: 'canceled' }
        });
        res.json({ data: tenant });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la désactivation' });
    }
});

export default router;
