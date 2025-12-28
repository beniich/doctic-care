# 🏥 Doctic Medical OS - Présentation Professionnelle

## Système de Gestion Médicale Intelligent avec RBAC Avancé

---

## 📋 Résumé Exécutif

**Doctic Medical OS** est une plateforme médicale moderne qui implémente un système complet de **Role-Based Access Control (RBAC)** avec intelligence artificielle intégrée. Cette solution révolutionne la gestion des cliniques et cabinets médicaux en combinant :

✅ **Sécurité de niveau entreprise** - Permissions granulaires par rôle  
✅ **Intelligence Artificielle** - Analyse radiologique automatisée (prototype)  
✅ **Expérience Utilisateur Premium** - Interface dark mode avec glassmorphism  
✅ **Conformité Réglementaire** - Prêt pour RGPD/HIPAA  
✅ **Multi-tenant** - Support de plusieurs cliniques

---

## 🎯 Objectifs du Projet

### Vision
Créer une plateforme médicale **tout-en-un** qui simplifie la gestion quotidienne des professionnels de santé tout en garantissant la sécurité et la confidentialité des données patients.

### Publics Cibles
1. **Médecins libéraux** - Gestion de cabinet simplifiée
2. **Cliniques privées** - Solution multi-praticiens
3. **Groupes médicaux** - Gestion centralisée multi-sites
4. **Hôpitaux** - Module complémentaire spécialisé

---

## 🏗️ Architecture Système

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                   │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │   Patient    │   Médecin    │     Admin    │    │
│  │   Portal     │   Dashboard  │   Control    │    │
│  └──────────────┴──────────────┴──────────────┘    │
│         AuthContext │ ModalContext │ Theme          │
└─────────────────────┼───────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          │   API Gateway (JWT)   │
          └───────────┬───────────┘
                      │
          ┌───────────┴────────────┐
          │   Backend Services     │
          ├────────────────────────┤
          │  Auth │ Patients │ AI  │
          │  Appt │ Billing  │ Msg │
          └───────────┬────────────┘
                      │
          ┌───────────┴────────────┐
          │   PostgreSQL + Redis   │
          └────────────────────────┘
```

### Stack Technologique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + ShadCN/UI |
| **State** | React Query + Context API |
| **Backend** | Node.js + NestJS (recommandé) |
| **Database** | PostgreSQL + Prisma ORM |
| **Cache** | Redis |
| **Storage** | AWS S3 / Cloudinary |
| **AI/ML** | MedGemma via HuggingFace |
| **Monitoring** | Sentry + Datadog |
| **Deploy** | Vercel (frontend) + AWS (backend) |

---

## 👥 Système de Rôles (RBAC)

### Hiérarchie des Permissions

```
Super Admin (Maître absolu)
    │
    ├─── Admin (Gestion clinique)
    │     │
    │     ├─── Doctor (Soins médicaux)
    │     │     │
    │     │     └─── Assistant (Support)
    │     │
    │     └─── Patient (Accès personnel)
