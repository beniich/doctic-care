// lib/api.ts — Client API Doctic · Adapté pour Vite/React
// Utilisé dans les composants de l'application Doctic Care

// En production (Vercel), l'API est sur le même domaine via /api
// En dev, on pointe vers le serveur Express local
const API_BASE = import.meta.env.VITE_API_URL 
  || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// ─── TYPES ────────────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  pagination?: { page: number; limit: number; total: number; totalPages?: number };
  error?: string;
  code?: string;
}

export interface Patient {
  id: string;
  patientNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  email?: string;
  phone?: string;
  chronicConditions: string[];
  allergies: string[];
  bloodType?: string;
  isActive: boolean;
  createdAt: string;
  _count?: { appointments: number; prescriptions: number };
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  duration: number;
  type: 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'TELECONSULT' | 'ANNUAL_CHECK' | 'RENEWAL';
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  reason?: string;
  patient?: Pick<Patient, 'id' | 'firstName' | 'lastName' | 'phone'>;
  doctor?: { id: string; firstName: string; lastName: string; speciality?: string };
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  status: 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  date: string;
  total: number;
  subtotal: number;
  taxAmount: number;
  patient?: Pick<Patient, 'id' | 'firstName' | 'lastName'>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR' | 'ASSISTANT';
  speciality?: string;
  avatar?: string;
  tenantId: string;
  tenant: { id: string; name: string; slug: string };
}

export interface DashboardStats {
  patients: { total: number; trend: number; newThisMonth: number };
  appointments: { today: number; pending: number };
  revenue: { thisMonth: number; trend: number };
  teleconsults: { active: number };
  weeklyActivity: Array<{ day: string; count: number }>;
  alerts: { overdueInvoices: number };
}

// ─── FETCH WRAPPER ────────────────────────────────────────────────────────────
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      credentials: 'include', // Important: envoyer le cookie de session
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);

    // Gérer les réponses non-JSON
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return { data: null as T };
    }

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.error || `Erreur ${response.status}`) as Error & { code?: string; status?: number };
      error.code = data.code;
      error.status = response.status;
      throw error;
    }

    return data;
  }

  // HTTP methods
  get<T>(endpoint: string, params?: Record<string, string | number | boolean>) {
    const url = params
      ? `${endpoint}?${new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)]))}` 
      : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
  }

  patch<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload multipart
  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Ne pas mettre Content-Type — le browser le fait
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Upload échoué');
    }
    return response.json();
  }
}

export const api = new ApiClient(API_BASE);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ user: User }>('/auth/login', { email, password }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ user: User }>('/auth/me'),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  csrfToken: () => api.get<{ csrfToken: string }>('/auth/csrf-token'),
};

// ─── PATIENTS ─────────────────────────────────────────────────────────────────
export const patientsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get<Patient[]>('/patients', params),

  get: (id: string) => api.get<Patient>(`/patients/${id}`),

  create: (data: Partial<Patient>) => api.post<Patient>('/patients', data),

  update: (id: string, data: Partial<Patient>) => api.patch<Patient>(`/patients/${id}`, data),

  delete: (id: string) => api.delete(`/patients/${id}`),

  history: (id: string) =>
    api.get<{ appointments: Appointment[]; prescriptions: unknown[]; invoices: Invoice[] }>(
      `/patients/${id}/history`
    ),
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
export const appointmentsApi = {
  list: (params?: {
    date?: string; dateFrom?: string; dateTo?: string;
    doctorId?: string; status?: string; page?: number; limit?: number;
  }) => api.get<Appointment[]>('/appointments', params),

  today: () => api.get<Appointment[]>('/appointments/today'),

  create: (data: Partial<Appointment>) => api.post<Appointment>('/appointments', data),

  update: (id: string, data: Partial<Appointment>) =>
    api.patch<Appointment>(`/appointments/${id}`, data),

  cancel: (id: string, reason?: string) =>
    api.patch(`/appointments/${id}`, { status: 'CANCELLED', cancelReason: reason }),
};

