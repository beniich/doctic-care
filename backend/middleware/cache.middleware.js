// ========================================
// DOCTIC - Redis Cache Middleware
// Impact: -80% response time pour requêtes cachées
// ========================================

const { createClient } = require('redis');

let redisClient = null;
let isRedisAvailable = false;

// Initialize Redis
async function initRedis() {
    if (!process.env.REDIS_URL) {
        console.warn('⚠️  Redis not configured - caching disabled');
        return;
    }

    try {
        redisClient = createClient({ url: process.env.REDIS_URL });

        redisClient.on('error', (err) => {
            console.error('❌ Redis Error:', err);
            isRedisAvailable = false;
        });

        redisClient.on('connect', () => {
            console.log('✅ Redis cache connected');
            isRedisAvailable = true;
        });

        await redisClient.connect();
    } catch (error) {
        console.error('❌ Redis initialization failed:', error);
        isRedisAvailable = false;
    }
}

// Initialize on module load
initRedis().catch(console.error);

/**
 * Cache middleware
 * @param {number} ttl - Time to live in seconds (default: 300 = 5min)
 */
function cacheMiddleware(ttl = 300) {
    return async (req, res, next) => {
        if (!isRedisAvailable) {
            return next();
        }

        // Cache key based on full URL + query params
        const cacheKey = `cache:${req.method}:${req.path}:${JSON.stringify(req.query)}`;

        try {
            // Try to get from cache
            const cached = await redisClient.get(cacheKey);

            if (cached) {
                console.log(`✅ Cache HIT: ${cacheKey}`);

                // Add cache header
                res.set('X-Cache', 'HIT');
                return res.json(JSON.parse(cached));
            }

            console.log(`❌ Cache MISS: ${cacheKey}`);
            res.set('X-Cache', 'MISS');

            // Override res.json to cache response
            const originalJson = res.json.bind(res);

            res.json = (data) => {
                // Cache only successful responses
                if (res.statusCode === 200) {
                    redisClient.setEx(cacheKey, ttl, JSON.stringify(data))
                        .catch(err => console.error('Cache set error:', err));
                }

                return originalJson(data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
}

/**
 * Invalidate cache by pattern
 * @param {string} pattern - Redis key pattern (e.g., "cache:GET:/api/patients:*")
 */
async function invalidateCache(pattern) {
    if (!isRedisAvailable) return;

    try {
        const keys = await redisClient.keys(pattern);

        if (keys.length > 0) {
            await redisClient.del(keys);
            console.log(`🗑️  Invalidated ${keys.length} cache keys: ${pattern}`);
        }
    } catch (error) {
        console.error('Cache invalidation error:', error);
    }
}

/**
 * Clear all cache
 */
async function clearAllCache() {
    if (!isRedisAvailable) return;

    try {
        await redisClient.flushDb();
        console.log('🗑️  All cache cleared');
    } catch (error) {
        console.error('Cache clear error:', error);
    }
}

module.exports = {
    cacheMiddleware,
    invalidateCache,
    clearAllCache,
    getRedisClient: () => redisClient,
    isRedisAvailable: () => isRedisAvailable
};
