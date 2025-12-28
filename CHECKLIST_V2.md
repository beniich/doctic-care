# ✅ Checklist Implémentation V2.0 - Doctic Medical OS

## 📋 Vue d'Ensemble

Cette checklist accompagne la migration vers **Doctic Medical OS Version 2.0** avec les nouveaux modules :
- 💊 **Ordonnances** (Prescriptions)
- 🎥 **Téléconsultation** (WebRTC)

---

## 📦 Fichiers Créés/Modifiés

### ✅ Documentation

| Fichier | Status | Description |
|---------|--------|-------------|
| `README.md` | ✅ Mis à jour | README principal avec V2 |
| `INSTALLATION.md` | ✅ Créé | Guide installation complet |
| `CHANGELOG_V2.md` | ✅ Créé | Détails nouveaux modules |
| `ANALYSIS_RBAC_SYSTEM.md` | ✅ Créé | Analyse sécurité V1 |
| `PRESENTATION_PROFESSIONNELLE.md` | ✅ Créé | Business case |
| `ARCHITECTURE.md` | ✅ Existant | Architecture V1 (à mettre à jour) |

### ✅ Configuration

| Fichier | Status | Action requise |
|---------|--------|---------------|
| `package.json` | ✅ Mis à jour | Exécuter `npm install` |
| `.env.example` | ✅ Créé | Copier vers `.env` et configurer |
| `vite.config.ts` | ✅ Existant | OK (port 3001) |
| `tailwind.config.ts` | ✅ Existant | OK (thème V2) |

### ✅ Base de Données

| Fichier | Status | Action requise |
|---------|--------|---------------|
| `prisma/migrations/002_add_prescriptions_teleconsult.sql` | ✅ Créé | **Exécuter migration** |
| `prisma/schema.prisma` | ⚠️ À créer | Optionnel (Prisma ORM) |

### ✅ Types TypeScript

| Fichier | Status | Notes |
|---------|--------|-------|
| `src/types/medical.ts` | ✅ Créé | Types ordonnances + téléconsult |
| `src/types/index.ts` | ⚠️ Existant | Vérifier exports |

### ⚠️ Code Modules (à créer)

| Module | Fichier | Status |
|--------|---------|--------|
| Ordonnances | `src/pages/Prescriptions.tsx` | ⚠️ Code fourni dans changelog |
| Téléconsultation | `src/pages/Teleconsult.tsx` | ⚠️ Code fourni dans changelog |
| Sidebar | `src/components/layout/AppSidebar.tsx` | ⚠️ Ajouter liens modules |

---

## 🔧 Étapes d'Installation

### 1. ✅ Installer les Nouvelles Dépendances

```bash
cd "c:\Users\pc gold\Documents\doctic care\doctic-care"
npm install
```

**Nouvelles dépendances installées** :
- `@daily-co/daily-js` - SDK Daily.co
- `jspdf` - Génération PDF
- `nodemailer` - Emails
- `socket.io-client` - WebSocket
- `dompurify` - Sanitization XSS

### 2. ⚠️ Configurer Variables d'Environnement

```bash
# Copier le template
copy .env.example .env

# Éditer le fichier
notepad .env
```

**Variables critiques à configurer** :
```env
# Daily.co (créer compte sur https://daily.co)
VITE_DAILY_API_KEY="votre-api-key-ici"
DAILY_DOMAIN="votre-domaine.daily.co"

# Email
SMTP_HOST="smtp.gmail.com"
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-app"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/doctic_db"
```

### 3. ⚠️ Créer et Migrer la Base de Données

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base
CREATE DATABASE doctic_db;
CREATE USER doctic_user WITH ENCRYPTED PASSWORD 'doctic_password';
GRANT ALL PRIVILEGES ON DATABASE doctic_db TO doctic_user;
\q

# Exécuter migration V2
psql -U doctic_user -d doctic_db -f "prisma/migrations/002_add_prescriptions_teleconsult.sql"

# Vérifier les tables
psql -U doctic_user -d doctic_db -c "\dt"
```

**Tables attendues** :
- ✅ `prescriptions`
- ✅ `prescription_items`
- ✅ `prescription_audit`
- ✅ `medications`
- ✅ `teleconsult_sessions`
- ✅ `teleconsult_participants`
- ✅ `teleconsult_messages`
- ✅ `teleconsult_documents`

### 4. ⚠️ Créer les Composants Manquants

**Fichiers à créer manuellement** (code fourni dans `CHANGELOG_V2.md`) :

```bash
# Créer les dossiers
mkdir -p src/pages/prescriptions
mkdir -p src/pages/teleconsult

# Copier le code depuis CHANGELOG_V2.md vers :
# - src/pages/Prescriptions.tsx
# - src/pages/Teleconsult.tsx
```

### 5. ⚠️ Mettre à Jour le Routage

**Éditer `src/App.tsx`** pour ajouter les routes :

```typescript
import Prescriptions from './pages/Prescriptions';
import Teleconsult from './pages/Teleconsult';

