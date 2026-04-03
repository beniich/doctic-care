// ============================================================
// Doctic Care — src/components/ai/ImageAnalysis.tsx
// Analyse d'images médicales LLaVA — Dark Theme Doctic
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, X, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (!file.type.startsWith('image/')) { setError('Seules les images sont acceptées (JPG, PNG)'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image trop volumineuse (max 10MB)'); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setSelectedImage(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true); setError(null); setResult(null);
    try {
      const res = await fetch('/api/ai/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ image: selectedImage, imageType, clinicalContext, patientId }),
      });
      if (!res.ok) { const err = await res.json(); throw new Error(err.error || "Erreur lors de l'analyse"); }
      const data = await res.json();
      setResult(data.data);
      onAnalysisComplete?.(data.data);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => { setSelectedImage(null); setImagePreview(null); setResult(null); setError(null); setClinicalContext(''); };

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
        <span className="w-7 h-7 bg-accent/20 border border-accent/30 rounded-lg flex items-center justify-center text-sm">🔬</span>
        <span>Analyse d'image médicale</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono-tech font-normal">LLaVA 13B</span>
      </h3>

      {!imagePreview ? (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
            ${isDragging ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,200,255,0.1)]' : 'border-border hover:border-primary/50 hover:bg-white/5'}`}
        >
          <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
          <p className="text-sm font-medium text-foreground">Glissez une image médicale</p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG · Max 10MB</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            title="Sélectionner une image médicale"
            className="hidden"
            onChange={e => e.target.files?.[0] && processFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img src={imagePreview} alt="Image médicale" className="w-full max-h-64 object-contain rounded-xl bg-black/30" />
            <button
              onClick={reset}
              title="Supprimer l'image"
              className="absolute top-2 right-2 w-7 h-7 bg-background/80 backdrop-blur-sm border border-border rounded-full flex items-center justify-center hover:bg-destructive/20 hover:border-destructive/50 hover:text-destructive text-muted-foreground transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Type d'image</label>
            <select
              title="Sélectionner le type d'image médicale"
              value={imageType}
              onChange={e => setImageType(e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:border-primary outline-none transition-colors"
            >
              {IMAGE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Contexte clinique (optionnel)</label>
            <textarea
              value={clinicalContext}
              onChange={e => setClinicalContext(e.target.value)}
              placeholder="Ex: Patient de 65 ans, fumeur, toux persistante depuis 3 mois..."
              className="w-full text-sm border border-border rounded-lg px-3 py-2 resize-none h-20 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full bg-accent/20 hover:bg-accent/30 disabled:opacity-40 text-accent border border-accent/30 hover:border-accent/50 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(155,127,255,0.2)]"
          >
            {isAnalyzing
              ? <><Loader2 size={16} className="animate-spin" /> Analyse LLaVA en cours...</>
              : <><ZoomIn size={16} /> Analyser l'image</>}
          </button>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-xl mt-4">
            <AlertCircle size={16} className="text-destructive mt-0.5 flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-accent/10 border border-accent/30 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">Analyse terminée</span>
              <span className="text-xs text-muted-foreground ml-auto font-mono-tech">{result.model}</span>
            </div>
            <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
              {result.analysis}
            </div>
            <p className="text-xs text-muted-foreground mt-3 border-t border-border/50 pt-2">
              ⚠️ Cette analyse est une aide à la décision. Validation par un radiologue requise.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
