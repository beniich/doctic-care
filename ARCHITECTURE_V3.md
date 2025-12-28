# ARCHITECTURE V3 - Doctic Pro : L'OS Médical Moderne

## Vision Globale

**Objectif** : Une plateforme tout-en-un pour le cabinet médical privé, 100% web, sécurisée, intuitive, avec IA intégrée et outils de communication/contenu.

**Positionnement** :
- Pour les **médecins indépendants** ou petits cabinets
- Patients gratuits (accès à leur dossier et téléconsultation)
- Médecins payants (3 plans : Silver, Master, Gold)

---

## Architecture Technique (Modulaire & Réutilisable)

```
src/
├── app/                          # Routing principal (React Router)
│   ├── layout/                   # Layouts réutilisables
│   │   ├── AuthLayout.tsx        # Login / Pricing
│   │   ├── DoctorLayout.tsx      # Sidebar + Header pour médecins
│   │   └── PatientLayout.tsx     # Version simplifiée pour patients
│   └── routes/                   # Pages protégées
│       ├── dashboard/
│       ├── patients/
│       ├── appointments/
│       ├── records/
│       ├── billing/
│       ├── prescriptions/
│       ├── teleconsult/
│       ├── streaming/
│       └── archives/
│
├── components/                   # Composants UI réutilisables
│   ├── ui/                       # Shadcn/UI customisés (Button, Card, Input, Modal, Table, Badge...)
│   ├── layout/                   # Header, Sidebar, Footer
│   ├── forms/                    # Formulaires réutilisables (PatientForm, InvoiceForm...)
│   ├── tables/                   # DataTable générique avec recherche/tri/pagination
│   ├── modals/                   # ModalProvider + modals spécifiques
│   └── common/                   # Badge, Status, AvatarWithName, etc.
│
├── contexts/                     # Contextes globaux
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx          # Dark/Light mode
│   └── LivePulseContext.tsx      # Si conservé
│
├── hooks/                        # Hooks personnalisés
│   ├── usePatients.ts
│   ├── useAppointments.ts
│   ├── useRecords.ts
│   ├── useBilling.ts
│   └── useQueryWrapper.ts        # Pour React Query
│
├── lib/                          # Utils
│   ├── api.ts                    # Client Axios avec interceptors (auth, errors)
│   └── utils.ts                  # Format date, currency, etc.
│
├── types/                        # Types TypeScript globaux
│   └── index.ts
│
├── assets/                       # Images, icons
└── pages/                        # Pages publiques (Login, Pricing, Landing)
```

---

## Fonctionnalités Clés (Toutes fonctionnelles)

### 1. **Authentification**
- Login email/mot de passe + Google
- Rôles : Médecin / Patient / Admin
- Patients : gratuit, accès limité (dossier, RDV, téléconsult)

### 2. **Tableau de bord médecin**
- KPI animés (patients, RDV, revenus, satisfaction)
- Graphiques (Recharts)
- Activité récente

### 3. **Gestion Patients** (détaillée)
- Liste searchable + filtres
- Fiche patient complète (infos, historique, allergies, médicaments)
- Édition, impression, archivage, envoi message

### 4. **Rendez-vous**
- Liste jour + vue calendrier (à venir FullCalendar)
- Création/édition/modal
- Boutons Reschedule / Start Visit (téléconsult)

### 5. **Dossiers Médicaux**
- Inspiré CNSS : sections Actes médicaux, Examens, Actes courants, Dentaire, Optique
- Résumé + pièces jointes
- Boutons : View Full, Add Note, Share with Patient, Export/Print

### 6. **Facturation**
- Liste factures (paid/sent/overdue/draft)
- Création/édition complète (items éditables, calcul auto TTC avec TVA)
- Signature électronique (react-signature-canvas)
- Impression PDF (react-to-print)
- Envoi email (modal avec destinataire)

### 7. **Ordonnances**
- Liste par patient
- Création avec recherche médicament (base mock ou API future)
- Impression / Envoi patient

### 8. **Téléconsultation**
- Liste sessions
- Bouton "Démarrer" → ouvre fenêtre vidéo (simulation ou intégration Jitsi/Whereby)

