import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 📝 CLINICAL & PRESCRIPTIONS ROUTES
 */

// 1. Get all prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prisma.prescription.findMany({
            where: { tenantId: req.user.tenantId },
            include: {
                patient: { select: { firstName: true, lastName: true } },
                medications: true
            }
        });

        const mapped = prescriptions.map(p => ({
            ...p,
            patient: `${p.patient.firstName} ${p.patient.lastName}`,
            medications: p.medications
        }));
        res.json({ data: mapped });
    } catch (err) {
        console.error('Prescription Fetch Error:', err);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// 2. Create new prescription
router.post('/prescriptions', async (req, res) => {
    try {
        let { patientId, patient: patientName, medications } = req.body;

        if (!patientId && patientName) {
            const parts = patientName.split(' ');
            const p = await prisma.patient.findFirst({
                where: { 
                    firstName: { contains: parts[0], mode: 'insensitive' },
                    tenantId: req.user.tenantId
                }
            });
            if (p) patientId = p.id;
        }

        if (!patientId) return res.status(400).json({ error: 'Patient not found' });

        const newPres = await prisma.prescription.create({
            data: {
                tenantId: req.user.tenantId,
                patientId,
                doctorId: req.user.id,
                medications: {
                    create: medications
                },
                status: 'ACTIVE'
            },
            include: { medications: true }
        });
        res.status(201).json({ data: newPres });

    } catch (err) {
        console.error('Prescription Create Error:', err);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// 3. Archives
router.get('/archives', async (req, res) => {
    try {
        // Archives logic: typically old medical records or specific archived patients
        const records = await prisma.medicalRecord.findMany({
            where: { tenantId: req.user.tenantId },
            include: { patient: true },
            take: 100
        });
        res.json({ data: records });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch archives' });
    }
});

export default router;
