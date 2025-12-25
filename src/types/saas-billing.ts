// SaaS Billing Types for Multi-Tenant Medical Platform

export type TenantStatus = 'active' | 'grace' | 'limited' | 'suspended';
export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trialing';
export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer' | 'manual';
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface PlanLimits {
  patients: number; // -1 for unlimited
  users: number;
  storageGB: number;
  aiRequests: number; // per month, -1 for unlimited
}

export interface PlanFeatures {
  billing: boolean;
  products: boolean;
  aiCopilot: boolean;
  offline: boolean;
  analytics: boolean;
  multiCabinet: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  limits: PlanLimits;
  features: PlanFeatures;
  popular?: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  country: string;
  planId: string;
  subscriptionStatus: TenantStatus;
  createdAt: string;
  adminEmail: string;
}

export interface Subscription {
  id: string;
  tenantId: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: SubscriptionStatus;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  cancelAtPeriodEnd: boolean;
}

export interface SaasInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidDate?: string;
  status: InvoiceStatus;
  items: SaasInvoiceItem[];
  createdAt: string;
}

export interface SaasInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface SaasPayment {
  id: string;
  invoiceId: string;
  tenantId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentMethodConfig {
  id: string;
  tenantId: string;
  type: PaymentMethod;
  isDefault: boolean;
  // Card details (masked)
  cardLast4?: string;
  cardBrand?: string;
  cardExpiry?: string;
  // Mobile Money
  mobileNumber?: string;
  mobileProvider?: string;
  // Bank
  bankName?: string;
  accountLast4?: string;
}

export interface UsageMetrics {
  tenantId: string;
  period: string; // YYYY-MM
  patientsCount: number;
  usersCount: number;
  storageUsedGB: number;
  aiRequestsCount: number;
}
