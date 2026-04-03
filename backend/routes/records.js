import express from 'express';
import { recordsData, invoicesData } from '../data/mocks.js';

const router = express.Router();

/**
 * 📂 RECORDS & INVOICES ROUTES (MOCK MODE)
 */

router.get('/', (req, res) => res.json({ data: recordsData }));

// Invoices
router.get('/invoices', (req, res) => res.json({ data: invoicesData }));

router.post('/invoices', (req, res) => {
    const newInvoice = { id: `INV-${Date.now()}`, ...req.body };
    invoicesData.push(newInvoice);
    res.status(201).json({ data: newInvoice });
});

router.patch('/invoices/:id', (req, res) => {
    const index = invoicesData.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
    invoicesData[index] = { ...invoicesData[index], ...req.body };
    res.json({ data: invoicesData[index] });
});

export default router;
