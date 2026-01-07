import prisma from '../config/db.js';

const auditService = {
    /**
     * Log an audit event
     * @param {string} userId - ID of the user performing the action (optional)
     * @param {string} action - Action code (e.g. 'LOGIN', 'VIEW_RECORD')
     * @param {string} resource - Resource identifier (e.g. 'Patient:123')
     * @param {string} outcome - 'SUCCESS', 'FAILURE', 'DENIED'
     * @param {object} metadata - Additional context (IP, UserAgent, etc.)
     */
    log: async (userId, action, resource, outcome = 'SUCCESS', metadata = {}) => {
        try {
            // If DATABASE_URL is not set, we might be in a mock environment without DB
            if (!process.env.DATABASE_URL) {
                console.log(`[AUDIT MOCK] ${action} by ${userId}: ${outcome}`);
                return;
            }

            await prisma.auditLog.create({
                data: {
                    userId: userId || null,
                    action,
                    resource,
                    outcome,
                    metadata: metadata || {},
                    timestamp: new Date(),
                },
            });
        } catch (error) {
            // Audit logging should not crash the application
            console.error('Failed to create audit log:', error);
        }
    },
};

export default auditService;
