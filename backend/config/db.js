import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from '@prisma/client';

const { Pool } = pg;
const { PrismaClient } = pkg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/doctic_care';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const basePrisma = new PrismaClient({ adapter });

import { tenantContext } from '../middleware/tenant.js';

// Prisma Extension pour l'isolation Multi-Tenant
const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const store = tenantContext.getStore();
        const tenantId = store?.tenantId;

        // Si la table n'est pas "Tenant" ou "User" et qu'un tenantId est défini
        if (tenantId && !['Tenant', 'User'].includes(model)) {
          // On s'assure qu'on ajoute tenantId dans la clause WHERE
          if (['findUnique', 'findFirst', 'findMany', 'count', 'update', 'updateMany', 'delete', 'deleteMany'].includes(operation)) {
            args.where = { ...args.where, tenantId };
          }
          // On s'assure d'injecter le tenantId pour les créations
          if (['create', 'createMany'].includes(operation)) {
            if (operation === 'create' && args.data) {
              args.data.tenantId = tenantId;
            } else if (operation === 'createMany' && Array.isArray(args.data)) {
              args.data = args.data.map(d => ({ ...d, tenantId }));
            }
          }
        }
        
        return query(args);
      },
    },
  },
});

export default prisma;
