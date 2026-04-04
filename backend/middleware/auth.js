import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    // Dans cet environnement de dev/SaaS, on simule l'auth de base
    // pour que les routes IA, etc. fonctionnent.
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        // Fallback to mock user for dev
        req.user = { id: 'admin-123', role: 'SUPER_ADMIN' };
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];
        if (token === 'mock-jwt-token-12345') {
            req.user = { id: 'admin-123', role: 'SUPER_ADMIN' };
            return next();
        }
        
        // Real logic if you had real JWTs signed
        if (process.env.JWT_SECRET) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } else {
             req.user = { id: 'admin-123', role: 'SUPER_ADMIN' };
        }
        next();
    } catch (err) {
        // Silent catch for dev
        req.user = { id: 'anon', role: 'GUEST' };
        next();
    }
};
