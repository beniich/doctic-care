import express from 'express';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.SESSION_SECRET || 'patient-secret-key';

/**
 * Middleware pour identifier le patient via le JWT
 */
const patientAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Auth header missing' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.patient = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalide' });
    }
};

/**
 * 1. Informations du patient
 */
router.get('/me', patientAuth, async (req, res) => {
    const patient = await prisma.patient.findUnique({
        where: { id: req.patient.id },
        include: { 
            appointments: { orderBy: { start: 'desc' }, take: 5 },
            tenant: { select: { name: true, slug: true, logo: true } }
        }
    });
    res.json({ data: patient });
});

/**
 * 2. Mes Ordonnances
 */
router.get('/prescriptions', patientAuth, async (req, res) => {
    const prescriptions = await prisma.prescription.findMany({
        where: { patientId: req.patient.id },
        orderBy: { prescriptionDate: 'desc' },
        include: { doctor: { select: { firstName: true, lastName: true } } }
    });
    res.json({ data: prescriptions });
});

/**
 * 3. Mes Rendez-vous
 */
router.get('/appointments', patientAuth, async (req, res) => {
    const appointments = await prisma.appointment.findMany({
        where: { patientId: req.patient.id },
        orderBy: { start: 'desc' }
    });
    res.json({ data: appointments });
});

/**
 * 4. Payer une facture (Lien Stripe)
 */
router.get('/invoices', patientAuth, async (req, res) => {
    const invoices = await prisma.invoice.findMany({
        where: { patientId: req.patient.id },
        orderBy: { createdAt: 'desc' }
    });
    res.json({ data: invoices });
});

export default router;
