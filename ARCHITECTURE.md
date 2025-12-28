# Architecture de Doctic Medical OS

## 📐 Vue d'ensemble

**Doctic Medical OS** est une plateforme complète de gestion de clinique médicale moderne, construite avec React, TypeScript, et Vite. Elle combine un design inspiré de Leonardo.AI avec des fonctionnalités avancées de téléconsultation, streaming vidéo, IA médicale, et gestion multi-tenant.

---

## 🏗️ Structure du Projet

```
doctic-care/
│
├── public/                          # Assets statiques
│   ├── logo.png                     # Logo principal (gorille tech)
│   ├── favicon.png                  # Favicon
│   ├── placeholder.svg
│   └── robots.txt
│
├── prisma/                          # Configuration base de données
│   ├── schema.prisma                # Schéma Prisma
│   └── migrations/                  # Migrations SQL
│       ├── 001_init.sql
│       └── 002_add_prescriptions_teleconsult.sql
│
├── src/                             # Code source
│   ├── main.tsx                     # Point d'entrée React
│   ├── App.tsx                      # Composant racine + routing
│   ├── index.css                    # Styles globaux + thèmes
│   │
│   ├── assets/                      # Images et ressources
│   │   └── hero-medical-bg.jpg
│   │
│   ├── components/                  # Composants réutilisables
│   │   ├── ThemeToggle.tsx         # Bouton dark/light mode
│   │   ├── NavLink.tsx             # Lien de navigation
│   │   │
│   │   ├── dashboard/              # Widgets du dashboard
│   │   │   └── DashboardWidgets.tsx
│   │   │
│   │   ├── layout/                 # Composants de mise en page
│   │   │   ├── AppSidebar.tsx      # Sidebar principale avec navigation
│   │   │   ├── OutlookLayout.tsx   # Layout 3-panes Outlook-style
│   │   │   ├── ListPane.tsx        # Volet liste
│   │   │   └── DetailPane.tsx      # Volet détails
│   │   │
│   │   ├── multi-tenant/           # Composants multi-tenant
│   │   │   ├── TenantCard.tsx
│   │   │   ├── TenantMetrics.tsx
│   │   │   └── NetworkMap.tsx
│   │   │
│   │   ├── saas-billing/           # Composants facturation SaaS
│   │   │   ├── PricingPlans.tsx
│   │   │   ├── SubscriptionCard.tsx
│   │   │   ├── UsageMetrics.tsx
│   │   │   └── BillingHistory.tsx
│   │   │
│   │   └── ui/                     # Composants UI ShadCN
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── input.tsx
│   │       ├── tabs.tsx
│   │       ├── badge.tsx
│   │       ├── textarea.tsx
│   │       └── ... (~50 composants)
│   │
│   ├── pages/                      # Pages de l'application
│   │   ├── Landing.tsx             # Page d'atterrissage publique
│   │   ├── LoginPage.tsx           # Page de connexion
│   │   ├── Dashboard.tsx           # Tableau de bord principal
│   │   │
│   │   ├── Patients.tsx            # ✅ Gestion des patients
│   │   ├── Appointments.tsx        # ✅ Gestion des rendez-vous (FullCalendar)
│   │   ├── MedicalCareSheetPage.tsx # ✅ Feuilles de soins CNSS
│   │   ├── Records.tsx             # Dossiers médicaux
│   │   ├── Prescriptions.tsx       # ✅ Ordonnances avec base médicaments
│   │   ├── Teleconsult.tsx         # ✅ Téléconsultation (Jitsi Meet)
│   │   │
│   │   ├── Products.tsx            # Gestion des produits/pharmacie
│   │   ├── Billing.tsx             # ✅ Facturation patients (avec TVA)
│   │   ├── SaasBilling.tsx         # Facturation SaaS
│   │   │
│   │   ├── Streaming.tsx           # ✅ Streaming & Vidéos éducatives
│   │   ├── SocialPublish.tsx       # Publication réseaux sociaux
│   │   │
│   │   ├── MultiTenantDashboard.tsx # Dashboard multi-tenant
│   │   ├── AIAssistant.tsx         # Assistant IA médical
│   │   ├── Settings.tsx            # Paramètres utilisateur
│   │   └── NotFound.tsx            # Page 404
│   │
│   ├── contexts/                    # Contexts React
│   │   ├── AuthContext.tsx         # Authentification
│   │   └── ModalContext.tsx        # Gestion des modales
│   │
│   ├── hooks/                      # Hooks personnalisés
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── lib/                        # Utilitaires
│   │   └── utils.ts                # Helpers (cn, clsx, etc.)
│   │
│   ├── types/                      # Types TypeScript
│   │   ├── index.ts
│   │   └── medical.ts              # Types médicaux spécifiques
│   │
│   └── data/                       # Données statiques
│       └── mockData.ts
│
├── server.js                        # Serveur backend Node.js (mock API)
├── index.html                       # Template HTML
├── vite.config.ts                  # Configuration Vite
├── tailwind.config.ts              # Configuration Tailwind
├── tsconfig.json                   # Configuration TypeScript
├── package.json                    # Dépendances
├── ARCHITECTURE.md                 # Ce fichier
├── CHANGELOG_V2.md                 # Journal des modifications
└── README.md                       # Documentation

```

