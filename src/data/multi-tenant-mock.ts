import type { Tenant, Plan, UsageMetrics } from '@/types/saas-billing';

export interface TenantWithMetrics extends Tenant {
  usage: UsageMetrics;
  revenue: number;
  activeUsers: number;
}

export interface NetworkAnalytics {
  totalRevenue: number;
  totalPatients: number;
  totalUsers: number;
  totalCabinets: number;
  avgRevenuePerCabinet: number;
  storageUsedGB: number;
  aiRequestsTotal: number;
  growthRate: number; // percentage
  revenueByMonth: { month: string; revenue: number }[];
  patientsByMonth: { month: string; patients: number }[];
  cabinetsByPlan: { plan: string; count: number }[];
  topCabinets: { name: string; revenue: number; patients: number }[];
}

export const mockTenants: TenantWithMetrics[] = [
  {
    id: 'tenant-001',
    name: 'Cabinet Médical du Parc',
    country: 'FR',
    planId: 'pro',
    subscriptionStatus: 'active',
    createdAt: '2024-01-15',
    adminEmail: 'admin@cabinet-parc.fr',
    usage: {
      tenantId: 'tenant-001',
      period: '2024-12',
      patientsCount: 342,
      usersCount: 3,
      storageUsedGB: 12.5,
      aiRequestsCount: 187,
    },
    revenue: 790,
    activeUsers: 3,
  },
  {
    id: 'tenant-002',
    name: 'Centre de Santé Riviera',
    country: 'CI',
    planId: 'network',
    subscriptionStatus: 'active',
    createdAt: '2023-06-20',
    adminEmail: 'direction@riviera-sante.ci',
    usage: {
      tenantId: 'tenant-002',
      period: '2024-12',
      patientsCount: 1250,
      usersCount: 12,
      storageUsedGB: 85.3,
      aiRequestsCount: 2340,
    },
    revenue: 1990,
    activeUsers: 12,
  },
  {
    id: 'tenant-003',
    name: 'Clinique Saint-Louis',
    country: 'SN',
    planId: 'pro',
    subscriptionStatus: 'active',
    createdAt: '2024-03-10',
    adminEmail: 'admin@clinique-stlouis.sn',
    usage: {
      tenantId: 'tenant-003',
      period: '2024-12',
      patientsCount: 578,
      usersCount: 5,
      storageUsedGB: 23.7,
      aiRequestsCount: 412,
    },
    revenue: 790,
    activeUsers: 5,
  },
  {
    id: 'tenant-004',
    name: 'Cabinet Dr. Koné',
    country: 'CI',
    planId: 'starter',
    subscriptionStatus: 'grace',
    createdAt: '2024-08-01',
    adminEmail: 'drkone@gmail.com',
    usage: {
      tenantId: 'tenant-004',
      period: '2024-12',
      patientsCount: 156,
      usersCount: 1,
      storageUsedGB: 2.1,
      aiRequestsCount: 0,
    },
    revenue: 290,
    activeUsers: 1,
  },
  {
    id: 'tenant-005',
    name: 'Polyclinique de l\'Ouest',
    country: 'FR',
    planId: 'network',
    subscriptionStatus: 'active',
    createdAt: '2023-11-05',
    adminEmail: 'admin@polyclinique-ouest.fr',
    usage: {
      tenantId: 'tenant-005',
      period: '2024-12',
      patientsCount: 2100,
      usersCount: 18,
      storageUsedGB: 156.8,
      aiRequestsCount: 4521,
    },
    revenue: 1990,
    activeUsers: 18,
  },
  {
    id: 'tenant-006',
    name: 'Centre Médical Bamako',
    country: 'ML',
    planId: 'pro',
    subscriptionStatus: 'limited',
    createdAt: '2024-02-20',
    adminEmail: 'contact@cm-bamako.ml',
    usage: {
      tenantId: 'tenant-006',
      period: '2024-12',
      patientsCount: 423,
      usersCount: 4,
      storageUsedGB: 18.2,
      aiRequestsCount: 289,
    },
    revenue: 790,
    activeUsers: 4,
  },
];

export const mockNetworkAnalytics: NetworkAnalytics = {
  totalRevenue: 6640,
  totalPatients: 4849,
  totalUsers: 43,
  totalCabinets: 6,
  avgRevenuePerCabinet: 1106.67,
  storageUsedGB: 298.6,
  aiRequestsTotal: 7749,
  growthRate: 23.5,
  revenueByMonth: [
    { month: 'Jul', revenue: 4200 },
    { month: 'Aug', revenue: 4500 },
    { month: 'Sep', revenue: 5100 },
    { month: 'Oct', revenue: 5400 },
    { month: 'Nov', revenue: 5900 },
    { month: 'Dec', revenue: 6640 },
  ],
  patientsByMonth: [
    { month: 'Jul', patients: 3200 },
    { month: 'Aug', patients: 3450 },
    { month: 'Sep', patients: 3800 },
    { month: 'Oct', patients: 4100 },
    { month: 'Nov', patients: 4500 },
    { month: 'Dec', patients: 4849 },
  ],
  cabinetsByPlan: [
    { plan: 'Starter', count: 1 },
    { plan: 'Pro', count: 3 },
    { plan: 'Network', count: 2 },
  ],
  topCabinets: [
    { name: 'Polyclinique de l\'Ouest', revenue: 1990, patients: 2100 },
    { name: 'Centre de Santé Riviera', revenue: 1990, patients: 1250 },
    { name: 'Clinique Saint-Louis', revenue: 790, patients: 578 },
  ],
};

export const getCountryFlag = (code: string): string => {
  const flags: Record<string, string> = {
    FR: '🇫🇷',
    CI: '🇨🇮',
    SN: '🇸🇳',
    ML: '🇲🇱',
    BF: '🇧🇫',
    GN: '🇬🇳',
  };
  return flags[code] || '🌍';
};

export const getCountryName = (code: string): string => {
  const names: Record<string, string> = {
    FR: 'France',
    CI: 'Côte d\'Ivoire',
    SN: 'Sénégal',
    ML: 'Mali',
    BF: 'Burkina Faso',
    GN: 'Guinée',
  };
  return names[code] || code;
};
