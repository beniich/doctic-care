import { useState } from 'react';
import { Building2, BarChart3, Map, Plus, Search, Filter, Download } from 'lucide-react';
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
import {
  mockTenants,
  mockNetworkAnalytics,
  getCountryFlag,
  getCountryName,
  type TenantWithMetrics,
} from '@/data/multi-tenant-mock';
import { formatCurrency, getStatusColor, getPlanById } from '@/data/saas-billing-mock';
import { toast } from 'sonner';

type ViewType = 'analytics' | 'cabinets' | 'map';

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
];

export default function MultiTenantDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [selectedTenant, setSelectedTenant] = useState<TenantWithMetrics | null>(null);

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tenant.subscriptionStatus === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const countries = [...new Set(mockTenants.map(t => t.country))];

  const renderListPane = () => (
    <ListPane
      title="Multi-Tenant"
      searchPlaceholder="Rechercher..."
      onSearch={() => {}}
      actions={
        <Badge variant="secondary">
          {mockTenants.length} cabinets
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
              <span className="font-bold text-primary">{formatCurrency(mockNetworkAnalytics.totalRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Patients</span>
              <span className="font-semibold">{mockNetworkAnalytics.totalPatients.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Croissance</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                +{mockNetworkAnalytics.growthRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Button className="w-full" onClick={() => toast.info('Fonctionnalité en développement')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau cabinet
        </Button>
      </div>
    </ListPane>
  );

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

      <NetworkStats analytics={mockNetworkAnalytics} />
      <NetworkCharts analytics={mockNetworkAnalytics} />
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

  const renderMapView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vue géographique</h2>
        <p className="text-muted-foreground">Répartition des cabinets par pays</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((country) => {
          const countryTenants = mockTenants.filter(t => t.country === country);
          const totalRevenue = countryTenants.reduce((sum, t) => sum + t.revenue, 0);
          const totalPatients = countryTenants.reduce((sum, t) => sum + t.usage.patientsCount, 0);
          
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
    </>
  );
}
