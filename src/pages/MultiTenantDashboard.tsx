import { useState, useEffect } from 'react';
import { Building2, BarChart3, Map, Plus, Search, Filter, Download, Shield } from 'lucide-react';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
import { ListPane } from '@/components/layout/ListPane';
import { DetailPane } from '@/components/layout/DetailPane';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TenantCard } from '@/components/multi-tenant/TenantCard';
import { NetworkStats } from '@/components/multi-tenant/NetworkStats';
import { NetworkCharts } from '@/components/multi-tenant/NetworkCharts';
import { formatCurrency, getStatusColor, getPlanById } from '@/data/saas-billing-mock';
import { toast } from 'sonner';

// Keep types for compatibility
import { type TenantWithMetrics } from '@/data/multi-tenant-mock';

const API_BASE = '/api';

type ViewType = 'analytics' | 'cabinets' | 'map' | 'audit';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const navItems: NavItem[] = [
  { id: 'analytics', label: 'Analytics réseau', icon: BarChart3, description: 'Vue consolidée' },
  { id: 'cabinets', label: 'Cabinets', icon: Building2, description: 'Liste des tenants' },
  { id: 'map', label: 'Carte', icon: Map, description: 'Vue géographique' },
  { id: 'audit', label: 'Logs d\'Audit', icon: Shield, description: 'Sécurité & Conformité' },
];

