import { Download, Eye, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { SaasInvoice } from '@/types/saas-billing';
import { formatCurrency, getStatusColor } from '@/data/saas-billing-mock';
import { toast } from 'sonner';

interface SaasInvoiceListProps {
  invoices: SaasInvoice[];
  onViewInvoice: (invoice: SaasInvoice) => void;
}

export function SaasInvoiceList({ invoices, onViewInvoice }: SaasInvoiceListProps) {
  const handleDownload = (invoice: SaasInvoice) => {
    toast.success(`Téléchargement de ${invoice.invoiceNumber}...`);
  };

  const statusLabels: Record<string, string> = {
    draft: 'Brouillon',
    pending: 'En attente',
    paid: 'Payée',
    overdue: 'En retard',
    cancelled: 'Annulée',
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>N° Facture</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Échéance</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
            <TableCell>
              {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
            </TableCell>
            <TableCell>
              {new Date(invoice.dueDate).toLocaleDateString('fr-FR')}
            </TableCell>
            <TableCell>{formatCurrency(invoice.amount, invoice.currency)}</TableCell>
            <TableCell>
              <Badge className={getStatusColor(invoice.status)}>
                {statusLabels[invoice.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onViewInvoice(invoice)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload(invoice)}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
