// ============================================================
// Doctic Care — src/components/ai/DiagnosisPanel.tsx
// Diagnostic différentiel IA — Dark Theme Doctic
// ============================================================

import React, { useState } from 'react';
import { Loader2, AlertTriangle, Info, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Diagnosis {
  name: string;
  icd10: string;
  probability: 'haute' | 'moyenne' | 'faible';
  probability_percent: number;
  urgency: 'urgence_vitale' | 'urgent' | 'semi_urgent' | 'non_urgent';
  reasoning: string;
  next_steps: string[];
  red_flags: string[];
}

interface DiagnosisResult {
  diagnoses: Diagnosis[];
  summary: string;
  recommended_exams: string[];
  disclaimer: string;
}

interface DiagnosisPanelProps {
  patientId: string;
  patientAge: number;
  patientSex: 'M' | 'F';
  existingConditions?: string[];
  currentMedications?: string[];
}

const URGENCY_CONFIG = {
  urgence_vitale: { label: 'URGENCE VITALE', cls: 'text-destructive bg-destructive/10 border-destructive/40', dot: 'bg-destructive shadow-[0_0_6px_rgba(255,59,48,0.7)]' },
  urgent: { label: 'Urgent', cls: 'text-warning bg-warning/10 border-warning/40', dot: 'bg-warning shadow-[0_0_6px_rgba(255,107,0,0.6)]' },
  semi_urgent: { label: 'Semi-urgent', cls: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/40', dot: 'bg-yellow-400' },
  non_urgent: { label: 'Non urgent', cls: 'text-success bg-success/10 border-success/40', dot: 'bg-success' },
};

function DiagnosisCard({ diagnosis, index }: { diagnosis: Diagnosis; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const urgency = URGENCY_CONFIG[diagnosis.urgency] || URGENCY_CONFIG.non_urgent;

  return (
    <div className={`border rounded-xl overflow-hidden transition-colors ${index === 0 ? 'border-primary/40' : 'border-border hover:border-border/80'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex-shrink-0 w-14 text-center">
          <div className={`text-lg font-bold font-mono-tech ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
            {diagnosis.probability_percent}%
          </div>
          <div className={`h-1 rounded-full mt-1 ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-primary/50' : 'bg-primary/20'}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground truncate">{diagnosis.name}</p>
            {index === 0 && <span className="flex-shrink-0 text-xs bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-full">1er</span>}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono-tech">CIM-10: {diagnosis.icd10}</p>
        </div>
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${urgency.cls}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
          {urgency.label}
        </div>
        {expanded ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 space-y-3 bg-white/5 border-t border-border">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1 mt-3">Raisonnement clinique</p>
                <p className="text-sm text-foreground/80">{diagnosis.reasoning}</p>
              </div>
              {diagnosis.next_steps?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Prochaines étapes</p>
                  <ul className="space-y-1">
                    {diagnosis.next_steps.map((step, i) => (
                      <li key={i} className="text-sm text-foreground/80 flex items-start gap-1.5">
                        <span className="text-primary mt-0.5">→</span> {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {diagnosis.red_flags?.length > 0 && (
                <div className="p-2.5 bg-destructive/10 rounded-lg border border-destructive/30">
                  <p className="text-xs font-medium text-destructive mb-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> Signes d'alarme
                  </p>
                  <ul className="space-y-0.5">
                    {diagnosis.red_flags.map((flag, i) => (
                      <li key={i} className="text-xs text-destructive/80">• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DiagnosisPanel({ patientId, patientAge, patientSex, existingConditions = [], currentMedications = [] }: DiagnosisPanelProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnosis = async () => {
    if (!symptoms.trim()) return;
    setIsLoading(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/ai/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ symptoms, patientAge, patientSex, patientId, additionalContext: { existingConditions, currentMedications } }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || 'Erreur diagnostic'); }
      const data = await res.json();
      setResult(data.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center">
          <Stethoscope size={15} className="text-primary" />
        </span>
        <span>Aide au diagnostic différentiel</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono-tech font-normal">medalpaca:7b</span>
      </h3>

      {/* Patient badges */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <span className="text-xs px-2.5 py-1 bg-white/5 border border-border text-foreground rounded-full">
          {patientSex === 'M' ? 'Homme' : 'Femme'} · {patientAge} ans
        </span>
        {existingConditions.length > 0 && (
          <span className="text-xs px-2.5 py-1 bg-warning/10 border border-warning/30 text-warning rounded-full">
            {existingConditions.length} antécédent(s)
          </span>
        )}
        {currentMedications.length > 0 && (
          <span className="text-xs px-2.5 py-1 bg-primary/10 border border-primary/30 text-primary rounded-full">
            {currentMedications.length} traitement(s)
          </span>
        )}
      </div>

      {/* Symptoms input */}
      <div className="mb-4">
        <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Symptômes et signes cliniques</label>
        <textarea
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          placeholder="Ex: Douleur thoracique irradiant dans le bras gauche depuis 2h, dyspnée, sueurs froides, nausées..."
          className="w-full text-sm border border-border rounded-xl px-3 py-2.5 resize-none h-28 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
        />
      </div>

      <button
        onClick={handleDiagnosis}
        disabled={!symptoms.trim() || isLoading}
        className="w-full bg-primary/20 hover:bg-primary/30 disabled:opacity-40 text-primary border border-primary/30 hover:border-primary/50 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mb-4 hover:shadow-[0_0_15px_rgba(0,200,255,0.15)]"
      >
        {isLoading
          ? <><Loader2 size={16} className="animate-spin" /> Analyse en cours...</>
          : <><Stethoscope size={16} /> Générer le diagnostic différentiel</>}
      </button>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mb-4">
            <AlertTriangle size={16} className="text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-primary mt-0.5 flex-shrink-0" />
                <p className="text-sm text-foreground/90">{result.summary}</p>
              </div>
            </div>
            <div className="space-y-2">
              {result.diagnoses.map((diag, i) => <DiagnosisCard key={i} diagnosis={diag} index={i} />)}
            </div>
            {result.recommended_exams?.length > 0 && (
              <div className="p-3 bg-white/5 rounded-xl border border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Examens complémentaires suggérés</p>
                <div className="flex flex-wrap gap-1.5">
                  {result.recommended_exams.map((exam, i) => (
                    <span key={i} className="text-xs bg-background border border-border text-foreground/80 px-2 py-0.5 rounded-full">{exam}</span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">{result.disclaimer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
