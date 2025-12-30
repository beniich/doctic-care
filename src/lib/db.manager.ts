import { PrismaClient } from '@prisma/client/management';

// Prevent multiple instances in development
const globalForPrisma = global as unknown as { prismaManagement: PrismaClient };

export const managementClient = globalForPrisma.prismaManagement || new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaManagement = managementClient;
