/**
 * Middleware pour filtrer l'accès selon le rôle de l'utilisateur
 * @param {string[]} allowedRoles - Liste des rôles autorisés ('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'ASSISTANT')
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Identification requise' });
    }

    const { role } = req.user;

    // SUPER_ADMIN a toujours accès à tout par défaut sur le backend
    if (role === 'SUPER_ADMIN') return next();

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        error: 'Accès refusé',
        message: 'Vos droits actuels ne vous permettent pas d\'effectuer cette action.',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * Middleware de shortcut pour les admins (TENANT_ADMIN)
 */
export const isAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

/**
 * Middleware de shortcut pour les médecins
 */
export const isDoctor = requireRole(['DOCTOR', 'ADMIN', 'SUPER_ADMIN']);
