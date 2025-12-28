# 🚀 Guide Installation - Doctic Medical OS V2.0

## Prérequis Système

### Logiciels Requis

| Logiciel | Version Minimum | Installation |
|----------|----------------|--------------|
| **Node.js** | 18.x ou supérieur | https://nodejs.org |
| **PostgreSQL** | 14.x ou supérieur | https://www.postgresql.org/download/ |
| **Redis** | 6.x ou supérieur | https://redis.io/download |
| **Git** | 2.x | https://git-scm.com/downloads |

### Comptes Services Externes

- [ ] **Daily.co** (Téléconsultation) - https://daily.co/signup
- [ ] **SendGrid/SMTP** (Emails) - Configuration email
- [ ] **AWS S3** ou **Cloudinary** (Stockage) - Compte cloud storage
- [ ] **Stripe** (Paiements) - https://dashboard.stripe.com/register

---

## 📥 Installation Étape par Étape

### 1. Cloner le Projet

```bash
# Cloner depuis GitHub
git clone https://github.com/votre-org/doctic-care.git
cd doctic-care
```

### 2. Installer les Dépendances

```bash
# Installer toutes les dépendances npm
npm install

# Ou avec Yarn
yarn install

# Ou avec pnpm (recommandé)
pnpm install
```

**Nouvelles dépendances V2** :
- ✅ `@daily-co/daily-js` - SDK téléconsultation
- ✅ `jspdf` - Génération PDF ordonnances
- ✅ `nodemailer` - Envoi emails
- ✅ `socket.io-client` - WebSocket temps réel
- ✅ `dompurify` - Sanitization XSS

### 3. Configuration Base de Données

#### A. Créer la base PostgreSQL

```bash
# Se connecter à PostgreSQL
psql -U postgres

# Créer la base de données
CREATE DATABASE doctic_db;

# Créer l'utilisateur
CREATE USER doctic_user WITH ENCRYPTED PASSWORD 'doctic_password';

# Donner les permissions
GRANT ALL PRIVILEGES ON DATABASE doctic_db TO doctic_user;

# Quitter
\q
```

#### B. Exécuter les migrations

```bash
# Migration initiale (V1)
psql -U doctic_user -d doctic_db -f prisma/migrations/001_initial_setup.sql

# Migration V2 (Ordonnances + Téléconsultation)
psql -U doctic_user -d doctic_db -f prisma/migrations/002_add_prescriptions_teleconsult.sql
```

**Vérifier que les tables sont créées** :
```bash
psql -U doctic_user -d doctic_db -c "\dt"
```

Vous devriez voir :
- `prescriptions`
- `prescription_items`
- `prescription_audit`
- `teleconsult_sessions`
- `teleconsult_participants`
- `teleconsult_messages`
- `medications`

### 4. Configuration Variables d'Environnement

```bash
# Copier le template
cp .env.example .env

# Éditer avec vos valeurs
nano .env  # ou notepad .env sur Windows
```

**Configuration minimale pour démarrer** :

```env
# Base de données
DATABASE_URL="postgresql://doctic_user:doctic_password@localhost:5432/doctic_db"

# JWT Secrets (générer avec: openssl rand -base64 32)
JWT_SECRET="votre-secret-jwt-ici"
JWT_REFRESH_SECRET="votre-refresh-secret-ici"

# Daily.co (créer compte sur https://daily.co)
VITE_DAILY_API_KEY="votre-daily-api-key"
DAILY_DOMAIN="votre-domaine.daily.co"

# Email SMTP (exemple avec Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="votre-email@gmail.com"
SMTP_PASSWORD="votre-mot-de-passe-app"
```

**Pour Gmail** : Activer "Mots de passe d'application" dans https://myaccount.google.com/security

### 5. Démarrer Redis

```bash
# Sur Linux/Mac
redis-server

# Sur Windows (avec WSL ou Docker)
docker run -d -p 6379:6379 redis:alpine
```

### 6. Démarrer l'Application

```bash
# Mode développement (frontend)
npm run dev

# L'app sera accessible sur http://localhost:3001
```

**Terminal séparé pour le backend** (à créer) :
```bash
# Démarrer le backend API
cd backend
npm run dev

# API accessible sur http://localhost:3000
```

---

## 🧪 Tests  d'Installation

### Vérifier le Frontend

1. Ouvrir http://localhost:3001
2. Connexion avec rôle "Médecin"
3. Accéder au module "Ordonnances"
4. Accéder au module "Téléconsultations"

### Vérifier la Base de Données