```

### Matrice de Fonctionnalités

| Fonctionnalité | Patient | Assistant | Doctor | Admin |
|----------------|---------|-----------|--------|-------|
| **Voir ses RDV** | ✅ | ✅ | ✅ | ✅ |
| **Créer RDV** | ✅ (soi) | ✅ (tous) | ✅ | ✅ |
| **Annuler RDV** | ✅ (soi) | ❌ | ✅ | ✅ |
| **Voir patients** | ❌ | ✅ | ✅ | ✅ |
| **Créer patients** | ❌ | ❌ | ✅ | ✅ |
| **Modifier patients** | ❌ | ❌ | ✅ | ✅ |
| **Supprimer patients** | ❌ | ❌ | ❌ | ✅ (soft) |
| **Voir dossiers médicaux** | ✅ (soi) | ❌ | ✅ | ✅ |
| **Écrire dossiers** | ❌ | ❌ | ✅ | ❌ |
| **Supprimer dossiers** | ❌ | ❌ | ❌ | ❌ (jamais) |
| **Voir facturation** | ✅ (soi) | ✅ | ✅ | ✅ |
| **Modifier facturation** | ❌ | ❌ | ❌ | ✅ |
| **Analytics** | ❌ | ❌ | ✅ | ✅ |
| **Export rapports** | ❌ | ❌ | ❌ | ✅ |
| **Gérer utilisateurs** | ❌ | ❌ | ❌ | ✅ |
| **AI Radiologie** | ❌ | ❌ | ✅ | ✅ |

### Règles de Sécurité Critiques

1. **Les dossiers médicaux ne peuvent JAMAIS être supprimés** (conformité légale)
2. **Seuls les médecins peuvent écrire dans les dossiers** (traçabilité)
3. **Les factures payées sont en lecture seule** (prévention fraude)
4. **L'audit log enregistre TOUTES les actions** (conformité)

---

## 🎨 Modules Fonctionnels

### 1. 📊 Dashboard Analytics (Médecins & Admins)

**KPIs Temps Réel** :
- Patients total avec évolution
- Rendez-vous du jour
- Revenus mensuels
- Taux de complétion consultations

**Visualisations** :
- Graphiques de consultations (12 mois)
- Timeline d'activité récente
- Alertes et notifications

**Cas d'usage** :
> Dr. Dupont se connecte le matin et voit immédiatement qu'il a 24 RDV dont 5 en attente de confirmation. Il voit aussi que ses revenus sont en hausse (+2.5%) et qu'il a 3 messages urgents.

### 2. 👨‍⚕️ Gestion des Patients

**Fonctionnalités** :
- Recherche instantanée
- Formulaire de création (modal)
- Édition inline
- Filtres avancés (sexe, âge, dernière visite)
- Export Excel/PDF

**Données Patient** :
- Informations personnelles
- Historique médical complet
- Allergies et antécédents
- Documents attachés (ordonnances, radios)
- Échanges de messages

**Sécurité** :
- Chiffrement E2E des données sensibles
- Accès tracé (qui a consulté quand)
- Anonymisation pour statistiques

### 3. 📅 Calendrier & Rendez-vous

**Interface** :
- Vue journalière/hebdomadaire/mensuelle
- Drag & drop pour déplacer RDV
- Color-coding par type (consultation, suivi, urgence)
- Gestion des salles et équipements

**Workflow** :
1. Patient prend RDV (en ligne ou par téléphone)
2. Assistant valide et assigne créneaux
3. Médecin reçoit notification
4. Rappel automatique SMS/Email (J-1)
5. Consultation
6. Post-consultation : notes + prescription

**Intégrations** :
- Google Calendar sync
- iCal export
- SMS via Twilio
- Email via SendGrid

### 4. 💰 Facturation & Comptabilité

**Gestion des Factures** :
- Création automatique après consultation
- Items de ligne multiples
- Calcul TVA automatique (20%, 10%, 5.5%)
- Numérotation séquentielle légale
- Support multi-devises (EUR, USD, CHF)

**Statuts** :
- `pending` - En attente de paiement
- `paid` - Payée (verrouillée)
- `overdue` - Échue (relance auto)
- `cancelled` - Annulée

**Exports** :
- PDF (impression/envoi email)
- Export comptable FEC (France)
- Rapports TVA
- Statistiques revenus

**Compliance** :
- Archivage 10 ans (loi française)
- Numérotation sans trous
- Mentions légales obligatoires

### 5. 🤖 Analyse IA Radiologique (PROTOTYPE)

**⚠️ MODULE EN MODE DÉMONSTRATION - PAS POUR USAGE CLINIQUE ⚠️**

**Concept** :
- Upload image radiologique (JPEG/PNG/DICOM)
- Analyse automatisée par IA (MedGemma/Ark+)
- Détection d'anomalies
- Rapport structuré avec confidence score
- Validation obligatoire par radiologue

**Workflow** :
```
1. Médecin upload radio thorax
      ↓
