import { useState } from 'react';
import { CreditCard, Receipt, ArrowUpRight, Plus, Building2 } from 'lucide-react';
import { OutlookLayout } from '@/components/layout/OutlookLayout';
import { ListPane } from '@/components/layout/ListPane';
import { DetailPane } from '@/components/layout/DetailPane';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PlanCard } from '@/components/saas-billing/PlanCard';
import { SubscriptionStatus } from '@/components/saas-billing/SubscriptionStatus';
import { PaymentMethodCard } from '@/components/saas-billing/PaymentMethodCard';
import { SaasInvoiceList } from '@/components/saas-billing/SaasInvoiceList';
import {
  mockPlans,
  mockTenant,
  mockSubscription,
  mockInvoices,
  mockPaymentMethods,
  mockUsageMetrics,
  getPlanById,
  formatCurrency,
  getStatusColor,
} from '@/data/saas-billing-mock';
import type { SaasInvoice, PaymentMethodConfig } from '@/types/saas-billing';
import { toast } from 'sonner';

type SectionType = 'overview' | 'plans' | 'invoices' | 'payment-methods';

interface SectionItem {
  id: SectionType;
  title: string;
  description: string;
  icon: React.ElementType;
}

const sections: SectionItem[] = [
  { id: 'overview', title: 'Vue d\'ensemble', description: 'Abonnement et utilisation', icon: Building2 },
  { id: 'plans', title: 'Plans & Tarifs', description: 'Changer de plan', icon: ArrowUpRight },
  { id: 'invoices', title: 'Factures', description: 'Historique des factures', icon: Receipt },
  { id: 'payment-methods', title: 'Moyens de paiement', description: 'Cartes et méthodes', icon: CreditCard },
];

