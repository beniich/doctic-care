// ============================================================
// Doctic Care — src/components/ai/ImageAnalysis.tsx
// Analyse d'images médicales avec LLaVA (Phase 3)
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, X, ZoomIn } from 'lucide-react';

interface AnalysisResult {
  analysis: string;
  imageType: string;
  model: string;
  generatedAt: string;
}

interface ImageAnalysisProps {
  patientId?: string;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

const IMAGE_TYPES = [
  { value: 'radio_thorax', label: 'Radio thoracique' },
  { value: 'ecg', label: 'ECG' },
  { value: 'echo', label: 'Échographie' },
  { value: 'scanner', label: 'Scanner (TDM)' },
  { value: 'irm', label: 'IRM' },
  { value: 'fond_oeil', label: "Fond d'œil" },
  { value: 'autre', label: 'Autre' },
];

export default function ImageAnalysis({ patientId, onAnalysisComplete }: ImageAnalysisProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageType, setImageType] = useState('radio_thorax');
  const [clinicalContext, setClinicalContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées (JPG, PNG, DICOM converti)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image trop volumineuse (max 10MB)');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // Extrait le base64 pur
      setSelectedImage(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          image: selectedImage,
          imageType,
          clinicalContext,
          patientId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erreur lors de l\'analyse');
      }

      const data = await res.json();
      setResult(data.data);
      onAnalysisComplete?.(data.data);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    setClinicalContext('');
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center text-sm">🔬</span>
        Analyse d'image médicale — LLaVA 13B
      </h3>

      {!imagePreview ? (
        /* Zone de drop */
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
        >
          <Upload className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-sm font-medium text-gray-700">Glissez une image médicale</p>
          <p className="text-xs text-gray-500 mt-1">JPG, PNG · Max 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
          />
        </div>
      ) : (
        /* Image chargée */
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image médicale"
              className="w-full max-h-64 object-contain rounded-xl bg-black"
            />
            <button
              onClick={reset}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100"
            >
              <X size={14} />
            </button>
          </div>

          {/* Type d'image */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">Type d'image</label>
            <select
              value={imageType}
              onChange={e => setImageType(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2"
            >
              {IMAGE_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Contexte clinique */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1.5 block">
              Contexte clinique (optionnel)
            </label>
            <textarea
              value={clinicalContext}
              onChange={e => setClinicalContext(e.target.value)}
              placeholder="Ex: Patient de 65 ans, fumeur, toux persistante depuis 3 mois..."
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none h-20"
            />
          </div>

          {/* Bouton analyser */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Analyse en cours (LLaVA 13B)...</>
            ) : (
              <><ZoomIn size={16} /> Analyser l'image</>
            )}
          </button>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl mt-4">
          <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-purple-600" />
            <span className="text-sm font-medium text-purple-800">Analyse terminée</span>
            <span className="text-xs text-purple-500 ml-auto">{result.model}</span>
          </div>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {result.analysis}
          </div>
          <p className="text-xs text-purple-500 mt-3 border-t border-purple-200 pt-2">
            ⚠️ Cette analyse est une aide à la décision. Validation par un radiologue requise.
          </p>
        </div>
      )}
    </div>
  );
}