// ─── PRESCRIPTIONS ────────────────────────────────────────────────────────────
export const prescriptionsApi = {
  list: (params?: { patientId?: string; status?: string }) =>
    api.get<unknown[]>('/prescriptions', params),

  create: (data: unknown) => api.post<unknown>('/prescriptions', data),

  update: (id: string, data: unknown) => api.patch(`/prescriptions/${id}`, data),
};

// ─── INVOICES ─────────────────────────────────────────────────────────────────
export const invoicesApi = {
  list: (params?: { status?: string; patientId?: string; page?: number }) =>
    api.get<Invoice[]>('/invoices', params),

  create: (data: unknown) => api.post<Invoice>('/invoices', data),

  update: (id: string, data: unknown) => api.patch<Invoice>(`/invoices/${id}`, data),

  createPaymentIntent: (id: string) =>
    api.post<{ clientSecret: string }>(`/invoices/${id}/pay`),
};

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  dashboard: () => api.get<DashboardStats>('/analytics/dashboard'),

  revenue: (months?: number) =>
    api.get<Array<{ month: string; revenue: number; invoices: number }>>(
      '/analytics/revenue', months ? { months } : undefined
    ),

  auditLogs: (params?: { page?: number; action?: string; resource?: string }) =>
    api.get<unknown[]>('/analytics/audit', params),
};

// ─── TELECONSULT ──────────────────────────────────────────────────────────────
export const teleconsultApi = {
  list: (params?: { status?: string }) => api.get<unknown[]>('/teleconsult', params),

  create: (data: { patientId: string; scheduledAt: string; notes?: string }) =>
    api.post<unknown>('/teleconsult', data),

  join: (id: string) =>
    api.post<{ roomId: string; roomToken: string; roomUrl: string }>(`/teleconsult/${id}/join`),

  end: (id: string, notes?: string) =>
    api.post(`/teleconsult/${id}/end`, { notes }),
};

// ─── AI ───────────────────────────────────────────────────────────────────────
export const aiApi = {
  chat: (messages: Array<{ role: 'user' | 'assistant'; content: string }>) =>
    api.post<{ content: string }>('/ai/chat', { messages }),

  diagnosis: (symptoms: string, patientContext?: string) =>
    api.post<{ content: string }>('/ai/diagnosis', { symptoms, patientContext }),

  medicalReport: (consultationNotes: string) =>
    api.post<{ content: string }>('/ai/medical-report', { consultationNotes }),

  labAnalysis: (results: string) =>
    api.post<{ content: string }>('/ai/lab-analysis', { results }),

  transcribe: (formData: FormData) =>
    api.upload<{ text: string }>('/ai/transcribe', formData),
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notificationsApi = {
  list: () => api.get<unknown[]>('/notifications'),

  markRead: (id: string) => api.patch(`/notifications/${id}/read`),

  // SSE stream
  subscribe: (onMessage: (data: unknown) => void, onError?: (err: Event) => void) => {
    const es = new EventSource(`${API_BASE}/notifications/stream`, { withCredentials: true });
    es.onmessage = (e) => {
      try { onMessage(JSON.parse(e.data)); } catch { /* ignore parse errors */ }
    };
    if (onError) es.onerror = onError;
    return () => es.close(); // Retourne fonction de cleanup
  },
};

// ─── RGPD ─────────────────────────────────────────────────────────────────────
export const rgpdApi = {
  exportPatient: (patientId: string) =>
    api.get<unknown>(`/rgpd/export/${patientId}`),

  erasePatient: (patientId: string, reason?: string) =>
    api.delete(`/rgpd/erase/${patientId}`),

  auditReport: (dateFrom?: string, dateTo?: string) =>
    api.get<unknown>('/rgpd/audit-report', dateFrom && dateTo ? { dateFrom, dateTo } : undefined),
};

// ─── SUBSCRIPTIONS ────────────────────────────────────────────────────────────
export const subscriptionsApi = {
  current: () => api.get<unknown>('/subscriptions/current'),
  plans: () => api.get<unknown>('/subscriptions/plans'),
  checkout: (plan: string) => api.post<{ url: string }>('/subscriptions/checkout', { plan }),
  portal: () => api.post<{ url: string }>('/subscriptions/portal'),
  invoices: () => api.get<unknown[]>('/subscriptions/invoices'),
};