---

## 🎨 Architecture des Thèmes

### Design System

Le design system utilise des **CSS Variables** pour supporter le mode sombre et clair :

#### Mode Sombre (par défaut)
```css
:root {
  --background: 240 10% 3.9%;        /* Noir profond */
  --foreground: 0 0% 98%;            /* Blanc cassé */
  --primary: 290 91% 65%;            /* Violet/Magenta */
  --accent: 330 81% 60%;             /* Rose */
  --sidebar-background: 240 10% 2% / 0.7; /* Glass effect */
}
```

#### Mode Clair
```css
.light {
  --background: 0 0% 100%;           /* Blanc pur */
  --foreground: 240 10% 3.9%;        /* Noir */
  --primary: 290 91% 55%;            /* Violet ajusté */
  --accent: 330 81% 50%;             /* Rose ajusté */
}
```

### Effets Visuels

1. **Glassmorphism** : `backdrop-blur-2xl` sur la sidebar
2. **Gradients** : Cartes avec dégradés animés
3. **Animations** : 
   - `fade-in`, `fade-up`, `fade-down`
   - `slide-up`, `slide-in`
   - `glow-pulse`, `shimmer`
   - `spin` (loaders)

---

## 🔌 Stack Technique

### Frontend
- **React 18.3** - Framework UI
- **TypeScript 5.8** - Typage statique
- **Vite 5.4** - Build tool ultra-rapide HMR
- **React Router 6.30** - Routing SPA

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS
- **ShadCN/UI** - Composants UI modernes accessibles
- **next-themes** - Gestion des thèmes dark/light

### State Management
- **React Query (TanStack)** - Data fetching et cache
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

### Backend (Mock)
- **Node.js + Express** - Serveur API REST mock
- **CORS** - Cross-Origin Resource Sharing
- **JSON** - Format de données

### Base de Données
- **Prisma** - ORM pour PostgreSQL/MySQL
- **PostgreSQL** - Base de données relationnelle (recommandé)

### Intégrations Tierces
- **FullCalendar.io** - Calendrier des rendez-vous
- **Jitsi Meet** - Téléconsultation vidéo
- **MediaRecorder API** - Enregistrement vidéo natif
- **getUserMedia API** - Accès caméra/micro

### Utilitaires
- **Lucide React** - Icons (500+ icônes)
- **date-fns** - Manipulation de dates
- **clsx / tailwind-merge** - Gestion de classes CSS
- **sonner** - Toast notifications élégantes

---

## 🧩 Architecture des Composants

### Layout Pattern : Outlook-Style

L'application utilise un layout inspiré d'Outlook avec 3 volets configurables :

```
┌──────────┬────────────┬──────────────────┐
│  Sidebar │ List Pane  │   Detail Pane    │
│  (固定)   │ (配置-可选) │  (配置-可选)      │
│          │            │                  │
│  - Logo  │ - Search   │  - Header        │
│  - Nav   │ - Filters  │  - Content       │
│  - Items │ - List     │  - Actions       │
│  - Theme │ - Items    │  - Forms         │
│          │            │                  │
└──────────┴────────────┴──────────────────┘
```

**Composants clés** :
- `OutlookLayout` : Container principal avec 3 modes
  - `listPane + detailPane` : Mode 2 colonnes
  - `singlePane` : Mode pleine page
