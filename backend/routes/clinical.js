import express from 'express';
import prisma from '../config/db.js';
import { archivesData } from '../data/mocks.js';

const router = express.Router();

/**
 * 📝 CLINICAL & PRESCRIPTIONS ROUTES
 */

// 1. Get all prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prisma.prescription.findMany({
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
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// 2. Create new prescription
router.post('/prescriptions', async (req, res) => {
    try {
        let doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
        let { patientId, patient: patientName, medications } = req.body;

        if (!patientId && patientName) {
            const parts = patientName.split(' ');
            const p = await prisma.patient.findFirst({
                where: { firstName: { contains: parts[0], mode: 'insensitive' } }
            });
            if (p) patientId = p.id;
        }

        if (!patientId || !doctor) return res.status(400).json({ error: 'Patient or Doctor not found' });

        const newPres = await prisma.prescription.create({
            data: {
                patientId,
                doctorId: doctor.id,
                medications: {
                    create: medications
                },
                status: 'ACTIVE'
            },
            include: { medications: true }
        });
        res.status(201).json({ data: newPres });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// 3. Archives
router.get('/archives', (req, res) => res.json({ data: archivesData }));
router.post('/archives', (req, res) => {
    const newArchive = { id: archivesData.length + 1, ...req.body };
    archivesData.push(newArchive);
    res.status(201).json({ data: newArchive });
});

// 4. RGPD Support (Mocks)
router.get('/rgpd/export/:id', (req, res) => res.json({ data: { patientId: req.params.id, message: "Export RGPD généré" } }));
router.delete('/rgpd/erase/:id', (req, res) => res.json({ data: { success: true, message: "Données anonymisées conformément au RGPD" } }));
router.get('/rgpd/audit-report', (req, res) => res.json({ data: [] }));

export default router;
