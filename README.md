# 🏥 Doctic Medical OS

## Système de Gestion Médicale Intelligent avec IA

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/doctic/doctic-care)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-5.8.3-blue.svg)](https://www.typescriptlang.org/)

**Doctic Medical OS** est une plateforme médicale moderne tout-en-un qui combine gestion de clinique, téléconsultation et intelligence artificielle pour révolutionner les soins de santé.

---

## ✨ Fonctionnalités

### 🩺 Modules Médicaux Core
- **📋 Gestion des Patients** - Dossiers médicaux complets avec historique
- **📅 Calendrier & RDV** - Planification intelligente avec rappels automatiques
- **💊 Ordonnances** - Création, impression, envoi email avec base médicaments intégrée
- **💰 Facturation** - Facturation automatique avec TVA, export comptable
- **📊 Analytics** - Dashboard temps réel avec KPIs et graphiques

### 🎥 Téléconsultation (NOUVEAU V2)
- **Vidéo HD WebRTC** - Intégration Daily.co HIPAA-compliant
- **Chat temps réel** - Messages durant consultation
- **Partage d'écran** - Montrer résultats examens
- **Enregistrement cloud** - Archivage sécurisé (avec consent)
- **Transcription auto** - Notes automatiques Speech-to-Text

### 🤖 Intelligence Artificielle
- **Analyse radiologique** - Détection anomalies (prototype)
- **Suggestions diagnostiques** - Assistant IA médical
- **Interactions médicamenteuses** - Alerte automatique

### 🔐 Sécurité & Conformité
- **RBAC** - Role-Based Access Control granulaire
- **RGPD/HIPAA** - Conformité réglementaire
- **Audit logs** - Traçabilité complète
- **Chiffrement E2E** - AES-256 pour données sensibles

---

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** ≥ 18.0.0
- **PostgreSQL** ≥ 14.x
- **Redis** ≥ 6.x (optionnel mais recommandé)

### Installation

```bash
# 1. Cloner le projet
git clone https://github.com/doctic/doctic-care.git
cd doctic-care

# 2. Installer les dépendances
npm install

# 3. Configuration
cp .env.example .env
# Éditer .env avec vos valeurs

# 4. Base de données
psql -U postgres -c "CREATE DATABASE doctic_db;"
npm run migrate

# 5. Démarrer
npm run dev
```

L'application sera accessible sur **http://localhost:3001**

📖 **Guide complet** : [INSTALLATION.md](INSTALLATION.md)

---

## 📐 Architecture

```
doctic-care/
├── src/
│   ├── components/         # Composants UI réutilisables
│   │   ├── ui/            # ShadCN/UI components
│   │   ├── layout/        # Sidebar, Layout
│   │   └── dashboard/     # Widgets dashboard
│   ├── pages/             # Pages principales
│   ├── types/             # Types TypeScript
│   │   └── medical.ts     # Types médicaux (V2)
│   └── contexts/          # React Contexts (Auth, Modal)
├── prisma/
│   ├── schema.prisma      # Schéma base de données
│   └── migrations/        # Migrations SQL
│       ├── 001_initial_setup.sql
│       └── 002_add_prescriptions_teleconsult.sql
├── docs/
│   ├── ARCHITECTURE.md           # Architecture système
│   ├── ANALYSIS_RBAC_SYSTEM.md  # Analyse sécurité
│   ├── CHANGELOG_V2.md          # Nouveautés V2
│   └── PRESENTATION_PROFESSIONNELLE.md
└── public/
    └── logo.png           # Logo Doctic
```

---

## 🛠️ Stack Technique

### Frontend
- **React 18.3** + **TypeScript 5.8**
- **Vite 5.4** - Build ultra-rapide
- **Tailwind CSS 3.4** - Styling moderne
- **ShadCN/UI** - Composants premium
- **React Query** - Data fetching & cache

### Backend (à développer)
- **Node.js** + **NestJS** (recommandé)
- **PostgreSQL** + **Prisma ORM**
- **Redis** - Cache & sessions
- **JWT** - Authentication

### Services Externes
- **Daily.co** - Téléconsultation WebRTC
- **SendGrid/SMTP** - Emails
- **AWS S3** - Stockage fichiers
- **Stripe** - Paiements

---

## 📊 Modules Disponibles

| Module | Version | Status | Permission |
|--------|---------|--------|------------|
| Dashboard Analytics | 1.0 | ✅ Stable | `analytics:view` |
| Gestion Patients | 1.0 | ✅ Stable | `patients:view` |
| Calendrier RDV | 1.0 | ✅ Stable | `appointments:view` |
| Facturation | 1.0 | ✅ Stable | `billing:view` |
| **Ordonnances** | **2.0** | **🆕 Nouveau** | `prescriptions:create` |
| **Téléconsultation** | **2.0** | **🆕 Nouveau** | `teleconsult:start` |
| IA Radiologie | 1.0 | ⚠️ Prototype | `ai:radiology` |
| Messagerie | - | 🚧 En cours | - |

---

## 👥 Rôles & Permissions

### Hiérarchie

```
Super Admin → Admin → Doctor → Assistant → Patient
```

### Matrice Permissions (Exemples)

| Action | Patient | Assistant | Doctor | Admin |
|--------|---------|-----------|--------|-------|
| Voir patients | ❌ | ✅ | ✅ | ✅ |
| Créer ordonnance | ❌ | ❌ | ✅ | ✅ |
| Démarrer téléconsult | ✅ (soi) | ❌ | ✅ | ✅ |
| Modifier facturation | ❌ | ❌ | ❌ | ✅ |
| Analytics export | ❌ | ❌ | ❌ | ✅ |

📖 **Détails complets** : [ANALYSIS_RBAC_SYSTEM.md](ANALYSIS_RBAC_SYSTEM.md)

---

## 🔧 Scripts NPM

```bash
# Développement
npm run dev           # Démarrer dev server (port 3001)

# Build
npm run build         # Build production
npm run build:dev     # Build mode développement
npm run preview       # Preview du build

# Qualité
npm run lint          # Linter ESLint
npm run type-check    # Vérification TypeScript

# Base de données
npm run migrate       # Exécuter migrations
npm run seed          # Données de démonstration
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [INSTALLATION.md](INSTALLATION.md) | Guide installation complet |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Architecture système |
| [CHANGELOG_V2.md](CHANGELOG_V2.md) | Nouveautés Version 2.0 |
| [ANALYSIS_RBAC_SYSTEM.md](ANALYSIS_RBAC_SYSTEM.md) | Analyse sécurité |
| [PRESENTATION_PROFESSIONNELLE.md](PRESENTATION_PROFESSIONNELLE.md) | Business case |

---

## 🐛 Problèmes Connus & Support

### Issues GitHub
https://github.com/doctic/doctic-care/issues

### Support
- **Email** : support@doctic.fr
- **Documentation** : https://docs.doctic.fr
- **Discord** : https://discord.gg/doctic

---

## 🚀 Roadmap

### Q1 2026
- ✅ Backend API complet
- ✅ Tests E2E (Playwright)
- ✅ CI/CD Pipeline
- ✅ Apps mobiles (React Native)

### Q2 2026
- 📱 Application iOS/Android
- 💬 Messagerie patient-médecin
- 🔔 Notifications push
- 📧 Campagnes email automatisées

### Q3 2026
- 🤖 Assistant IA conversationnel
- 🔬 Analyse IA radiologie (production)
- 📊 Analytics prédictifs

### Q4 2026
- 🌍 Multi-langues (EN, ES, DE)
- 🏥 Intégration hôpitaux (HL7 FHIR)
- 📈 Module BI avancé

---

## 🤝 Contribuer

Les contributions sont les bienvenues !

1. **Fork** le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

📖 [Guide de contribution](CONTRIBUTING.md)

---

## ⚖️ Conformité Légale

- ✅ **RGPD** (EU) - Conforme
- ✅ **HIPAA** (USA) - En cours certification
- ✅ **HDS** (France) - Hébergement données de santé
- ⚠️ **FDA/ANSM** - Module IA non certifié (prototype uniquement)

**Disclaimers** :
- Le module IA radiologie est un **prototype de démonstration**
- **Ne pas utiliser pour diagnostics réels**
- Validation par professionnel de santé **obligatoire**

---

## 📜 Licence

Ce projet est sous licence **MIT** - voir [LICENSE](LICENSE) pour détails.

---

## 👨‍💻 Équipe

**Lead Developer** : [@beniich](https://github.com/beniich)  
**Contributors** : [Liste des contributeurs](https://github.com/doctic/doctic-care/graphs/contributors)

---

## 🙏 Remerciements

- [ShadCN/UI](https://ui.shadcn.com/) - Composants UI
- [Daily.co](https://daily.co) - Téléconsultation WebRTC
- [Lucide](https://lucide.dev/) - Icons
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS

---

<div align="center">

**Fait avec ❤️ pour améliorer les soins de santé**

[Site Web](https://doctic.fr) • [Documentation](https://docs.doctic.fr) • [Blog](https://blog.doctic.fr)

</div>