- `AppSidebar` : Navigation globale + logo + theme toggle
- Pages : Consomment OutlookLayout selon leurs besoins

### Pattern de Routage

```typescript
// App.tsx - Routes principales
<BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/landing" element={<Landing />} />
    <Route path="/login" element={<LoginPage />} />
    
    {/* Protected */}
    <Route path="/" element={<Dashboard />} />
    <Route path="/patients" element={<Patients />} />
    <Route path="/appointments" element={<Appointments />} />
    <Route path="/medical-care-sheet" element={<MedicalCareSheetPage />} />
    <Route path="/prescriptions" element={<Prescriptions />} />
    <Route path="/teleconsult" element={<Teleconsult />} />
    <Route path="/billing" element={<Billing />} />
    <Route path="/streaming" element={<Streaming />} />
    {/* ... */}
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Pattern de Theming

```typescript
// App.tsx - Provider wrapping
<ThemeProvider attribute="class" defaultTheme="dark">
  <AuthProvider>
    <ModalProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* App content */}
        </TooltipProvider>
      </QueryClientProvider>
    </ModalProvider>
  </AuthProvider>
</ThemeProvider>
```

---

## 📦 Modules Fonctionnels Détaillés

### 1. 🏠 Dashboard
**Fichier** : `src/pages/Dashboard.tsx`

**Fonctionnalités** :
- Statistiques en temps réel (patients, RDV, revenus)
- Agenda du jour avec RDV à venir
- Activité récente (derniers patients)
- Gradient hero section avec animations
- Raccourcis rapides vers modules

**State** : Local (useState)

---

### 2. 👥 Gestion des Patients
**Fichier** : `src/pages/Patients.tsx`

**Fonctionnalités** :
- ✅ Liste des patients avec recherche en temps réel
- ✅ Détails du patient (profil, coordonnées, historique)
- ✅ Création/édition de fiches patients via modal
- ✅ CRUD complet avec API backend
- ✅ Layout Outlook (liste gauche + détails droite)

**API Endpoints** :
- `GET /api/patients` - Liste
- `POST /api/patients` - Créer
- `PUT /api/patients/:id` - Modifier
- `DELETE /api/patients/:id` - Supprimer

---

### 3. 📅 Rendez-vous
**Fichier** : `src/pages/Appointments.tsx`

**Fonctionnalités** :
- ✅ Calendrier FullCalendar (Mois/Semaine/Jour)
- ✅ Vue Liste alternative avec filtre
- ✅ Tabs pour basculer Liste ↔ Calendrier
- ✅ Création RDV avec modal
- ✅ Statuts colorés (confirmé, en_attente, urgent, annulé)
- ✅ Clic sur date → pré-remplissage modal
- ✅ Intégration backend complète

**Technologies** :
- FullCalendar plugins : dayGrid, timeGrid, interaction
- Locale française (frLocale)

**API Endpoints** :
- `GET /api/appointments`
- `POST /api/appointments`
- `PUT /api/appointments/:id`
- `DELETE /api/appointments/:id`

---

### 4. 📋 Feuilles de Soins
**Fichier** : `src/pages/MedicalCareSheetPage.tsx`

**Fonctionnalités** :
- ✅ Formulaire inspiré feuilles CNSS/AMO
- ✅ Sections : I. Actes Médicaux, II. Examens, III. Actes Courants
- ✅ Zone notes et résumé
- ✅ Impression PDF (window.print + CSS @media print)
- ✅ Envoi par email (mailto:)
- ✅ Sauvegarde backend

---

### 5. 💊 Ordonnances (Prescriptions)
**Fichier** : `src/pages/Prescriptions.tsx`

**Fonctionnalités** :
- ✅ Liste des ordonnances avec recherche
- ✅ Ajout dynamique de lignes de médicaments
- ✅ Base médicaments mock (autocomplete via datalist)
  - Paracétamol, Doliprane, Amoxicilline, etc.
- ✅ Champs : Nom, Dosage, Fréquence, Durée, Quantité
- ✅ Statuts : active, dispensée, expirée
- ✅ Impression et envoi email

**API Endpoints** :
- `GET /api/prescriptions`
- `POST /api/prescriptions`

---

### 6. 🎥 Téléconsultation
**Fichier** : `src/pages/Teleconsult.tsx`

**Fonctionnalités** :
- ✅ Liste des sessions (prévue, en_cours, terminée)
- ✅ Démarrage vidéo via Jitsi Meet (window.open)
- ✅ Génération de liens salle unique
- ✅ Modal de planification
- ✅ Layout Outlook (liste + détails)

**Intégration** :
- Jitsi Meet (https://meet.jit.si/Doctic-{patient}-{id})
- Sécurisé, chiffré de bout en bout, open-source

**API Endpoints** :
- `GET /api/teleconsult`
- `POST /api/teleconsult`

---

### 7. 💶 Facturation Patients
**Fichier** : `src/pages/Billing.tsx`

**Fonctionnalités** :
- ✅ Liste des factures avec recherche
- ✅ Création de factures avec lignes multiples
- ✅ Calcul automatique : Sous-total HT, TVA %, Total TTC
- ✅ Statuts : payée, en_attente, retard, brouillon
- ✅ Zone signature électronique (simulation)
- ✅ Impression et email
- ✅ CRUD complet

**Calculs** :
```typescript
subtotal = sum(items.map(i => i.qty * i.price))
taxAmount = subtotal * (taxRate / 100)
total = subtotal + taxAmount
```

**API Endpoints** :
- `GET /api/billing`
- `POST /api/billing`
- `PUT /api/billing/:id`
- `DELETE /api/billing/:id`

---

### 8. 🎬 Streaming & Vidéos Éducatives
**Fichier** : `src/pages/Streaming.tsx`

**Fonctionnalités** :
- ✅ Enregistrement vidéo via `getUserMedia` + `MediaRecorder`
- ✅ Aperçu en direct de la caméra
- ✅ Sauvegarde locale (Blob → ObjectURL)
- ✅ Téléchargement vidéo (.webm)
- ✅ Publication multi-plateformes :
  - YouTube, TikTok, Instagram, Facebook
  - X (Twitter), LinkedIn, Pinterest, Threads
- ✅ Modal avec sélection visuelle des plateformes
- ✅ Grille responsive des vidéos

**Technologies** :
- MediaRecorder API (navigateur natif)
- getUserMedia (accès caméra/micro)
- Blob URL pour preview

**API Endpoints** :
- `GET /api/streaming` - Liste vidéos
- `POST /api/streaming` - Upload nouvelle vidéo

---

### 9. 🏢 Multi-Tenant Dashboard
**Fichier** : `src/pages/MultiTenantDashboard.tsx`

**Fonctionnalités** :
- Gestion de plusieurs cliniques/tenants
- Métriques par tenant (patients, revenus)
- Carte du réseau
- Switch entre tenants

---

### 10. 🤖 Assistant IA Médical
**Fichier** : `src/pages/AIAssistant.tsx`

**Fonctionnalités** :
- Chat avec IA médicale
- Suggestions de diagnostics
- Recherche dans la base de connaissances
- Historique des conversations

---

### 11. 💳 Facturation SaaS
**Fichier** : `src/pages/SaasBilling.tsx`

**Fonctionnalités** :
- Plans tarifaires (Starter, Pro, Enterprise)
- Gestion des abonnements
- Métriques d'utilisation
- Historique de facturation

---

### 12. 🗂️ Dossiers Médicaux
**Fichier** : `src/pages/Records.tsx`

**Fonctionnalités** :
- Historique médical complet
- Documents attachés (radios, analyses)
- Notes de consultation
- Timeline des événements

---

## 🔐 Patterns de Sécurité

### Type Safety
- ✅ 100% TypeScript
- ✅ Interfaces définies (`src/types/`)
- ✅ Validation avec Zod pour formulaires
- ✅ Typage strict activé (`tsconfig.json`)

### Authentication
- AuthContext pour gestion session
- Routes protégées (à implémenter)
- JWT tokens (à implémenter)

### API Security
- CORS configuré sur backend
- Sanitization des inputs
- Rate limiting (à implémenter)

---

## 🚀 Performance

### Optimisations Actuelles
1. ✅ **Vite HMR** : Hot Module Replacement ultra-rapide
2. ✅ **Tree Shaking** : Vite supprime le code mort
3. ✅ **CSS Purging** : Tailwind ne garde que le CSS utilisé
4. ✅ **Image Optimization** : PNG optimisés pour logo/favicon
5. ✅ **React Query Cache** : Mise en cache des requêtes API

### Optimisations Futures
- [ ] Code Splitting avec React.lazy()
- [ ] Service Worker pour PWA
- [ ] Image lazy loading
- [ ] Virtual scrolling pour grandes listes

### Build
```bash
npm run dev        # Dev server (port 3001)
npm run build      # Production build
npm run preview    # Preview du build
```

---

## 🔄 Flux de Données

### Architecture API

```
User Action (UI)
    ↓
