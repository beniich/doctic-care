import type {
  Plan,
  Tenant,
  Subscription,
  SaasInvoice,
  SaasPayment,
  PaymentMethodConfig,
  UsageMetrics,
} from '@/types/saas-billing';

export const mockPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Pour les cabinets individuels débutants',
    priceMonthly: 29,
    priceYearly: 290,
    currency: 'EUR',
    limits: {
      patients: 500,
      users: 2,
      storageGB: 5,
      aiRequests: 0,
    },
    features: {
      billing: false,
      products: false,
      aiCopilot: false,
      offline: true,
      analytics: false,
      multiCabinet: false,
      prioritySupport: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les cabinets en croissance',
    priceMonthly: 79,
    priceYearly: 790,
    currency: 'EUR',
    limits: {
      patients: -1,
      users: 5,
      storageGB: 50,
      aiRequests: 500,
    },
    features: {
      billing: true,
      products: true,
      aiCopilot: true,
      offline: true,
      analytics: true,
      multiCabinet: false,
      prioritySupport: false,
    },
    popular: true,
  },
  {
    id: 'network',
    name: 'Network',
    description: 'Pour les réseaux multi-cabinets',
    priceMonthly: 199,
    priceYearly: 1990,
    currency: 'EUR',
    limits: {
      patients: -1,
      users: -1,
      storageGB: 500,
      aiRequests: -1,
    },
    features: {
      billing: true,
      products: true,
      aiCopilot: true,
      offline: true,
      analytics: true,
      multiCabinet: true,
      prioritySupport: true,
    },
  },
];

export const mockTenant: Tenant = {
  id: 'tenant-001',
  name: 'Cabinet Médical du Parc',
  country: 'FR',
  planId: 'pro',
  subscriptionStatus: 'active',
  createdAt: '2024-01-15',
  adminEmail: 'admin@cabinet-parc.fr',
};

export const mockSubscription: Subscription = {
  id: 'sub-001',
  tenantId: 'tenant-001',
  planId: 'pro',
  startDate: '2024-01-15',
  endDate: '2025-01-15',
  status: 'active',
  billingCycle: 'yearly',
  nextBillingDate: '2025-01-15',
  cancelAtPeriodEnd: false,
};

export const mockInvoices: SaasInvoice[] = [
  {
    id: 'inv-001',
    invoiceNumber: 'DOC-2024-001',
    tenantId: 'tenant-001',
    subscriptionId: 'sub-001',
    amount: 790,
    currency: 'EUR',
    dueDate: '2024-01-20',
    paidDate: '2024-01-18',
    status: 'paid',
    items: [
      { description: 'Plan Pro - Abonnement annuel', quantity: 1, unitPrice: 790, total: 790 },
    ],
    createdAt: '2024-01-15',
  },
  {
    id: 'inv-002',
    invoiceNumber: 'DOC-2024-002',
    tenantId: 'tenant-001',
    subscriptionId: 'sub-001',
    amount: 50,
    currency: 'EUR',
    dueDate: '2024-06-15',
    paidDate: '2024-06-14',
    status: 'paid',
    items: [
      { description: 'Stockage supplémentaire - 25GB', quantity: 1, unitPrice: 50, total: 50 },
    ],
    createdAt: '2024-06-10',
  },
  {
    id: 'inv-003',
    invoiceNumber: 'DOC-2025-001',
    tenantId: 'tenant-001',
    subscriptionId: 'sub-001',
    amount: 790,
    currency: 'EUR',
    dueDate: '2025-01-20',
    status: 'pending',
    items: [
      { description: 'Plan Pro - Renouvellement annuel', quantity: 1, unitPrice: 790, total: 790 },
    ],
    createdAt: '2025-01-01',
  },
];

export const mockPayments: SaasPayment[] = [
  {
    id: 'pay-001',
    invoiceId: 'inv-001',
    tenantId: 'tenant-001',
    amount: 790,
    currency: 'EUR',
    method: 'card',
    status: 'completed',
    transactionId: 'ch_1234567890',
    paidAt: '2024-01-18',
    createdAt: '2024-01-18',
  },
  {
    id: 'pay-002',
    invoiceId: 'inv-002',
    tenantId: 'tenant-001',
    amount: 50,
    currency: 'EUR',
    method: 'card',
    status: 'completed',
    transactionId: 'ch_0987654321',
    paidAt: '2024-06-14',
    createdAt: '2024-06-14',
  },
];

export const mockPaymentMethods: PaymentMethodConfig[] = [
  {
    id: 'pm-001',
    tenantId: 'tenant-001',
    type: 'card',
    isDefault: true,
    cardLast4: '4242',
    cardBrand: 'Visa',
    cardExpiry: '12/26',
  },
  {
    id: 'pm-002',
    tenantId: 'tenant-001',
    type: 'mobile_money',
    isDefault: false,
    mobileNumber: '+225 07 XX XX 42',
    mobileProvider: 'Orange Money',
  },
];

export const mockUsageMetrics: UsageMetrics = {
  tenantId: 'tenant-001',
  period: '2024-12',
  patientsCount: 342,
  usersCount: 3,
  storageUsedGB: 12.5,
  aiRequestsCount: 187,
};

// Helper functions
export const getPlanById = (planId: string): Plan | undefined => {
  return mockPlans.find(p => p.id === planId);
};

export const formatCurrency = (amount: number, currency: string = 'EUR'): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    grace: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    limited: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status] || 'bg-muted text-muted-foreground';
};
