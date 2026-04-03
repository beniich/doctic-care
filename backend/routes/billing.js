import express from 'express';
import { stripe, isStripeConfigured } from '../config/stripe.js';
import { subscriptionsData } from '../data/mocks.js';

const router = express.Router();

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

// 1. Create Checkout Session
router.post('/create-checkout-session', async (req, res) => {
    const { plan, billingPeriod, email, userId } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    // ⚠️ MOCK MODE if Stripe not configured
    if (!isStripeConfigured()) {
        const mockSubId = `sub_mock_${Date.now()}`;
        subscriptionsData[userId || 'demo-user'] = {
            id: mockSubId,
            plan: plan,
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            cancelAtPeriodEnd: false
        };
        return res.json(mockCheckout(plan, billingPeriod));
    }

    // ✅ REAL STRIPE LOGIC
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
    const userId = req.query.userId || 'demo-user';
    const mockSubscription = subscriptionsData[userId] || subscriptionsData['demo-user'] || null;
    res.json({ subscription: mockSubscription || { plan: 'free', status: 'active', currentPeriodEnd: null, cancelAtPeriodEnd: false } });
});

// 5. Cancel Subscription
router.post('/cancel-subscription', async (req, res) => {
    const userId = req.body.userId || 'demo-user';
    if (!isStripeConfigured()) {
        if (subscriptionsData[userId]) subscriptionsData[userId].cancelAtPeriodEnd = true;
        return res.json({ success: true, subscription: subscriptionsData[userId] });
    }

    const { subscriptionId } = req.body;
    try {
        const subscription = await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
        if (subscriptionsData[userId]) subscriptionsData[userId].cancelAtPeriodEnd = true;
        res.json({ success: true, subscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
