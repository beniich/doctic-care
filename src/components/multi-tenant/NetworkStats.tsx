import { Building2, Users, Heart, TrendingUp, Database, Sparkles, DollarSign, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { NetworkAnalytics } from '@/data/multi-tenant-mock';
import { formatCurrency } from '@/data/saas-billing-mock';

interface NetworkStatsProps {
  analytics: NetworkAnalytics;
}

export function NetworkStats({ analytics }: NetworkStatsProps) {
  const stats = [
    {
      label: 'Cabinets',
      value: analytics.totalCabinets.toString(),
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Patients totaux',
      value: analytics.totalPatients.toLocaleString('fr-FR'),
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      label: 'Utilisateurs',
      value: analytics.totalUsers.toString(),
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Revenu mensuel',
      value: formatCurrency(analytics.totalRevenue),
      icon: DollarSign,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Croissance',
      value: `+${analytics.growthRate}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    },
    {
      label: 'Stockage utilisé',
      value: `${analytics.storageUsedGB.toFixed(0)} GB`,
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      label: 'Requêtes IA',
      value: analytics.aiRequestsTotal.toLocaleString('fr-FR'),
      icon: Sparkles,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      label: 'Revenu / Cabinet',
      value: formatCurrency(analytics.avgRevenuePerCabinet),
      icon: Globe,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
