// ============================================================
// Doctic Care — backend/routes/ai.js
// Routes API IA — Ollama réel (remplace les mocks)
// ============================================================

import express from 'express';
import {
  isOllamaAvailable,
  listModels,
  chatStream,
  generateDiagnosis,
  analyzeImage,
  generateMedicalReport,
  summarizePatientRecord,
} from '../services/ollamaService.js';
import { authMiddleware } from '../middleware/auth.js';
import { auditLog } from '../services/auditService.js';

const router = express.Router();

// ─── Middleware : Log toutes les requêtes IA ────────────────
router.use((req, res, next) => {
  console.log(`[AI] ${req.method} ${req.path} — user: ${req.user?.id || 'anon'}`);
  next();
});

// ─────────────────────────────────────────────────────────────
// GET /api/ai/status
// Statut des agents IA et modèles disponibles
// ─────────────────────────────────────────────────────────────
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const available = await isOllamaAvailable();
    const models = available ? await listModels() : [];

    const requiredModels = ['mistral:7b', 'llava:13b', 'medalpaca:7b'];
    const installedNames = models.map(m => m.name);
    const missingModels = requiredModels.filter(m => !installedNames.includes(m));

    res.json({
      available,
      ollamaUrl: process.env.OLLAMA_BASE_URL,
      models,
      missingModels,
      status: missingModels.length === 0 ? 'ready' : 'incomplete',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message, available: false });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/chat