### 9. **Streaming & Contenu**
- Enregistrement vidéo (getUserMedia)
- Publication multi-plateformes (YouTube, TikTok, Instagram, Facebook, X, LinkedIn, etc.)
- Gestion vidéos (brouillon/publié)

### 10. **Archives**
- Éléments archivés (patients, factures, dossiers)
- Restauration / Suppression définitive

### 11. **Abonnements**
- Page Pricing publique
- 3 plans : Silver 23€/mois, Master 79€/mois (recommandé), Gold 120€/mois
- Intégration Stripe (checkout simulé ou réel)

---

## Design System (Homogène & Professionnel)

### Palette de couleurs
- **Primaire** : Bleu médical #007BFF → #0056b3 (hover)
- **Accent** : Violet #6F42C1 → #5a32a3
- **Succès** : Vert #28A745
- **Fond sombre** : #0f172a → #1e293b (cards)
- **Fond clair** : #f8fafc → #ffffff (cards)

### Effets visuels
- **Glassmorphism** : backdrop-blur-md, opacity 0.9, borders 1px subtils
- **Animations** : Framer Motion (fade-in, slide-up, stagger children)

### Typographie
- **Font** : Inter
- **Headings** : Bold
- **Body** : 14-16px

### Responsive
- Mobile-first
- Sidebar collapsible

---

## Backend (Node.js/Express)

### API REST complète
- CRUD pour tous modules
- Auth JWT mock
- Prêt pour MongoDB/PostgreSQL

### Endpoints
- `/api/patients`
- `/api/appointments`
- `/api/records`
- `/api/billing`
- `/api/prescriptions`
- `/api/teleconsult`
- `/api/streaming`
- `/api/archives`

---

## Roadmap

### Phase 1 : MVP Fonctionnel ✅
- [x] Architecture de base
- [x] Authentification
- [x] Dashboard
- [x] Gestion patients
- [x] Rendez-vous
- [x] Facturation basique
- [x] Ordonnances
- [x] Téléconsultation (mock)

### Phase 2 : Professionnalisation (En cours)
- [ ] **Réorganisation architecture** (dossiers app/, hooks/, lib/)
- [ ] **Types TypeScript** globaux
- [ ] **Client API** avec React Query
- [ ] **Hooks personnalisés** (usePatients, useAppointments, etc.)
- [ ] **DataTable** générique réutilisable
- [ ] **Formulaires** standardisés (PatientForm, InvoiceForm, etc.)

### Phase 3 : Intégrations Réelles
- [ ] Intégration Stripe réelle
- [ ] Upload fichiers (Cloudinary/S3)
- [ ] Téléconsultation réelle (Jitsi Meet)
- [ ] Base médicaments (API Vidal ou mock étendu)
- [ ] Notifications (email/SMS via Twilio)
- [ ] Export PDF réel (pdf-make ou @react-pdf/renderer)

### Phase 4 : Optimisations & Déploiement
- [ ] Tests unitaires (Vitest)
- [ ] Tests E2E (Playwright)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker
- [ ] Déploiement (Vercel + Railway/Render)

---

## Technologies Clés

### Frontend
- **React 18** + TypeScript
- **Vite** (build tool)
- **React Router v6**
- **TanStack Query** (React Query)
- **Framer Motion** (animations)
- **Shadcn/UI** + Tailwind CSS
- **Recharts** (graphiques)
- **React Hook Form** + Zod (validation)

### Backend
- **Node.js** + Express
- **PostgreSQL** (Prisma ORM)
- **JWT** (authentification)
- **Multer** (upload fichiers)

### Services externes (futurs)
- **Stripe** (paiements)
- **Cloudinary** (images)
- **Jitsi Meet** (vidéo)
- **Twilio** (SMS)
- **SendGrid** (emails)

---

## Prochaines Étapes Immédiates

1. ✅ **Créer ARCHITECTURE_V3.md** (ce document)
2. **Réorganiser** la structure des dossiers
3. **Créer** les types TypeScript globaux (`src/types/index.ts`)
4. **Mettre en place** le client API (`src/lib/api.ts`)
5. **Créer** les hooks personnalisés (`src/hooks/`)
6. **Progresser** module par module

---

**Date de création** : 26/12/2024  
**Version** : 3.0  
**Statut** : En développement actif
