import React, { useState, useEffect } from 'react';
import { Search, Plus, Printer, Mail, Edit, Trash2, Signature, Loader2, Archive, FileText, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

interface InvoiceItem {
  description: string;
  qty: number;
  price: number;
  total: number;
}

interface Invoice {
  id: string;
  patient: string;
  patientEmail?: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // % TVA
  taxAmount: number;
  total: number;
  paymentMethod: string;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  signature?: string; // base64 ou URL
  notes?: string;
}

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [formData, setFormData] = useState<Partial<Invoice>>({
    patient: '',
    date: new Date().toISOString().split('T')[0],
    items: [],
    taxRate: 20,
    paymentMethod: 'Carte',
    status: 'draft',
    notes: '',
    subtotal: 0,
    taxAmount: 0,
    total: 0
  });

  const API_URL = 'http://localhost:5000/api/billing';

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
      setError('Impossible de charger les factures');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), { description: '', qty: 1, price: 0, total: 0 }]
    }));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    setFormData((prev) => {
      const items = [...(prev.items || [])];
      items[index] = { ...items[index], [field]: value };
      if (field === 'qty' || field === 'price') {
        items[index].total = (items[index].qty || 0) * (items[index].price || 0);
      }
      const totals = calculateTotals(items, prev.taxRate || 20);
      return { ...prev, items, ...totals };
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => {
      const newItems = prev.items?.filter((_, i) => i !== index) || [];
      const totals = calculateTotals(newItems, prev.taxRate || 20);
      return {
        ...prev,
        items: newItems,
        ...totals
      };
    });
  };

  const handleNewInvoice = () => {
    setEditingInvoice(null);
    setFormData({
      patient: '',
      date: new Date().toISOString().split('T')[0],
      items: [],
      taxRate: 20,
      paymentMethod: 'Carte',
      status: 'draft',
      notes: '',
      subtotal: 0,
      taxAmount: 0,
      total: 0
    });
    setIsNewModalOpen(true);
  };

  const handleEditInvoice = (inv: Invoice) => {
    setEditingInvoice(inv);
    setFormData(inv);
    setIsNewModalOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm("Supprimer cette facture ?")) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      if (selectedInvoice?.id === id) setSelectedInvoice(null);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleSaveInvoice = async () => {
    try {
      const method = editingInvoice ? 'PUT' : 'POST';
      const url = editingInvoice ? `${API_URL}/${editingInvoice.id}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Erreur sauvegarde');

      await fetchInvoices();
      setIsNewModalOpen(false);
    } catch (err) {
      alert('Échec sauvegarde');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const body = `
      Facture Doctic Pro - ${selectedInvoice?.id || formData.id || 'Nouveau'}
      Patient: ${selectedInvoice?.patient || formData.patient}
      Date: ${selectedInvoice?.date || formData.date}
      Total: ${(selectedInvoice?.total || formData.total || 0).toFixed(2)} €
    `;
    window.location.href = `mailto:${selectedInvoice?.patientEmail || ''}?subject=Facture Doctic Pro&body=${encodeURIComponent(body)}`;
  };

  const handleAddSignature = () => {
    // Simulation signature (en prod : react-signature-canvas)
    alert('Signature ajoutée (simulation)');
    setFormData(prev => ({ ...prev, signature: 'data:image/png;base64,simulation' }));
  };

  const handleArchiveInvoice = (id: string) => {
    if (window.confirm('Archiver cette facture ?')) {
      alert('Facture archivée (simulation)');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'overdue': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <OutlookLayout
      singlePane={
        <div className="min-h-screen bg-background text-foreground flex flex-col">
          {/* Header */}
          <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 print:hidden">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-500" />
                Facturation
                {invoices.length > 0 && <Badge variant="secondary" className="ml-2">{invoices.length}</Badge>}
              </h1>
              <Button
                onClick={handleNewInvoice}
                className="rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-indigo-600 border-0 hover:opacity-90 transition-opacity"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle facture
              </Button>
            </div>
          </div>

          {error && (
            <div className="m-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive flex items-center gap-2">
              <Info className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="p-6 max-w-7xl mx-auto w-full print:p-0 print:max-w-none">

            {/* Recherche */}
            <div className="mb-6 relative max-w-md print:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher une facture..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-card"
              />
            </div>

            {/* Liste factures */}
            <Card className="bg-card/90 backdrop-blur-md border-border overflow-hidden print:border-none print:shadow-none print:bg-transparent">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-muted-foreground border-b border-border bg-muted/50 print:bg-transparent">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium w-32">ID</th>
                      <th className="text-left py-3 px-4 font-medium">Patient</th>
                      <th className="text-left py-3 px-4 font-medium w-32">Date</th>
                      <th className="text-right py-3 px-4 font-medium w-32">Total</th>
                      <th className="text-center py-3 px-4 font-medium w-32">Statut</th>
                      <th className="text-right py-3 px-4 font-medium w-64 print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                          <p className="mt-2 text-muted-foreground">Chargement des factures...</p>
                        </td>
                      </tr>
                    ) : filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-muted-foreground">Aucune facture trouvée</td>
                      </tr>
                    ) : filteredInvoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors print:border-gray-200">
                        <td className="py-4 px-4 font-medium font-mono text-xs">{inv.id}</td>
                        <td className="py-4 px-4 font-medium">{inv.patient}</td>
                        <td className="py-4 px-4 text-muted-foreground">{inv.date}</td>
                        <td className="py-4 px-4 text-right font-bold text-base">{inv.total.toFixed(2)} €</td>
                        <td className="py-4 px-4 text-center">
                          <Badge variant={getStatusBadgeVariant(inv.status) as "default" | "secondary" | "destructive" | "outline" | null | undefined}>
                            {inv.status === 'paid' ? 'Payée' : inv.status === 'pending' ? 'En attente' : inv.status === 'overdue' ? 'Retard' : 'Brouillon'}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right print:hidden">
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditInvoice(inv)} title="Modifier">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePrintInvoice} title="Imprimer">
                              <Printer className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setSelectedInvoice(inv); handleSendEmail(); }} title="Envoyer">
                              <Mail className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleArchiveInvoice(inv.id)} title="Archiver">
                              <Archive className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeleteInvoice(inv.id)} title="Supprimer">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Modal Édition Facture */}
          {isNewModalOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200 print:hidden">
              <Card className="w-full max-w-5xl bg-background border-border p-0 shadow-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                    {editingInvoice ? 'Modifier Facture' : 'Nouvelle Facture'}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsNewModalOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="p-6 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Patient</label>
                      <Input
                        placeholder="Nom du patient"
                        value={formData.patient}
                        onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Date</label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">TVA (%)</label>
                      <Input
                        type="number"
                        placeholder="TVA %"
                        value={formData.taxRate}
                        onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 20 })}
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Articles & Prestations</h3>
                      <Button onClick={addItem} size="sm" variant="secondary">
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter une ligne
                      </Button>
                    </div>

                    <div className="border border-border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                          <tr>
                            <th className="text-left py-2 px-4">Description</th>
                            <th className="text-right py-2 px-4 w-24">Qté</th>
                            <th className="text-right py-2 px-4 w-32">Prix HT</th>
                            <th className="text-right py-2 px-4 w-32">Total HT</th>
                            <th className="w-12 py-2 px-4"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items?.map((item, i) => (
                            <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                              <td className="p-2"><Input className="h-9 border-0 bg-transparent focus-visible:ring-0 px-2" value={item.description} onChange={(e) => updateItem(i, 'description', e.target.value)} placeholder="Description..." /></td>
                              <td className="p-2"><Input type="number" className="h-9 text-right border-0 bg-transparent focus-visible:ring-0 px-2" value={item.qty} onChange={(e) => updateItem(i, 'qty', parseInt(e.target.value))} /></td>
                              <td className="p-2"><Input type="number" className="h-9 text-right border-0 bg-transparent focus-visible:ring-0 px-2" value={item.price} onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value))} /></td>
                              <td className="p-2 text-right font-medium px-4">{item.total.toFixed(2)} €</td>
                              <td className="p-2 text-center">
                                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                          {(!formData.items || formData.items.length === 0) && (
                            <tr>
                              <td colSpan={5} className="text-center py-8 text-muted-foreground italic">Aucun article ajouté</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Récapitulatif */}
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2">Notes</label>
                      <textarea
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={3}
                        placeholder="Conditions de paiement, notes..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />

                      <div className="mt-4">
                        <label className="block text-sm font-medium mb-2">Signature du médecin</label>
                        <div className="border border-input border-dashed rounded-xl p-4 h-24 flex items-center justify-center bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors" onClick={handleAddSignature}>
                          {formData.signature ? (
                            <div className="text-center">
                              <p className="text-xs text-green-500 font-semibold mb-1">Signé électroniquement</p>
                              <Signature className="h-8 w-8 text-primary mx-auto opacity-50" />
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">
                              <Signature className="h-5 w-5 mx-auto mb-1" />
                              <span className="text-xs">Cliquez pour signer</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-80 bg-muted/20 border border-border rounded-xl p-6 h-fit">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Sous-total HT</span>
                          <span>{formData.subtotal?.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">TVA ({formData.taxRate}%)</span>
                          <span>{formData.taxAmount?.toFixed(2)} €</span>
                        </div>
                        <div className="border-t border-border pt-3 mt-3">
                          <div className="flex justify-between font-bold text-lg">
                            <span>Total TTC</span>
                            <span className="text-primary">{formData.total?.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                  <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>Annuler</Button>
                  <Button onClick={handleSaveInvoice} className="bg-gradient-to-r from-purple-600 to-indigo-600">
                    {editingInvoice ? 'Mettre à jour' : 'Créer la facture'}
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Styles Print */}
          <style>{`
        @media print {
            body { background: white; color: black; }
            .print\\:hidden { display: none !important; }
            .print\\:border-none { border: none !important; }
            .print\\:shadow-none { box-shadow: none !important; }
            .print\\:bg-transparent { background: transparent !important; }
            .print\\:p-0 { padding: 0 !important; }
        }
      `}</style>
        </div>
      }
    />
  );
}
