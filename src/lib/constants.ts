// ============================================================================
// CONFIGURATION & TYPES
// ============================================================================
export const ROLES = {
    PATIENT: 'patient',
    DOCTOR: 'doctor',
    ADMIN: 'admin',
    ASSISTANT: 'assistant',
    SUPER_ADMIN: 'super_admin'
} as const;

export const PERMISSIONS = {
    'patients:view': ['doctor', 'admin', 'assistant'],
    'patients:create': ['doctor', 'admin'],
    'patients:edit': ['doctor', 'admin'],
    'patients:delete': ['admin'],
    'records:view': ['doctor', 'admin'],
    'records:write': ['doctor'],
    'appointments:view': ['doctor', 'admin', 'assistant'],
    'appointments:create': ['doctor', 'admin', 'assistant'],
    'appointments:edit': ['doctor', 'admin', 'assistant'],
    'billing:view': ['doctor', 'admin', 'assistant'],
    'billing:create': ['doctor', 'admin'],
    'billing:edit': ['admin'],
    'analytics:view': ['doctor', 'admin'],
    'prescriptions:view': ['doctor', 'admin'],
    'prescriptions:create': ['doctor'],
    'teleconsult:view': ['doctor', 'patient'],
    'teleconsult:start': ['doctor'],
    'streaming:create': ['doctor'],
    'streaming:publish': ['doctor']
} as const;
