import express from 'express';
import auditRequest from '../middleware/auditRequest.js';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * 🏥 PATIENTS ROUTES
 */

// 1. Get all patients (with fuzzy search)
router.get('/', async (req, res) => {
    try {
        const q = req.query.q ? req.query.q.toLowerCase() : '';
        const where = q ? {
            OR: [
                { firstName: { contains: q, mode: 'insensitive' } },
                { lastName: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } }
            ]
        } : {};

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
router.post('/', auditRequest('PATIENT_CREATE'), async (req, res) => {
    try {
        // Basic validation - check if tenant exists, defaulting to first one for migration context
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            tenant = await prisma.tenant.create({
                data: { name: 'Default Clinic', slug: 'default-clinic' }
            });
        }

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
                tenantId: tenant.id
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
            where: { id: req.params.id }
        });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        res.json({ data: patient });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Failed to fetch patient details' });
    }
});

export default router;
