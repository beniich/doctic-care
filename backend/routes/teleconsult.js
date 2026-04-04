import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 📹 TELECONSULTATION ROUTES
 */

// 1. Get all scheduled sessions
router.get('/', async (req, res) => {
    try {
        const sessions = await prisma.teleconsultSession.findMany({
            where: { tenantId: req.user.tenantId },
            include: { patient: { select: { firstName: true, lastName: true } } },
            orderBy: { scheduledDate: 'asc' }
        });
        res.json({ data: sessions });
    } catch (e) {
        console.error('Teleconsult Fetch Error:', e);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
});

// 2. Schedule new session
router.post('/', async (req, res) => {
    try {
        const { patientId, scheduledAt } = req.body;
        const newSession = await prisma.teleconsultSession.create({
            data: {
                tenantId: req.user.tenantId,
                patientId,
                doctorId: req.user.id,
                scheduledDate: new Date(scheduledAt || Date.now()),
                status: 'SCHEDULED'
            }
        });
        res.json({ data: newSession });
    } catch (e) {
        console.error('Teleconsult Create Error:', e);
        res.status(500).json({ error: 'Failed to schedule session' });
    }
});

// 3. Join session (Generate Daily.io / Jitsi room URL)
router.post('/:id/join', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Use Daily.co API if Key exists, otherwise fallback to Jitsi
        const dailyApiKey = process.env.DAILY_API_KEY;
        let roomUrl = `https://meet.jit.si/DocticRoom_${id}`;
        let roomToken = "dev-token";

        if (dailyApiKey) {
            // Placeholder: await daily.createRoom(...)
            // roomUrl = dailyRoom.url;
        }

        const session = await prisma.teleconsultSession.update({
            where: { id, tenantId: req.user.tenantId },
            data: { status: 'IN_PROGRESS', roomUrl }
        });

        res.json({ data: { roomId: id, roomToken, roomUrl: session.roomUrl } });
    } catch (e) {
        console.error('Teleconsult Join Error:', e);
        res.status(500).json({ error: 'Failed to join session' });
    }
});

// 4. End session
router.post('/:id/end', async (req, res) => {
    try {
        await prisma.teleconsultSession.update({
            where: { id: req.params.id, tenantId: req.user.tenantId },
            data: { status: 'COMPLETED' }
        });
        res.json({ data: { success: true } });
    } catch(e) {
        res.status(500).json({ error: 'Failed to end session' });
    }
});

export default router;
