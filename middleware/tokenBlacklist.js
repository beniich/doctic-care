// ========================================
// DOCTIC MEDICAL OS - Token Blacklist
// Version: 2.1.0 - Redis Implementation
// ========================================

const { createClient } = require('redis');
const jwt = require('jsonwebtoken');

// ========================================
// REDIS CLIENT
// ========================================

let redisClient = null;
let isRedisAvailable = false;

async function initializeRedis() {
    if (!process.env.REDIS_URL) {
        console.warn('⚠️  Redis not configured - Token blacklist disabled');
        return;
    }

    try {
        redisClient = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        console.error('❌ Redis: Max reconnect attempts reached');
                        return new Error('Redis unavailable');
                    }
                    return Math.min(retries * 100, 3000);
                }
            }
        });

        redisClient.on('error', (err) => {
            console.error('❌ Redis Error:', err);
            isRedisAvailable = false;
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis connected');
            isRedisAvailable = true;
        });

        redisClient.on('disconnect', () => {
            console.warn('⚠️  Redis disconnected');
            isRedisAvailable = false;
        });

        await redisClient.connect();
    } catch (error) {
        console.error('❌ Redis initialization failed:', error);
        isRedisAvailable = false;
    }
}

// ========================================
// TOKEN BLACKLIST FUNCTIONS
// ========================================

/**
 * Ajouter token à la blacklist
 * @param {string} token - JWT token
 * @param {number} expiresAt - Timestamp expiration (epoch seconds)
 */
async function blacklistToken(token, expiresAt) {
    if (!isRedisAvailable) {
        console.warn('⚠️  Cannot blacklist token - Redis unavailable');
        return false;
    }

    try {
        // Calculer TTL (Time To Live)
        const ttl = Math.floor((expiresAt * 1000 - Date.now()) / 1000);

        if (ttl <= 0) {
            // Token déjà expiré, pas besoin de blacklist
            return true;
        }

        // Stocker avec auto-expiration
        await redisClient.setEx(`blacklist:${token}`, ttl, '1');

        console.log(`🚫 Token blacklisted (TTL: ${ttl}s)`);
        return true;
    } catch (error) {
        console.error('❌ Error blacklisting token:', error);
        return false;
    }
}

/**
 * Vérifier si token est blacklisté
 * @param {string} token - JWT token
 * @returns {Promise<boolean>}
 */
async function isTokenBlacklisted(token) {
    if (!isRedisAvailable) {
        // Si Redis indisponible, ne pas bloquer (fail open)
        return false;
    }

    try {
        const exists = await redisClient.get(`blacklist:${token}`);
        return !!exists;
    } catch (error) {
        console.error('❌ Error checking blacklist:', error);
        // Fail open en cas d'erreur
        return false;
    }
}

/**
 * Blacklist tous les tokens d'un utilisateur
 * (utile si compte compromis)
 * @param {string} userId - User ID
 * @param {number} duration - Durée en secondes (default: 1h)
 */
async function blacklistUserTokens(userId, duration = 3600) {
    if (!isRedisAvailable) return false;

    try {
        await redisClient.setEx(`blacklist:user:${userId}`, duration, '1');
        console.log(`🚫 All tokens for user ${userId} blacklisted for ${duration}s`);
        return true;
    } catch (error) {
        console.error('❌ Error blacklisting user tokens:', error);
        return false;
    }
}

/**
 * Vérifier si tous les tokens d'un user sont blacklistés
 */
async function isUserBlacklisted(userId) {
    if (!isRedisAvailable) return false;

    try {
        const exists = await redisClient.get(`blacklist:user:${userId}`);
        return !!exists;
    } catch (error) {
        console.error('❌ Error checking user blacklist:', error);
        return false;
    }
}

/**
 * Nettoyer tokens expirés (appelé via cron)
 * Redis le fait automatiquement avec TTL, mais utile pour logs
 */
async function cleanupExpiredTokens() {
    if (!isRedisAvailable) return 0;

    try {
        // Redis nettoie automatiquement avec TTL
        // Cette fonction est surtout pour monitoring
        const keys = await redisClient.keys('blacklist:*');
        console.log(`📊 Blacklist contains ${keys.length} tokens`);
        return keys.length;
    } catch (error) {
        console.error('❌ Error cleanup:', error);
        return 0;
    }
}

// ========================================
// MIDDLEWARE
// ========================================

/**
 * Middleware pour vérifier blacklist
 * À utiliser APRÈS authenticateJWT
 */
const checkTokenBlacklist = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return next(); // Géré par authenticateJWT
    }

    try {
        // Vérifier blacklist token
        if (await isTokenBlacklisted(token)) {
            return res.status(401).json({
                error: 'Token révoqué',
                code: 'TOKEN_REVOKED'
            });
        }

        // Vérifier blacklist user
        if (req.user && await isUserBlacklisted(req.user.userId)) {
            return res.status(401).json({
                error: 'Compte suspendu',
                code: 'USER_SUSPENDED'
            });
        }

        next();
    } catch (error) {
        console.error('❌ Error in blacklist middleware:', error);
        // Fail open - ne pas bloquer si Redis erreur
        next();
    }
};

// ========================================
// LOGOUT AVEC BLACKLIST
// ========================================

/**
 * Helper logout complet avec blacklist
 */
async function logoutWithBlacklist(req, res) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = req.user?.userId;

        // Blacklist access token
        if (token) {
            const decoded = jwt.decode(token);
            if (decoded && decoded.exp) {
                await blacklistToken(token, decoded.exp);
            }
        }

        // Blacklist refresh token (si présent)
        const refreshToken = req.cookies?.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
                );
                if (decoded && decoded.exp) {
                    await blacklistToken(refreshToken, decoded.exp);
                }
            } catch {
                // Refresh token invalide/expiré, ignorer
            }
        }

        // Supprimer session
        if (req.logout) {
            req.logout((err) => {
                if (err) console.error('Logout error:', err);
            });
        }

        // Supprimer cookie
        res.clearCookie('refreshToken');

        if (req.session) {
            req.session.destroy();
        }

        // Audit log
        if (global.auditLog && userId) {
            global.auditLog('USER_LOGOUT', userId, { ip: req.ip });
        }

        res.json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ error: 'Erreur lors de la déconnexion' });
    }
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
    initializeRedis,
    blacklistToken,
    isTokenBlacklisted,
    blacklistUserTokens,
    isUserBlacklisted,
    cleanupExpiredTokens,
    checkTokenBlacklist,
    logoutWithBlacklist,
    getRedisClient: () => redisClient,
    isRedisAvailable: () => isRedisAvailable
};
