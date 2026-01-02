# Doctic Medical OS

<div align="center">

![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Build](https://img.shields.io/badge/build-passing-success.svg)

**Système de Gestion Médicale Intelligent**

Plateforme complète de gestion pour cabinets médicaux avec conformité HIPAA/RGPD

[Documentation](./docs) · [Installation](#-installation) · [Sécurité](#-sécurité) · [Tests](#-tests)

</div>

---

## ✨ Fonctionnalités

### 🏥 Modules Cliniques
- **Gestion Patients** - Dossiers médicaux complets
- **Rendez-vous** - Planification avec FullCalendar
- **Prescriptions V2** - Génération et signature électronique
- **Téléconsultation V2** - Vidéo Daily.co HIPAA-compliant
- **Facturation** - Intégration Stripe + feuilles de soins
- **Dossiers Médicaux** - Historique complet avec attachements

### 🔐 Sécurité & Conformité
- ✅ **HIPAA Compliant**
- ✅ **RGPD/HDS**
- ✅ Authentification Google OAuth 2.0
- ✅ JWT + Refresh Tokens
- ✅ Token Blacklist Redis
- ✅ Rate Limiting
- ✅ Audit Logs (6 ans)
- ✅ Chiffrement AES-256

### 🚀 Performance
- ⚡ Support **1000 utilisateurs** simultanés
- ⚡ Response time **< 1s** (p95)
- ⚡ Clustering multi-core
- ⚡ Cache Redis
- ⚡ Database pooling

### 🎨 Interface
- 🌓 Dark/Light mode
- 📱 Responsive (Mobile/Tablet/Desktop)
- ♿ Accessible (WCAG 2.1)
- 🎨 Glassmorphism design
- ✨ Animations Framer Motion

---

## 🚀 Installation

### Prérequis

- Node.js 18+ ([télécharger](https://nodejs.org))
- PostgreSQL 14+ (optionnel pour dev)
- Redis 7+ (optionnel pour dev)
- Compte Google Cloud (OAuth gratuit)

### Quick Start

```bash
# 1. Cloner le repo
git clone https://github.com/beniich/doctic-care.git
cd doctic-care

# 2. Installer dépendances
npm install

# 3. Configurer environnement
cp .env.example .env
# Éditer .env avec vos clés API

# 4. Lancer en dev
npm run dev      # Frontend (port 3001)
npm start        # Backend (port 5000)
```

Ouvrir http://localhost:3001 🎉

### Configuration Détaillée

Voir [INSTALLATION.md](./docs/INSTALLATION.md)

---

## 📁 Structure Projet

```
doctic-care/
├── src/                      # Frontend React
│   ├── components/          # Composants UI
│   ├── pages/              # Pages principales
│   ├── contexts/           # AuthContext, etc.
│   └── hooks/              # Custom hooks
├── backend/                 # Backend Node.js
│   ├── middleware/         # Validation, cache, auth
│   └── server-cluster.js   # Multi-core production
├── prisma/                 # Database schema
│   └── schema.prisma       # Modèles Prisma
├── tests/                  # Tests
│   ├── load/              # K6 load tests
│   └── auth.test.js       # Jest tests
├── scripts/                # Utilitaires admin
│   ├── admin-utils.sh     # Scripts Linux
│   └── admin-utils.ps1    # Scripts Windows
├── docs/                   # Documentation
│   ├── LOAD-TESTING.md
│   ├── DEPLOYMENT.md
│   └── SECURITY.md
└── config/                 # Configuration
    ├── postgresql.conf
    └── nginx-optimized.conf
```

---

## 🔧 Développement

### Scripts Disponibles

```bash
# Développement
npm run dev              # Frontend Vite
npm start                # Backend

# Tests
npm test                 # Jest unit tests
npm run test:watch       # Jest watch mode
k6 run tests/load/k6-full-scenario.js  # Load tests

# Validation
npm run validate:env     # Vérifier .env
npm run generate:secrets # Générer JWT secrets

# Production
npm run build            # Build frontend
node backend/server-cluster.js  # Production server
```

### Installation K6 (Tests de Charge)

```bash
# Windows
choco install k6

# Mac
brew install k6

# Linux
sudo apt install k6
```

Voir [K6-INSTALLATION.md](./docs/K6-INSTALLATION.md)

---

## 🔒 Sécurité

### Authentification

- **OAuth 2.0** : Google (production)
- **JWT** : Access token (15min) + Refresh token (7j)
- **Token Blacklist** : Révocation Redis
- **RBAC** : Doctor, Admin, Assistant, Patient

### Protection

- ✅ Rate Limiting (5 req/15min auth, 100 req/15min API)
- ✅ Helmet.js (headers sécurisés)
- ✅ CORS strict (whitelist domaines)
- ✅ Validation inputs (Zod)
- ✅ Sanitization XSS
- ✅ HTTPS obligatoire (production)

### Compliance

- ✅ **HIPAA** : Audit logs 6 ans, BAA Daily.co
- ✅ **RGPD** : Consentement, droit oubli, export données
- ✅ **HDS** : Hébergement France/UE

Voir [SECURITY.md](./docs/SECURITY.md)

---

## 📊 Tests & Performance

### Tests Unitaires

```bash
npm test
# Coverage >70% requis
```

### Tests de Charge

```bash
# Smoke test (10 users, 1min)
k6 run --vus 10 --duration 1m tests/load/k6-full-scenario.js

# Full test (1000 users, 28min)
k6 run tests/load/k6-full-scenario.js
```

### Résultats Cibles

| Métrique | Target | Status |
|----------|--------|--------|
| Users simultanés | 1000 | ✅ |
| Response time p95 | < 1s | ✅ |
| Error rate | < 0.1% | ✅ |
| Throughput | 450 req/s | ✅ |

Voir [LOAD-TESTING.md](./docs/LOAD-TESTING.md)

---

## 📦 Déploiement

### Docker (Recommandé)

```bash
# Build
docker-compose build

# Lancer
docker-compose up -d

# Logs
docker-compose logs -f backend
```

### Cloud

- **Render.com** : Guide dans [DEPLOYMENT.md](./DEPLOYMENT.md)
- **AWS/EC2** : Scripts Terraform disponibles
- **Heroku** : `git push heroku main`

---

## 🛠️ Stack Technique

### Frontend
- React 18.3 + TypeScript 5.8
- Vite 5.4
- Tailwind CSS + ShadCN/UI
- Framer Motion
- React Router DOM

### Backend
- Node.js 20+
- Express 4.18
- Prisma ORM (PostgreSQL)
- Passport.js (OAuth)
- JWT + Redis

### Intégrations
- **Vidéo** : Daily.co (HIPAA)
- **Paiement** : Stripe
- **Email** : Nodemailer/SendGrid
- **AI** : OpenAI GPT-4
- **SMS** : Twilio

---

## 📄 License

MIT License - voir [LICENSE](./LICENSE)

---

## 👥 Contribution

Les contributions sont bienvenues ! 

1. Fork le projet
2. Créer branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir Pull Request

Voir [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 🆘 Support

- 📧 Email : support@doctic.fr
- 📚 Documentation : [docs/](./docs)
- 🐛 Issues : [GitHub Issues](https://github.com/beniich/doctic-care/issues)
- 💬 Discord : [Rejoindre](https://discord.gg/doctic)

---

## 🗺️ Roadmap

### V2.2.0 (Q1 2026)
- [ ] 2FA Twilio SMS
- [ ] Biométrie mobile
- [ ] SSO entreprise
- [ ] API publique REST

### V3.0.0 (Q2 2026)
- [ ] IA prescriptions
- [ ] OCR ordonnances
- [ ] Blockchain dossiers
- [ ] Mobile app native

---

## 🙏 Remerciements

- [Daily.co](https://daily.co) - Vidéo HIPAA
- [Stripe](https://stripe.com) - Paiements
- [ShadCN](https://ui.shadcn.com) - Composants UI
- [Grafana K6](https://k6.io) - Load testing

---

<div align="center">

**Fait avec ❤️ pour les professionnels de santé**

[⬆ Retour en haut](#doctic-medical-os)

</div>
