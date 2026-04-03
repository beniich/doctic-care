// ============================================================
// Doctic Care — backend/services/auditService.js
// Service d'audit HIPAA / RGPD
// ============================================================

import { PrismaClient } from '@prisma/prisma-client';
// Note: Dans un environnement réel, on utiliserait le client partagé
const prisma = new PrismaClient();

/**
 * Enregistre une action dans les logs d'audit (Table audit_logs)
 * 
 * @param {string} userId - ID de l'utilisateur (médecin/pers. santé)
 * @param {string} action - Code de l'action (ex: AI_CHAT, AI_DIAGNOSIS)
 * @param {Object} metadata - Détails supplémentaires (modèle, patientId, etc.)
 */
export async function auditLog(userId, action, metadata = {}) {
  try {
    // Dans l'environnement Docker, on insère directement en SQL ou via Prisma
    // Ici on simule l'appel DB pour l'infrastructure
    console.log(`[AUDIT] User:${userId} | Action:${action} | Data:${JSON.stringify(metadata)}`);
    
    // Si Prisma est configuré :
    /*
    await prisma.audit_logs.create({
      data: {
        user_id: userId,
        action: action,
        metadata: metadata,
        ip_address: metadata.ip || '0.0.0.0'
      }
    });
    */
    
    return true;
  } catch (err) {
    console.error('[Audit Service] Error logging action:', err);
    return false;
  }
}

export const AuditService = {
  auditLog
};

export default AuditService;