2. Prétraitement image (resize, normalize)
      ↓
3. Envoi à modèle IA (via API HuggingFace)
      ↓
4. Analyse (détection anomalies)
      ↓
5. Rapport JSON :
   {
     "findings": "Pas d'anomalie détectée",
     "confidence": 92%,
     "regions": [],
     "suggestions": "Validation radiologue requise"
   }
      ↓
6. Affichage dans UI avec disclaimers
```

**Modèles IA Recommandés** :
- **MedGemma** (Google) - LLM médical
- **Ark+** - Analyse radiologique
- **BiomedCLIP** - Classification images
- **CheXNet** - Pneumonie thorax

**Disclaimers Légaux** :
```
❌ CE MODULE EST UN PROTOTYPE DE DÉMONSTRATION
❌ NE PAS UTILISER POUR DES DIAGNOSTICS RÉELS
❌ VALIDATION PAR PROFESSIONNEL QUALIFIÉ OBLIGATOIRE
❌ NON CERTIFIÉ FDA/ANSM/CE
❌ DOCTIC N'ASSUME AUCUNE RESPONSABILITÉ
```

---

## 🔒 Sécurité & Conformité

### Architecture Sécurisée

```
┌─────────────────────────────────────────┐
│  Client (React App)                     │
│  - Input validation (Zod)               │
│  - XSS prevention (DOMPurify)           │
│  - CSRF tokens                          │
└─────────────┬───────────────────────────┘
              │ HTTPS only
┌─────────────┴───────────────────────────┐
│  API Gateway                             │
│  - JWT verification                      │
│  - Rate limiting (100 req/min)          │
│  - CORS strict                          │
└─────────────┬───────────────────────────┘
              │
┌─────────────┴───────────────────────────┐
│  Backend Services                        │
│  - Permission checking (RBAC)           │
│  - Input sanitization                   │
│  - SQL injection prevention (Prisma)    │
│  - Audit logging (all actions)          │
└─────────────┬───────────────────────────┘
              │
