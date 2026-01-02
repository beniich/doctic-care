# 📊 Tests de Charge - Guide Complet

## Analyse Résultats & Optimisations Performance

---

## 🎯 Objectifs Tests de Charge

### KPIs Cibles (SLA)

| Métrique | Target | Acceptable | Critique |
|----------|--------|------------|----------|
| **Response Time (p95)** | < 1s | < 2s | > 3s |
| **Response Time (p99)** | < 2s | < 3s | > 5s |
| **Error Rate** | < 0.1% | < 1% | > 2% |
| **Throughput** | > 500 req/s | > 300 req/s | < 200 req/s |
| **Concurrent Users** | 1000+ | 500+ | < 300 |
| **Database Load** | < 70% CPU | < 85% CPU | > 90% CPU |
| **Memory Usage** | < 70% | < 85% | > 90% |

---

## 🚀 Préparation Tests

### 1. Environnement Test

```bash
# Créer environnement staging identique prod
# staging.doctic.fr

# Configuration .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db:5432/doctic_staging
REDIS_URL=redis://staging-redis:6379

# Désactiver rate limiting (tests uniquement!)
RATE_LIMIT_ENABLED=false

# Logs verbose
LOG_LEVEL=debug
```

### 2. Données Test

Voir `scripts/generate-test-data.sh`

### 3. Baseline Performance

```bash
# Mesurer performance AVANT optimisations
k6 run --vus 10 --duration 5m tests/load/k6-full-scenario.js > baseline.txt
```

---

## 📈 Exécution Tests

### Test Progressif (Recommandé)

```bash
# Phase 1 : Smoke test (10 users, 5 min)
k6 run --vus 10 --duration 5m tests/load/k6-full-scenario.js

# Phase 2 : Load test (100 users, 10 min)
k6 run --vus 100 --duration 10m tests/load/k6-full-scenario.js

# Phase 3 : Stress test (500 users, 15 min)
k6 run --vus 500 --duration 15m tests/load/k6-full-scenario.js

# Phase 4 : Peak test (1000 users, 20 min)
k6 run tests/load/k6-full-scenario.js

# Phase 5 : Spike test (0→1000 users en 1min)
k6 run --vus 1000 --duration 5m --rps 100 tests/load/k6-full-scenario.js

# Phase 6 : Soak test (500 users, 4 heures)
k6 run --vus 500 --duration 4h tests/load/k6-full-scenario.js
```

---

## 📊 Analyse Résultats

### Interprétation Métriques

✅ **BON :**
- Checks pass rate : > 95%
- p95 response time : < 2s
- Throughput : acceptable pour charge

⚠️ **À AMÉLIORER :**
- Error rate : > 1%
- p95 response time : Proche limite
- Max response time : > 5s (identifier goulots)

### Identifier Goulots

```bash
# Database Slow Queries
SELECT query, mean_exec_time, calls 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

# Redis Cache Hit Rate
INFO stats | grep keyspace_hits
```

---

## 🔧 Optimisations Performance

### 1. Backend Node.js

#### Clustering (Multi-core)
Voir `backend/server-cluster.js`

**Impact :** +300% throughput (8 cores = 8x workers)

#### Caching Redis
Voir `backend/middleware/cache.middleware.js`

**Impact :** -80% response time pour requêtes cachées

#### Connection Pooling PostgreSQL
Voir `backend/db/pool.js`

**Impact :** -50% latence DB, +200% throughput

#### Requêtes SQL Optimisées

```sql
-- AVANT (Slow query - 2000ms)
SELECT * FROM patients 
WHERE email LIKE '%test%';

-- APRÈS (Optimized - 50ms)
SELECT id, first_name, last_name, email
FROM patients 
WHERE email ILIKE 'test%'  -- Utilise index
LIMIT 20;

-- Créer index
CREATE INDEX CONCURRENTLY idx_patients_email 
ON patients USING gin(email gin_trgm_ops);
```

**Impact :** -95% latence queries

### 2. PostgreSQL Tuning

Voir `config/postgresql.conf`

**Impact :** +150% throughput DB

### 3. Nginx Tuning

Voir `config/nginx-optimized.conf`

**Impact :** +100% throughput Nginx

### 4. Docker Optimization

Voir `docker-compose.production.yml`

**Impact :** +50% throughput global

---

## 📉 Résultats Attendus Post-Optimisation

### Comparaison Avant/Après

| Métrique | Avant | Après | Amélioration |
|----------|-------|-------|--------------|
| Response Time p95 | 1.8s | 0.6s | **-67%** ✅ |
| Response Time p99 | 3.2s | 1.2s | **-62%** ✅ |
| Error Rate | 1.5% | 0.2% | **-87%** ✅ |
| Throughput | 100 req/s | 450 req/s | **+350%** ✅ |
| CPU Backend | 85% | 60% | **-29%** ✅ |
| CPU Database | 90% | 55% | **-39%** ✅ |

### Capacité Finale

✅ **1000 users simultanés** avec :
- Response time p95 < 1s ✅
- Error rate < 0.5% ✅
- Throughput 450 req/s ✅

---

## 🎯 Checklist Finale

### Avant Tests
- [ ] Environnement staging prêt
- [ ] Données test générées (10k patients)
- [ ] Monitoring configuré (Grafana)
- [ ] Alertes désactivées (tests uniquement)
- [ ] Équipe DevOps prévenue
- [ ] Backup production récent

### Pendant Tests
- [ ] Monitoring actif (CPU, RAM, DB)
- [ ] Logs en temps réel
- [ ] Screenshots métriques
- [ ] Notes anomalies

### Après Tests
- [ ] Rapport K6 sauvegardé
- [ ] Screenshots Grafana exportés
- [ ] Analyse goulots réalisée
- [ ] Plan optimisation documenté
- [ ] Débriefing équipe

---

## 📚 Ressources

### Outils
- **K6** : https://k6.io
- **Artillery** : https://artillery.io
- **Locust** : https://locust.io

### Services
- **K6 Cloud** : 299€/mois (1000 VUs)
- **Gatling Enterprise** : 5 000€+ (consulting)

---

**Version** : 2.1.0  
**Dernière mise à jour** : 2 Janvier 2026
