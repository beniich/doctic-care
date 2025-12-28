import React, { useState, useEffect } from 'react';
import { Search, Plus, Printer, Mail, Pill, User, Edit, Trash2, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { OutlookLayout } from '@/components/layout/OutlookLayout';

interface Medication {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
}

export interface Prescription {
    id: number;
    patient: string;
    date: string;
    medications: Medication[];
    status: 'active' | 'dispensed' | 'expired';
    notes?: string;
}

export default function Prescriptions() {
    const [searchTerm, setSearchTerm] = useState('');
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(true);
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient: '',
        date: new Date().toISOString().split('T')[0],
        medications: [] as Medication[],
        notes: ''
    });

    const API_URL = 'http://localhost:5000/api/prescriptions';

    // Base médicaments mock (à remplacer par API Vidal ou autre plus tard)
    const medicationsDB = [
        'Paracétamol 500mg',
        'Amoxicilline 1g',
        'Ibuprofène 400mg',
        'Doliprane 1000mg',
        'Efferalgan 1g',
        'Spasfon',
        'Dafalgan',
        'Augmentin',
        'Ventoline',
        'Seretide'
    ];

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Erreur chargement');
            const data = await response.json();
            setPrescriptions(data);
        } catch (err) {
            console.error('Impossible de charger les ordonnances', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredPrescriptions = prescriptions.filter(p =>
        p.patient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'active': return 'success';
            case 'dispensed': return 'secondary';
            case 'expired': return 'destructive';
            default: return 'default';
        }
    };

    const addMedication = () => {
        setFormData(prev => ({
            ...prev,
            medications: [...prev.medications, { name: '', dosage: '', frequency: '', duration: '', quantity: 1 }]
        }));
    };

    const updateMedication = (index: number, field: keyof Medication, value: string | number) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => {
            const meds = [...prev.medications];
            meds[index] = { ...meds[index], [field]: value };
            return { ...prev, medications: meds };
        });
    };

    const removeMedication = (index: number) => {
        setFormData(prev => ({
            ...prev,
            medications: prev.medications.filter((_, i) => i !== index)
        }));
    };

    const handleSavePrescription = async () => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, status: 'active' })
            });

            if (!response.ok) throw new Error('Erreur sauvegarde');

            fetchPrescriptions();
            setIsNewModalOpen(false);
            // alert('Ordonnance créée avec succès !');
        } catch (err) {
            alert('Échec création ordonnance');
        }
    };

    const handleDeletePrescription = async (id: number) => {
        if (!confirm("Supprimer cette ordonnance ?")) return;
        try {
            // Simulation suppression API si endpoint dispo, sinon juste filtre local pour démo
            // await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            setPrescriptions(p => p.filter(x => x.id !== id));
            if (selectedPrescription?.id === id) setSelectedPrescription(null);
        } catch (e) {
            console.error(e);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSendEmail = () => {
        const body = `
      Ordonnance Doctic Pro
      Patient: ${formData.patient}
      Date: ${formData.date}

      Médicaments:
      ${formData.medications.map(m => `- ${m.name} : ${m.dosage}, ${m.frequency}, ${m.duration}, Quantité: ${m.quantity}`).join('\n')}

      Notes: ${formData.notes || 'Aucune'}
    `;
        window.location.href = `mailto:?subject=Ordonnance médicale&body=${encodeURIComponent(body)}`;
    };

    // Utilisation de OutlookLayout singlePane pour cette vue liste/détails custom
    // Ou listPane/detailPane si on sépare bien.
    // Vu que le user a fourni un design "single page" avec table, je vais utiliser singlePane pour respecter son design, ou adapter en split view.
    // Le design fourni est une grande table. Je vais respecter ça avec singlePane.

    return (
        <OutlookLayout
            singlePane={
                <div className="min-h-screen bg-background text-foreground flex flex-col">
                    {/* Header */}
                    <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10">
                        <div className="flex items-center gap-6">
                            <h1 className="text-xl font-semibold flex items-center gap-2">
                                <Pill className="h-6 w-6 text-pink-500" />
                                Ordonnances
                            </h1>
                            <Button
                                onClick={() => setIsNewModalOpen(true)}
                                className="rounded-full shadow-lg bg-gradient-to-r from-pink-600 to-purple-600 border-0 hover:opacity-90 transition-opacity"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle Ordonnance
                            </Button>
                        </div>
                    </div>

                    <div className="p-6 max-w-7xl mx-auto w-full">
                        {/* Recherche */}
                        <div className="mb-6 relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Rechercher par patient ou médicament..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-card"
                            />
                        </div>

                        {/* Liste ordonnances */}
                        <Card className="bg-card/90 backdrop-blur-md border-border overflow-hidden">
                            <div className="">
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground border-b border-border bg-muted/50">
                                        <tr>
                                            <th className="text-left py-3 px-4 font-medium">Patient</th>
                                            <th className="text-left py-3 px-4 font-medium">Date</th>
                                            <th className="text-center py-3 px-4 font-medium">Médicaments</th>
                                            <th className="text-center py-3 px-4 font-medium">Statut</th>
                                            <th className="text-right py-3 px-4 font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12">
                                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                                    <p className="mt-2 text-muted-foreground">Chargement des ordonnances...</p>
                                                </td>
                                            </tr>
                                        ) : filteredPrescriptions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-muted-foreground">Aucune ordonnance trouvée</td>
                                            </tr>
                                        ) : (
                                            filteredPrescriptions.map((pres) => (
                                                <tr key={pres.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                                                    <td className="py-4 px-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <User className="h-4 w-4 text-primary" />
                                                            </div>
                                                            <span className="font-medium">{pres.patient}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-4 text-muted-foreground">{pres.date}</td>
                                                    <td className="py-4 px-4 text-center">
                                                        <Badge variant="outline" className="font-normal">
                                                            {pres.medications.length} molécule{pres.medications.length > 1 ? 's' : ''}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-center">
                                                        <Badge variant={getStatusBadgeVariant(pres.status) as any}>
                                                            {pres.status === 'active' ? 'Active' : pres.status === 'dispensed' ? 'Délivrée' : 'Expirée'}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-4 px-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handlePrint} title="Imprimer">
                                                                <Printer className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSendEmail} title="Envoyer par email">
                                                                <Mail className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setSelectedPrescription(pres)} title="Voir détails">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDeletePrescription(pres.id)} title="Supprimer">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>

                    {/* Modal Nouvelle Ordonnance */}
                    {isNewModalOpen && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                            <Card className="w-full max-w-4xl bg-background border-border p-0 shadow-2xl flex flex-col max-h-[90vh]">
                                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/20">
                                    <h2 className="text-xl font-bold flex items-center gap-3">
                                        <Pill className="h-6 w-6 text-pink-500" />
                                        Nouvelle Ordonnance
                                    </h2>
                                    <Button variant="ghost" size="icon" onClick={() => setIsNewModalOpen(false)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>

                                <div className="p-6 overflow-y-auto">
                                    <div className="grid grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Patient</label>
                                            <Input
                                                value={formData.patient}
                                                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                                                placeholder="Nom du patient"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Date</label>
                                            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold">Médicaments</h3>
                                            <Button onClick={addMedication} size="sm" variant="secondary">
                                                <Plus className="h-4 w-4 mr-2" />
                                                Ajouter un médicament
                                            </Button>
                                        </div>

                                        <div className="space-y-3">
                                            {formData.medications.map((med, index) => (
                                                <div key={index} className="p-4 bg-muted/30 border border-border rounded-lg group hover:border-primary/50 transition-colors">
                                                    <div className="grid grid-cols-12 gap-3 items-center">
                                                        <div className="col-span-3">
                                                            <Input
                                                                placeholder="Nom médicament"
                                                                value={med.name}
                                                                onChange={(e) => updateMedication(index, 'name', e.target.value)}
                                                                list="medications-list"
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                placeholder="Dosage"
                                                                value={med.dosage}
                                                                onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                placeholder="Fréquence"
                                                                value={med.frequency}
                                                                onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                placeholder="Durée"
                                                                value={med.duration}
                                                                onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <Input
                                                                type="number"
                                                                placeholder="Qté"
                                                                value={med.quantity}
                                                                onChange={(e) => updateMedication(index, 'quantity', parseInt(e.target.value) || 0)}
                                                                className="h-9"
                                                            />
                                                        </div>
                                                        <div className="col-span-1 text-right">
                                                            <Button
                                                                size="icon"
                                                                variant="ghost"
                                                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                                onClick={() => removeMedication(index)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {formData.medications.length === 0 && (
                                                <div className="text-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground">
                                                    <Pill className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                                    <p>Aucun médicament ajouté à l'ordonnance</p>
                                                </div>
                                            )}
                                        </div>

                                        <datalist id="medications-list">
                                            {medicationsDB.map((m) => (
                                                <option key={m} value={m} />
                                            ))}
                                        </datalist>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">Notes & Instructions</label>
                                        <Textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            placeholder="Instructions particulières (ex: à prendre au millieu des repas, ne pas arrêter le traitement, etc.)"
                                            className="resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/20">
                                    <Button variant="outline" onClick={() => setIsNewModalOpen(false)}>
                                        Annuler
                                    </Button>
                                    <Button variant="outline" onClick={handlePrint} className="gap-2">
                                        <Printer className="h-4 w-4" />
                                        Imprimer
                                    </Button>
                                    <Button onClick={handleSavePrescription} className="bg-gradient-to-r from-pink-600 to-purple-600 gap-2">
                                        <Save className="h-4 w-4" />
                                        Enregistrer l'ordonnance
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            } />
    );
}
