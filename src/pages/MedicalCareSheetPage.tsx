import React, { useState } from 'react';
import { Printer, Mail, Save, Stethoscope, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface CareAct {
    date: string;
    designation: string;
    amount: string;
    signature: string;
}

interface Exam {
    date: string;
    nature: string;
    coef: string;
    amount: string;
    signature: string;
}

interface CurrentAct {
    date: string;
    number: string;
    unitPrice: string;
    total: string;
    signature: string;
}

interface CareSheetFormData {
    patientName: string;
    patientId: string;
    date: string;
    provider: string;
    acts: CareAct[];
    exams: Exam[];
    currentActs: CurrentAct[];
    dental: { diagram: string; amount: string };
    optical: { glasses: string; amount: string };
    summary: string;
}

export default function MedicalCareSheetPage() {
    const [formData, setFormData] = useState<CareSheetFormData>({
        patientName: '',
        patientId: '',
        date: new Date().toISOString().split('T')[0],
        provider: 'Dr. Dupont',
        acts: Array(5).fill({ date: '', designation: '', amount: '', signature: '' }),
        exams: Array(5).fill({ date: '', nature: '', coef: '', amount: '', signature: '' }),
        currentActs: Array(5).fill({ date: '', number: '', unitPrice: '', total: '', signature: '' }),
        dental: { diagram: '', amount: '' },
        optical: { glasses: '', amount: '' },
        summary: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = <T extends 'acts' | 'exams' | 'currentActs'>(
        section: T,
        index: number,
        field: string,
        value: string
    ) => {
        setFormData((prev) => {
            const newSection = [...prev[section]] as Record<string, string>[];
            newSection[index] = { ...newSection[index], [field]: value };
            return { ...prev, [section]: newSection as CareSheetFormData[T] };
        });
    };

    const handleSendEmail = () => {
        const emailBody = `
      Fiche de Soins - Doctic Pro
      Patient: ${formData.patientName} (${formData.patientId})
      Date: ${formData.date}
      Médecin: ${formData.provider}

      Résumé: ${formData.summary}

      (Pièce jointe : PDF de la fiche)
    `;
        window.location.href = `mailto:?subject=Fiche de Soins Doctic Pro&body=${encodeURIComponent(emailBody)}`;
        alert('Client mail ouvert pour envoi.');
    };

    const handlePrint = () => {
        window.print();
    };

    const handleSave = async () => {
        if (!formData.patientId) {
            toast.error('Veuillez spécifier un patient');
            return;
        }

        setIsSaving(true);
        try {
            await api.post('/records', {
                patientId: formData.patientId,
                title: `Fiche de Soins - ${formData.date}`,
                content: JSON.stringify(formData),
                recordDate: new Date(formData.date)
            });
            toast.success('Fiche de soins enregistrée avec succès');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Erreur lors de la sauvegarde de la fiche');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-6">
            <Card className="max-w-5xl mx-auto bg-card/90 backdrop-blur-md border border-border rounded-2xl shadow-2xl animate-in fade-in duration-500">
                <div className="p-8 border-b border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                                <Stethoscope className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Fiche de Soins</h1>
                                <p className="text-muted-foreground">Cabinet Médical Privé – Inspiré CNSS/AMO</p>
                            </div>
                        </div>
                        <div className="flex gap-3 print:hidden">
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Printer className="h-4 w-4 mr-2" />
                                Imprimer
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSendEmail}>
                                <Mail className="h-4 w-4 mr-2" />
                                Envoyer
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-2" />
                                )}
                                Sauvegarder
                            </Button>
                        </div>
                    </div>

                    {/* Infos patient */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Nom du patient</label>
                            <Input
                                value={formData.patientName}
                                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                                placeholder="Ex: Sarah Johnson"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">N° Patient</label>
                            <Input
                                value={formData.patientId}
                                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                placeholder="PAT-XXXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-2">Médecin</label>
                            <Input value={formData.provider} disabled className="bg-muted/50" />
                        </div>
                    </div>

                    {/* Sections CNSS */}
                    <div className="space-y-10">
                        {/* I - Actes Médicaux */}
                        <div className="border border-border rounded-xl p-6 bg-muted/20">
                            <h3 className="text-xl font-semibold text-primary mb-4">I - Partie Réservée aux Actes Médicaux</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="text-left py-2 px-2 w-32">Date</th>
                                            <th className="text-left py-2 px-2">Désignation acte</th>
                                            <th className="text-right py-2 px-2 w-32">Honoraires</th>
                                            <th className="text-right py-2 px-2 w-48">Signature</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.acts.map((act, i) => (
                                            <tr key={i} className="border-b border-border/50 last:border-0">
                                                <td className="p-1"><Input type="date" className="h-8" value={act.date} onChange={(e) => handleChange('acts', i, 'date', e.target.value)} /></td>
                                                <td className="p-1"><Input className="h-8" value={act.designation} onChange={(e) => handleChange('acts', i, 'designation', e.target.value)} /></td>
                                                <td className="p-1"><Input type="number" className="h-8 text-right" value={act.amount} onChange={(e) => handleChange('acts', i, 'amount', e.target.value)} /></td>
                                                <td className="p-1 text-right text-xs text-muted-foreground align-middle">Dr. {formData.provider}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* II - Examens et Analyses */}
                        <div className="border border-border rounded-xl p-6 bg-muted/20">
                            <h3 className="text-xl font-semibold text-primary mb-4">II - Examens et Analyses Prescrits</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="text-left py-2 px-2 w-32">Date</th>
                                            <th className="text-left py-2 px-2">Nature</th>
                                            <th className="text-right py-2 px-2 w-24">Coef</th>
                                            <th className="text-right py-2 px-2 w-32">Honoraires</th>
                                            <th className="text-right py-2 px-2 w-48">Signature</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.exams.map((exam, i) => (
                                            <tr key={i} className="border-b border-border/50 last:border-0">
                                                <td className="p-1"><Input type="date" className="h-8" value={exam.date} onChange={(e) => handleChange('exams', i, 'date', e.target.value)} /></td>
                                                <td className="p-1"><Input className="h-8" value={exam.nature} onChange={(e) => handleChange('exams', i, 'nature', e.target.value)} /></td>
                                                <td className="p-1"><Input className="h-8 text-right" value={exam.coef} onChange={(e) => handleChange('exams', i, 'coef', e.target.value)} /></td>
                                                <td className="p-1"><Input type="number" className="h-8 text-right" value={exam.amount} onChange={(e) => handleChange('exams', i, 'amount', e.target.value)} /></td>
                                                <td className="p-1 text-right text-xs text-muted-foreground align-middle">Dr. {formData.provider}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* III - Actes Courants */}
                        <div className="border border-border rounded-xl p-6 bg-muted/20">
                            <h3 className="text-xl font-semibold text-primary mb-4">III - Partie Réservée aux Actes Courants</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="text-muted-foreground border-b border-border">
                                        <tr>
                                            <th className="text-left py-2 px-2 w-32">Date</th>
                                            <th className="text-left py-2 px-2 w-24">Qte</th>
                                            <th className="text-right py-2 px-2 w-32">P.U</th>
                                            <th className="text-right py-2 px-2 w-32">Total</th>
                                            <th className="text-right py-2 px-2 w-48">Signature</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.currentActs.map((act, i) => (
                                            <tr key={i} className="border-b border-border/50 last:border-0">
                                                <td className="p-1"><Input type="date" className="h-8" value={act.date} onChange={(e) => handleChange('currentActs', i, 'date', e.target.value)} /></td>
                                                <td className="p-1"><Input type="number" className="h-8 text-right" value={act.number} onChange={(e) => handleChange('currentActs', i, 'number', e.target.value)} /></td>
                                                <td className="p-1"><Input type="number" className="h-8 text-right" value={act.unitPrice} onChange={(e) => handleChange('currentActs', i, 'unitPrice', e.target.value)} /></td>
                                                <td className="p-1 text-right font-medium align-middle">{(parseFloat(act.unitPrice || '0') * parseInt(act.number || '0')).toFixed(2)} €</td>
                                                <td className="p-1 text-right text-xs text-muted-foreground align-middle">Dr. {formData.provider}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Résumé */}
                        <div className="border border-border rounded-xl p-6 bg-muted/20 print:hidden">
                            <h3 className="text-xl font-semibold text-primary mb-4">Résumé & Notes</h3>
                            <Textarea
                                value={formData.summary}
                                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                rows={4}
                                placeholder="Résumé des soins, diagnostic, recommandations..."
                                className="bg-background"
                            />
                        </div>

                        {/* Pied de page Print uniquement */}
                        <div className="hidden print:block mt-8 pt-8 border-t border-gray-300">
                            <div className="flex justify-between text-sm text-gray-500">
                                <p>Fait à Paris, le {new Date().toLocaleDateString()}</p>
                                <p>Signature et Cachet du Médecin</p>
                            </div>
                            <div className="h-24"></div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Styles Print */}
            <style>{`
        @media print {
          body { background: white; color: black; }
          .print\\:hidden { display: none !important; }
          .bg-card\\/90 { background: white !important; backdrop-filter: none; }
          .text-muted-foreground { color: #666 !important; }
          input { border: none !important; box-shadow: none !important; padding: 0 !important; }
          .border { border-color: #ddd !important; }
        }
      `}</style>
        </div>
    );
}
