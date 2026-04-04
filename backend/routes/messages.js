import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 📨 MESSAGING ROUTES
 */

// 1. Get all conversations for current user
router.get('/conversations', async (req, res) => {
    try {
        const conversations = await prisma.conversation.findMany({
            where: { 
                tenantId: req.user.tenantId,
                userId: req.user.id
            },
            include: {
                patient: { select: { firstName: true, lastName: true, avatar: true } },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        res.json({ data: conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// 2. Get messages for a specific conversation
router.get('/conversations/:id/messages', async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: 'asc' }
        });
        
        // Mark as read if receiver is user
        await prisma.message.updateMany({
            where: { 
                conversationId: id,
                isRead: false,
                senderRole: 'PATIENT' // User reads patient's messages
            },
            data: { isRead: true, readAt: new Date() }
        });

        res.json({ data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// 3. Send a message
router.post('/conversations/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({ error: 'Message content is required' });

        const message = await prisma.message.create({
            data: {
                conversationId: id,
                senderId: req.user.id,
                senderRole: req.user.role,
                content
            }
        });

        // Update conversation timestamp
        await prisma.conversation.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        res.status(201).json({ data: message });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// 4. Start a new conversation with a patient
router.post('/start', async (req, res) => {
    try {
        const { patientId, subject } = req.body;

        if (!patientId) return res.status(400).json({ error: 'Patient ID is required' });

        // Upsert conversation
        const conversation = await prisma.conversation.upsert({
            where: {
                userId_patientId: {
                    userId: req.user.id,
                    patientId
                }
            },
            update: { subjects: subject },
            create: {
                tenantId: req.user.tenantId,
                userId: req.user.id,
                patientId,
                subjects: subject
            },
            include: {
                patient: { select: { firstName: true, lastName: true } }
            }
        });

        res.status(201).json({ data: conversation });
    } catch (error) {
        console.error('Error starting conversation:', error);
        res.status(500).json({ error: 'Failed to start conversation' });
    }
});

export default router;
