import { Building2, Users, Database, Sparkles, MoreVertical, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { TenantWithMetrics } from '@/data/multi-tenant-mock';
import { getCountryFlag } from '@/data/multi-tenant-mock';
import { formatCurrency, getStatusColor, getPlanById } from '@/data/saas-billing-mock';

interface TenantCardProps {
  tenant: TenantWithMetrics;
  onView: (tenant: TenantWithMetrics) => void;
}

export function TenantCard({ tenant, onView }: TenantCardProps) {
  const plan = getPlanById(tenant.planId);
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{tenant.name}</h3>
                <span className="text-lg">{getCountryFlag(tenant.country)}</span>
              </div>
              <p className="text-sm text-muted-foreground">{tenant.adminEmail}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(tenant.subscriptionStatus)}>
              {tenant.subscriptionStatus}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(tenant)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir détails
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{tenant.usage.patientsCount}</p>
            <p className="text-xs text-muted-foreground">Patients</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{tenant.activeUsers}</p>
            <p className="text-xs text-muted-foreground">Utilisateurs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{tenant.usage.storageUsedGB.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">GB stockage</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{formatCurrency(tenant.revenue)}</p>
            <p className="text-xs text-muted-foreground">Revenu</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{plan?.name}</Badge>
            <span className="text-xs text-muted-foreground">
              Depuis {new Date(tenant.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          
          {plan && plan.limits.aiRequests > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" />
              {tenant.usage.aiRequestsCount} IA
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
