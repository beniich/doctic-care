// ============================================================
// Doctic Care — src/components/ai/ReportGenerator.tsx
// Génération rapports HL7 — Dark Theme Doctic
// ============================================================

import React, { useState } from 'react';
import { FileText, Loader2, Download, Copy, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PatientData {
  id: string;
  age: number;
  sex: 'M' | 'F';
  antecedents?: string[];
  allergies?: string[];
  currentTreatments?: string[];
}

interface ReportGeneratorProps {
  patient: PatientData;
  defaultNotes?: string;
}

const REPORT_TYPES = [
  { value: 'consultation', label: 'Compte rendu de consultation' },
  { value: 'hospitalisation', label: "Compte rendu d'hospitalisation" },
  { value: 'urgences', label: 'Passage aux urgences' },
  { value: 'chirurgie', label: 'Compte rendu opératoire' },
];

export default function ReportGenerator({ patient, defaultNotes = '' }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState('consultation');
  const [consultationNotes, setConsultationNotes] = useState(defaultNotes);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportContent, setReportContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!consultationNotes.trim()) return;
    setIsGenerating(true); setError(null); setReportContent(null);
    try {
      const res = await fetch('/api/ai/medical-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ patientData: patient, consultationNotes, reportType }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Erreur lors de la génération'); }
      const data = await res.json();
      setReportContent(data.data.content);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!reportContent) return;
    await navigator.clipboard.writeText(reportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!reportContent) return;
    const blob = new Blob([reportContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CR_${reportType}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-success/20 border border-success/30 rounded-lg flex items-center justify-center">
          <FileText size={15} className="text-success" />
        </span>
        <span>Génération de rapport médical</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono-tech font-normal">mistral:7b</span>
      </h3>

      {/* Report type selector */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type de rapport</label>
        <select
          title="Sélectionner le type de rapport médical"
          value={reportType}
          onChange={e => setReportType(e.target.value)}
          className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:border-primary outline-none transition-colors"
        >
          {REPORT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Notes input */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Notes de consultation brutes</label>
        <textarea
          value={consultationNotes}
          onChange={e => setConsultationNotes(e.target.value)}
          placeholder="Saisissez vos notes libres : motif, examen, résultats, diagnostic, traitement..."
          className="w-full text-sm border border-border rounded-xl px-3 py-2.5 resize-none h-36 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!consultationNotes.trim() || isGenerating}
        className="w-full bg-success/20 hover:bg-success/30 disabled:opacity-40 text-success border border-success/30 hover:border-success/50 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 hover:shadow-[0_0_15px_rgba(0,230,118,0.15)]"
      >
        {isGenerating
          ? <><Loader2 size={16} className="animate-spin" /> Rédaction en cours...</>
          : <><FileText size={16} /> Générer le compte rendu</>}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-4">
            <AlertCircle size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {reportContent && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Compte rendu généré</p>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 border border-border hover:border-border/80 rounded-lg transition-colors"
                >
                  {copied ? <Check size={13} className="text-success" /> : <Copy size={13} />}
                  {copied ? 'Copié !' : 'Copier'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 border border-border hover:border-border/80 rounded-lg transition-colors"
                >
                  <Download size={13} /> Télécharger
                </button>
              </div>
            </div>
            <div className="bg-background border border-border rounded-xl p-4 max-h-80 overflow-y-auto">
              <pre className="text-sm text-foreground/90 whitespace-pre-wrap font-mono-tech leading-relaxed">
                {reportContent}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ Ce compte rendu doit être relu, corrigé et validé par le médecin avant utilisation officielle.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