┌─────────────┴───────────────────────────┐
│  Database                                │
│  - Encryption at rest (AES-256)         │
│  - Row-level security                   │
│  - Backup 3-2-1 strategy                │
└─────────────────────────────────────────┘
```

### Conformité RGPD (GDPR)

| Exigence | Implémentation |
|----------|----------------|
| **Consentement** | Checkbox lors création compte + signature électronique |
| **Droit d'accès** | Export PDF/JSON de toutes données patient |
| **Droit à l'oubli** | Soft delete + anonymisation après 10 ans |
| **Portabilité** | Export format standardisé (HL7 FHIR) |
| **Notification breach** | Email automatique sous 72h + log ANSM |
| **DPO** | Contact désigné |

### Conformité HIPAA (USA)

| Exigence | Implémentation |
|----------|----------------|
| **Access Control** | RBAC + 2FA pour accès sensibles |
| **Audit Controls** | Logs complets (qui, quoi, quand) |
| **Integrity** | Hash checksum documents + versioning |
| **Transmission Security** | TLS 1.3 + VPN pour accès distant |

### Hébergement Données de Santé (HDS - France)

**Hébergeurs certifiés** :
- OVHcloud (HDS 1 & 2)
- Outscale (Dassault Systèmes)
- AWS France (avec BAA)
- Microsoft Azure France

---

## 📊 Business Model

### Plans Tarifaires

#### 🆓 Plan Gratuit (Médecin Solo)
- **0€/mois**
- 1 praticien
- 50 patients max
- Fonctionnalités de base
- Support email
- Branding Doctic

#### 💼 Plan Pro (Cabinet)
- **79€/mois** (ou 790€/an)
- 3 praticiens inclus
- Patients illimités
- Toutes fonctionnalités
- Support prioritaire
- Sans branding
- Intégrations tierces

#### 🏢 Plan Clinique (Multi-sites)
- **Sur devis**
- Praticiens illimités
- Multi-tenant
- Module IA inclus
- Account manager dédié
- SLA 99.9%
- Formation sur site

### ROI pour les Clients

**Économies** :
- ❌ Plus besoin de logiciels séparés (agenda, facturation, dossiers)
- ❌ Réduction temps administratif (-40%)
- ❌ Diminution erreurs de facturation (-80%)
- ✅ Augmentation taux de remplissage RDV (+25%)

**Exemple concret** :
> Cabinet avec 3 médecins, 15 RDV/jour chacun :
> - Temps gagné : 2h/jour d'administratif = 60h/mois
> - @ 50€/h = **3000€ économisés/mois**
> - Coût Doctic : 79€/mois
> - **ROI : 3,700%**

---

## 🚀 Roadmap Produit

### Q1 2026 - MVP Production
- ✅ Backend API sécurisé
- ✅ Auth JWT + 2FA
- ✅ Modules patients/RDV/facturation
- ✅ Tests E2E complets
- ✅ Certification RGPD

### Q2 2026 - Features Avancées
- 📱 Applications mobiles (iOS/Android)
- 💬 Messagerie patient-médecin
- 📞 Téléconsultation (WebRTC)
- 🔔 Notifications push
- 📧 Campagnes email automatisées

### Q3 2026 - Intelligence Artificielle
- 🤖 Assistant IA conversationnel
- 🩺 Suggestions diagnostiques (IA)
- 📊 Analytics prédictifs
- 🔬 Analyse radiologique (production)

### Q4 2026 - Expansion
- 🌍 Support multi-langues (EN, ES, DE)
- 🏥 Intégration hôpitaux (HL7 FHIR)
- 🔗 API publique pour partenaires
- 📈 Module BI avancé (Tableau/PowerBI)

---

## 🏆 Avantages Concurrentiels

### vs. Doctolib
| Critère | Doctolib | Doctic |
|---------|----------|--------|
| **Prix** | 129€+/mois | 79€/mois |
| **Propriété données** | Centralisé | Client propriétaire |
| **Personnalisation** | Limitée | Totale |
| **IA** | Non | Oui (radiologie) |
| **Open Source** | Non | Possible (licence entreprise) |

### vs. Maiia
| Critère | Maiia | Doctic |
|---------|-------|--------|
| **Focus** | Prise RDV | Gestion complète |
| **Facturation** | Basique | Avancée (TVA auto) |
| **Multi-tenant** | Non | Oui |
| **Conformité** | RGPD | RGPD + HIPAA + HDS |

---

## 📞 Informations de Contact

**Entreprise** : Doctic Medical OS  
**Site Web** : www.doctic.fr *(à créer)*  
**Email** : contact@doctic.fr  
**Support** : support@doctic.fr  
**Sales** : sales@doctic.fr  

**Adresse** :  
Doctic SAS  
123 Rue de la Santé  
75013 Paris, France

**SIRET** : XXX XXX XXX XXXXX *(à obtenir)*  
**TVA Intracommunautaire** : FR XX XXX XXX XXX

---

## 📄 Annexes

### A. Glossaire Médical
- **HIPAA** : Health Insurance Portability and Accountability Act (USA)
- **RGPD** : Règlement Général sur la Protection des Données (EU)
- **HDS** : Hébergement de Données de Santé (France)
- **HL7 FHIR** : Fast Healthcare Interoperability Resources
- **BAA** : Business Associate Agreement

### B. Références Techniques
- [Documentation React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://www.postgresql.org)
- [Prisma ORM](https://www.prisma.io)

### C. Conformité Légale
- [Texte RGPD officiel](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [Guide HIPAA](https://www.hhs.gov/hipaa/index.html)
- [Certification HDS](https://esante.gouv.fr/labels-certifications/hds)

---

**Version** : 1.0  
**Date** : 26 Décembre 2025  
**Auteur** : Équipe Doctic Medical OS  
**Statut** : Prototype RBAC - En développement

---

© 2025 Doctic Medical OS - Tous droits réservés
