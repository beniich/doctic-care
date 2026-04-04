import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Building2, Users, CreditCard, Activity, Plus, Search,
  MoreVertical, ShieldAlert, TrendingUp, BarChart3,
  CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  Loader2, Eye, Ban, ChevronRight
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { LogoIcon } from '@/components/layout/LogoIcon';

// ─── TYPES ──────────────────────────────────────────────────────────────────
interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: string;
  subscriptionStatus: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  currentPeriodEnd?: string;
  active: boolean;
  _count?: { users: number; patients: number; appointments: number; invoices: number };
  createdAt: string;
}

interface RevenuePoint { month: string; revenue: number; invoices: number; }
interface AuditLog {
  id: string;
  action: string;
  resource?: string;
  outcome: string;
  ipAddress?: string;
  timestamp: string;
  tenantId?: string;
  user?: { firstName?: string; lastName?: string; email: string };
}

// ─── PLAN PRICES (MRR reference) ────────────────────────────────────────────
const PLAN_PRICES: Record<string, number> = { STARTER: 19, PRO: 67, BUSINESS: 100, ENTERPRISE: 249 };

const PLAN_COLORS: Record<string, string> = {
  STARTER: '#6366f1',
  PRO: '#3b82f6',
  BUSINESS: '#f59e0b',
  ENTERPRISE: '#ec4899',
};

function getPlanMRR(tenant: Tenant) {
  if (tenant.subscriptionStatus !== 'active') return 0;
  return PLAN_PRICES[tenant.plan] || 0;
}

// ─── STATUS BADGE ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    active: { label: 'Actif', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    trialing: { label: 'Essai', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    past_due: { label: 'Retard', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
    canceled: { label: 'Annulé', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
    inactive: { label: 'Inactif', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
  };
  const cfg = map[status] ?? map.inactive;
  return <Badge className={`border ${cfg.className} text-xs`}>{cfg.label}</Badge>;
}