export default function MultiTenantDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedTenant, setSelectedTenant] = useState<TenantWithMetrics | null>(null);
  
  const [tenants, setTenants] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTenantData, setNewTenantData] = useState({ name: '', slug: '', plan: 'STARTER', adminEmail: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tenantsRes, analyticsRes] = await Promise.all([
          fetch(`${API_BASE}/tenants`),
          fetch(`${API_BASE}/analytics/dashboard`)
        ]);

        if (tenantsRes.ok) {
          const tenantsJson = await tenantsRes.json();
          setTenants(tenantsJson.data || []);
        }

        if (analyticsRes.ok) {
          const analyticsJson = await analyticsRes.json();
          setAnalytics(analyticsJson.data);
        }

        const auditRes = await fetch(`${API_BASE}/analytics/audit`);
        if (auditRes.ok) {
          const auditJson = await auditRes.json();
          setAuditLogs(auditJson.data || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch = (tenant.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tenant.adminEmail || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.subscriptionStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const countries = [...new Set(tenants.map(t => t.country))];

  const renderListPane = () => (
    <ListPane
      title="Multi-Tenant"
      searchPlaceholder="Rechercher..."
      onSearch={() => {}}
      actions={
        <Badge variant="secondary">
          {tenants.length} cabinets
        </Badge>
      }
    >
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                currentView === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.label}</p>
                <p className="text-sm text-muted-foreground truncate">{item.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Revenu total</span>
              <span className="font-bold text-primary">{formatCurrency(analytics?.revenue?.thisMonth || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Patients</span>
              <span className="font-semibold">{(analytics?.patients?.total || 0).toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Croissance</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                +{analytics?.patients?.trend || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau cabinet
        </Button>
      </div>
    </ListPane>
  );

  const handleCreateTenant = async () => {
    try {
      const res = await fetch(`${API_BASE}/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTenantData)
      });
      if (res.ok) {
        toast.success('Cabinet créé avec succès');
        setIsCreateModalOpen(false);
        // Page reload or state refresh
        window.location.reload();
      } else {
        toast.error('Erreur lors de la création');
      }
    } catch (e) {
      toast.error('Impossible de créer le cabinet');
    }
  };

  const renderAnalyticsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics réseau</h2>
          <p className="text-muted-foreground">Vue consolidée de tous vos cabinets</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Export en cours...')}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {analytics && analytics.network && (
        <>
          <NetworkStats analytics={analytics.network} />
          <NetworkCharts analytics={analytics.network} />
        </>
      )}
    </div>
  );

  const renderCabinetsView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cabinets</h2>
          <p className="text-muted-foreground">{filteredTenants.length} cabinet(s) trouvé(s)</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cabinet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="grace">Grâce</SelectItem>
            <SelectItem value="limited">Limité</SelectItem>
            <SelectItem value="suspended">Suspendu</SelectItem>
          </SelectContent>
        </Select>
        <Select value={planFilter} onValueChange={setPlanFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous plans</SelectItem>
            <SelectItem value="starter">Starter</SelectItem>
            <SelectItem value="pro">Pro</SelectItem>
            <SelectItem value="network">Network</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredTenants.map((tenant) => (
          <TenantCard
            key={tenant.id}
            tenant={tenant}
            onView={setSelectedTenant}
          />
        ))}
      </div>

      {filteredTenants.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun cabinet trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderAuditLogsView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Logs d'Activités Fleet</h2>
        <p className="text-slate-500">Dernières actions sur l'ensemble de l'infrastructure</p>
      </div>

      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight text-[10px]">Horodatage</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight text-[10px]">Utilisateur</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight text-[10px]">Action</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-tight text-[10px]">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 text-slate-500 font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        {log.user?.firstName} {log.user?.lastName}
                      </span>
                      <span className="text-[10px] text-slate-400">{log.user?.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant={log.action === 'LOGIN' ? 'secondary' : 'outline'} className="text-[10px]">
                      {log.action}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                    {log.details || '-'}
                  </td>
                </tr>
              ))}
              {auditLogs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-400">Aucun log récent</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderMapView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vue géographique</h2>
        <p className="text-muted-foreground">Répartition des cabinets par pays</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => {
          const countryTenants = tenants.filter(t => t.country === country);
          const totalRevenue = countryTenants.reduce((sum, t) => sum + (t.revenue || 0), 0);
          const totalPatients = countryTenants.reduce((sum, t) => sum + (t.usage?.patientsCount || 0), 0);
          
          return (
            <Card key={country} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-3xl">{getCountryFlag(country)}</span>
                  {getCountryName(country)}
                </CardTitle>
                <CardDescription>{countryTenants.length} cabinet(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Revenu</p>
                    <p className="font-bold text-primary">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Patients</p>
                    <p className="font-bold">{totalPatients.toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  {countryTenants.map(tenant => (
                    <div key={tenant.id} className="flex items-center justify-between text-sm">
                      <span className="truncate">{tenant.name}</span>
                      <Badge className={getStatusColor(tenant.subscriptionStatus)} variant="secondary">
                        {tenant.subscriptionStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderDetailContent = () => {
    switch (currentView) {
      case 'analytics':
        return renderAnalyticsView();
      case 'cabinets':
        return renderCabinetsView();
      case 'map':
        return renderMapView();
      case 'audit':
        return renderAuditLogsView();
      default:
        return renderAnalyticsView();
    }
  };

  return (
    <>
      <OutlookLayout
        listPane={renderListPane()}
        detailPane={<DetailPane>{renderDetailContent()}</DetailPane>}
      />

      {/* Tenant Detail Dialog */}
      <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTenant && getCountryFlag(selectedTenant.country)}
              {selectedTenant?.name}
            </DialogTitle>
            <DialogDescription>{selectedTenant?.adminEmail}</DialogDescription>
          </DialogHeader>
          {selectedTenant && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Statut</span>
                <Badge className={getStatusColor(selectedTenant.subscriptionStatus)}>
                  {selectedTenant.subscriptionStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Plan</span>
                <Badge variant="outline">{getPlanById(selectedTenant.planId)?.name}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Patients</p>
                  <p className="text-xl font-bold">{selectedTenant.usage.patientsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Utilisateurs</p>
                  <p className="text-xl font-bold">{selectedTenant.activeUsers}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stockage</p>
                  <p className="text-xl font-bold">{selectedTenant.usage.storageUsedGB.toFixed(1)} GB</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenu</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(selectedTenant.revenue)}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Membre depuis</p>
                <p className="font-medium">
                  {new Date(selectedTenant.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <Button className="w-full" onClick={() => toast.info('Accès admin en développement')}>
                Accéder au cabinet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Tenant Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouveau Cabinet</DialogTitle>
            <DialogDescription>Créez une nouvelle instance Doctic Care</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de la clinique</label>
              <Input 
                placeholder="Ex: Clinique du Soleil" 
                value={newTenantData.name} 
                onChange={e => setNewTenantData({...newTenantData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sous-domaine (slug)</label>
              <Input 
                placeholder="Ex: clinique-soleil" 
                value={newTenantData.slug} 
                onChange={e => setNewTenantData({...newTenantData, slug: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Administrateur</label>
              <Input 
                type="email"
                placeholder="Ex: admin@clinique.com" 
                value={newTenantData.adminEmail} 
                onChange={e => setNewTenantData({...newTenantData, adminEmail: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Plan</label>
              <Select value={newTenantData.plan} onValueChange={v => setNewTenantData({...newTenantData, plan: v})}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="STARTER">Starter</SelectItem>
                  <SelectItem value="PRO">Pro</SelectItem>
                  <SelectItem value="NETWORK">Network</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full mt-4" onClick={handleCreateTenant}>Créer la clinique</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
