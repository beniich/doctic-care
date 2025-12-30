import { PrismaClient } from '@prisma/client/tenant';

const tenantClients = new Map<string, PrismaClient>();

export const getTenantClient = (connectionUrl: string): PrismaClient => {
    if (tenantClients.has(connectionUrl)) {
        return tenantClients.get(connectionUrl)!;
    }

    const client = new PrismaClient({
        datasourceUrl: connectionUrl
    });

    tenantClients.set(connectionUrl, client);
    return client;
};

export const disconnectAllTenants = async () => {
    for (const client of tenantClients.values()) {
        await client.$disconnect();
    }
    tenantClients.clear();
};
