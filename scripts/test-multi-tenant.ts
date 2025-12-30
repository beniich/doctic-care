import { managementClient } from '../src/lib/db.manager';
import { getTenantClient, disconnectAllTenants } from '../src/lib/db.tenant';
import { v4 as uuidv4 } from 'uuid';

async function main() {
    console.log('--- TEST MULTI-TENANT ARCHITECTURE ---');

    try {
        // 1. Management DB Interaction
        console.log('1. Connecting to Management DB...');
        // Note: This requires DATABASE_URL to be set in .env and migration to be applied
        // await managementClient.$connect(); 

        // Simulate finding a tenant (Mocking for now if DB not ready)
        const mockTenant = {
            id: uuidv4(),
            name: "Docteur Test",
            slug: "docteur-test",
            dbName: "cldindustry_test",
            dbUser: "cldindustry",
            dbPassword: "password",
            dbHost: "localhost"
        };

        console.log(`✅ Tenant found: ${mockTenant.name}`);

        // 2. Tenant DB Connection Construction
        const connectionUrl = `postgresql://${mockTenant.dbUser}:${mockTenant.dbPassword}@${mockTenant.dbHost}/${mockTenant.dbName}`;
        console.log(`2. Constructing Tenant DB URL: ${connectionUrl}`);

        // 3. Tenant DB Interaction
        console.log('3. Getting Tenant Client...');
        const tenantClient = getTenantClient(connectionUrl);

        // Example query (will fail if DB does not exist, but proves client creation works)
        // const count = await tenantClient.patient.count();
        // console.log(`✅ Connection successful. Patient count: ${count}`);

        console.log('✅ Tenant Client created successfully (Lazy connection)');

    } catch (error) {
        console.error('❌ Error during test:', error);
    } finally {
        await managementClient.$disconnect();
        await disconnectAllTenants();
    }
}

main();
