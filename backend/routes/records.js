import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 📂 RECORDS & INVOICES ROUTES (MOCK MODE)
 */

// 1. Get all medical records
router.get('/', async (req, res) => {
    try {
        const records = await prisma.medicalRecord.findMany({
            where: { tenantId: req.user.tenantId },
            include: {
                patient: { select: { firstName: true, lastName: true } }
            },
            orderBy: { recordDate: 'desc' }
        });
        res.json({ data: records });
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ error: 'Failed to fetch medical records' });
    }
});

// 2. Get all invoices
router.get('/invoices', async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: { tenantId: req.user.tenantId },
            include: {
                patient: { select: { firstName: true, lastName: true } }
            },
            orderBy: { invoiceDate: 'desc' }
        });
        res.json({ data: invoices });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ error: 'Failed to fetch invoices' });
    }
});

// 3. Create invoice
router.post('/invoices', async (req, res) => {
    try {
        const { patientId, items, subtotal, taxAmount, total, notes, dueDate } = req.body;
        
        const newInvoice = await prisma.invoice.create({
            data: {
                tenantId: req.user.tenantId,
                patientId,
                invoiceNumber: `INV-${Date.now()}`,
                subtotal,
                taxAmount,
                total,
                status: 'SENT',
                notes,
                dueDate: dueDate ? new Date(dueDate) : null,
                items: {
                    create: items.map(item => ({
                        description: item.description,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        total: item.total
                    }))
                }
            },
            include: { items: true }
        });
        res.status(201).json({ data: newInvoice });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Failed to create invoice' });
    }
});

// 4. Update invoice status
router.patch('/invoices/:id', async (req, res) => {
    try {
        const updatedInvoice = await prisma.invoice.update({
            where: { 
                id: req.params.id,
                tenantId: req.user.tenantId 
            },
            data: req.body
        });
        res.json({ data: updatedInvoice });
    } catch (error) {
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: 'Failed to update invoice' });
    }
});

export default router;
