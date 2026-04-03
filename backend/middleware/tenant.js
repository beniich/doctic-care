import { AsyncLocalStorage } from 'async_hooks';

// AsyncLocalStorage permet de garder le contexte du tenant actif tout au long de la requête
export const tenantContext = new AsyncLocalStorage();

/**
 * Middleware qui extrait le tenantId de l'utilisateur ou du sous-domaine/header
 * et le stocke dans le contexte asynchrone pour que Prisma puisse l'utiliser.
 */
export const tenantMiddleware = (req, res, next) => {
    let tenantId = null;

    // 1. Si l'utilisateur est connecté, récupérer son tenantId
    if (req.user && req.user.tenantId) {
        tenantId = req.user.tenantId;
    }

    // 2. Si c'est un SUPER_ADMIN, il peut forcer un tenant via les headers
    if (req.headers['x-tenant-id']) {
        if (!req.user || req.user.role === 'SUPER_ADMIN') {
            tenantId = req.headers['x-tenant-id'];
        }
    }

    // 3. (Optionnel pour MVP) Gérer le sous-domaine
    // const host = req.headers.host;
    // if (host && host.includes('.doctic.com')) {
    //     const slug = host.split('.')[0];
    //     // Ici on devrait résoudre le slug en tenantId
    // }

    // Exécuter la requête entière dans le scope du tenant
    tenantContext.run({ tenantId }, () => {
        req.tenantId = tenantId;
        next();
    });
};
