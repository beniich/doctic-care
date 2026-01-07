import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { createClient } from 'redis';
import auditRequest from './backend/middleware/auditRequest.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import session from 'express-session';
import RedisStore from 'connect-redis';
import passport from './backend/config/passport.js';
import prisma from './backend/config/db.js';

// Define __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Sentry
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        nodeProfilingIntegration(),
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
});

const app = express();

app.use(cookieParser());
// Setup CSRF protection
const csrfProtection = csrf({ cookie: true });

// Expose CSRF token for frontend
app.get('/api/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Sentry Request Handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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

app.use(cors());

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
            case 'checkout.session.completed':
                const session = event.data.object;
                console.log('✅ Payment successful:', session.id);
                // TODO: Update your database - mark user as subscribed
                // Example: await updateUserSubscription(session.metadata.userId, session.subscription);
                break;

            case 'invoice.paid':
                const paidInvoice = event.data.object;
                console.log('💰 Invoice paid:', paidInvoice.id);
                // TODO: Extend subscription, send receipt email
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('❌ Invoice payment failed:', failedInvoice.id);
                // TODO: Notify user, attempt retry, or suspend service
                break;

            case 'customer.subscription.created':
                const createdSubscription = event.data.object;
                console.log('🆕 Subscription created:', createdSubscription.id);
                // TODO: Activate features for user
                break;

            case 'customer.subscription.updated':
                const updatedSubscription = event.data.object;
                console.log('🔄 Subscription updated:', updatedSubscription.id);
                // TODO: Update subscription status, handle plan changes
                break;

            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                console.log('🗑️ Subscription deleted:', deletedSubscription.id);
                // TODO: Mark subscription as canceled in database, downgrade to free
                break;

            case 'customer.subscription.trial_will_end':
                const trialEndingSub = event.data.object;
                console.log('⏰ Trial ending soon:', trialEndingSub.id);
                // TODO: Send reminder email about trial ending
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    }
);

// Regular JSON parsing for all other routes
// Regular JSON parsing for all other routes
app.use(bodyParser.json());

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

// Mock subscriptions database
let subscriptions = {};

// ============================================================================
// STRIPE ROUTES (WITH MOCK FALLBACK)
// ============================================================================

const isStripeConfigured = () =>
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith('sk_') &&
    !process.env.STRIPE_SECRET_KEY.includes('YOUR_SECRET_KEY');

// Mock helpers
const mockCheckout = (plan, billingPeriod) => {
    return {
        url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/pricing?success=true&session_id=mock_session_${Date.now()}`
    };
};

const mockCreatePortal = () => {
    return {
        url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/subscription?portal_acting=true`
    };
};

// Create Checkout Session
app.post('/api/create-checkout-session', async (req, res) => {
    const { plan, billingPeriod, email, userId } = req.body;

    if (!email) return res.status(400).json({ error: 'Email required' });

    // MOCK MODE if Stripe not configured
    if (!isStripeConfigured()) {
        console.log('⚠️ Stripe not configured. Using MOCK RESPONSE.');

        // Update mock DB to simulate successful subscription immediately for testing
        const mockSubId = `sub_mock_${Date.now()}`;
        subscriptions[userId || 'demo-user'] = {
            id: mockSubId,
            plan: plan,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false
        };

        return res.json(mockCheckout(plan, billingPeriod));
    }

    // REAL STRIPE LOGIC
    let priceId;
    if (plan === 'professional') {
        priceId = billingPeriod === 'annual'
            ? process.env.STRIPE_PRICE_PRO_ANNUAL
            : process.env.STRIPE_PRICE_PRO_MONTHLY;
    }

    if (!priceId) return res.status(400).json({ error: 'Invalid plan or billing period' });

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: email,
            success_url: `${process.env.FRONTEND_URL}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
            metadata: { plan, billingPeriod, userId: userId || '' },
            subscription_data: { trial_period_days: 14 },
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// Create Stripe Customer Portal Session
app.post('/api/create-portal-session', async (req, res) => {
    // MOCK MODE
    if (!isStripeConfigured()) {
        return res.json(mockCreatePortal());
    }

    const { customerId } = req.body;
    if (!customerId) return res.status(400).json({ error: 'Customer ID required' });

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.FRONTEND_URL}/subscription`,
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Upgrade subscription
app.post('/api/upgrade-subscription', async (req, res) => {
    // MOCK MODE
    if (!isStripeConfigured()) {
        const { subscriptionId, newPriceId } = req.body;
        // Mock update
        return res.json({ success: true, subscription: { id: subscriptionId, items: { data: [{ price: { id: newPriceId } }] } } });
    }

    const { subscriptionId, newPriceId } = req.body;
    if (!subscriptionId || !newPriceId) return res.status(400).json({ error: 'Subscription ID and new price ID required' });

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [{
                id: subscription.items.data[0].id,
                price: newPriceId,
            }],
            proration_behavior: 'create_prorations',
        });
        res.json({ success: true, subscription: updatedSubscription });
    } catch (error) {
        console.error('Error upgrading subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get subscription info
app.get('/api/subscription', async (req, res) => {
    // Mock: In production, get userId from authenticated session
    const userId = req.query.userId || 'user-1';
    // Fallback to demo-user if user-1 has no sub (for easy testing)
    const mockSubscription = subscriptions[userId] || subscriptions['demo-user'] || null;

    res.json({
        subscription: mockSubscription || {
            plan: 'free',
            status: 'active',
            currentPeriodEnd: null,
            cancelAtPeriodEnd: false
        }
    });
});

// Cancel subscription
app.post('/api/cancel-subscription', async (req, res) => {
    const userId = req.body.userId || 'user-1';

    // MOCK MODE logic included in main flow via mock DB update
    if (!isStripeConfigured()) {
        if (subscriptions[userId]) {
            subscriptions[userId].cancelAtPeriodEnd = true;
            return res.json({ success: true, subscription: subscriptions[userId] });
        } else if (subscriptions['demo-user']) {
            subscriptions['demo-user'].cancelAtPeriodEnd = true;
            return res.json({ success: true, subscription: subscriptions['demo-user'] });
        }
        return res.json({ success: true });
    }

    const subscriptionId = req.body.subscriptionId;
    if (!subscriptionId) return res.status(400).json({ error: 'Subscription ID required' });

    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        // Update local mock DB
        if (subscriptions[userId]) {
            subscriptions[userId] = { ...subscriptions[userId], cancelAtPeriodEnd: true };
        }

        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: error.message });
    }
});

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
app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            isAuthenticated: true,
            user: req.user
        });
    } else {
        res.status(401).json({ isAuthenticated: false });
    }
});

