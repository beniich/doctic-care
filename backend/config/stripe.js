import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

let stripe = null;

const isStripeConfigured = () =>
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY.startsWith('sk_') &&
    !process.env.STRIPE_SECRET_KEY.includes('YOUR_SECRET_KEY');

if (isStripeConfigured()) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-10-28.acacia',
    });
    console.log('✅ Stripe initialized');
} else {
    console.warn('⚠️  Stripe not configured - using mock mode');
}

export { stripe, isStripeConfigured };
export default stripe;
