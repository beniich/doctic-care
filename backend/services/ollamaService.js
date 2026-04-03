// ============================================================
// Doctic Care — backend/services/ollamaService.js
// Service principal Ollama — tous les agents IA
// ============================================================

import fetch from 'node-fetch';

const OLLAMA_BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const DEFAULT_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0.3');
const MAX_TOKENS = parseInt(process.env.AI_MAX_TOKENS || '4096');

// Prompt système médical — injecté dans tous les appels
const MEDICAL_SYSTEM_PROMPT = `Tu es DoctIA, un assistant médical IA intégré dans le système Doctic Care.
Tu aides les médecins et professionnels de santé avec :
- Des informations cliniques et médicales précises
- Des résumés et synthèses de dossiers patients
- Des suggestions diagnostiques différentielles
- L'analyse d'images médicales (radiographies, ECG, etc.)
- La rédaction de comptes rendus médicaux structurés

RÈGLES ABSOLUES :
1. Rappelle toujours que tes suggestions sont des aides à la décision, jamais des diagnostics définitifs
2. En cas d'urgence vitale détectée, indique immédiatement d'appeler le 15 (SAMU)
3. Respecte strictement la confidentialité HIPAA/RGPD — ne reproduis jamais d'identifiants patients
4. Réponds en français par défaut, sauf si le médecin utilise une autre langue
5. Cite tes sources médicales quand tu le peux (recommandations HAS, ANSM, etc.)`;

// ─────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────

/**
 * Vérifie si Ollama est disponible (timeout 3s)
 */
export async function isOllamaAvailable() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Liste les modèles installés dans Ollama
 */
export async function listModels() {
  try {
    const res = await fetch(`${OLLAMA_BASE}/api/tags`);
    const data = await res.json();
    return (data.models || []).map(m => ({
      name: m.name,
      size: m.size,
      modified: m.modified_at,
    }));
  } catch {
    return [];
  }
}

// ─────────────────────────────────────────────────────────────
// Agent 1 : Chat médical streaming (SSE)
// Modèle : mistral:7b
// ─────────────────────────────────────────────────────────────

/**
 * Generator asynchrone — yield les tokens un par un
 * Utilisé avec les routes SSE (Server-Sent Events)
 *
 * @param {Array} messages - [{role: 'user'|'assistant', content: string}]
 * @param {string} model - Modèle Ollama à utiliser
 * @yields {string} Token de réponse
 */