// 4. Logout
app.post('/api/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.json({ success: true });
    });
});

// Legacy/Dev Mock Login (kept for fallback if needed, but protected)
app.post('/api/login', auditRequest('USER_LOGIN'), (req, res) => {
    const { email, password, role } = req.body;
    // Mock login - accept any email/password for demo
    if (email) {
        res.json({
            token: 'mock-jwt-token-12345',
            user: {
                id: '1',
                name: 'Dr. Anderson',
                email: email,
                role: role || 'doctor'
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
        // Map to match frontend expectations if needed (e.g. combine names)
        const mappedPatients = patients.map(p => ({
            ...p,
            name: `${p.firstName} ${p.lastName}`
        }));
        res.json(mappedPatients);
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
        res.status(201).json({ ...newPatient, name: `${newPatient.firstName} ${newPatient.lastName}` });
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

app.put('/api/patients/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPatient = await prisma.patient.update({
            where: { id },
            data: req.body
        });
        res.json({ ...updatedPatient, name: `${updatedPatient.firstName} ${updatedPatient.lastName}` });
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
        res.json({ success: true, id });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.status(500).json({ error: 'Failed to delete patient' });
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
        res.json(mappedAppointments);
    } catch (err) {
        console.error('Error fetching appointments:', err);
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
        res.status(201).json(newApt);
    } catch (err) {
        console.error('Error creating appointment:', err);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

app.put('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma.appointment.update({
            where: { id },
            data: req.body
        });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.appointment.delete({ where: { id } });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

// ============================================================================
// RECORDS ROUTES
// ============================================================================

app.get('/api/records', (req, res) => res.json(records));
app.post('/api/records', (req, res) => {
    const newRecord = { id: records.length + 1, ...req.body };
    records.push(newRecord);
    res.status(201).json(newRecord);
});

// ============================================================================
// BILLING ROUTES
// ============================================================================

app.get('/api/billing', (req, res) => res.json(invoices));
app.post('/api/billing', (req, res) => {
    const newInvoice = { id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`, ...req.body };
    invoices.push(newInvoice);
    res.status(201).json(newInvoice);
});

// ============================================================================
// PRESCRIPTIONS ROUTES
// ============================================================================

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
        res.json(mapped);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

app.post('/api/prescriptions', async (req, res) => {
    try {
        // Assuming Mock Frontend sends 'patient' as string name
        // We need real doctor ID (from auth or default)
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
                    create: medications // Assumes medications is array of objects matching schema
                },
                status: 'ACTIVE'
            },
            include: { medications: true }
        });
        res.status(201).json(newPres);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// ============================================================================
// ARCHIVES ROUTES
// ============================================================================

app.get('/api/archives', (req, res) => res.json(archives));
app.post('/api/archives', (req, res) => {
    const newArchive = { id: archives.length + 1, ...req.body };
    archives.push(newArchive);
    res.status(201).json(newArchive);
});

// ============================================================================
// SERVE FRONTEND (MUST BE LAST)
// ============================================================================

// Sentry Error Handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

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




