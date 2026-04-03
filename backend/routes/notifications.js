import express from 'express';

const router = express.Router();

/**
 * 🔔 NOTIFICATIONS & REAL-TIME (SSE)
 */

// Shared client set
export const sseClients = new Set();

// 1. Get initial notifications (Mock)
router.get('/', (req, res) => res.json({ data: [] }));

// 2. Mark notification as read
router.patch('/:id/read', (req, res) => res.json({ data: { success: true } }));

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
export const broadcast = (data) => {
    const payload = JSON.stringify({ type: 'notification', data });
    sseClients.forEach(client => client.write(`data: ${payload}\n\n`));
};

export default router;
