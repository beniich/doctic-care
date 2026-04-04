import express from 'express';
import { stripe, isStripeConfigured } from '../config/stripe.js';
import prisma from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

/**
 * 💳 STRIPE / BILLING ROUTES
 */

// 🔹 Mock helpers
const mockCheckout = (plan, billingPeriod) => ({
    url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/pricing?success=true&session_id=mock_session_${Date.now()}`
});

const mockCreatePortal = () => ({
    url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/subscription?portal_acting=true`
});

// 1. Create Checkout Session for a Tenant
router.post('/create-checkout-session', async (req, res) => {
    // Dans le SaaS, c'est le Tenant (Clinique) qui s'abonne, ou on l'identifie par le compte admin
    const { plan, billingPeriod, email, tenantId, userId } = req.body;
    
    // Fallback on request tenantId
    const targetTenantId = tenantId || req.tenantId || req.user?.tenantId;

    if (!email) return res.status(400).json({ error: 'Email required' });
    if (!targetTenantId && !userId) return res.status(400).json({ error: 'Tenant ID ou User ID requis' });

    // ⚠️ MOCK MODE if Stripe not configured
    if (!isStripeConfigured()) {
        try {
            if (targetTenantId) {
                // Update Tenant in DB
                await prisma.tenant.update({
                    where: { id: targetTenantId },
                    data: {
                        plan: plan.toUpperCase(),
                        stripeSubscriptionId: `sub_mock_${Date.now()}`,
                        subscriptionStatus: 'active',
                        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    }
                });
            }
        } catch(e) {
            console.error("Mock Stripe error saving to DB:", e);
        }
        return res.json(mockCheckout(plan, billingPeriod));
    }

    // ✅ REAL STRIPE LOGIC (Map internal plan names to Stripe Price IDs)
    let priceId;
    const normalizedPlan = plan.toUpperCase();

    if (normalizedPlan === 'STARTER' || normalizedPlan === 'SILVER') {
        priceId = billingPeriod === 'annual'
            ? process.env.STRIPE_PRICE_STARTER_ANNUAL
            : process.env.STRIPE_PRICE_STARTER_MONTHLY;
    } else if (normalizedPlan === 'PRO' || normalizedPlan === 'MASTER') {
        priceId = billingPeriod === 'annual'
            ? process.env.STRIPE_PRICE_PRO_ANNUAL
            : process.env.STRIPE_PRICE_PRO_MONTHLY;
    } else if (normalizedPlan === 'BUSINESS' || normalizedPlan === 'GOLD') {
        priceId = billingPeriod === 'annual'
            ? process.env.STRIPE_PRICE_BUSINESS_ANNUAL
            : process.env.STRIPE_PRICE_BUSINESS_MONTHLY;
    }

    if (!priceId && !isStripeConfigured()) {
        // Fallback for mock if priceId missing
    } else if (!priceId) {
        return res.status(400).json({ error: `Plan '${plan}' not mapped to a Stripe Price ID for ${billingPeriod} billing.` });
    }

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [{ price: priceId, quantity: 1 }],
            customer_email: email,
            success_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3001'}/pricing?canceled=true`,
            metadata: { 
                plan: normalizedPlan, 
                billingPeriod, 
                tenantId: targetTenantId || '', 
                userId: userId || '' 
            },
            subscription_data: { trial_period_days: 14 },
        });
        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe error:', error);
        res.status(500).json({ error: error.message || 'Internal server error' });
    }
});

// 2. Create Portal Session
router.post('/create-portal-session', async (req, res) => {
    if (!isStripeConfigured()) return res.json(mockCreatePortal());

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

// 3. Upgrade Subscription
router.post('/upgrade-subscription', async (req, res) => {
    const { subscriptionId, newPriceId } = req.body;
    if (!subscriptionId || !newPriceId) return res.status(400).json({ error: 'Required data missing' });

    if (!isStripeConfigured()) {
        return res.json({ success: true, subscription: { id: subscriptionId, items: { data: [{ price: { id: newPriceId } }] } } });
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [{ id: subscription.items.data[0].id, price: newPriceId }],
            proration_behavior: 'create_prorations',
        });
        res.json({ success: true, subscription: updatedSubscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Get Subscription Info
router.get('/subscription', async (req, res) => {
    try {
        const tenant = await prisma.tenant.findUnique({
            where: { id: req.user.tenantId }
        });
        res.json({ subscription: tenant || { plan: 'free', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch subscription' });
    }
});

// 5. Cancel Subscription
router.post('/cancel-subscription', async (req, res) => {
    const targetTenantId = req.user.tenantId;

    if (!isStripeConfigured()) {
        await prisma.tenant.update({
            where: { id: targetTenantId },
            data: { subscriptionStatus: 'canceled' }
        });
        return res.json({ success: true });
    }

    const { subscriptionId } = req.body;
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