Component Event Handler
    ↓
API Call (fetch)
    ↓
Backend Mock Server (server.js:5000)
    ↓
JSON Response
    ↓
State Update (useState/React Query)
    ↓
UI Re-render
```

### Exemple Concret : Création Patient

```typescript
// 1. User clicks "Créer Patient" button
<Button onClick={handleCreatePatient}>Créer</Button>

// 2. Event handler
const handleCreatePatient = async () => {
  const response = await fetch('http://localhost:5000/api/patients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  // 3. Update local state
  const newPatient = await response.json();
  setPatients(prev => [...prev, newPatient]);
  
  // 4. React re-renders list
};
```

---

## 📱 Responsive Design

### Breakpoints Tailwind
```css
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
2xl: 1536px  /* Extra large */
```

### Stratégies
- ✅ **Mobile First** : Classes de base pour mobile
- ✅ **Sidebar** : Collapse sur mobile (`collapsed` state)
- ✅ **Grid Layout** : `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- ✅ **Touch Friendly** : Boutons min 44px
- ✅ **Overflow** : Scroll sur small screens

---

## 🎯 Backend API (Mock)

### Serveur Node.js
**Fichier** : `server.js`

**Port** : 5000

**Endpoints Implémentés** :

```javascript
// Patients
GET    /api/patients           // Liste
POST   /api/patients           // Créer
PUT    /api/patients/:id       // Modifier
DELETE /api/patients/:id       // Supprimer

// Rendez-vous
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id

// Ordonnances
GET    /api/prescriptions
POST   /api/prescriptions

// Téléconsultation
GET    /api/teleconsult
POST   /api/teleconsult

// Facturation
GET    /api/billing
POST   /api/billing
PUT    /api/billing/:id
DELETE /api/billing/:id

// Streaming
GET    /api/streaming
POST   /api/streaming
```

### Démarrage Backend
```bash
node server.js
# Server listening on http://localhost:5000
```

---

## 📊 Base de Données (Prisma)

### Schema
**Fichier** : `prisma/schema.prisma`

**Tables principales** :
- `User` - Utilisateurs du système
- `Patient` - Patients de la clinique
- `Appointment` - Rendez-vous
- `Prescription` - Ordonnances
- `MedicalRecord` - Dossiers médicaux
- `Invoice` - Factures
- `TeleconsultSession` - Sessions téléconsultation

### Migrations
```bash
npx prisma migrate dev      # Créer migration
npx prisma generate         # Générer client
npx prisma studio           # UI admin
```

---

## 🎬 Déploiement

### Frontend (Recommandé : Vercel)
```bash
npm run build              # Build production
# Upload dist/ vers Vercel
```

### Backend (Recommandé : Railway/Render)
```bash
# Push server.js + package.json
# Configure PORT env variable
```

### Base de Données (Recommandé : Supabase)
- PostgreSQL hébergé
- Auto-backup
- API REST auto-générée

---

## 🧪 Tests (À Implémenter)

### Unit Tests
```bash
npm install -D vitest @testing-library/react
npm run test
```

### E2E Tests
```bash
npm install -D @playwright/test
npx playwright test
```

---

## 📞 Contact & Support

**Projet** : Doctic Medical OS  
**Version** : 2.0.0  
**Port Frontend** : 3001  
**Port Backend** : 5000  
**Commandes** :
```bash
npm run dev       # Frontend (Vite)
node server.js    # Backend (Express)
```

---

## 📄 Licence

Ce projet est privé et confidentiel.

---

## 📚 Documentation Complémentaire

- **CHANGELOG_V2.md** : Historique des modifications
- **README.md** : Guide de démarrage rapide
- **package.json** : Liste des dépendances
- **Composants Shadcn** : https://ui.shadcn.com/
- **FullCalendar Docs** : https://fullcalendar.io/docs
- **Jitsi Meet API** : https://jitsi.github.io/handbook/

---

*Dernière mise à jour : 27 Décembre 2024*
