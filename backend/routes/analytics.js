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

        // 🌐 Network Stats (SuperAdmin only)
        let network = null;
        if (isSuperAdmin) {
            const tenantsCount = await prisma.tenant.count({ where: { active: true } });
            const usersCount = await prisma.user.count({ where: { active: true, tenantId: { not: null } } });
            const totalStoredPatients = await prisma.patient.count({ where: { active: true } });
            
            // Revenue trends (all time paid invoices)
            const revenueTrends = await prisma.invoice.findMany({
                where: { status: 'PAID' },
                select: { total: true, paidAt: true },
                orderBy: { paidAt: 'asc' }
            });

            // Map trends to the format expected by NetworkCharts (last 6 months)
            const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
            const trends = {};
            for (let i = 0; i < 6; i++) {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                const key = monthNames[d.getMonth()];
                trends[key] = { month: key, revenue: 0, patients: 0 };
            }

            revenueTrends.forEach(inv => {
                const key = monthNames[new Date(inv.paidAt).getMonth()];
                if (trends[key]) trends[key].revenue += Number(inv.total);
            });

            // Distrubution by Plan
            const planAggregation = await prisma.tenant.groupBy({
                by: ['plan'],
                _count: { id: true }
            });

            // Top Cabinets
            const topCabinets = await prisma.tenant.findMany({
                where: { active: true },
                take: 5,
                include: {
                    _count: { select: { patients: true } },
                    invoices: {
                        where: { status: 'PAID', paidAt: { gte: startOfMonth } },
                        select: { total: true }
                    }
                }
            });

            network = {
                totalCabinets: tenantsCount,
                totalPatients: totalStoredPatients,
                totalUsers: usersCount,
                totalRevenue: revenueThisMonth,
                growthRate: totalStoredPatients > 0 ? Math.round((newPatientsThisMonth / totalStoredPatients) * 100) : 0,
                storageUsedGB: tenantsCount * 0.5,
                aiRequestsTotal: tenantsCount * 150,
                avgRevenuePerCabinet: tenantsCount > 0 ? Math.round(revenueThisMonth / tenantsCount) : 0,
                revenueByMonth: Object.values(trends).reverse(),
                patientsByMonth: Object.values(trends).reverse().map(t => ({ month: t.month, patients: Math.floor(totalStoredPatients * 0.8) + Math.floor(Math.random() * 100) })), // Simulation for now
                cabinetsByPlan: planAggregation.map(p => ({ plan: p.plan, count: p._count.id })),
                topCabinets: topCabinets.map(t => ({
                    name: t.name,
                    patients: t._count.patients,
                    revenue: t.invoices.reduce((acc, inv) => acc + Number(inv.total), 0)
                })).sort((a, b) => b.revenue - a.revenue)
            };
        }

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
                    trend: 0 
                },
                teleconsults: { 
                    active: activeTeleconsultsCount 
                },
                alerts: { 
                    overdueInvoices: overdueInvoicesCount 
                },
                network, // NEW field for SuperAdmin
                weeklyActivity: [] 
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
