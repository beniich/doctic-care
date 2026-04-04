import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';
// import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { createClient } from 'redis';
import auditRequest from './backend/middleware/auditRequest.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import { RedisStore } from 'connect-redis';
import passport from './backend/config/passport.js';
import prisma from './backend/config/db.js';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import authRoutes from './backend/routes/auth.js';
import clinicalRoutes from './backend/routes/clinical.js';
import billingRoutes from './backend/routes/billing.js';
import teleconsultRoutes from './backend/routes/teleconsult.js';
import aiRoutes from './backend/routes/ai.js';
import messagesRoutes from './backend/routes/messages.js';
import notificationsRoutes from './backend/routes/notifications.js';
import analyticsRoutes from './backend/routes/analytics.js';
import { tenantMiddleware } from './backend/middleware/tenant.js';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import { tenantRateLimit } from './backend/middleware/tenantRateLimit.js';
import rgpdRoutes from './backend/routes/rgpd.js';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (already loaded at top)

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // nodeProfilingIntegration(), // disabled due to missing native module
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

const app = express();

// 1. GLOBAL SECURITY HEADERS (Helmet)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https://*"],
            connectSrc: ["'self'", "https://api.stripe.com", process.env.OLLAMA_BASE_URL || "http://localhost:11434"],
            frameSrc: ["'self'", "https://js.stripe.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
        },
    },
}));

// 2. RATE LIMITING
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 auth attempts per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again after an hour'
});

// Apply global limiter to all routes
app.use('/api/', globalLimiter);
// Apply stricter limit to auth and AI routes
app.use('/api/auth/', authLimiter);
app.use('/api/ai/', rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many AI requests, please pace yourself'
}));

// 3. DATA SANITIZATION
app.use(mongoSanitize()); // Prevent NoSQL Injection (even on Postgres, good practice for JSON fields)
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution

app.use(cookieParser());
// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

// Expose CSRF token for frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Sentry Request Handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

// Initialize Services (DB & Cache)
// Prisma initialized in db.js
const redisClient = createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.warn('⚠️ Redis Client Error', err));
(async () => {
    try {
        if (process.env.REDIS_URL) {
            await redisClient.connect();
            console.log('✅ Redis connected');
        }
    } catch (e) {
        console.warn('⚠️ Redis connection failed - proceeding without cache');
    }
})();

// Sentry Request Handler must be the first middleware on the app
// app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
// app.use(Sentry.Handlers.tracingHandler());

// Session Management
let sessionStore = new session.MemoryStore();
if (process.env.REDIS_URL && redisClient.isOpen) {
    sessionStore = new RedisStore({
        client: redisClient,
        prefix: 'doctic:',
    });
}

app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'secret-fallback-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true in prod
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// 3. Multi-Tenant context injected into every request (must be after passport auth)
app.use(tenantMiddleware);
// 4. Rate Limiting par Tenant (Isolation)
app.use('/api/', (req, res, next) => {
    // On ne rate-limite pas les routes d'authentification avec ça (elles ont leur propre limite)
    if (req.path.includes('/auth/')) return next();
    return tenantRateLimit(req, res, next);
});

const PORT = process.env.PORT || 5000;

// Initialize Stripe only if properly configured
let stripe;
if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-10-28.acacia',
    });
    console.log('✅ Stripe initialized');
} else {
    console.warn('⚠️  Stripe not configured - using mock mode');
}

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
}));

