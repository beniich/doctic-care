import { CreditCard, Smartphone, Building2, MoreVertical, Trash2, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { PaymentMethodConfig } from '@/types/saas-billing';

interface PaymentMethodCardProps {
  method: PaymentMethodConfig;
  onSetDefault: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PaymentMethodCard({ method, onSetDefault, onDelete }: PaymentMethodCardProps) {
  const icons = {
    card: CreditCard,
    mobile_money: Smartphone,
    bank_transfer: Building2,
    manual: Building2,
  };
  
  const Icon = icons[method.type];
  
  const getMethodLabel = () => {
    switch (method.type) {
      case 'card':
        return `${method.cardBrand} •••• ${method.cardLast4}`;
      case 'mobile_money':
        return `${method.mobileProvider} - ${method.mobileNumber}`;
      case 'bank_transfer':
        return `${method.bankName} •••• ${method.accountLast4}`;
      default:
        return 'Paiement manuel';
    }
  };

  const getMethodDetails = () => {
    switch (method.type) {
      case 'card':
        return `Expire ${method.cardExpiry}`;
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Virement bancaire';
      default:
        return 'Facture manuelle';
    }
  };

  return (
    <Card className={method.isDefault ? 'border-primary' : ''}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{getMethodLabel()}</p>
              {method.isDefault && (
                <Badge variant="secondary" className="text-xs">
                  Par défaut
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{getMethodDetails()}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!method.isDefault && (
              <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                <Star className="h-4 w-4 mr-2" />
                Définir par défaut
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              onClick={() => onDelete(method.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
