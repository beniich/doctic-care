import { Check, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/saas-billing';
import { formatCurrency } from '@/data/saas-billing-mock';

interface PlanCardProps {
  plan: Plan;
  currentPlanId?: string;
  billingCycle: 'monthly' | 'yearly';
  onSelect: (planId: string) => void;
}

export function PlanCard({ plan, currentPlanId, billingCycle, onSelect }: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId;
  const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
  const period = billingCycle === 'monthly' ? '/mois' : '/an';

  const featureLabels: Record<keyof typeof plan.features, string> = {
    billing: 'Facturation patients',
    products: 'Gestion produits',
    aiCopilot: 'IA Copilot',
    offline: 'Mode hors-ligne',
    analytics: 'Analytics avancés',
    multiCabinet: 'Multi-cabinets',
    prioritySupport: 'Support prioritaire',
  };

  return (
    <Card className={cn(
      'relative flex flex-col transition-all',
      plan.popular && 'border-primary shadow-lg',
      isCurrent && 'ring-2 ring-primary'
    )}>
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
          Populaire
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">{formatCurrency(price, plan.currency)}</span>
          <span className="text-muted-foreground">{period}</span>
          {billingCycle === 'yearly' && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              Économisez {formatCurrency(plan.priceMonthly * 12 - plan.priceYearly, plan.currency)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Limites</p>
          <ul className="text-sm space-y-1">
            <li>
              {plan.limits.patients === -1 ? 'Patients illimités' : `${plan.limits.patients} patients`}
            </li>
            <li>
              {plan.limits.users === -1 ? 'Utilisateurs illimités' : `${plan.limits.users} utilisateurs`}
            </li>
            <li>{plan.limits.storageGB} GB stockage</li>
            <li>
              {plan.limits.aiRequests === -1 
                ? 'Requêtes IA illimitées' 
                : plan.limits.aiRequests === 0 
                  ? 'IA non incluse'
                  : `${plan.limits.aiRequests} requêtes IA/mois`}
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Fonctionnalités</p>
          <ul className="text-sm space-y-1">
            {Object.entries(plan.features).map(([key, enabled]) => (
              <li key={key} className="flex items-center gap-2">
                {enabled ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground" />
                )}
                <span className={cn(!enabled && 'text-muted-foreground')}>
                  {featureLabels[key as keyof typeof featureLabels]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          variant={isCurrent ? 'outline' : plan.popular ? 'default' : 'secondary'}
          disabled={isCurrent}
          onClick={() => onSelect(plan.id)}
        >
          {isCurrent ? 'Plan actuel' : 'Choisir ce plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}