// Dans <Routes>
<Route path="/prescriptions" element={<Prescriptions />} />
<Route path="/teleconsult" element={<Teleconsult />} />
```

### 6. ⚠️ Mettre à Jour la Sidebar

**Éditer `src/components/layout/AppSidebar.tsx`** :

```typescript
// Ajouter dans navigationByRole[ROLES.DOCTOR]
{ icon: Pill, label: 'Ordonnances', view: 'prescriptions', permission: 'prescriptions:view' },
{ icon: Video, label: 'Téléconsultation', view: 'teleconsult', permission: 'teleconsult:view' },
```

### 7. ✅ Démarrer l'Application

```bash
npm run dev
```

Ouvrir http://localhost:3001

---

## 🧪 Tests de Validation

### Frontend

- [ ] Application démarre sans erreurs
- [ ] Connexion en tant que Médecin fonctionne
- [ ] Module "Ordonnances" accessible
- [ ] Module "Téléconsultation" accessible
- [ ] Modal nouvelle ordonnance s'ouvre
- [ ] Modal nouvelle téléconsult s'ouvre

### Base de Données

```sql
-- Vérifier tables
SELECT COUNT(*) FROM prescriptions;  -- Devrait retourner 0 (vide initialement)
SELECT COUNT(*) FROM medications;   -- Devrait retourner 5 (seed data)

-- Tester numérotation auto
INSERT INTO prescriptions (patient_id, doctor_id) VALUES (1, 1);
SELECT prescription_number FROM prescriptions;  -- Devrait retourner ORD-2025-00001
```

### Services Externes

```bash
# Tester Daily.co API
curl -H "Authorization: Bearer VOTRE_DAILY_API_KEY" https://api.daily.co/v1/

# Tester SMTP
node -e "
const nodemailer = require('nodemailer');
const t = nodemailer.createTransport({host:'smtp.gmail.com',port:587,auth:{user:'EMAIL',pass:'PASS'}});
t.verify().then(() => console.log('✅ SMTP OK')).catch(console.error);
"
```

---

## ⚠️ Actions Requises Avant Production

### Sécurité

- [ ] Changer tous les secrets dans `.env`
- [ ] Générer vrais JWT secrets (`openssl rand -base64 32`)
- [ ] Activer HTTPS (certificat SSL)
- [ ] Configurer CORS strictement
- [ ] Activer rate limiting
- [ ] Implémenter 2FA pour médecins/admins

### Backend API

- [ ] Créer dossier `/backend`
- [ ] Implémenter endpoints REST/GraphQL
- [ ] Validation Zod sur tous les inputs
- [ ] Middleware CSRF protection
- [ ] Audit logging complet

### Tests

- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Playwright)
- [ ] Tests d'intégration API
- [ ] Load testing (K6)

### Compliance

- [ ] Audit sécurité complet
- [ ] Revue RGPD avec DPO
- [ ] Contrat BAA avec Daily.co
- [ ] Certification HDS hébergeur
- [ ] Mentions légales + CGU

### Monitoring

- [ ] Configurer Sentry
- [ ] Configurer Datadog/Grafana
- [ ] Alertes critiques (Slack/PagerDuty)
- [ ] Uptime monitoring

---

## 📊 Métriques de Succès

### Post-Installation

- [ ] 0 erreurs console
- [ ] Build passe sans warnings
- [ ] Toutes routes accessibles
- [ ] Lighthouse score > 90

### Production

- [ ] Uptime > 99.9%
- [ ] Response time < 200ms (p95)
- [ ] 0 incidents sécurité
- [ ] Satisfaction utilisateurs > 4.5/5

---

## 🐛 Troubleshooting Commun

### Problème : `npm install` échoue

**Solution** :
```bash
# Nettoyer cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problème : Migration SQL échoue

**Solution** :
```bash
# Vérifier que PostgreSQL tourne
pg_isready

# Vérifier permissions
psql -U postgres -c "GRANT ALL ON DATABASE doctic_db TO doctic_user;"

# Réexécuter migration
psql -U doctic_user -d doctic_db -f prisma/migrations/002_*.sql
```

### Problème : Daily.co "Unauthorized"

**Solution** :
1. Vérifier API key dans `.env`
2. Créer compte sur https://daily.co
3. Récupérer API key dans Dashboard → Developers

### Problème : Emails non envoyés

**Solution Gmail** :
1. Activer "Accès application moins sécurisée" OU
2. Générer "Mot de passe application" sur https://myaccount.google.com/security

---

## 📞 Support

**Bloqué ?** Contactez l'équipe :
- **GitHub Issues** : https://github.com/doctic/doctic-care/issues
- **Email** : support@doctic.fr
- **Discord** : https://discord.gg/doctic

---

## ✅ Validation Finale

Une fois TOUTES les étapes complétées :

```bash
# Build de production
npm run build

# Vérifier pas d'erreurs
npm run preview

# Tests
npm run lint
npm run type-check
```

Si tout passe ✅ → **Vous êtes prêt pour la production !**

---

**Version** : 2.0  
**Date** : 26 Décembre 2025  
**Auteur** : Équipe Doctic Medical OS
