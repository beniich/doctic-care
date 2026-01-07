import prisma from '../backend/config/db.js';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('🔍 Verifying Database Connection...');
    try {
        const userCount = await prisma.user.count();
        console.log(`✅ Database connected! Found ${userCount} users.`);

        // Check if Google Credentials are set
        if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
            console.log('✅ Google Credentials found in environment.');
        } else {
            console.error('❌ Missing Google Credentials in .env');
            process.exit(1);
        }

    } catch (e) {
        console.error('❌ Database connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
