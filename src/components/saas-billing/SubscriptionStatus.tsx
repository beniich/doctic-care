import { AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import type { Subscription, Tenant, Plan, UsageMetrics } from '@/types/saas-billing';
import { formatCurrency, getStatusColor } from '@/data/saas-billing-mock';

interface SubscriptionStatusProps {
  tenant: Tenant;
  subscription: Subscription;
  plan: Plan;
  usage: UsageMetrics;
  onManage: () => void;
}

export function SubscriptionStatus({ tenant, subscription, plan, usage, onManage }: SubscriptionStatusProps) {
  const statusIcons = {
    active: CheckCircle,
    grace: AlertTriangle,
    limited: Clock,
    suspended: XCircle,
  };
  
  const StatusIcon = statusIcons[tenant.subscriptionStatus];
  
  const statusMessages = {
    active: 'Votre abonnement est actif',
    grace: 'Période de grâce - Veuillez régulariser votre paiement',
    limited: 'Accès limité - Certaines fonctionnalités sont désactivées',
    suspended: 'Compte suspendu - Accès en lecture seule',
  };

  const calculateUsagePercent = (used: number, limit: number) => {
    if (limit === -1) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${
              tenant.subscriptionStatus === 'active' ? 'text-green-600' :
              tenant.subscriptionStatus === 'grace' ? 'text-yellow-600' :
              tenant.subscriptionStatus === 'limited' ? 'text-orange-600' :
              'text-red-600'
            }`} />
            Plan {plan.name}
          </CardTitle>
          <CardDescription>{statusMessages[tenant.subscriptionStatus]}</CardDescription>
        </div>
        <Badge className={getStatusColor(tenant.subscriptionStatus)}>
          {tenant.subscriptionStatus.toUpperCase()}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Cycle de facturation</p>
            <p className="font-medium">
              {subscription.billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Prochaine facturation</p>
            <p className="font-medium">
              {new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Montant</p>
            <p className="font-medium">
              {formatCurrency(
                subscription.billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly,
                plan.currency
              )}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Renouvellement auto</p>
            <p className="font-medium">
              {subscription.cancelAtPeriodEnd ? 'Non' : 'Oui'}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t">
          <p className="text-sm font-medium">Utilisation ce mois</p>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Patients</span>
              <span>
                {usage.patientsCount} / {plan.limits.patients === -1 ? '∞' : plan.limits.patients}
              </span>
            </div>
            <Progress value={calculateUsagePercent(usage.patientsCount, plan.limits.patients)} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Utilisateurs</span>
              <span>
                {usage.usersCount} / {plan.limits.users === -1 ? '∞' : plan.limits.users}
              </span>
            </div>
            <Progress value={calculateUsagePercent(usage.usersCount, plan.limits.users)} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Stockage</span>
              <span>{usage.storageUsedGB} GB / {plan.limits.storageGB} GB</span>
            </div>
            <Progress value={calculateUsagePercent(usage.storageUsedGB, plan.limits.storageGB)} className="h-2" />
          </div>

          {plan.limits.aiRequests > 0 && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Requêtes IA</span>
                <span>
                  {usage.aiRequestsCount} / {plan.limits.aiRequests === -1 ? '∞' : plan.limits.aiRequests}
                </span>
              </div>
              <Progress value={calculateUsagePercent(usage.aiRequestsCount, plan.limits.aiRequests)} className="h-2" />
            </div>
          )}
        </div>

        <Button onClick={onManage} className="w-full">
          Gérer l'abonnement
        </Button>
      </CardContent>
    </Card>
  );
}