// ─── OUTCOME BADGE ────────────────────────────────────────────────────────────
function OutcomeBadge({ outcome }: { outcome: string }) {
  if (outcome === 'SUCCESS') return (
    <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 className="w-3 h-3" /> Succès</span>
  );
  if (outcome === 'FAILURE') return (
    <span className="flex items-center gap-1 text-rose-400 text-xs"><XCircle className="w-3 h-3" /> Échec</span>
  );
  return (
    <span className="flex items-center gap-1 text-amber-400 text-xs"><AlertTriangle className="w-3 h-3" /> Refusé</span>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
type Tab = 'cliniques' | 'abonnements' | 'audit';

const SuperAdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Global state
  const [activeTab, setActiveTab] = useState<Tab>('cliniques');
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  // Manage tenant
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.role === 'SUPER_ADMIN') {
      loadAll();
    }
  }, [user]);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [tenantsRes, revenueRes, auditRes] = await Promise.allSettled([
        api.get<{ data: Tenant[] }>('/tenants'),
        api.get<{ data: RevenuePoint[] }>('/analytics/revenue'),
        api.get<{ data: AuditLog[] }>('/analytics/audit'),
      ]);

      if (tenantsRes.status === 'fulfilled') {
        setTenants((tenantsRes.value as any).data ?? []);
      }
      if (revenueRes.status === 'fulfilled') {
        setRevenueData((revenueRes.value as any).data ?? []);
      }
      if (auditRes.status === 'fulfilled') {
        setAuditLogs((auditRes.value as any).data ?? []);
      }
    } catch (e) {
      toast.error('Erreur de chargement de l\'infrastructure');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (tenant: Tenant) => {
    if (!confirm(`Suspendre "${tenant.name}" ?`)) return;
    setUpdatingId(tenant.id);
    try {
      await api.delete(`/tenants/${tenant.id}`);
      setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, active: false, subscriptionStatus: 'canceled' } : t));
      toast.success(`${tenant.name} suspendu`);
    } catch {
      toast.error('Erreur lors de la suspension');
    } finally {
      setUpdatingId(null);
    }
  };

  if (user?.role !== 'SUPER_ADMIN') return <Navigate to="/dashboard" />;

  // ─── KPIs ─────────────────────────────────────────────────────────────────
  const totalMRR = tenants.reduce((acc, t) => acc + getPlanMRR(t), 0);
  const activeTenants = tenants.filter(t => t.active && t.subscriptionStatus === 'active').length;
  const totalUsers = tenants.reduce((acc, t) => acc + (t._count?.users || 0), 0);
  const totalPatients = tenants.reduce((acc, t) => acc + (t._count?.patients || 0), 0);

  // Plan distribution for pie chart
  const planDistribution = Object.entries(
    tenants.reduce((acc, t) => {
      acc[t.plan] = (acc[t.plan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([plan, count]) => ({ plan, count }));

  // Filtered lists
  const filteredTenants = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.slug.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLogs = auditLogs.filter(log => {
    const matchSearch = !auditSearch ||
      (log.user?.email ?? '').toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase());
    const matchAction = !actionFilter || log.action === actionFilter;
    return matchSearch && matchAction;
  });

  const uniqueActions = [...new Set(auditLogs.map(l => l.action))];

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#050508] text-white overflow-hidden">

      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 border-r border-white/[0.06] bg-black/40 backdrop-blur-xl p-6 hidden md:flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <LogoIcon className="w-9 h-9" />
          <div>
            <h1 className="text-base font-bold text-white leading-tight">Doctic Control</h1>
            <p className="text-[10px] text-rose-400 tracking-widest uppercase">Super Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="space-y-1 flex-1">
          {([
            { id: 'cliniques', label: 'Cliniques (Tenants)', icon: Building2 },
            { id: 'abonnements', label: 'Abonnements & MRR', icon: CreditCard },
            { id: 'audit', label: "Logs d'Audit", icon: Activity },
          ] as { id: Tab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                activeTab === id
                  ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/10 text-white border border-rose-500/20'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === id ? 'text-rose-400' : ''}`} />
              {label}
              {activeTab === id && <ChevronRight className="w-3 h-3 ml-auto text-rose-400" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="pt-6 border-t border-white/[0.06] space-y-3">
          <button
            onClick={loadAll}
            className="w-full flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors px-1"
          >
            <RefreshCw className="w-3 h-3" /> Actualiser les données
          </button>
          <button
            onClick={() => navigate('/onboarding')}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white text-xs font-semibold rounded-xl py-2.5 shadow-lg shadow-rose-500/20 transition-all"
          >
            <Plus className="w-3 h-3" /> Nouveau Tenant
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600/8 blur-[120px] rounded-full -z-10" />

        <div className="p-8 space-y-8">

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'MRR Réel', value: `${totalMRR.toLocaleString('fr-FR')} €`, icon: TrendingUp, color: 'rose', sub: `${activeTenants} abonnements actifs` },
              { label: 'Tenants', value: tenants.length, icon: Building2, color: 'blue', sub: `${activeTenants} actifs` },
              { label: 'Praticiens', value: totalUsers.toLocaleString(), icon: Users, color: 'orange', sub: 'Utilisateurs du réseau' },
              { label: 'Patients', value: totalPatients.toLocaleString('fr-FR'), icon: Activity, color: 'purple', sub: 'Dossiers sur la flotte' },
            ].map(({ label, value, icon: Icon, color, sub }) => (
              <Card key={label} className="bg-white/[0.03] border-white/[0.07] backdrop-blur-sm group hover:border-white/10 transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-white/40 mb-1">{label}</p>
                      <p className="text-2xl font-bold text-white">{isLoading ? '—' : value}</p>
                      <p className="text-[10px] text-white/25 mt-1">{sub}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-4 h-4 text-${color}-400`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ── Loading ── */}
          {isLoading && (
            <div className="flex items-center justify-center py-20 text-white/30 gap-3">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Chargement de l'infrastructure...</span>
            </div>
          )}

          {!isLoading && (
            <>
              {/* ════════════════════════════════════════════════════════════
                  TAB 1 — CLINIQUES
              ════════════════════════════════════════════════════════════ */}
              {activeTab === 'cliniques' && (
                <Card className="bg-black/40 border border-white/[0.07] backdrop-blur-xl">
                  <CardHeader className="border-b border-white/[0.05] flex flex-row items-center justify-between py-4 px-6">
                    <CardTitle className="text-base text-white font-medium">
                      Cliniques Connectées
                      <span className="ml-2 text-xs font-normal text-white/30">({filteredTenants.length})</span>
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <Input
                        placeholder="Rechercher..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-56 bg-white/[0.04] border-white/[0.08] text-white text-sm pl-8 h-8 rounded-lg focus:border-rose-500/50"
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.05] hover:bg-transparent">
                          {['Clinique / Tenant', 'Statut', 'Plan', 'MRR', 'Membres', 'Patients', 'Actions'].map(h => (
                            <TableHead key={h} className="text-white/30 text-[11px] font-semibold uppercase tracking-wider">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTenants.length === 0 ? (
                          <TableRow className="border-none">
                            <TableCell colSpan={7} className="text-center py-12 text-white/20">
                              Aucune clinique trouvée
                            </TableCell>
                          </TableRow>
                        ) : filteredTenants.map(tenant => (
                          <TableRow key={tenant.id} className="border-white/[0.04] hover:bg-white/[0.02] group">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/60">
                                  {tenant.name[0]}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-white">{tenant.name}</p>
                                  <p className="text-[10px] text-white/30 font-mono">{tenant.slug}.doctic.com</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={tenant.active ? tenant.subscriptionStatus : 'inactive'} />
                            </TableCell>
                            <TableCell>
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${
                                tenant.plan === 'ENTERPRISE' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' :
                                tenant.plan === 'BUSINESS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                tenant.plan === 'PRO' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              }`}>
                                {tenant.plan}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-semibold text-white">
                                {getPlanMRR(tenant) > 0 ? `${getPlanMRR(tenant)} €` : <span className="text-white/20">—</span>}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm text-white/60">{tenant._count?.users ?? 0}</TableCell>
                            <TableCell className="text-sm text-white/60">{tenant._count?.patients ?? 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-7 w-7 text-white/40 hover:text-white hover:bg-white/10"
                                  onClick={() => navigate(`/admin/tenant/${tenant.id}`)}
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </Button>
                                {tenant.active && (
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-white/40 hover:text-rose-400 hover:bg-rose-500/10"
                                    onClick={() => handleSuspend(tenant)}
                                    disabled={updatingId === tenant.id}
                                  >
                                    {updatingId === tenant.id
                                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      : <Ban className="w-3.5 h-3.5" />
                                    }
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}

              {/* ════════════════════════════════════════════════════════════
                  TAB 2 — ABONNEMENTS & MRR
              ════════════════════════════════════════════════════════════ */}
              {activeTab === 'abonnements' && (
                <div className="space-y-6">
                  {/* MRR Chart */}
                  <Card className="bg-black/40 border border-white/[0.07] backdrop-blur-xl">
                    <CardHeader className="border-b border-white/[0.05] px-6 py-4">
                      <CardTitle className="text-base text-white font-medium flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-rose-400" />
                        Évolution du MRR — 6 derniers mois
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {revenueData.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-white/20 text-sm">
                          Aucune donnée de revenu enregistrée
                        </div>
                      ) : (
                        <div className="h-56">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                              <defs>
                                <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}€`} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}
                                formatter={(v: number) => [`${v.toLocaleString('fr-FR')} €`, 'Revenu']}
                                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="#f43f5e" strokeWidth={2} fill="url(#mrrGrad)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Plan distribution + Per-tenant table */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Pie */}
                    <Card className="bg-black/40 border border-white/[0.07] backdrop-blur-xl">
                      <CardHeader className="px-6 py-4 border-b border-white/[0.05]">
                        <CardTitle className="text-sm text-white font-medium">Répartition par Plan</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4">
                        {planDistribution.length === 0 ? (
                          <div className="h-40 flex items-center justify-center text-white/20 text-xs">Aucune donnée</div>
                        ) : (
                          <div className="h-44">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={planDistribution} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={65} labelLine={false} label={({ plan, count }) => `${plan} (${count})`}>
                                  {planDistribution.map((entry) => (
                                    <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan] ?? '#6366f1'} />
                                  ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#0d0d14', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        <div className="space-y-2 mt-2">
                          {planDistribution.map(({ plan, count }) => (
                            <div key={plan} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PLAN_COLORS[plan] }} />
                                <span className="text-white/60">{plan}</span>
                              </div>
                              <span className="text-white font-semibold">{count} clinique{count > 1 ? 's' : ''}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Per-tenant revenue table */}
                    <Card className="lg:col-span-2 bg-black/40 border border-white/[0.07] backdrop-blur-xl">
                      <CardHeader className="px-6 py-4 border-b border-white/[0.05]">
                        <CardTitle className="text-sm text-white font-medium">Abonnements par Clinique</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="border-white/[0.05] hover:bg-transparent">
                              {['Clinique', 'Plan', 'Statut', 'MRR/mois', 'Expire le'].map(h => (
                                <TableHead key={h} className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">{h}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {tenants.map(tenant => (
                              <TableRow key={tenant.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                                <TableCell className="text-sm font-medium text-white">{tenant.name}</TableCell>
                                <TableCell>
                                  <span className="text-xs text-white/60">{tenant.plan}</span>
                                </TableCell>
                                <TableCell>
                                  <StatusBadge status={tenant.active ? tenant.subscriptionStatus : 'inactive'} />
                                </TableCell>
                                <TableCell>
                                  <span className={`text-sm font-bold ${getPlanMRR(tenant) > 0 ? 'text-emerald-400' : 'text-white/20'}`}>
                                    {getPlanMRR(tenant) > 0 ? `${getPlanMRR(tenant)} €` : '—'}
                                  </span>
                                </TableCell>
                                <TableCell className="text-xs text-white/30 font-mono">
                                  {tenant.currentPeriodEnd
                                    ? new Date(tenant.currentPeriodEnd).toLocaleDateString('fr-FR')
                                    : '—'}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* ════════════════════════════════════════════════════════════
                  TAB 3 — LOGS D'AUDIT
              ════════════════════════════════════════════════════════════ */}
              {activeTab === 'audit' && (
                <div className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[220px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
                      <Input
                        placeholder="Utilisateur, action..."
                        value={auditSearch}
                        onChange={e => setAuditSearch(e.target.value)}
                        className="bg-white/[0.04] border-white/[0.08] text-white text-sm pl-8 h-9 rounded-xl focus:border-rose-500/50"
                      />
                    </div>
                    <select
                      value={actionFilter}
                      onChange={e => setActionFilter(e.target.value)}
                      className="h-9 px-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 text-sm focus:outline-none focus:border-rose-500/50"
                    >
                      <option value="">Toutes les actions</option>
                      {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/30 hover:text-white border border-white/[0.08]"
                      onClick={() => { setAuditSearch(''); setActionFilter(''); }}
                    >
                      Réinitialiser
                    </Button>
                    <span className="text-xs text-white/25">{filteredLogs.length} entrée{filteredLogs.length > 1 ? 's' : ''}</span>
                  </div>

                  <Card className="bg-black/40 border border-white/[0.07] backdrop-blur-xl">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-white/[0.05] hover:bg-transparent">
                            {['Horodatage', 'Utilisateur', 'Action', 'Ressource', 'Résultat', 'IP'].map(h => (
                              <TableHead key={h} className="text-white/30 text-[10px] font-semibold uppercase tracking-wider">{h}</TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLogs.length === 0 ? (
                            <TableRow className="border-none">
                              <TableCell colSpan={6} className="text-center py-16 text-white/20">
                                Aucun log d'activité trouvé
                              </TableCell>
                            </TableRow>
                          ) : filteredLogs.map(log => (
                            <TableRow key={log.id} className="border-white/[0.04] hover:bg-white/[0.02] group">
                              <TableCell className="text-[11px] text-white/30 font-mono">
                                {new Date(log.timestamp).toLocaleString('fr-FR')}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-xs font-medium text-white">
                                    {log.user ? `${log.user.firstName ?? ''} ${log.user.lastName ?? ''}`.trim() || log.user.email : 'Système'}
                                  </span>
                                  <span className="text-[10px] text-white/25">{log.user?.email}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <code className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-rose-300">{log.action}</code>
                              </TableCell>
                              <TableCell className="text-[11px] text-white/40 font-mono max-w-[120px] truncate">
                                {log.resource ?? '—'}
                              </TableCell>
                              <TableCell>
                                <OutcomeBadge outcome={log.outcome} />
                              </TableCell>
                              <TableCell className="text-[11px] text-white/25 font-mono">
                                {log.ipAddress ?? '—'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;
