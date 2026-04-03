// ============================================================
// Doctic Care — src/components/ai/ReportGenerator.tsx
// Génération rapports HL7 depuis la page Prescriptions
// ============================================================

import React, { useState } from 'react';
import { FileText, Loader2, Download, Copy, Check, AlertCircle } from 'lucide-react';

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

    setIsGenerating(true);
    setError(null);
    setReportContent(null);

    try {
      const res = await fetch('/api/ai/medical-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          patientData: patient,
          consultationNotes,
          reportType,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de la génération');
      }

      const data = await res.json();
      setReportContent(data.data.content);

    } catch (err: any) {
      setError(err.message);
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
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
          <FileText size={16} className="text-green-600" />
        </span>
        Génération de rapport médical
        <span className="ml-auto text-xs text-gray-400 font-normal">mistral:7b</span>
      </h3>

      {/* Sélecteur type de rapport */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">Type de rapport</label>
        <select
          value={reportType}
          onChange={e => setReportType(e.target.value)}
          className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
        >
          {REPORT_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Notes de consultation */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Notes de consultation brutes
        </label>
        <textarea
          value={consultationNotes}
          onChange={e => setConsultationNotes(e.target.value)}
          placeholder="Saisissez vos notes libres de consultation : motif, examen, résultats, diagnostic, traitement..."
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none h-36 focus:border-green-400 outline-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={!consultationNotes.trim() || isGenerating}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
      >
        {isGenerating ? (
          <><Loader2 size={16} className="animate-spin" /> Rédaction du compte rendu...</>
        ) : (
          <><FileText size={16} /> Générer le compte rendu</>
        )}
      </button>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
          <AlertCircle size={16} className="text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Rapport généré */}
      {reportContent && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Compte rendu généré</p>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1.5 border border-gray-200 rounded-lg"
              >
                {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                {copied ? 'Copié !' : 'Copier'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 px-2.5 py-1.5 border border-gray-200 rounded-lg"
              >
                <Download size={13} /> Télécharger
              </button>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 max-h-80 overflow-y-auto">
            <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
              {reportContent}
            </pre>
          </div>

          <p className="text-xs text-gray-400">
            ⚠️ Ce compte rendu doit être relu, corrigé et validé par le médecin avant utilisation officielle.
          </p>
        </div>
      )}
    </div>
  );
}
