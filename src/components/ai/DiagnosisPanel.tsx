// ============================================================
// Doctic Care — src/components/ai/DiagnosisPanel.tsx
// Diagnostic différentiel IA connecté à la page Patients
// ============================================================

import React, { useState } from 'react';
import { Loader2, AlertTriangle, Info, ChevronDown, ChevronUp, Stethoscope } from 'lucide-react';

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
  urgence_vitale: { label: 'URGENCE VITALE', color: 'text-red-700 bg-red-100 border-red-300', dot: 'bg-red-500' },
  urgent: { label: 'Urgent', color: 'text-orange-700 bg-orange-100 border-orange-300', dot: 'bg-orange-500' },
  semi_urgent: { label: 'Semi-urgent', color: 'text-yellow-700 bg-yellow-100 border-yellow-300', dot: 'bg-yellow-500' },
  non_urgent: { label: 'Non urgent', color: 'text-green-700 bg-green-100 border-green-300', dot: 'bg-green-500' },
};

const PROBABILITY_COLOR = {
  haute: 'bg-blue-500',
  moyenne: 'bg-blue-300',
  faible: 'bg-blue-100',
};

function DiagnosisCard({ diagnosis, index }: { diagnosis: Diagnosis; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);
  const urgency = URGENCY_CONFIG[diagnosis.urgency] || URGENCY_CONFIG.non_urgent;

  return (
    <div className={`border rounded-xl overflow-hidden ${index === 0 ? 'border-blue-300' : 'border-gray-200'}`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
      >
        {/* Probabilité */}
        <div className="flex-shrink-0 w-12 text-center">
          <div className="text-lg font-bold text-blue-600">{diagnosis.probability_percent}%</div>
          <div className={`h-1.5 rounded-full mt-1 ${PROBABILITY_COLOR[diagnosis.probability]}`} />
        </div>

        {/* Nom + CIM-10 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium text-gray-900 truncate">{diagnosis.name}</p>
            {index === 0 && (
              <span className="flex-shrink-0 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">1er</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">CIM-10: {diagnosis.icd10}</p>
        </div>

        {/* Urgence */}
        <div className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${urgency.color}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
          {urgency.label}
        </div>

        {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {/* Détails */}
      {expanded && (
        <div className="px-4 pb-4 pt-0 space-y-3 bg-gray-50 border-t border-gray-200">
          {/* Raisonnement */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">Raisonnement clinique</p>
            <p className="text-sm text-gray-700">{diagnosis.reasoning}</p>
          </div>

          {/* Prochaines étapes */}
          {diagnosis.next_steps?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1">Prochaines étapes</p>
              <ul className="space-y-1">
                {diagnosis.next_steps.map((step, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-blue-500 mt-0.5">→</span> {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Drapeaux rouges */}
          {diagnosis.red_flags?.length > 0 && (
            <div className="p-2.5 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs font-medium text-red-600 mb-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Signes d'alarme
              </p>
              <ul className="space-y-0.5">
                {diagnosis.red_flags.map((flag, i) => (
                  <li key={i} className="text-xs text-red-700">• {flag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DiagnosisPanel({
  patientId,
  patientAge,
  patientSex,
  existingConditions = [],
  currentMedications = [],
}: DiagnosisPanelProps) {
  const [symptoms, setSymptoms] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDiagnosis = async () => {
    if (!symptoms.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/diagnosis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          symptoms,
          patientAge,
          patientSex,
          patientId,
          additionalContext: {
            existingConditions,
            currentMedications,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors du diagnostic');
      }

      const data = await res.json();
      setResult(data.data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
          <Stethoscope size={16} className="text-blue-600" />
        </span>
        Aide au diagnostic différentiel
        <span className="ml-auto text-xs text-gray-400 font-normal">medalpaca:7b</span>
      </h3>

      {/* Info patient */}
      <div className="flex gap-2 mb-4">
        <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
          {patientSex === 'M' ? 'Homme' : 'Femme'} · {patientAge} ans
        </span>
        {existingConditions.length > 0 && (
          <span className="text-xs px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full">
            {existingConditions.length} antécédent(s)
          </span>
        )}
        {currentMedications.length > 0 && (
          <span className="text-xs px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {currentMedications.length} traitement(s)
          </span>
        )}
      </div>

      {/* Saisie symptômes */}
      <div className="mb-4">
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Symptômes et signes cliniques
        </label>
        <textarea
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          placeholder="Ex: Douleur thoracique irradiant dans le bras gauche depuis 2h, dyspnée, sueurs froides, nausées. ECG : sus-décalage ST en V1-V4..."
          className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none h-28 focus:border-blue-400 outline-none"
        />
      </div>

      <button
        onClick={handleDiagnosis}
        disabled={!symptoms.trim() || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
      >
        {isLoading ? (
          <><Loader2 size={16} className="animate-spin" /> Analyse en cours...</>
        ) : (
          <><Stethoscope size={16} /> Générer le diagnostic différentiel</>
        )}
      </button>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
          <AlertTriangle size={16} className="text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Résultats */}
      {result && (
        <div className="space-y-4">
          {/* Synthèse */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-start gap-2">
              <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">{result.summary}</p>
            </div>
          </div>

          {/* Liste diagnostics */}
          <div className="space-y-2">
            {result.diagnoses.map((diag, i) => (
              <DiagnosisCard key={i} diagnosis={diag} index={i} />
            ))}
          </div>

          {/* Examens recommandés */}
          {result.recommended_exams?.length > 0 && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">Examens complémentaires suggérés</p>
              <div className="flex flex-wrap gap-1.5">
                {result.recommended_exams.map((exam, i) => (
                  <span key={i} className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-0.5 rounded-full">
                    {exam}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center">{result.disclaimer}</p>
        </div>
      )}
    </div>
  );
}
