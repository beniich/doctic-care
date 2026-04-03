import { rateLimit } from 'express-rate-limit';

/**
 * Matrice des limites de requêtes par minute (RPM) par plan
 */
const RPM_LIMITS = {
  STARTER: 60,
  PRO: 300,
  BUSINESS: 1000,
  ENTERPRISE: 5000
};

/**
 * Middleware de Rate Limiting par Tenant
 * Identifie le tenant via tenantId (injecté par tenantMiddleware)
 * Fallback sur l'IP si non identifié.
 */
export const tenantRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: (req) => {
    // req.tenantId est déjà injecté par tenantMiddleware
    const tenantPlan = req.user?.tenant?.plan || 'STARTER';
    return RPM_LIMITS[tenantPlan] || 60;
  },
  keyGenerator: (req) => {
    return req.tenantId || req.ip; // Utilise le tenantId s'il existe, sinon l'IP
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: (req) => {
    const plan = req.user?.tenant?.plan || 'STARTER';
    return {
      error: 'Quota de requêtes atteint',
      message: `Votre plan actuel (${plan}) est limité à ${RPM_LIMITS[plan]} requêtes par minute.`,
      code: 'TENANT_RATE_LIMIT'
    };
  },
  // Skip pour le Super Admin (optionnel)
  skip: (req) => req.user?.role === 'SUPER_ADMIN'
});
