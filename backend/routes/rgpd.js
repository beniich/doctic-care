import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';
import auditRequest from '../middleware/auditRequest.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 🔒 RGPD / DATA PRIVACY ROUTES
 */

// 1. Export Data (SAR - Subject Access Request)
router.get('/export/:id', auditRequest('DATA_EXPORT'), async (req, res) => {
    try {
        const { id } = req.params;
        // Verify tenant isolation
        const patient = await prisma.patient.findUnique({
            where: { id, tenantId: req.user.tenantId },
            include: {
                appointments: true,
                medicalRecords: true,
                prescriptions: { include: { medications: true } },
                invoices: true
            }
        });

        if (!patient) return res.status(404).json({ error: 'Patient non trouvé' });

        // Prepare the package
        const exportData = {
            metadata: {
                exportedAt: new Date(),
                exportedBy: req.user.id,
                tenant: req.user.tenantId
            },
            patientInfo: patient,
            clinical: {
                records: patient.medicalRecords,
                appointments: patient.appointments,
                prescriptions: patient.prescriptions
            },
            billing: {
                invoices: patient.invoices
            }
        };

        res.json({ data: exportData });
    } catch (error) {
        console.error('RGPD Export Error:', error);
        res.status(500).json({ error: 'Erreur lors de la génération de l\'export' });
    }
});

// 2. Erase Data (Right to be Forgotten)
router.delete('/erase/:id', auditRequest('DATA_ERASE'), async (req, res) => {
    try {
        const { id } = req.params;
        
        // Logical delete/Anonymization for compliance
        await prisma.patient.update({
            where: { id, tenantId: req.user.tenantId },
            data: {
                firstName: 'ANONYMIZED',
                lastName: 'DATA',
                email: `deleted_${Date.now()}@anonymized.com`,
                phone: '0000000000',
                address: 'ANONYMIZED',
                active: false
            }
        });

        res.json({ data: { success: true, message: 'Données anonymisées conformément au RGPD' } });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'anonymisation' });
    }
});

// 3. Audit Report for Compliance
router.get('/audit-report', async (req, res) => {
    try {
        const logs = await prisma.auditLog.findMany({
            where: { tenantId: req.user.tenantId },
            orderBy: { timestamp: 'desc' },
            take: 100
        });
        res.json({ data: logs });
    } catch (error) {
        res.status(500).json({ error: 'Erreur rapport audit' });
    }
});

export default router;
