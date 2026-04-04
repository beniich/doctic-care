import express from 'express';
import passport from '../config/passport.js';
import auditRequest from '../middleware/auditRequest.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * 🔐 AUTHENTICATION ROUTES
 */

// 1. Google Login
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 2. Google Callback
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard`);
    }
);

// 3. Get Current User (Used by AuthContext.tsx)
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            data: { user: req.user }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// 4. Logout
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ data: { success: true } });
    });
});

// 5. CSRF Token (Exposed for frontend)
router.get('/csrf-token', (req, res) => {
    // If using csurf middleware in server.js, it will handle token generation
    if (req.csrfToken) {
        res.json({ csrfToken: req.csrfToken() });
    } else {
        res.json({ success: true, message: 'CSRF token not required' });
    }
});

// 6. Real JWT Login (Production Ready)
router.post('/login', auditRequest('USER_LOGIN'), async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { tenant: true }
        });

        if (!user || !user.active) {
            return res.status(401).json({ error: 'Invalid credentials or inactive account' });
        }

        // Si l'utilisateur n'a pas de mot de passe (OAuth uniquement)
        if (!user.password) {
            return res.status(401).json({ error: 'Please use Google Login for this account' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Update failed attempts
            await prisma.user.update({
                where: { id: user.id },
                data: { failedLoginAttempts: { increment: 1 } }
            });
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Reset failed attempts on success
        await prisma.user.update({
            where: { id: user.id },
            data: { 
                failedLoginAttempts: 0,
                lastLogin: new Date()
            }
        });

        // Generate JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                role: user.role,
                tenantId: user.tenantId 
            },
            process.env.JWT_SECRET || 'your-fallback-secret',
            { expiresIn: '24h' }
        );

        res.json({
            data: {
                token,
                user: {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    tenantId: user.tenantId,
                    tenantName: user.tenant?.name
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 7. Accept Invitation
router.post('/accept-invite', async (req, res) => {
    const { token, firstName, lastName, password } = req.body;

    if (!token) return res.status(400).json({ error: 'Token is required' });

    try {
        const invitation = await prisma.invitation.findUnique({
            where: { token },
            include: { tenant: true }
        });

        if (!invitation || invitation.acceptedAt || invitation.expiresAt < new Date()) {
            return res.status(400).json({ error: 'Invalid or expired invitation' });
        }

        const newUser = await prisma.user.create({
            data: {
                email: invitation.email,
                firstName,
                lastName,
                role: invitation.role,
                tenantId: invitation.tenantId,
                active: true
            }
        });

        await prisma.invitation.update({
            where: { id: invitation.id },
            data: { acceptedAt: new Date() }
        });

        res.json({ 
            success: true, 
            message: 'Compte créé avec succès',
            data: { email: newUser.email }
        });
    } catch (error) {
        console.error('Accept invite error:', error);
        res.status(500).json({ error: 'Failed to accept invitation' });
    }
});

export default router;
