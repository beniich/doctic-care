// scripts/check-deploy.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateEnvironment, validateProduction } from '../config/validateEnv.js';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load env
dotenv.config({ path: path.join(rootDir, '.env') });

console.log('========================================');
console.log('🔍 DOCTIC DOCTOR - DIAGNOSTIC DÉPLOIEMENT');
console.log('========================================\n');

async function check() {
    let hasError = false;

    // 1. Node Version
    console.log(`📦 Node Version: ${process.version}`);
    if (parseInt(process.version.slice(1).split('.')[0]) < 18) {
        console.error('❌ Node.js 18+ requis');
        hasError = true;
    }

    // 2. Check Files
    const distPath = path.join(rootDir, 'dist');
    const indexHtml = path.join(distPath, 'index.html');

    console.log(`\n📂 Vérification des fichiers build...`);
    if (!fs.existsSync(distPath)) {
        console.error('❌ Dossier "dist" manquant ! (Le frontend n\'est pas construit)');
        hasError = true;
    } else if (!fs.existsSync(indexHtml)) {
        console.error('❌ "dist/index.html" manquant !');
        hasError = true;
    } else {
        console.log('✅ Frontend build présent');
    }

    // 3. Env Validation
    try {
        validateEnvironment();
        validateProduction(); // Only warns if dev
    } catch (e) {
        console.error(`❌ Erreur configuration: ${e.message}`);
        hasError = true;
    }

    // 4. Database Connection
    console.log('\n🗄️  Test connexion Base de données...');

    // Check if URL is set
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️  DATABASE_URL non défini dans .env');
    }

    try {
        // Dynamic import to ensure env vars are loaded first
        // and to reuse the project's specific adapter configuration
        const dbModule = await import('../backend/config/db.js');
        const prisma = dbModule.default;

        await prisma.$connect();
        console.log('✅ Connexion DB réussie');

        // Count users as a smoke test
        const userCount = await prisma.user.count();
        console.log(`POUR INFO: ${userCount} utilisateurs trouvés en base.`);

        await prisma.$disconnect();
    } catch (e) {
        console.error(`❌ Échec connexion DB: ${e.message}`);
        console.error('Stack:', e.stack);
        hasError = true;
    }

    console.log('\n========================================');
    if (hasError) {
        console.log('💥 DIAGNOSTIC ÉCHOUÉ - Corrigez les erreurs ci-dessus');
        process.exit(1);
    } else {
        console.log('✨ TOUS LES SYSTÈMES OPÉRATIONNELS');
        process.exit(0);
    }
}

check();
