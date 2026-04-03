import express from 'express';

const router = express.Router();

/**
 * 📈 ANALYTICS & DASHBOARD ROUTES
 */

// 1. Dashboard summary
router.get('/dashboard', (req, res) => {
    res.json({
        data: {
            patients: { total: 42, trend: 12, newThisMonth: 5 },
            appointments: { today: 8, pending: 2 },
            revenue: { thisMonth: 12000, trend: 5 },
            teleconsults: { active: 2 },
            weeklyActivity: [],
            alerts: { overdueInvoices: 1 }
        }
    });
});

// 2. Revenue trends
router.get('/revenue', (req, res) => {
    res.json({
        data: [
            { month: 'Jan', revenue: 4000, invoices: 12 },
            { month: 'Fév', revenue: 5500, invoices: 18 },
            { month: 'Mar', revenue: 8000, invoices: 24 }
        ]
    });
});

// 3. Audit logs summary
router.get('/audit', (req, res) => {
    res.json({ data: [] });
});

export default router;
