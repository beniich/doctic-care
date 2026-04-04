import express from 'express';
import auditRequest from '../middleware/auditRequest.js';
import prisma from '../config/db.js';
import { validate, patientSchema } from '../middleware/validate.middleware.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 🏥 PATIENTS ROUTES
 */

// 1. Get all patients (with fuzzy search)
router.get('/', async (req, res) => {
    try {
        const q = req.query.q ? req.query.q.toLowerCase() : '';
        const tenantId = req.user.tenantId;

        const where = {
            tenantId,
            ...(q ? {
                OR: [
                    { firstName: { contains: q, mode: 'insensitive' } },
                    { lastName: { contains: q, mode: 'insensitive' } },
                    { email: { contains: q, mode: 'insensitive' } }
                ]
            } : {})
        };

        const patients = await prisma.patient.findMany({ where });
        const mappedPatients = patients.map(p => ({
            ...p,
            name: `${p.firstName} ${p.lastName}`
        }));
        res.json({ data: mappedPatients });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// 2. Create new patient
router.post('/', auditRequest('PATIENT_CREATE'), validate(patientSchema), async (req, res) => {
    try {
        const tenantId = req.user.tenantId;

        // Parse name parts
        let { firstName, lastName, name } = req.body;
        if (!firstName && name) {
            const parts = name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || '-';
        }

        const newPatient = await prisma.patient.create({
            data: {
                ...req.body,
                firstName: firstName || 'Unknown',
                lastName: lastName || 'Unknown',
                tenantId
            }
        });

        res.status(201).json({ data: newPatient });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

// 3. Get single patient details
router.get('/:id', async (req, res) => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { 
                id: req.params.id,
                tenantId: req.user.tenantId
            }
        });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json({ data: patient });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Failed to fetch patient details' });
    }
});

// 4. Update patient
router.put('/:id', auditRequest('PATIENT_UPDATE'), async (req, res) => {
    try {
        let { firstName, lastName, name } = req.body;
        if (!firstName && name) {
            const parts = name.split(' ');
            firstName = parts[0];
            lastName = parts.slice(1).join(' ') || '-';
        }

        const updated = await prisma.patient.update({
            where: { 
                id: req.params.id,
                tenantId: req.user.tenantId
            },
            data: {
                ...req.body,
                firstName: firstName || undefined,
                lastName: lastName || undefined,
                name: undefined // remove name virtual field if present
            }
        });
        res.json({ data: updated });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});

// 5. Delete patient
router.delete('/:id', auditRequest('PATIENT_DELETE'), async (req, res) => {
    try {
        await prisma.patient.delete({
            where: { 
                id: req.params.id,
                tenantId: req.user.tenantId
            }
        });
        res.json({ data: { success: true } });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

// 6. Archive patient
router.patch('/:id/archive', auditRequest('PATIENT_ARCHIVE'), async (req, res) => {
    try {
        const archived = await prisma.patient.update({
            where: { 
                id: req.params.id,
                tenantId: req.user.tenantId
            },
            data: { active: false }
        });
        res.json({ data: archived });
    } catch (error) {
        console.error('Error archiving patient:', error);
        res.status(500).json({ error: 'Failed to archive patient' });
    }
});

export default router;
