# 🛠️ Scripts d'Administration Doctic Medical OS

Scripts de maintenance et administration pour production et développement.

## 📁 Fichiers

- **admin-utils.sh** - Scripts Bash (Linux/Mac production)
- **admin-utils.ps1** - Scripts PowerShell (Windows développement)

---

## 🚀 Utilisation Rapide

### Windows (PowerShell)

```powershell
# Menu interactif
.\scripts\admin-utils.ps1 menu

# Health check
.\scripts\admin-utils.ps1 health-check

# Générer secrets
.\scripts\admin-utils.ps1 generate-secrets

# Backup
.\scripts\admin-utils.ps1 backup

# Monitoring temps réel
.\scripts\admin-utils.ps1 monitor
```

### Linux/Mac (Bash)

```bash
# Rendre exécutable
chmod +x scripts/admin-utils.sh

# Menu interactif
./scripts/admin-utils.sh menu

# Health check complet
./scripts/admin-utils.sh health-check

# Générer secrets
./scripts/admin-utils.sh generate-secrets

# Backup manuel
./scripts/admin-utils.sh backup

# Monitoring
./scripts/admin-utils.sh monitor
```

---

## 📋 Commandes Disponibles

### 1. generate-secrets
Génère des secrets cryptographiques sécurisés (JWT, DB, Redis, AES)

**Windows :**
```powershell
.\scripts\admin-utils.ps1 generate-secrets
```

**Linux :**
```bash
./scripts/admin-utils.sh generate-secrets > .env.secrets
```

### 2. health-check
Vérification complète de l'état du système

**Vérifie :**
- Containers Docker (prod)
- Endpoints HTTP
- Base de données
- Redis
- SSL
- Disque/RAM/CPU
- Backups récents
- Logs erreurs

### 3. backup
Crée un backup manuel

**Production (Bash) :**
- Dump PostgreSQL
- Snapshot Redis
- Archive logs
- Upload S3 (optionnel)

**Dev (PowerShell) :**
- Zip code source
- Zip configuration

### 4. restore
Restaure depuis un backup (production seulement)

```bash
./scripts/admin-utils.sh restore /path/to/backup.sql.gz
```

### 5. monitor
Monitoring temps réel

**Affiche :**
- État containers/processus
- Endpoints (UP/DOWN)
- Métriques système
- Database stats

### 6. rotate-secrets
Rotation des secrets tous les 90 jours (prod)

**Actions :**
- Backup anciens secrets
- Génération nouveaux
- Update .env
- Restart backend
- Flush tokens Redis

### 7. cleanup
Nettoyage des fichiers temporaires

**Nettoie :**
- Logs > 6 ans (HIPAA)
- Gzip logs > 30 jours
- Docker volumes inutilisés
- Cache npm

### 8. deploy
Déploiement zero-downtime (prod)

```bash
./scripts/admin-utils.sh deploy v2.1.0
```

### 9. audit
Audit sécurité rapide

**Vérifie :**
- Ports ouverts
- Tentatives login échouées
- Vulnérabilités Docker
- Processus suspects

---

## 🎯 Cas d'Usage

### Développement (Windows)

```powershell
# 1. Démarrer menu admin
.\scripts\admin-utils.ps1 menu

# 2. Vérifier santé application
Option 1: Health Check

# 3. Générer nouveaux secrets JWT
Option 4: Generate Secrets

# 4. Backup avant modifications
Option 2: Backup Now
```

### Production (Linux)

```bash
# 1. Health check quotidien (cron)
0 */6 * * * /app/scripts/admin-utils.sh health-check

# 2. Backup automatique quotidien
0 2 * * * /app/scripts/admin-utils.sh backup

# 3. Rotation secrets tous les 90 jours
0 3 1 */3 * /app/scripts/admin-utils.sh rotate-secrets

# 4. Cleanup hebdomadaire
0 4 * * 0 /app/scripts/admin-utils.sh cleanup
```

### CI/CD

```yaml
# .github/workflows/deploy.yml
- name: Health Check
  run: ./scripts/admin-utils.sh health-check

- name: Backup Before Deploy
  run: ./scripts/admin-utils.sh backup

- name: Deploy New Version
  run: ./scripts/admin-utils.sh deploy ${{ github.ref_name }}
```

---

## 🔒 Sécurité

### Secrets Générés

**Format :**
- JWT secrets : 256-bit (64 caractères hex)
- Passwords : 32+ caractères base64
- AES keys : 256-bit pour chiffrement PHI

**Stockage :**
- ✅ `.env.production` (jamais commit)
- ✅ Variables environnement CI/CD
- ✅ Vault (Hashicorp, AWS Secrets Manager)
- ❌ Jamais dans Git
- ❌ Jamais en clair dans logs

### Rotation

**Fréquence recommandée :**
- JWT secrets : 90 jours
- DB passwords : 180 jours
- Redis password : 90 jours

---

## 📊 Monitoring

### Windows Desktop

Le monitoring affiche :
```
NODE PROCESSES:
ProcessName  Id    CPU  WorkingSet
node        12345  10%  150 MB

ENDPOINTS:
Frontend (3001): ✓ UP
Backend (5000): ✓ UP

SYSTEM:
Memory: 65%
Uptime: 5.2 hours
```

### Linux Production

```bash
./scripts/admin-utils.sh monitor
```

Affiche toutes les 5 secondes :
- État containers Docker
- Health endpoints JSON
- Stats database (patients, appointments)
- Métriques système (uptime, disk)

---

## ⚠️ Prérequis

### Windows (PowerShell)
- PowerShell 5.1+
- Node.js installé
- npm accessible dans PATH

### Linux (Bash)
- Bash 4.0+
- Docker & Docker Compose
- OpenSSL
- jq (pour JSON parsing)
- PostgreSQL client
- Redis client

---

## 🆘 Troubleshooting

### "Permission denied"
```bash
chmod +x scripts/admin-utils.sh
```

### "Command not found"
Vérifier que le script est lancé depuis la racine du projet :
```bash
cd /path/to/doctic-care
./scripts/admin-utils.sh
```

### PowerShell "execution policy"
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📚 Références

- [HIPAA Audit Log Requirements](https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [PostgreSQL Backup & Restore](https://www.postgresql.org/docs/current/backup.html)

---

**Version** : 2.1.0  
**Dernière mise à jour** : 2 Janvier 2026