export default function SaasBilling() {
  const [selectedSection, setSelectedSection] = useState<SectionType>('overview');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(mockPaymentMethods);
  const [selectedInvoice, setSelectedInvoice] = useState<SaasInvoice | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);

  const currentPlan = getPlanById(mockTenant.planId);

  const handlePlanSelect = (planId: string) => {
    if (planId === mockTenant.planId) return;
    setPendingPlanId(planId);
    setShowPlanDialog(true);
  };

  const confirmPlanChange = () => {
    toast.success('Demande de changement de plan envoyée. Un conseiller vous contactera.');
    setShowPlanDialog(false);
    setPendingPlanId(null);
  };

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({ ...m, isDefault: m.id === id }))
    );
    toast.success('Méthode de paiement par défaut mise à jour');
  };

  const handleDeletePayment = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    if (method?.isDefault) {
      toast.error('Impossible de supprimer la méthode par défaut');
      return;
    }
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
    toast.success('Méthode de paiement supprimée');
  };

  const renderListPane = () => (
    <ListPane
      title="Facturation SaaS"
      searchPlaceholder="Rechercher..."
      onSearch={() => {}}
      actions={
        <Badge className={getStatusColor(mockTenant.subscriptionStatus)}>
          {mockTenant.subscriptionStatus.toUpperCase()}
        </Badge>
      }
    >
      <div className="space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left ${
                selectedSection === section.id
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{section.title}</p>
                <p className="text-sm text-muted-foreground truncate">{section.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cabinet</p>
            <p className="font-semibold">{mockTenant.name}</p>
            <p className="text-sm text-muted-foreground mt-2">Plan actuel</p>
            <p className="font-semibold">{currentPlan?.name}</p>
          </CardContent>
        </Card>
      </div>
    </ListPane>
  );

  const renderOverviewSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
        <p className="text-muted-foreground">Gérez votre abonnement Doctic</p>
      </div>

      {currentPlan && (
        <SubscriptionStatus
          tenant={mockTenant}
          subscription={mockSubscription}
          plan={currentPlan}
          usage={mockUsageMetrics}
          onManage={() => setSelectedSection('plans')}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Dernières factures</CardTitle>
        </CardHeader>
        <CardContent>
          <SaasInvoiceList
            invoices={mockInvoices.slice(0, 3)}
            onViewInvoice={setSelectedInvoice}
          />
          <Button
            variant="link"
            className="mt-2"
            onClick={() => setSelectedSection('invoices')}
          >
            Voir toutes les factures
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderPlansSection = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Plans & Tarifs</h2>
        <p className="text-muted-foreground">Choisissez le plan adapté à votre cabinet</p>
      </div>

      <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg">
        <Label htmlFor="billing-cycle" className={billingCycle === 'monthly' ? 'font-medium' : 'text-muted-foreground'}>
          Mensuel
        </Label>
        <Switch
          id="billing-cycle"
          checked={billingCycle === 'yearly'}
          onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
        />
        <Label htmlFor="billing-cycle" className={billingCycle === 'yearly' ? 'font-medium' : 'text-muted-foreground'}>
          Annuel
        </Label>
        {billingCycle === 'yearly' && (
          <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            -17%
          </Badge>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {mockPlans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanId={mockTenant.planId}
            billingCycle={billingCycle}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>
    </div>
  );

  const renderInvoicesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Factures</h2>
          <p className="text-muted-foreground">Historique de facturation</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <SaasInvoiceList
            invoices={mockInvoices}
            onViewInvoice={setSelectedInvoice}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentMethodsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Moyens de paiement</h2>
          <p className="text-muted-foreground">Gérez vos méthodes de paiement</p>
        </div>
        <Button onClick={() => toast.info('Fonctionnalité en développement')}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="card">Cartes</TabsTrigger>
          <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
          <TabsTrigger value="bank">Virement</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {paymentMethods.map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={handleSetDefaultPayment}
              onDelete={handleDeletePayment}
            />
          ))}
        </TabsContent>

        <TabsContent value="card" className="space-y-3 mt-4">
          {paymentMethods.filter(m => m.type === 'card').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={handleSetDefaultPayment}
              onDelete={handleDeletePayment}
            />
          ))}
        </TabsContent>

        <TabsContent value="mobile" className="space-y-3 mt-4">
          {paymentMethods.filter(m => m.type === 'mobile_money').map((method) => (
            <PaymentMethodCard
              key={method.id}
              method={method}
              onSetDefault={handleSetDefaultPayment}
              onDelete={handleDeletePayment}
            />
          ))}
        </TabsContent>

        <TabsContent value="bank" className="space-y-3 mt-4">
          {paymentMethods.filter(m => m.type === 'bank_transfer').length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucun compte bancaire configuré</p>
          ) : (
            paymentMethods.filter(m => m.type === 'bank_transfer').map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSetDefault={handleSetDefaultPayment}
                onDelete={handleDeletePayment}
              />
            ))
          )}
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Méthodes de paiement acceptées</CardTitle>
          <CardDescription>Doctic supporte plusieurs options de paiement</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
            <CreditCard className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Cartes</span>
            <span className="text-xs text-muted-foreground">Visa, Mastercard</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
            <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <span className="text-sm font-medium">Mobile Money</span>
            <span className="text-xs text-muted-foreground">Orange, MTN, Wave</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-muted/50">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium">Virement</span>
            <span className="text-xs text-muted-foreground">SEPA, Swift</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetailContent = () => {
    switch (selectedSection) {
      case 'overview':
        return renderOverviewSection();
      case 'plans':
        return renderPlansSection();
      case 'invoices':
        return renderInvoicesSection();
      case 'payment-methods':
        return renderPaymentMethodsSection();
      default:
        return renderOverviewSection();
    }
  };

  return (
    <>
      <OutlookLayout
        listPane={renderListPane()}
        detailPane={
          <DetailPane>{renderDetailContent()}</DetailPane>
        }
      />

      {/* Plan Change Confirmation Dialog */}
      <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer de plan</DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de passer au plan{' '}
              <strong>{getPlanById(pendingPlanId || '')?.name}</strong>.
              {billingCycle === 'yearly' && (
                <span className="block mt-2">
                  Nouveau tarif : {formatCurrency(getPlanById(pendingPlanId || '')?.priceYearly || 0)} / an
                </span>
              )}
              {billingCycle === 'monthly' && (
                <span className="block mt-2">
                  Nouveau tarif : {formatCurrency(getPlanById(pendingPlanId || '')?.priceMonthly || 0)} / mois
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
              Annuler
            </Button>
            <Button onClick={confirmPlanChange}>
              Confirmer le changement
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Invoice Detail Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Facture {selectedInvoice?.invoiceNumber}</DialogTitle>
            <DialogDescription>
              Émise le {selectedInvoice && new Date(selectedInvoice.createdAt).toLocaleDateString('fr-FR')}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Statut</span>
                <Badge className={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Badge>
              </div>
              <div className="border-t pt-4 space-y-2">
                {selectedInvoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{item.description}</span>
                    <span className="font-medium">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total</span>
                <span>{formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}</span>
              </div>
              <Button className="w-full" onClick={() => toast.success('Téléchargement...')}>
                Télécharger PDF
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