```sql
-- Vérifier que les tables existent
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Compter les médicaments de seed
SELECT COUNT(*) FROM medications;
-- Devrait retourner 5 (médicaments de démonstration)
```

### Vérifier la Connexion Daily.co

```bash
# Tester l'API Daily.co
curl -X GET https://api.daily.co/v1/rooms \
  -H "Authorization: Bearer VOTRE_DAILY_API_KEY"
```

---

##  🔧 Configuration Avancée

### Activer HTTPS en Développement

```bash
# Installer mkcert
brew install mkcert  # Mac
choco install mkcert # Windows

# Créer certificats locaux
mkcert -install
mkcert localhost 127.0.0.1

# Copier certificats dans /certs
mkdir certs
mv localhost+1.pem certs/cert.pem
mv localhost+1-key.pem certs/key.pem
```

Puis modifier `vite.config.ts` :
```typescript
server: {
  https: {
    key: fs.readFileSync('./certs/key.pem'),
    cert: fs.readFileSync('./certs/cert.pem')
  },
  host: true,
  port: 3001
}
```

### Configurer Prisma ORM (recommandé pour production)

```bash
# Installer Prisma
npm install prisma @prisma/client

# Initialiser
npx prisma init

# Générer client
npx prisma generate

# Créer migration depuis schéma
npx prisma migrate dev --name init
```

---

## 📊 Seed de Données de Démonstration

### Option 1 : SQL Direct

```bash
psql -U doctic_user -d doctic_db -f prisma/seeds/demo_data.sql
```

### Option 2 : Script Node.js

Créer `prisma/seed.ts` :
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer médecin demo
  const doctor = await prisma.user.create({
    data: {
      email: 'dr.dupont@doctic.com',
      name: 'Dr. Marie Dupont',
      role: 'doctor',
      password_hash: 'hashed_password_here'
    }
  });

  // Créer patients demo
  const patients = await prisma.patient.createMany({
    data: [
      { name: 'Jean Martin', email: 'jean@example.com', phone: '0612345678' },
      { name: 'Sophie Bernard', email: 'sophie@example.com', phone: '0687654321' }
    ]
  });

  console.log('✅ Seed terminé', { doctor, patients });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Exécuter :
```bash
npx tsx prisma/seed.ts
```

---

## 🐛 Dépannage

### Problème : Port 3001 déjà utilisé

```bash
# Trouver le processus
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Tuer le processus
kill -9 PID  # Mac/Linux
taskkill /PID PID /F  # Windows
```

### Problème : Connexion PostgreSQL refusée

```bash
# Vérifier que PostgreSQL tourne
pg_isready

# Redémarrer si nécessaire
sudo systemctl restart postgresql  # Linux
brew services restart postgresql  # Mac
```

### Problème : Daily.co "Unauthorized"

Vérifier que votre API key est correcte :
```bash
# Tester l'API
curl -H "Authorization: Bearer VOTRE_API_KEY" \
  https://api.daily.co/v1/
```

### Problème : Emails non envoyés

```bash
# Tester connexion SMTP
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: { user: 'YOUR_EMAIL', pass: 'YOUR_PASSWORD' }
});
transport.verify().then(console.log).catch(console.error);
"
```

---

## 🚀 Déploiement Production

### Option 1 : Vercel (Frontend) + Railway (Backend + DB)

```bash
# Frontend sur Vercel
vercel deploy

# Backend sur Railway
railway up
```

### Option 2 : Docker Compose (Tout-en-un)

Créer `docker-compose.yml` :
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: doctic_db
      POSTGRES_USER: doctic_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:alpine

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://doctic_user:${DB_PASSWORD}@postgres:5432/doctic_db
    depends_on:
      - postgres
      - redis

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Lancer :
```bash
docker-compose up -d
```

---

## ✅ Checklist Post-Installation

- [ ] Frontend accessible sur http://localhost:3001
- [ ] Backend API répond sur http://localhost:3000
- [ ] PostgreSQL contient toutes les tables
- [ ] Redis fonctionne
- [ ] Connexion Daily.co OK (test room)
- [ ] Emails sortants fonctionnent
- [ ] Ordonnances générées en PDF
- [ ] Module Téléconsultation accessible

---

## 📞 Support

**Documentation** : https://docs.doctic.fr  
**GitHub Issues** : https://github.com/doctic/doctic-care/issues  
**Email** : support@doctic.fr  
**Discord** : https://discord.gg/doctic

---

**Version** : 2.0  
**Dernière mise à jour** : 26 Décembre 2025
