# 🚀 Guide de Déploiement Doctic Medical OS V2.1.0

## Checklist Avant Production

### ✅ P0 - Bloquant

- [ ] **Installer dépendances backend**
  ```bash
  cd doctic-care
  npm install express cors passport jsonwebtoken helmet express-rate-limit
  npm install zod redis connect-redis bcrypt
  npm install @prisma/client prisma --save-dev
  npm install jest supertest --save-dev
  ```

- [ ] **Configurer Prisma**
  ```bash
  # Copier schema complet
  cp prisma/schema-complete.prisma prisma/schema.prisma
  
  # Générer client Prisma
  npx prisma generate
  
  # Créer migration
  npx prisma migrate dev --name init
  ```

- [ ] **Configurer variables d'environnement**
  ```bash
  # Générer secrets sécurisés
  npm run generate:secrets
  
  # Copier dans .env
  cp .env.example .env
  # Éditer avec vos valeurs
  ```

- [ ] **Valider configuration**
  ```bash
  npm run validate:env
  ```

- [ ] **Lancer tests**
  ```bash
  npm test
  # Coverage >70% requis
  ```

### ⚠️ P1 - Semaine 1

- [ ] **Configurer HTTPS**
  - Certificat SSL Let's Encrypt
  - Nginx reverse proxy
  - Redirection HTTP → HTTPS

- [ ] **Configurer Redis**
  ```bash
  # Installation Ubuntu
  sudo apt install redis-server
  sudo systemctl enable redis
  
  # Configuration .env
  REDIS_URL=redis://localhost:6379
  ```

- [ ] **Configurer PostgreSQL**
  ```bash
  # Créer DB production
  sudo -u postgres createdb doctic_prod
  
  # Exécuter migrations
  npx prisma migrate deploy
  ```

- [ ] **Configurer monitoring**
  - Sentry pour erreurs
  - Datadog/CloudWatch pour logs
  - UptimeRobot pour uptime

---

## 🐳 Déploiement Docker

### Dockerfile Optimisé

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM base AS runtime
COPY . .
RUN npx prisma generate

EXPOSE 5000
CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env.production
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: doctic_prod
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Lancer

```bash
docker-compose up -d
docker-compose logs -f backend
```

---

## ☁️ Déploiement Cloud

### AWS EC2

```bash
# 1. Instance Ubuntu 22.04 t3.small
# 2. Installer Node.js, PostgreSQL, Redis
sudo apt update
sudo apt install nodejs npm postgresql redis-server nginx

# 3. Cloner repo
git clone https://github.com/votre-org/doctic-care.git
cd doctic-care

# 4. Installer dépendances
npm install

# 5. Configurer .env production
cp .env.production.example .env.production
nano .env.production

# 6. Migrations
npx prisma migrate deploy

# 7. PM2 pour auto-restart
npm install -g pm2
pm2 start server.js --name doctic-backend
pm2 startup
pm2 save
```

### Render.com (Simple)

```bash
# 1. Connecter GitHub repo
# 2. Service Type: Web Service
# 3. Build Command: npm install && npx prisma generate
# 4. Start Command: node server.js
# 5. Ajouter variables d'environnement dans dashboard
```

---

## 🔒 Sécurité Post-Déploiement

### 1. Vérifier HTTPS

```bash
curl -I https://api.doctic.fr/health
# Doit retourner status 200
```

### 2. Tester Rate Limiting

```bash
# Doit bloquer après 5 tentatives
for i in {1..10}; do curl https://api.doctic.fr/auth/google; done
```

### 3. Vérifier Headers Sécurité

```bash
curl -I https://api.doctic.fr/health | grep -i "x-frame\|strict-transport"
```

### 4. Tester Token Blacklist

```bash
# Login → Logout → Retry avec même token
# Doit retourner 401 TOKEN_REVOKED
```

---

## 📊 Monitoring

### Logs

```bash
# Logs backend
tail -f /var/log/doctic-backend.log

# Logs PostgreSQL
tail -f /var/log/postgresql/postgresql-14-main.log

# Logs Redis
tail -f /var/log/redis/redis-server.log
```

### Métriques

- **Uptime** : >99.9%
- **Response time** : <200ms (p95)
- **Error rate** : <0.1%
- **CPU** : <60%
- **Memory** : <80%

---

## 🔄 Backup

### PostgreSQL Automatique

```bash
# /etc/cron.daily/backup-doctic-db
#!/bin/bash
pg_dump doctic_prod | gzip > /backups/doctic_$(date +%Y%m%d).sql.gz

# Garder 30 jours
find /backups -name "doctic_*.sql.gz" -mtime +30 -delete
```

### Redis Snapshot

```bash
# redis.conf
save 900 1
save 300 10
save 60 10000

dir /var/lib/redis/snapshots
```

---

## 🆘 Dépannage Production

### Backend ne démarre pas

```bash
# Vérifier logs
pm2 logs doctic-backend

# Vérifier env
npm run validate:env

# Vérifier ports
sudo netstat -tulpn | grep :5000
```

### Redis connection failed

```bash
# Test connexion
redis-cli ping

# Vérifier config
cat /etc/redis/redis.conf | grep bind
```

### PostgreSQL migration failed

```bash
# Reset DB (dev only!)
npx prisma migrate reset

# Déployer
npx prisma migrate deploy
```

---

## 📞 Support Production

**Erreurs critiques** : support@doctic.fr  
**Incident response** : +33 XXX XXX XXX  
**Status page** : https://status.doctic.fr

---

**Version** : 2.1.0  
**Dernière mise à jour** : 2 Janvier 2026
