import { z } from 'zod';

/**
 * Validateur générique pour les requêtes Express
 * @param {z.ZodSchema} schema - Le schéma Zod à valider
 * @param {string} source - 'body' | 'query' | 'params'
 */
export const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const validatedData = await schema.parseAsync(dataToValidate);
      
      // On remplace les données brutes par les données validées/nettoyées
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        });
      }
      next(error);
    }
  };
};

// ─────────────────────────────────────────────────────────────
// SCHÉMAS DE VALIDATION MÉDICAUX
// ─────────────────────────────────────────────────────────────

/**
 * Schéma pour la création/mise à jour d'un patient
 */
export const patientSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis").max(50),
  lastName: z.string().min(1, "Le nom est requis").max(50),
  email: z.string().email("Format d'email invalide").optional().or(z.literal('')),
  phone: z.string().regex(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/, "Numéro de téléphone invalide").optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER', 'Male', 'Female', 'Other']).optional(),
  birthDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(), // Accepte ISO ou YYYY-MM-DD
  address: z.string().max(200).optional(),
  medicalHistory: z.string().optional(),
  allergies: z.string().optional(),
  medications: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'Actif', 'Inactif']).optional().default('ACTIVE'),
});

/**
 * Schéma pour les requêtes Ollama (AI)
 */
export const aiChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, "Le message ne peut pas être vide").max(10000)
  })).min(1, "Au moins un message est requis"),
  model: z.string().optional().default('mistral:7b'),
  sessionId: z.string().optional(),
});

/**
 * Schéma pour l'analyse d'image (Vision)
 */
export const aiImageSchema = z.object({
  image: z.string().min(1, "L'image base64 est requise"),
  imageType: z.enum(['radio_thorax', 'ecg', 'echo', 'scanner', 'irm', 'fond_oeil', 'autre']).default('autre'),
  clinicalContext: z.string().max(2000).optional(),
  patientId: z.string().uuid().optional(),
});