// Important: Webhook endpoint needs raw body
app.post('/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.error('⚠️  Webhook signature verification failed.', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                const tenantId = session.metadata?.tenantId;
                const plan = session.metadata?.plan || 'PRO';

                console.log('✅ Payment successful for Tenant:', tenantId, 'Session:', session.id);
                
                if (tenantId) {
                    try {
                        await prisma.tenant.update({
                            where: { id: tenantId },
                            data: {
                                stripeCustomerId: session.customer,
                                stripeSubscriptionId: session.subscription,
                                plan: plan.toUpperCase(),
                                subscriptionStatus: 'active'
                            }
                        });
                        console.log(`✓ Tenant ${tenantId} upgraded to ${plan}`);
                    } catch (e) {
                         console.error(`Erreur maj plan Tenant:`, e);
                    }
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object;
                console.log('🔄 Subscription updated:', subscription.id);
                
                try {
                    await prisma.tenant.updateMany({
                        where: { stripeSubscriptionId: subscription.id },
                        data: {
                            subscriptionStatus: subscription.status,
                            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
                        }
                    });
                } catch (e) {
                    console.error('Erreur webhook subscription updated', e);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const deletedSubscription = event.data.object;
                console.log('🗑️ Subscription deleted:', deletedSubscription.id);
                
                try {
                    await prisma.tenant.updateMany({
                        where: { stripeSubscriptionId: deletedSubscription.id },
                        data: {
                            subscriptionStatus: 'canceled',
                            plan: 'STARTER' // Rétrograde l'accès au bout de la période
                        }
                    });
                } catch (e) {
                    console.error('Erreur webhook subscription deleted', e);
                }
                break;
            }

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
);

// Regular JSON parsing for all other routes
// Regular JSON parsing for all other routes
app.use(bodyParser.json());

import tenantsRoutes from './backend/routes/tenants.js';
import usersRoutes from './backend/routes/users.js';
import patientAuthRoutes from './backend/routes/patientAuth.js';
import patientPortalRoutes from './backend/routes/patientPortal.js';
app.use('/api/tenants', tenantsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/patient/auth', patientAuthRoutes);
app.use('/api/patient/portal', patientPortalRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clinical', clinicalRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/teleconsult', teleconsultRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/rgpd', rgpdRoutes);
// ============================================================================
// HEALTH CHECK (Monitoring)
// ============================================================================
app.get('/api/health', async (req, res) => {
    const health = {
        uptime: process.uptime(),
        timestamp: new Date(),
        status: 'OK',
        services: {
            database: 'UNKNOWN',
            redis: 'UNKNOWN'
        }
    };

    try {
        await prisma.$queryRaw`SELECT 1`;
        health.services.database = 'UP';
    } catch (e) {
        health.services.database = 'DOWN';
        health.status = 'DEGRADED';
    }

    try {
        if (redisClient.isOpen) {
            await redisClient.ping();
            health.services.redis = 'UP';
        } else {
            health.services.redis = 'DISABLED';
        }
    } catch (e) {
        health.services.redis = 'DOWN';
        // Redis might be non-critical depending on config
    }

    const statusCode = health.status === 'OK' ? 200 : 503;
    res.status(statusCode).json(health);
});

// ============================================================================
// IN-MEMORY DATABASES (MOCK)
// ============================================================================

let patients = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.johnson@email.com', age: 34, lastVisit: '15/12/2025', status: 'Actif', phone: '06 12 34 56 78', gender: 'Female', address: '123 Main St, Cityville', medicalHistory: 'Hypertension', allergies: 'Penicillin', medications: 'Metformin' },
    { id: 2, name: 'Jean Martin', email: 'jean.martin@email.com', age: 45, lastVisit: '20/12/2025', status: 'Actif', phone: '06 23 45 67 89', gender: 'Male', address: '456 Oak Ave', medicalHistory: 'Asthma', allergies: 'None', medications: 'Ventolin' },
    { id: 3, name: 'Emma Williams', email: 'emma.williams@email.com', age: 28, lastVisit: '10/01/2026', status: 'Actif', phone: '06 98 76 54 32', gender: 'Female', address: '789 Pine Rd', medicalHistory: 'None', allergies: 'Peanuts', medications: 'None' }
];

let appointments = [
    { id: 1, time: '09:00', patient: 'Sarah Johnson', type: 'Consultation', duration: '30m', status: 'confirmed', location: 'Room 101', provider: 'Dr. Anderson', date: '2024-01-16T09:00', reason: 'Annual check-up', notes: 'Blood work requested' },
    { id: 2, time: '10:30', patient: 'Jean Martin', type: 'Follow-Up', duration: '45m', status: 'scheduled', location: 'Room 102', provider: 'Dr. Anderson', date: '2024-01-16T10:30', reason: 'Follow-up asthma', notes: '' },
    { id: 3, time: '11:45', patient: 'Emma Williams', type: 'Telehealth', duration: '30m', status: 'confirmed', location: 'Online', provider: 'Dr. Anderson', date: '2024-01-16T11:45', reason: 'Consultation', notes: '' }
];

let records = [
    { id: 1, patient: 'Sarah Johnson', type: 'Annual Health Check-up', date: '15/01/2024', status: 'final', provider: 'Dr. Anderson', summary: 'Patient presents for annual wellness examination. Vital signs normal.', attachments: 2 },
    { id: 2, patient: 'Jean Martin', type: 'Complete Blood Count', date: '14/01/2024', status: 'final', provider: 'Dr. Anderson', summary: 'All values within normal range.', attachments: 1 }
];

let invoices = [
    {
        id: 'INV-2024-001',
        patient: 'Sarah Johnson',
        date: '15/01/2024',
        items: [{ description: 'General Consultation', qty: 1, price: 150.00, total: 150.00 }],
        subtotal: 150.00,
        tax: 15.00,
        total: 165.00,
        paymentMethod: 'Credit Card',
        status: 'paid',
        signature: null
    },
    {
        id: 'INV-2024-002',
        patient: 'Jean Martin',
        date: '20/12/2025',
        items: [{ description: 'Suivi Asthma', price: 100.00, qty: 1, total: 100.00 }],
        subtotal: 100.00,
        tax: 10.00,
        total: 110.00,
        paymentMethod: 'Insurance',
        status: 'pending',
        signature: null
    }
];

let prescriptions = [
    { id: 1, patient: 'Sarah Johnson', date: '15/12/2025', medications: [{ name: 'Metformin', dosage: '500mg', frequency: '2x/jour' }], status: 'Active' },
    { id: 2, patient: 'Jean Martin', date: '20/12/2025', medications: [{ name: 'Ventolin', dosage: '100mg', frequency: 'Au besoin' }], status: 'Active' }
];

let archives = [
    { id: 1, patient: 'John Doe', type: 'Dossier médical', date: '15/01/2023', reason: 'Patient déménagé', size: '12 MB' }
];

// STRIPE ROUTES have been migrated to backend/routes/billing.js
// and mounted at /api

// ============================================================================
// AUTHENTICATION
// ============================================================================

// ============================================================================
// AUTHENTICATION
// ============================================================================

// Expose CSRF Token to Frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// ============================================================================
// AUTHENTICATION ROUTES
// ============================================================================

// 1. Google Login
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// 2. Google Callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login?error=auth_failed' }),
    (req, res) => {
        // Successful authentication
        res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
    }
);

// 3. Get Current User
app.get('/api/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            data: { user: req.user }
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

// 4. Logout
app.post('/api/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ data: { success: true } });
    });
});