export async function* chatStream(messages, model = 'mistral:7b') {
  const response = await fetch(`${OLLAMA_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: MEDICAL_SYSTEM_PROMPT },
        ...messages,
      ],
      stream: true,
      options: {
        temperature: DEFAULT_TEMPERATURE,
        num_predict: MAX_TOKENS,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || ''; // Dernière ligne peut être incomplète

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.message?.content) {
          yield parsed.message.content;
        }
        if (parsed.done) return;
      } catch {
        // JSON partiel — ignoré
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────
// Agent 2 : Diagnostic différentiel
// Modèle : medalpaca:7b
// ─────────────────────────────────────────────────────────────

/**
 * Génère un diagnostic différentiel structuré en JSON
 *
 * @param {string} symptoms - Description des symptômes
 * @param {number} patientAge - Âge du patient
 * @param {string} patientSex - 'M' ou 'F'
 * @param {Object} additionalContext - Antécédents, traitements, etc.
 * @returns {Object} { diagnoses: [{name, probability, urgency, next_steps, icd10}] }
 */
export async function generateDiagnosis(symptoms, patientAge, patientSex, additionalContext = {}) {
  const contextStr = Object.keys(additionalContext).length > 0
    ? `\nContexte supplémentaire: ${JSON.stringify(additionalContext)}`
    : '';

  const prompt = `${MEDICAL_SYSTEM_PROMPT}

Patient : ${patientSex === 'M' ? 'Homme' : 'Femme'}, ${patientAge} ans
Symptômes présentés : ${symptoms}${contextStr}

Génère un diagnostic différentiel structuré et cliniquement pertinent.
Ordonne les diagnostics par probabilité décroissante.
Inclus le code CIM-10 pour chaque diagnostic.

RÉPONDS UNIQUEMENT en JSON valide, sans texte avant ou après :
{
  "diagnoses": [
    {
      "name": "Nom du diagnostic",
      "icd10": "Code CIM-10",
      "probability": "haute|moyenne|faible",
      "probability_percent": 75,
      "urgency": "urgence_vitale|urgent|semi_urgent|non_urgent",
      "reasoning": "Explication clinique en 1-2 phrases",
      "next_steps": ["Examen 1", "Examen 2", "Traitement si confirmé"],
      "red_flags": ["Signe d'alarme 1", "Signe d'alarme 2"]
    }
  ],
  "summary": "Synthèse clinique en 2-3 phrases",
  "recommended_exams": ["Bilan sanguin", "ECG", ...],
  "disclaimer": "Ces suggestions sont des aides à la décision médicale."
}`;

  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'medalpaca:7b',
      prompt,
      stream: false,
      format: 'json',
      options: {
        temperature: 0.1, // Très bas pour le diagnostic : précision maximale
        num_predict: 2048,
      },
    }),
  });

  const data = await response.json();

  try {
    return JSON.parse(data.response);
  } catch {
    // Fallback si le JSON est malformé
    return {
      diagnoses: [],
      summary: data.response,
      disclaimer: 'Ces suggestions sont des aides à la décision médicale.',
    };
  }
}

// ─────────────────────────────────────────────────────────────
// Agent 3 : Analyse d'image médicale (multimodal)
// Modèle : llava:13b
// ─────────────────────────────────────────────────────────────

/**
 * Analyse une image médicale avec LLaVA (vision + language)
 *
 * @param {string} base64Image - Image encodée en base64 (sans data: prefix)
 * @param {string} imageType - 'radio_thorax'|'ecg'|'echo'|'scanner'|'autre'
 * @param {string} clinicalContext - Contexte clinique du patient
 * @returns {string} Analyse textuelle structurée
 */
export async function analyzeImage(base64Image, imageType = 'autre', clinicalContext = '') {
  const imageTypeLabels = {
    radio_thorax: 'radiographie thoracique',
    ecg: 'électrocardiogramme (ECG)',
    echo: 'échographie',
    scanner: 'scanner (TDM)',
    irm: 'IRM',
    fond_oeil: "fond d'œil",
    autre: 'image médicale',
  };

  const label = imageTypeLabels[imageType] || imageTypeLabels.autre;

  const prompt = `Tu es un radiologue IA expert. Analyse cette ${label} de manière structurée.
${clinicalContext ? `\nContexte clinique : ${clinicalContext}` : ''}

Structure ton analyse ainsi :
1. QUALITÉ DE L'IMAGE : (bonne/moyenne/mauvaise et raison)
2. OBSERVATIONS PRINCIPALES : (liste les éléments visibles clés)
3. ANOMALIES DÉTECTÉES : (décris précisément chaque anomalie)
4. IMPRESSION DIAGNOSTIQUE : (hypothèses radiologiques)
5. RECOMMANDATIONS : (examens complémentaires suggérés)

Rappelle que cette analyse est une aide et doit être validée par un médecin qualifié.`;

  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llava:13b',
      prompt,
      images: [base64Image],
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 1024,
      },
    }),
  });

  const data = await response.json();
  return data.response;
}

// ─────────────────────────────────────────────────────────────
// Agent 4 : Génération rapport médical HL7/FHIR
// Modèle : mistral:7b
// ─────────────────────────────────────────────────────────────

/**
 * Génère un compte rendu médical structuré
 *
 * @param {Object} patientData - Données patient (anonymisées)
 * @param {string} consultationNotes - Notes brutes de consultation
 * @param {string} reportType - 'consultation'|'hospitalisation'|'urgences'|'chirurgie'
 * @returns {Object} { content: string, structured: Object }
 */
export async function generateMedicalReport(patientData, consultationNotes, reportType = 'consultation') {
  const templates = {
    consultation: 'compte rendu de consultation',
    hospitalisation: "compte rendu d'hospitalisation",
    urgences: "compte rendu de passage aux urgences",
    chirurgie: 'compte rendu opératoire',
  };

  const template = templates[reportType] || templates.consultation;

  const prompt = `${MEDICAL_SYSTEM_PROMPT}

Génère un ${template} médical professionnel en français.

DONNÉES PATIENT (anonymisées) :
${JSON.stringify(patientData, null, 2)}

NOTES DE CONSULTATION :
${consultationNotes}

Le compte rendu doit suivre ce format standard :
---
COMPTE RENDU DE ${template.toUpperCase()}
Date : [date du jour]

MOTIF DE CONSULTATION :
[motif]

HISTOIRE DE LA MALADIE :
[anamnèse structurée]

EXAMEN CLINIQUE :
- Constantes : 
- Examen général :
- Examens spécifiques :

RÉSULTATS DES EXAMENS COMPLÉMENTAIRES :
[si disponibles]

CONCLUSION ET DIAGNOSTIC :
[diagnostic retenu]

TRAITEMENT ET PRESCRIPTION :
[ordonnance structurée]

SUIVI ET RECOMMANDATIONS :
[plan de suivi]

Dr. [Médecin référent]
---

Rédige ce compte rendu de façon professionnelle et complète.`;

  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral:7b',
      prompt,
      stream: false,
      options: {
        temperature: 0.2,
        num_predict: 2048,
      },
    }),
  });

  const data = await response.json();
  return {
    content: data.response,
    type: reportType,
    generatedAt: new Date().toISOString(),
    model: 'mistral:7b',
  };
}

// ─────────────────────────────────────────────────────────────
// Agent 5 : Résumé de dossier patient
// Modèle : mistral:7b
// ─────────────────────────────────────────────────────────────

/**
 * Résume un dossier patient complexe en points clés
 *
 * @param {Object} patientRecord - Dossier patient complet
 * @returns {Object} { summary, keyPoints, alerts, medications }
 */
export async function summarizePatientRecord(patientRecord) {
  const prompt = `${MEDICAL_SYSTEM_PROMPT}

Analyse et résume ce dossier patient de manière concise pour une prise en charge rapide.

DOSSIER PATIENT :
${JSON.stringify(patientRecord, null, 2)}

Réponds UNIQUEMENT en JSON valide :
{
  "summary": "Résumé en 3-4 phrases du contexte clinique global",
  "keyPoints": ["Point clinique important 1", "Point 2", ...],
  "alerts": [
    {
      "type": "allergie|interaction_medicamenteuse|antecedent_grave|autre",
      "severity": "critique|warning|info",
      "message": "Description de l'alerte"
    }
  ],
  "currentMedications": ["Traitement 1 - dose", "Traitement 2 - dose"],
  "lastVisit": "Date et motif de la dernière consultation",
  "followUpNeeded": true,
  "followUpReason": "Raison du suivi"
}`;

  const response = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'mistral:7b',
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.1, num_predict: 1024 },
    }),
  });

  const data = await response.json();
  try {
    return JSON.parse(data.response);
  } catch {
    return { summary: data.response, keyPoints: [], alerts: [] };
  }
}

// Export classe (compatibilité ancien code)
export const OllamaService = {
  isAvailable: isOllamaAvailable,
  listModels,
  chatStream,
  generateDiagnosis,
  analyzeImage,
  generateReport: generateMedicalReport,
  summarizePatientRecord,
};

export default OllamaService;
