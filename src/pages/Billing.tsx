import { useState } from "react";
import { Plus, Filter, Download, Receipt } from "lucide-react";
import { OutlookLayout } from "@/components/layout/OutlookLayout";
import { ListPane } from "@/components/layout/ListPane";
import { DetailPane } from "@/components/layout/DetailPane";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  patientEmail: string;
  date: string;
  dueDate: string;
  items: { description: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  tax: number;
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  paymentMethod?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    patientName: "Sarah Johnson",
    patientEmail: "sarah.johnson@email.com",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    items: [
      { description: "General Consultation", quantity: 1, unitPrice: 150 },
      { description: "Blood Test Panel", quantity: 1, unitPrice: 75 },
    ],
    subtotal: 225,
    tax: 22.5,
    total: 247.5,
    status: "paid",
    paymentMethod: "Credit Card",
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    patientName: "Michael Chen",
    patientEmail: "m.chen@email.com",
    date: "2024-01-14",
    dueDate: "2024-02-14",
    items: [
      { description: "Post-Surgery Follow-up", quantity: 1, unitPrice: 200 },
      { description: "Wound Care Supplies", quantity: 1, unitPrice: 45 },
    ],
    subtotal: 245,
    tax: 24.5,
    total: 269.5,
    status: "sent",
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    patientName: "Emma Williams",
    patientEmail: "emma.w@email.com",
    date: "2024-01-10",
    dueDate: "2024-01-25",
    items: [
      { description: "Telehealth Consultation", quantity: 1, unitPrice: 100 },
    ],
    subtotal: 100,
    tax: 10,
    total: 110,
    status: "overdue",
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    patientName: "James Brown",
    patientEmail: "james.brown@email.com",
    date: "2024-01-16",
    dueDate: "2024-02-16",
    items: [
      { description: "Minor Procedure", quantity: 1, unitPrice: 500 },
      { description: "Anesthesia", quantity: 1, unitPrice: 150 },
      { description: "Post-Op Medication", quantity: 1, unitPrice: 85 },
    ],
    subtotal: 735,
    tax: 73.5,
    total: 808.5,
    status: "draft",
  },
];

export default function Billing() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredInvoices = mockInvoices.filter((inv) =>
    inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "status-success";
      case "sent":
        return "status-info";
      case "draft":
        return "bg-muted text-muted-foreground";
      case "overdue":
        return "status-error";
      case "cancelled":
        return "status-warning";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <OutlookLayout
      listPane={
        <ListPane
          title="Invoices"
          searchPlaceholder="Search invoices..."
          onSearch={setSearchQuery}
          actions={
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Create
              </Button>
            </div>
          }
        >
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => setSelectedInvoice(invoice)}
              className={cn(
                "list-item",
                selectedInvoice?.id === invoice.id && "active"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {invoice.invoiceNumber}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {invoice.patientName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(invoice.total)}</p>
                  <span className={cn("status-badge text-xs", getStatusColor(invoice.status))}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </ListPane>
      }
      detailPane={
        <DetailPane
          title={selectedInvoice?.invoiceNumber}
          subtitle={selectedInvoice?.patientName}
          onClose={() => setSelectedInvoice(null)}
          emptyState={
            <div className="text-center">
              <p className="text-lg font-medium">Select an invoice</p>
              <p className="text-sm">Choose an invoice from the list to view details</p>
            </div>
          }
          actions={
            selectedInvoice && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                {selectedInvoice.status !== "paid" && (
                  <Button size="sm">Record Payment</Button>
                )}
              </div>
            )
          }
        >
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Info */}
              <div className="grid gap-4 md:grid-cols-2">
                <InfoCard label="Patient Email" value={selectedInvoice.patientEmail} />
                <InfoCard
                  label="Invoice Date"
                  value={new Date(selectedInvoice.date).toLocaleDateString()}
                />
                <InfoCard
                  label="Due Date"
                  value={new Date(selectedInvoice.dueDate).toLocaleDateString()}
                />
                {selectedInvoice.paymentMethod && (
                  <InfoCard label="Payment Method" value={selectedInvoice.paymentMethod} />
                )}
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Items</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left text-xs font-medium p-3">Description</th>
                        <th className="text-center text-xs font-medium p-3">Qty</th>
                        <th className="text-right text-xs font-medium p-3">Price</th>
                        <th className="text-right text-xs font-medium p-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items.map((item, idx) => (
                        <tr key={idx} className="border-t border-border">
                          <td className="p-3 text-sm">{item.description}</td>
                          <td className="p-3 text-sm text-center">{item.quantity}</td>
                          <td className="p-3 text-sm text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 text-sm text-right font-medium">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>{formatCurrency(selectedInvoice.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedInvoice.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DetailPane>
      }
    />
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