// Legacy/Dev Mock Login (kept for fallback if needed, but protected)
app.post('/api/auth/login', auditRequest('USER_LOGIN'), (req, res) => {
    const { email, password, role } = req.body;
    // Mock login - accept any email/password for demo
    if (email) {
        res.json({
            data: {
                token: 'mock-jwt-token-12345',
                user: {
                    id: '1',
                    firstName: 'Dr. Anderson',
                    lastName: '',
                    email: email,
                    role: role || 'DOCTOR' // Use CDV role standard: 'DOCTOR'
                }
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// ============================================================================
// PATIENTS ROUTES
// ============================================================================

// ============================================================================
// PATIENTS ROUTES
// ============================================================================

app.get('/api/patients', async (req, res) => {
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

app.post('/api/patients', async (req, res) => {
    try {
        // Basic validation - check if tenant exists, defaulting to first one for migration context
        // In real app, tenantId should come from auth user
        let tenant = await prisma.tenant.findFirst();
        if (!tenant) {
            // Auto-create default tenant if missing
            tenant = await prisma.tenant.create({
                data: { name: 'Default Clinic', slug: 'default-clinic' }
            });
        }

        // Split name if only 'name' provided
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
        res.status(201).json({ data: { ...newPatient, name: `${newPatient.firstName} ${newPatient.lastName}` } });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

app.patch('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPatient = await prisma.patient.update({
            where: { id },
            data: req.body
        });
        res.json({ data: { ...updatedPatient, name: `${updatedPatient.firstName} ${updatedPatient.lastName}` } });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(500).json({ error: 'Failed to update patient' });
    }
});

app.delete('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.patient.delete({ where: { id } });
        res.json({ data: { success: true, id } });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

app.get('/api/patients/:id/history', async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await prisma.patient.findUnique({
            where: { id },
            include: {
                appointments: true,
                prescriptions: { include: { medications: true } },
                documents: true
            }
        });
        if (!patient) return res.status(404).json({ error: 'Patient not found' });
        
        // Return object conforming to frontend expectations
        res.json({
            data: {
                appointments: patient.appointments || [],
                prescriptions: patient.prescriptions || [],
                invoices: [] // Missing specific invoices relation in Prisma right now
            }
        });
    } catch (error) {
        console.error('Error fetching patient history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// ============================================================================
// APPOINTMENTS ROUTES
// ============================================================================

// ============================================================================
// APPOINTMENTS ROUTES
// ============================================================================

app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                patient: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        // Map to match frontend expectations
        const mappedAppointments = appointments.map(a => ({
            ...a,
            patient: `${a.patient.firstName} ${a.patient.lastName}`,
            provider: 'Dr. Anderson' // Placeholder as appointment model doesn't have provider link yet or implicit via auth
        }));
        res.json({ data: mappedAppointments });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.get('/api/appointments/today', async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
                start: { gte: today, lt: tomorrow }
            },
            include: {
                patient: { select: { firstName: true, lastName: true } }
            }
        });

        const mappedAppointments = appointments.map(a => ({
            ...a,
            patient: `${a.patient.firstName} ${a.patient.lastName}`,
            provider: 'Dr. Anderson'
        }));
        res.json({ data: mappedAppointments });
    } catch (err) {
        console.error('Error fetching appointments today:', err);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

app.post('/api/appointments', async (req, res) => {
    try {
        // Need to resolve patientId from name if only patient name provided (legacy frontend)
        // For now assume frontend sends patientId OR we pick first match (risky but okay for migration phase)
        let { patientId, patient: patientName } = req.body;

        if (!patientId && patientName) {
            const parts = patientName.split(' ');
            const p = await prisma.patient.findFirst({
                where: {
                    firstName: { contains: parts[0] },
                    lastName: { contains: parts[1] || '' }
                }
            });
            if (p) patientId = p.id;
        }

        if (!patientId) {
            // Fallback: create dummy patient if name provided, or error
            // For safety, let's require existing patient
            return res.status(400).json({ error: 'Patient ID required' });
        }

        const newApt = await prisma.appointment.create({
            data: {
                start: new Date(req.body.date || new Date().toISOString()),
                end: new Date(new Date(req.body.date).getTime() + 30 * 60000), // Default 30m
                patientId: patientId,
                status: req.body.status ? req.body.status.toUpperCase() : 'PENDING',
                motif: req.body.reason,
                notes: req.body.notes
            }
        });
        res.status(201).json({ data: newApt });
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.patch('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.appointment.update({
            where: { id },
            data: req.body
        });
        res.json({ data: updated });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.appointment.delete({ where: { id } });
        res.json({ data: { success: true } });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// ============================================================================
// RECORDS ROUTES
// ============================================================================

app.get('/api/records', (req, res) => res.json({ data: records }));
app.post('/api/records', (req, res) => {
    const newRecord = { id: records.length + 1, ...req.body };
    records.push(newRecord);
    res.status(201).json({ data: newRecord });
});

// ============================================================================
// INVOICES ROUTES
// ============================================================================

// Mapped from old billing to invoices to match api.ts
app.get('/api/invoices', (req, res) => res.json({ data: invoices }));
app.post('/api/invoices', (req, res) => {
    const newInvoice = { id: `INV-${Date.now()}`, ...req.body };
    invoices.push(newInvoice);
    res.status(201).json({ data: newInvoice });
});
app.patch('/api/invoices/:id', (req, res) => {
    const index = invoices.findIndex(i => i.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Invoice not found' });
    invoices[index] = { ...invoices[index], ...req.body };
    res.json({ data: invoices[index] });
});

// ============================================================================
// PRESCRIPTIONS ROUTES
// ============================================================================

app.get('/api/prescriptions', async (req, res) => {
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

app.post('/api/prescriptions', async (req, res) => {
    try {
        let doctor = await prisma.user.findFirst({ where: { role: 'DOCTOR' } });
        let { patientId, patient: patientName, medications } = req.body;

        if (!patientId && patientName) {
            const parts = patientName.split(' ');
            const p = await prisma.patient.findFirst({
                where: { firstName: parts[0] }
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

// ============================================================================
// ARCHIVES ROUTES
// ======================================// Modular Routes mounted above take precedence.
// The code below is being removed to migrate to the modular architecture.

// ============================================================================
// SERVE FRONTEND (MUST BE LAST)
// ============================================================================

// Sentry Error Handler must be before any other error middleware and after all controllers
// app.use(Sentry.Handlers.errorHandler());

// Serve static files from the "dist" directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return all requests to React app
// Express 5 requires regex for catch-all or specific syntax instead of '*'
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
// Start Server only if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`🚀 Backend server running on http://localhost:${PORT}`);
        console.log(`\n📋 Available API Endpoints:`);
        console.log(`   - Authentication: http://localhost:${PORT}/api/login`);
        console.log(`   - Patients: http://localhost:${PORT}/api/patients`);
        console.log(`   - Appointments: http://localhost:${PORT}/api/appointments`);
        console.log(`   - Billing: http://localhost:${PORT}/api/billing`);
        console.log(`   - Stripe Checkout: http://localhost:${PORT}/api/create-checkout-session`);
        console.log(`   - Stripe Webhooks: http://localhost:${PORT}/api/webhooks/stripe`);
        console.log(`\n💳 Stripe integration ${process.env.STRIPE_SECRET_KEY ? '✅ active' : '⚠️  not configured'}`);
    });
}

// CSRF Error Handler
app.use((err, req, res, next) => {
    if (err.code !== 'EBADCSRFTOKEN') return next(err);
    res.status(403).json({ error: 'Invalid or missing CSRF token' });
});

// Export for Vercel
export default app;




