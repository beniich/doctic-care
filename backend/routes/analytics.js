import express from 'express';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Apply authMiddleware to all analytics routes
router.use(authMiddleware);

/**
 * 📈 ANALYTICS & DASHBOARD ROUTES
 */

// 1. Dashboard summary
router.get('/dashboard', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
        
        // Define filters
        const filter = isSuperAdmin ? {} : { tenantId };
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        // 📊 Patients
        const totalPatients = await prisma.patient.count({ where: { ...filter, active: true } });
        const newPatientsThisMonth = await prisma.patient.count({ 
            where: { ...filter, createdAt: { gte: startOfMonth } } 
        });

        // 📅 Appointments
        const todayAppointmentsCount = await prisma.appointment.count({ 
            where: { ...filter, start: { gte: today }, status: { not: 'CANCELLED' } } 
        });
        const pendingAppointmentsCount = await prisma.appointment.count({ 
            where: { ...filter, status: 'PENDING' } 
        });

        // 💰 Revenue (This Month)
        const revenueAggregation = await prisma.invoice.aggregate({
            _sum: { total: true },
            where: { ...filter, status: 'PAID', paidAt: { gte: startOfMonth } }
        });
        const revenueThisMonth = Number(revenueAggregation._sum.total || 0);

        // 📹 Teleconsults
        const activeTeleconsultsCount = await prisma.teleconsultSession.count({
            where: { ...filter, status: 'IN_PROGRESS' }
        });

        // ⚠️ Alerts
        const overdueInvoicesCount = await prisma.invoice.count({
            where: { ...filter, status: 'OVERDUE' }
        });

        res.json({
            data: {
                patients: { 
                    total: totalPatients, 
                    trend: totalPatients > 0 ? Math.round((newPatientsThisMonth / totalPatients) * 100) : 0, 
                    newThisMonth: newPatientsThisMonth 
                },
                appointments: { 
                    today: todayAppointmentsCount, 
                    pending: pendingAppointmentsCount 
                },
                revenue: { 
                    thisMonth: revenueThisMonth, 
                    trend: 0 // Would need previous month comparison
                },
                teleconsults: { 
                    active: activeTeleconsultsCount 
                },
                alerts: { 
                    overdueInvoices: overdueInvoicesCount 
                },
                weeklyActivity: [] // Could be implemented with more complex grouping
            }
        });
    } catch (error) {
        console.error('Analytics dashboard error:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
});

// 2. Revenue trends
router.get('/revenue', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
        const filter = isSuperAdmin ? {} : { tenantId };

        // Group by month (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const invoices = await prisma.invoice.findMany({
            where: {
                ...filter,
                status: 'PAID',
                paidAt: { gte: sixMonthsAgo }
            },
            select: {
                total: true,
                paidAt: true
            }
        });

        // Simple aggregation in JS (Prisma doesn't have easy group-by-month for PG without raw SQL or many queries)
        const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const trendsMap = {};
        
        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${monthNames[d.getMonth()]}`;
            trendsMap[key] = { month: key, revenue: 0, invoices: 0 };
        }

        invoices.forEach(inv => {
            const monthKey = monthNames[new Date(inv.paidAt).getMonth()];
            if (trendsMap[monthKey]) {
                trendsMap[monthKey].revenue += Number(inv.total);
                trendsMap[monthKey].invoices += 1;
            }
        });

        res.json({ data: Object.values(trendsMap).reverse() });
    } catch (error) {
        console.error('Revenue analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch revenue trends' });
    }
});

// 3. Audit logs summary
router.get('/audit', async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
        const filter = isSuperAdmin ? {} : { tenantId };

        const logs = await prisma.auditLog.findMany({
            where: filter,
            take: 50,
            orderBy: { timestamp: 'desc' },
            include: {
                user: {
                    select: { firstName: true, lastName: true, email: true }
                }
            }
        });

        res.json({ data: logs });
    } catch (error) {
        console.error('Audit analytics error:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

export default router;
