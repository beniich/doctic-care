import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 🔔 NOTIFICATIONS & REAL-TIME (SSE)
 */

// Shared client set
export const sseClients = new Set();

// 1. Get initial notifications (Real)
router.get('/', async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { tenantId: req.user.tenantId, userId: null },
                    { userId: req.user.id }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
        res.json({ data: notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// 2. Mark notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        await prisma.notification.update({
            where: { id: req.params.id },
            data: { isRead: true }
        });
        res.json({ data: { success: true } });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// 2b. Mark ALL as read
router.post('/read-all', async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: {
                OR: [
                    { tenantId: req.user.tenantId, userId: null },
                    { userId: req.user.id }
                ],
                isRead: false
            },
            data: { isRead: true }
        });
        res.json({ data: { success: true } });
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});

// 3. Main SSE stream (EventSource endpoint)
router.get('/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders(); 

    sseClients.add(res);

    req.on('close', () => {
        sseClients.delete(res);
    });

    // Send connection success message
    res.write(`data: ${JSON.stringify({ type: 'connected', message: 'SSE Connection Established' })}\n\n`);
    
    // Heartbeat ping every 30s to keep connection alive
    const intervalId = setInterval(() => {
        res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
    }, 30000);

    req.on('close', () => clearInterval(intervalId));
});

// 4. Helper for testing broadcasts
router.post('/test-broadcast', (req, res) => {
    const payload = JSON.stringify({ type: 'notification', data: req.body });
    sseClients.forEach(client => client.write(`data: ${payload}\n\n`));
    res.json({ data: { success: true, clients: sseClients.size } });
});

// Global broadcast function for other routes
export const broadcast = async (data) => {
    try {
        // Persist notification in DB
        const newNotification = await prisma.notification.create({
            data: {
                tenantId: data.tenantId,
                userId: data.userId,
                title: data.title,
                message: data.message || data.content,
                type: data.type || 'INFO',
                link: data.link,
                metadata: data.metadata || {}
            }
        });

        const payload = JSON.stringify({ type: 'notification', data: newNotification });
        sseClients.forEach(client => {
            // Ideally check client's tenantId before writing
            client.write(`data: ${payload}\n\n`);
        });
    } catch (error) {
        console.error('Failed to broadcast/persist notification:', error);
    }
};

export default router;
