// lib/hooks.ts — Hooks React pour Doctic Medical OS
// Adapté de l'implémentation CDV

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  authApi, patientsApi, appointmentsApi, analyticsApi,
  invoicesApi, prescriptionsApi, teleconsultApi, aiApi,
  notificationsApi, type User, type Patient, type Appointment,
  type Invoice, type DashboardStats, type ApiResponse,
} from './api';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface UseQueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseMutationState<T> {
  mutate: (data?: unknown) => Promise<T | null>;
  loading: boolean;
  error: string | null;
}

// ─── GENERIC QUERY HOOK ───────────────────────────────────────────────────────
function useQuery<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  deps: unknown[] = []
): UseQueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetcherRef.current();
      setData(res.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [...deps, fetch]);

  return { data, loading, error, refetch: fetch };
}

// ─── AUTH HOOKS ───────────────────────────────────────────────────────────────
export function useCurrentUser() {
  const { data, loading, error, refetch } = useQuery<{ user: User }>(authApi.me);
  return { user: data?.user ?? null, loading, error, refetch };
}

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(email, password);
      return res.data.user;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Connexion échouée');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

// ─── DASHBOARD HOOK ───────────────────────────────────────────────────────────
export function useDashboardStats() {
  return useQuery<DashboardStats>(analyticsApi.dashboard);
}

// ─── PATIENTS HOOKS ───────────────────────────────────────────────────────────
export function usePatients(params?: { page?: number; limit?: number; search?: string }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0 });

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await patientsApi.list(params);
      setPatients(res.data ?? []);
      if (res.pagination) setPagination(res.pagination);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { fetch(); }, [fetch]);

  return { patients, loading, error, pagination, refetch: fetch };
}

export function usePatient(id: string | null) {
  return useQuery<Patient>(() => patientsApi.get(id!), [id]);
}

export function useCreatePatient(): UseMutationState<Patient> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data?: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const res = await patientsApi.create(data as Partial<Patient>);
      return res.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur création patient');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

export function useUpdatePatient(id: string): UseMutationState<Patient> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data?: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const res = await patientsApi.update(id, data as Partial<Patient>);
      return res.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur mise à jour');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// ─── APPOINTMENTS HOOKS ───────────────────────────────────────────────────────
export function useAppointments(params?: {
  date?: string; doctorId?: string; status?: string;
}) {
  return useQuery<Appointment[]>(() => appointmentsApi.list(params), [JSON.stringify(params)]);
}

export function useTodayAppointments() {
  return useQuery<Appointment[]>(appointmentsApi.today);
}

export function useCreateAppointment(): UseMutationState<Appointment> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (data?: unknown) => {
    setLoading(true);
    setError(null);
    try {
      const res = await appointmentsApi.create(data as Partial<Appointment>);
      return res.data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur création RDV');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// ─── INVOICES HOOK ────────────────────────────────────────────────────────────
export function useInvoices(params?: { status?: string; page?: number }) {
  return useQuery<Invoice[]>(() => invoicesApi.list(params), [JSON.stringify(params)]);
}

// ─── AI CHAT HOOK ─────────────────────────────────────────────────────────────
interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp: Date; }

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const userMsg: ChatMessage = { role: 'user', content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setError(null);

    try {
      const res = await aiApi.chat([
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content },
      ]);
      const aiMsg: ChatMessage = {
        role: 'assistant', content: res.data.content, timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
      return aiMsg;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur IA');
      return null;
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = () => setMessages([]);

  return { messages, sendMessage, clearChat, loading, error };
}

// ─── NOTIFICATIONS HOOK ───────────────────────────────────────────────────────
export function useNotifications() {
  const [notifications, setNotifications] = useState<unknown[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Charger les notifs initiales
    notificationsApi.list().then(res => {
      setNotifications(res.data ?? []);
      setUnreadCount((res.data ?? []).filter((n: unknown) => !(n as { read: boolean }).read).length);
    }).catch(() => {});

    // S'abonner aux nouvelles notifs via SSE
    const unsubscribe = notificationsApi.subscribe((data) => {
      if ((data as { type: string }).type === 'connected') return;
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const markRead = async (id: string) => {
    await notificationsApi.markRead(id);
    setNotifications(prev =>
      prev.map((n: unknown) =>
        (n as { id: string }).id === id ? { ...(n as object), read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markRead };
}

// ─── TELECONSULT HOOK ─────────────────────────────────────────────────────────
export function useTeleconsult(sessionId: string | null) {
  const [session, setSession] = useState<unknown>(null);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const joinSession = useCallback(async () => {
    if (!sessionId) return;
    setLoading(true);
    try {
      const res = await teleconsultApi.join(sessionId);
      setSession(res.data);
      setRoomUrl(res.data.roomUrl);
    } catch (err) {
      console.error('Join teleconsult error:', err);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  const endSession = useCallback(async (notes?: string) => {
    if (!sessionId) return;
    await teleconsultApi.end(sessionId, notes);
    setSession(null);
    setRoomUrl(null);
  }, [sessionId]);

  return { session, roomUrl, joinSession, endSession, loading };
}

// ─── REVENUE ANALYTICS HOOK ───────────────────────────────────────────────────
export function useRevenueChart(months = 6) {
  return useQuery(
    () => analyticsApi.revenue(months),
    [months]
  );
}