// Chat médical en streaming SSE (Server-Sent Events)
// Body: { messages: [{role, content}], model?: string }
// ─────────────────────────────────────────────────────────────
router.post('/chat', authMiddleware, async (req, res) => {
  const { messages, model = 'mistral:7b', sessionId } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages est requis (array non vide)' });
  }

  // Headers SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Désactive le buffer Nginx pour SSE

  // Heartbeat toutes les 15s pour éviter le timeout
  const heartbeat = setInterval(() => {
    res.write(': ping\n\n');
  }, 15000);

  try {
    // Vérification disponibilité Ollama
    const available = await isOllamaAvailable();
    if (!available) {
      clearInterval(heartbeat);
      res.write(`data: ${JSON.stringify({ error: 'Ollama indisponible. Vérifiez que le service est démarré.' })}\n\n`);
      return res.end();
    }

    let fullResponse = '';

    // Stream des tokens
    for await (const chunk of chatStream(messages, model)) {
      fullResponse += chunk;
      res.write(`data: ${JSON.stringify({ content: chunk, type: 'token' })}\n\n`);
    }

    // Signal de fin
    res.write(`data: ${JSON.stringify({ type: 'done', totalLength: fullResponse.length })}\n\n`);
    res.write('data: [DONE]\n\n');

    // Audit log asynchrone (ne bloque pas la réponse)
    auditLog(req.user.id, 'AI_CHAT', {
      model,
      sessionId,
      messageCount: messages.length,
      responseLength: fullResponse.length,
      ip: req.ip,
    }).catch(err => console.error('[Audit] Error:', err));

  } catch (err) {
    console.error('[AI Chat] Error:', err);
    res.write(`data: ${JSON.stringify({ error: err.message, type: 'error' })}\n\n`);
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/diagnosis
// Diagnostic différentiel structuré JSON
// Body: { symptoms, patientAge, patientSex, patientId, additionalContext? }
// ─────────────────────────────────────────────────────────────
router.post('/diagnosis', authMiddleware, async (req, res) => {
  const { symptoms, patientAge, patientSex, patientId, additionalContext } = req.body;

  // Validation
  if (!symptoms || !patientAge || !patientSex) {
    return res.status(400).json({
      error: 'symptoms, patientAge et patientSex sont requis',
    });
  }

  if (patientAge < 0 || patientAge > 150) {
    return res.status(400).json({ error: 'Âge invalide' });
  }

  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({ error: 'Service IA indisponible' });
    }

    const result = await generateDiagnosis(
      symptoms,
      patientAge,
      patientSex,
      additionalContext || {}
    );

    // Audit HIPAA
    await auditLog(req.user.id, 'AI_DIAGNOSIS', {
      patientId: patientId || 'non_specifie',
      model: 'medalpaca:7b',
      symptomsLength: symptoms.length,
      ip: req.ip,
    });

    res.json({
      success: true,
      data: result,
      meta: {
        model: 'medalpaca:7b',
        generatedAt: new Date().toISOString(),
        disclaimer: result.disclaimer || 'Ces suggestions sont des aides à la décision médicale.',
      },
    });

  } catch (err) {
    console.error('[AI Diagnosis] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/analyze-image
// Analyse d'image médicale avec LLaVA
// Body: { image: base64, imageType, clinicalContext, patientId }
// ─────────────────────────────────────────────────────────────
router.post('/analyze-image', authMiddleware, async (req, res) => {
  const { image, imageType = 'autre', clinicalContext = '', patientId } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'image (base64) est requis' });
  }

  // Validation taille image (max ~10MB en base64)
  if (image.length > 14_000_000) {
    return res.status(413).json({ error: "Image trop volumineuse (max 10MB)" });
  }

  // Strip le prefix data:image/xxx;base64, si présent
  const base64Data = image.includes(',') ? image.split(',')[1] : image;

  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({ error: 'Service IA indisponible' });
    }

    const analysis = await analyzeImage(base64Data, imageType, clinicalContext);

    await auditLog(req.user.id, 'AI_IMAGE_ANALYSIS', {
      patientId: patientId || 'non_specifie',
      imageType,
      model: 'llava:13b',
      ip: req.ip,
    });

    res.json({
      success: true,
      data: {
        analysis,
        imageType,
        model: 'llava:13b',
        generatedAt: new Date().toISOString(),
      },
    });

  } catch (err) {
    console.error('[AI Image] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/medical-report
// Génération rapport médical structuré
// Body: { patientData, consultationNotes, reportType? }
// ─────────────────────────────────────────────────────────────
router.post('/medical-report', authMiddleware, async (req, res) => {
  const { patientData, consultationNotes, reportType = 'consultation' } = req.body;

  if (!patientData || !consultationNotes) {
    return res.status(400).json({ error: 'patientData et consultationNotes sont requis' });
  }

  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({ error: 'Service IA indisponible' });
    }

    // Anonymisation des données patient avant envoi à Ollama
    const anonymizedData = {
      age: patientData.age,
      sex: patientData.sex,
      antecedents: patientData.antecedents,
      allergies: patientData.allergies,
      currentTreatments: patientData.currentTreatments,
      // On EXCLUT : nom, prénom, adresse, numéro SS
    };

    const report = await generateMedicalReport(anonymizedData, consultationNotes, reportType);

    await auditLog(req.user.id, 'AI_REPORT_GENERATED', {
      reportType,
      model: 'mistral:7b',
      ip: req.ip,
    });

    res.json({
      success: true,
      data: report,
    });

  } catch (err) {
    console.error('[AI Report] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/ai/summarize-patient
// Résumé intelligent d'un dossier patient
// Body: { patientRecord }
// ─────────────────────────────────────────────────────────────
router.post('/summarize-patient', authMiddleware, async (req, res) => {
  const { patientRecord } = req.body;

  if (!patientRecord) {
    return res.status(400).json({ error: 'patientRecord est requis' });
  }

  try {
    const available = await isOllamaAvailable();
    if (!available) {
      return res.status(503).json({ error: 'Service IA indisponible' });
    }

    const summary = await summarizePatientRecord(patientRecord);

    await auditLog(req.user.id, 'AI_PATIENT_SUMMARY', {
      patientId: patientRecord.id,
      model: 'mistral:7b',
      ip: req.ip,
    });

    res.json({ success: true, data: summary });

  } catch (err) {
    console.error('[AI Summary] Error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
