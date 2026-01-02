// ========================================
// DOCTIC MEDICAL OS - Validation Middleware
// Version: 2.1.0 - Zod Schemas
// ========================================

const { z } = require('zod');

// ========================================
// SCHEMAS
// ========================================

const schemas = {
    // Patient
    patient: z.object({
        firstName: z.string().min(1, 'Prénom requis').max(100),
        lastName: z.string().min(1, 'Nom requis').max(100),
        email: z.string().email('Email invalide').optional().or(z.literal('')),
        phone: z.string().regex(/^\+?[\d\s\-()]+$/, 'Téléphone invalide').optional().or(z.literal('')),
        dateOfBirth: z.string().datetime().optional().or(z.literal('')),
        gender: z.enum(['M', 'F', 'Autre', '']).optional(),
        bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']).optional(),
        allergies: z.array(z.string()).optional().default([]),
        chronicDiseases: z.array(z.string()).optional().default([])
    }),

    // Prescription
    prescription: z.object({
        patientId: z.string().uuid('Patient ID invalide'),
        medications: z.array(z.object({
            name: z.string().min(1, 'Nom médicament requis').max(255),
            dosage: z.string()
                .min(1, 'Dosage requis')
                .regex(/^\d+\s?(mg|g|ml|UI|%|comprimé|gélule|cp)$/, 'Format dosage invalide (ex: 500mg, 10ml)'),
            frequency: z.string().min(1, 'Fréquence requise').max(100),
            duration: z.string().min(1, 'Durée requise').max(50),
            quantity: z.number().int().min(1, 'Quantité minimum 1').max(1000).optional().default(1),
            instructions: z.string().max(500).optional()
        }))
            .min(1, 'Au moins 1 médicament requis')
            .max(20, 'Maximum 20 médicaments'),
        notes: z.string().max(2000).optional()
    }),

    // Appointment
    appointment: z.object({
        patientId: z.string().uuid(),
        start: z.string().datetime('Date de début invalide'),
        end: z.string().datetime('Date de fin invalide'),
        motif: z.string().min(1, 'Motif requis').max(500),
        notes: z.string().max(2000).optional()
    }).refine(data => {
        const start = new Date(data.start);
        const end = new Date(data.end);
        return end > start;
    }, {
        message: 'La date de fin doit être après la date de début'
    }),

    // Teleconsult Session
    teleconsult: z.object({
        patientId: z.string().uuid(),
        scheduledDate: z.string().datetime(),
        motif: z.string().min(1).max(500),
        notes: z.string().max(2000).optional()
    }),

    // Invoice
    invoice: z.object({
        patientId: z.string().uuid(),
        items: z.array(z.object({
            description: z.string().min(1).max(255),
            quantity: z.number().int().min(1).max(1000),
            unitPrice: z.number().min(0).max(999999.99)
        })).min(1, 'Au moins 1 item requis'),
        taxRate: z.number().min(0).max(100).default(20),
        notes: z.string().max(2000).optional()
    }),

    // Medical Record
    medicalRecord: z.object({
        patientId: z.string().uuid(),
        title: z.string().min(1, 'Titre requis').max(200),
        content: z.string().min(1, 'Contenu requis').max(50000),
        attachments: z.array(z.string().url()).optional().default([])
    }),

    // User Update
    userUpdate: z.object({
        firstName: z.string().min(1).max(100).optional(),
        lastName: z.string().min(1).max(100).optional(),
        phone: z.string().regex(/^\+?[\d\s\-()]+$/).optional(),
        avatar: z.string().url().optional()
    })
};

// ========================================
// VALIDATION MIDDLEWARE
// ========================================

/**
 * Middleware de validation avec Zod
 * @param {string} schemaName - Nom du schéma à utiliser
 * @returns {Function} Express middleware
 */
const validate = (schemaName) => (req, res, next) => {
    const schema = schemas[schemaName];

    if (!schema) {
        console.error(`❌ Schema "${schemaName}" non trouvé`);
        return res.status(500).json({ error: 'Erreur de validation interne' });
    }

    try {
        // Parser et valider
        const validated = schema.parse(req.body);

        // Stocker données validées
        req.validatedBody = validated;

        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            // Formater erreurs Zod
            const errors = error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }));

            return res.status(400).json({
                error: 'Données invalides',
                details: errors
            });
        }

        console.error('❌ Erreur validation:', error);
        return res.status(500).json({ error: 'Erreur de validation' });
    }
};

// ========================================
// VALIDATION PARAMS (UUID)
// ========================================

/**
 * Valider UUID dans params
 */
const validateUUID = (paramName = 'id') => (req, res, next) => {
    const uuid = req.params[paramName];

    const uuidSchema = z.string().uuid();

    try {
        uuidSchema.parse(uuid);
        next();
    } catch {
        return res.status(400).json({
            error: `Paramètre "${paramName}" doit être un UUID valide`
        });
    }
};

// ========================================
// SANITIZATION
// ========================================

/**
 * Sanitizer basique (protection XSS)
 */
const sanitize = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;

        // Remplacer caractères dangereux
        return str
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    };

    const sanitizeObject = (obj) => {
        if (typeof obj !== 'object' || obj === null) return obj;

        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                sanitized[key] = sanitizeString(value);
            } else if (Array.isArray(value)) {
                sanitized[key] = value.map(item =>
                    typeof item === 'string' ? sanitizeString(item) : item
                );
            } else if (typeof value === 'object') {
                sanitized[key] = sanitizeObject(value);
            } else {
                sanitized[key] = value;
            }
        }
        return sanitized;
    };

    req.body = sanitizeObject(req.body);
    next();
};

// ========================================
// EXPORTS
// ========================================

module.exports = {
    validate,
    validateUUID,
    sanitize,
    schemas // Exporter pour tests
};
