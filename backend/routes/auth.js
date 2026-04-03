import express from 'express';
import passport from '../config/passport.js';
import auditRequest from '../middleware/auditRequest.js';

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

// 6. Legacy/Dev Mock Login (Demo fallback)
router.post('/login', auditRequest('USER_LOGIN'), (req, res) => {
    const { email, password, role } = req.body;
    // Mock login - accept any email/password for demo
    if (email) {
        res.json({
            data: {
                token: 'mock-jwt-token-12345',
                user: {
                    id: '1',
                    firstName: 'Dr. Anderson',
                    lastName: '',
                    email: email,
                    role: role || 'DOCTOR'
                }
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
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
