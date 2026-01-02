// ========================================
// DOCTIC MEDICAL OS - Environment Validation
// Version: 2.1.0
// ========================================

const crypto = require('crypto');

// ========================================
// VARIABLES REQUISES
// ========================================

const requiredEnvVars = {
    // Serveur
    NODE_ENV: {
        required: true,
        values: ['development', 'production', 'test'],
        default: 'development'
    },
    PORT: {
        required: false,
        validate: (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
        default: '5000'
    },
    FRONTEND_URL: {
        required: true,
        validate: (val) => val.startsWith('http://') || val.startsWith('https://'),
        default: 'http://localhost:3001'
    },

    // Google OAuth
    GOOGLE_CLIENT_ID: {
        required: true,
        validate: (val) => val.includes('.apps.googleusercontent.com')
    },
    GOOGLE_CLIENT_SECRET: {
        required: true,
        minLength: 20
    },

    // JWT Secrets
    JWT_SECRET: {
        required: true,
        minLength: 32,
        validate: (val) => {
            if (val.length < 32) {
                throw new Error('JWT_SECRET doit faire au moins 32 caractères');
            }
            // Vérifier entropie basique
            const uniqueChars = new Set(val).size;
            if (uniqueChars < 10) {
                throw new Error('JWT_SECRET manque d\'entropie (utilisez crypto.randomBytes)');
            }
            return true;
        }
    },
    JWT_REFRESH_SECRET: {
        required: true,
        minLength: 32,
        validate: (val) => {
            // Doit être différent de JWT_SECRET
            if (val === process.env.JWT_SECRET) {
                throw new Error('JWT_REFRESH_SECRET doit être différent de JWT_SECRET');
            }
            return val.length >= 32;
        }
    },
    SESSION_SECRET: {
        required: true,
        minLength: 32,
        validate: (val) => {
            // Doit être différent des autres secrets
            if (val === process.env.JWT_SECRET || val === process.env.JWT_REFRESH_SECRET) {
                throw new Error('SESSION_SECRET doit être unique');
            }
            return val.length >= 32;
        }
    },

    // Database
    DATABASE_URL: {
        required: process.env.NODE_ENV === 'production',
        validate: (val) => val.startsWith('postgresql://') || val.startsWith('postgres://')
    },

    // Redis (optionnel mais recommandé)
    REDIS_URL: {
        required: false,
        validate: (val) => val.startsWith('redis://')
    }
};

// ========================================
// VALIDATION FUNCTIONS
// ========================================

/**
 * Valider toutes les variables d'environnement
 * @throws {Error} Si validation échoue
 */
function validateEnvironment() {
    const errors = [];
    const warnings = [];

    console.log('🔍 Validation des variables d\'environnement...\n');

    // Vérifier chaque variable
    for (const [varName, config] of Object.entries(requiredEnvVars)) {
        const value = process.env[varName];

        // Vérifier présence
        if (!value) {
            if (config.required) {
                errors.push(`❌ ${varName} est REQUIS`);
            } else if (config.default) {
                process.env[varName] = config.default;
                warnings.push(`⚠️  ${varName} manquant, utilisation valeur par défaut: ${config.default}`);
            } else {
                warnings.push(`ℹ️  ${varName} non défini (optionnel)`);
            }
            continue;
        }

        // Vérifier valeurs autorisées
        if (config.values && !config.values.includes(value)) {
            errors.push(`❌ ${varName}="${value}" invalide. Valeurs acceptées: ${config.values.join(', ')}`);
        }

        // Vérifier longueur minimum
        if (config.minLength && value.length < config.minLength) {
            errors.push(`❌ ${varName} trop court (min: ${config.minLength} caractères)`);
        }

        // Validation personnalisée
        if (config.validate) {
            try {
                if (!config.validate(value)) {
                    errors.push(`❌ ${varName} validation échouée`);
                }
            } catch (error) {
                errors.push(`❌ ${varName}: ${error.message}`);
            }
        }

        // Success
        console.log(`✅ ${varName} OK`);
    }

    // Afficher warnings
    if (warnings.length > 0) {
        console.log('\n⚠️  WARNINGS:');
        warnings.forEach(w => console.warn(w));
    }

    // Afficher erreurs
    if (errors.length > 0) {
        console.error('\n💥 VALIDATION ERRORS:');
        errors.forEach(e => console.error(e));
        console.error('\n🛠️  Fix: Créer un fichier .env avec ces variables');
        console.error('💡 Aide: Voir .env.example pour référence\n');

        throw new Error(`${errors.length} variable(s) d'environnement invalide(s)`);
    }

    console.log('\n✅ Toutes les variables obligatoires sont valides\n');
}

/**
 * Vérifier sécurité en production
 */
function validateProduction() {
    if (process.env.NODE_ENV !== 'production') {
        return;
    }

    console.log('🔒 Vérification configuration production...\n');

    const prodErrors = [];

    // HTTPS requis
    if (!process.env.FRONTEND_URL?.startsWith('https://')) {
        prodErrors.push('❌ FRONTEND_URL doit utiliser HTTPS en production');
    }

    // Secrets robustes
    const secrets = ['JWT_SECRET', 'JWT_REFRESH_SECRET', 'SESSION_SECRET'];
    secrets.forEach(secret => {
        const value = process.env[secret];
        if (value && value.length < 64) {
            prodErrors.push(`⚠️  ${secret} devrait faire 64+ caractères en production`);
        }
    });

    // Redis requis
    if (!process.env.REDIS_URL) {
        prodErrors.push('⚠️  REDIS_URL recommandé pour scalabilité en production');
    }

    // Database requis
    if (!process.env.DATABASE_URL) {
        prodErrors.push('❌ DATABASE_URL REQUIS en production');
    }

    if (prodErrors.length > 0) {
        console.error('⚠️  PRODUCTION WARNINGS/ERRORS:');
        prodErrors.forEach(e => console.error(e));
        console.error('');
    } else {
        console.log('✅ Configuration production sécurisée\n');
    }
}

/**
 * Générer secrets aléatoires
 * @param {number} length - Longueur en bytes
 */
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Afficher exemple .env
 */
function showEnvExample() {
    console.log('📋 Exemple de fichier .env:\n');
    console.log(`NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3001

# Google OAuth
GOOGLE_CLIENT_ID=votre-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre-client-secret

# Secrets (GÉNÉRER AVEC: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=${generateSecret()}
JWT_REFRESH_SECRET=${generateSecret()}
SESSION_SECRET=${generateSecret()}

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/doctic_db

# Redis (optionnel)
REDIS_URL=redis://localhost:6379
`);
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
    validateEnvironment,
    validateProduction,
    generateSecret,
    showEnvExample
};
