import prisma from '../config/db.js';

/**
 * Matrice des limites par plan d'abonnement
 */
export const PLAN_LIMITS = {
  STARTER: {
    maxUsers: 3,
    maxPatients: 500,
    aiTokens: 100,
    teleconsult: false,
    apiAccess: false,
    analytics: 'basic'
  },
  PRO: {
    maxUsers: 15,
    maxPatients: 1000000, // Quasi illimité pour le marketing
    aiTokens: 1000,
    teleconsult: true,
    apiAccess: false,
    analytics: 'advanced'
  },
  BUSINESS: {
    maxUsers: 50,
    maxPatients: 1000000,
    aiTokens: 5000,
    teleconsult: true,
    apiAccess: true,
    analytics: 'full'
  },
  ENTERPRISE: {
    maxUsers: 10000,
    maxPatients: 1000000,
    aiTokens: 1000000,
    teleconsult: true,
    apiAccess: true,
    analytics: 'full'
  }
};

/**
 * Middleware pour vérifier si une feature est incluse dans le plan du tenant
 * @param {string} feature - 'teleconsult', 'apiAccess', etc.
 */
export const requireFeature = (feature) => {
  return async (req, res, next) => {
    const tenant = await getTenant(req);
    if (!tenant) return res.status(403).json({ error: 'Tenant context missing' });

    const plan = tenant.plan || 'STARTER';
    const limits = PLAN_LIMITS[plan];

    if (!limits || !limits[feature]) {
      return res.status(403).json({
        error: `Feature non incluse`,
        message: `Votre plan actuel (${plan}) n'inclut pas cette fonctionnalité. Veuillez ugrader votre abonnement.`,
        code: 'FEATURE_LOCK'
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier les quotas numériques (utilisateurs, patients, etc.)
 * @param {string} resource - 'users', 'patients'
 */
export const requireQuota = (resource) => {
  return async (req, res, next) => {
    // On ne vérifie que pour les créations (POST)
    if (req.method !== 'POST') return next();

    const tenant = await getTenant(req, true); // On fetch avec les counts
    if (!tenant) return res.status(403).json({ error: 'Tenant context missing' });

    const plan = tenant.plan || 'STARTER';
    const limit = PLAN_LIMITS[plan][resource === 'users' ? 'maxUsers' : 'maxPatients'];

    const currentCount = tenant._count[resource];

    if (limit !== null && currentCount >= limit) {
      return res.status(402).json({
        error: `Quota atteint`,
        message: `Vous avez atteint la limite de ${resource} pour votre plan (${currentCount}/${limit}).`,
        code: 'QUOTA_EXCEEDED'
      });
    }

    next();
  };
};

/**
 * Helper pur récupérer le tenant avec son plan actuel
 */
async function getTenant(req, includeCounts = false) {
  const tenantId = req.tenantId;
  if (!tenantId) return null;

  const query = {
    where: { id: tenantId }
  };

  if (includeCounts) {
    query.include = {
      _count: {
        select: { users: true, patients: true }
      }
    };
  }

  return await prisma.tenant.findUnique(query);
}
