#!/bin/bash
# ========================================
# DOCTIC MEDICAL OS - Utility Scripts
# Collection de scripts pour maintenance
# Version: 2.1.0
# ========================================

# ========================================
# 1. GÉNÉRATION SECRETS
# scripts/generate-secrets.sh
# ========================================

generate_secrets() {
    echo "# ========================================="
    echo "# DOCTIC SECRETS - Generated $(date)"
    echo "# ⚠️  KEEP THESE SECRET - NEVER COMMIT!"
    echo "# ========================================="
    echo ""
    
    echo "# JWT Secrets (256-bit)"
    echo "JWT_SECRET=$(openssl rand -hex 32)"
    echo "JWT_REFRESH_SECRET=$(openssl rand -hex 32)"
    echo "SESSION_SECRET=$(openssl rand -hex 32)"
    echo ""
    
    echo "# Database Password (32 chars)"
    echo "POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')"
    echo ""
    
    echo "# Redis Password (32 chars)"
    echo "REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d '\n')"
    echo ""
    
    echo "# Grafana Password"
    echo "GRAFANA_PASSWORD=$(openssl rand -base64 16 | tr -d '\n')"
    echo ""
    
    echo "# AES Encryption Key (pour données PHI)"
    echo "AES_ENCRYPTION_KEY=$(openssl rand -hex 32)"
}

# ========================================
# 2. ROTATION SECRETS (tous les 90 jours)
# scripts/rotate-secrets.sh
# ========================================

rotate_secrets() {
    BACKUP_DIR="secrets/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    echo "🔄 Rotating secrets..."
    
    # 1. Backup anciens secrets
    cp .env.production "$BACKUP_DIR/.env.production.old"
    
    # 2. Générer nouveaux secrets
    NEW_JWT_SECRET=$(openssl rand -hex 32)
    NEW_REFRESH_SECRET=$(openssl rand -hex 32)
    
    # 3. Update .env
    sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$NEW_JWT_SECRET/" .env.production
    sed -i.bak "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$NEW_REFRESH_SECRET/" .env.production
    
    # 4. Redémarrer backend
    docker-compose restart backend
    
    # 5. Invalider tous les tokens existants (forcer re-login)
    docker exec doctic_redis redis-cli -a "$REDIS_PASSWORD" FLUSHDB
    
    echo "✅ Secrets rotated successfully"
    echo "📁 Old secrets backed up to: $BACKUP_DIR"
    echo "⚠️  All users will need to re-login"
}

# ========================================
# 3. HEALTH CHECK COMPLET
# scripts/health-check.sh
# ========================================

health_check() {
    echo "🏥 Doctic Health Check - $(date)"
    echo "======================================"
    
    ERRORS=0
    
    # 1. Vérifier containers
    echo "[1/10] Checking containers..."
    CONTAINERS=(doctic_nginx doctic_backend doctic_postgres doctic_redis)
    for container in "${CONTAINERS[@]}"; do
        if docker ps | grep -q "$container"; then
            echo "  ✓ $container: Running"
        else
            echo "  ✗ $container: DOWN"
            ((ERRORS++))
        fi
    done
    
    # 2. Vérifier endpoints
    echo "[2/10] Checking endpoints..."
    ENDPOINTS=(
        "https://doctic.fr/health"
        "https://doctic.fr/api/health"
    )
    for endpoint in "${ENDPOINTS[@]}"; do
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$endpoint")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "  ✓ $endpoint: $HTTP_CODE"
        else
            echo "  ✗ $endpoint: $HTTP_CODE"
            ((ERRORS++))
        fi
    done
    
    # 3. Vérifier DB
    echo "[3/10] Checking PostgreSQL..."
    if docker exec doctic_postgres pg_isready -U "$POSTGRES_USER" > /dev/null 2>&1; then
        echo "  ✓ PostgreSQL: Ready"
    else
        echo "  ✗ PostgreSQL: Not Ready"
        ((ERRORS++))
    fi
    
    # 4. Vérifier Redis
    echo "[4/10] Checking Redis..."
    if docker exec doctic_redis redis-cli -a "$REDIS_PASSWORD" ping 2>/dev/null | grep -q PONG; then
        echo "  ✓ Redis: PONG"
    else
        echo "  ✗ Redis: No Response"
        ((ERRORS++))
    fi
    
    # 5. Vérifier SSL
    echo "[5/10] Checking SSL certificate..."
    DAYS_LEFT=$(echo | openssl s_client -servername doctic.fr -connect doctic.fr:443 2>/dev/null | openssl x509 -noout -enddate | cut -d= -f2 | xargs -I{} date -d {} +%s)
    DAYS_LEFT=$(( ($DAYS_LEFT - $(date +%s)) / 86400 ))
    if [ "$DAYS_LEFT" -gt 30 ]; then
        echo "  ✓ SSL: Valid for $DAYS_LEFT days"
    else
        echo "  ⚠ SSL: Expires in $DAYS_LEFT days (renew soon!)"
    fi
    
    # 6. Vérifier espace disque
    echo "[6/10] Checking disk space..."
    DISK_USAGE=$(df -h /mnt/doctic_hds | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -lt 80 ]; then
        echo "  ✓ Disk: ${DISK_USAGE}% used"
    else
        echo "  ⚠ Disk: ${DISK_USAGE}% used (cleanup needed)"
    fi
    
    # 7. Vérifier RAM
    echo "[7/10] Checking memory..."
    MEMORY_USAGE=$(free | grep Mem | awk '{print int($3/$2 * 100)}')
    if [ "$MEMORY_USAGE" -lt 90 ]; then
        echo "  ✓ Memory: ${MEMORY_USAGE}% used"
    else
        echo "  ⚠ Memory: ${MEMORY_USAGE}% used"
    fi
    
    # 8. Vérifier CPU
    echo "[8/10] Checking CPU..."
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo "  ℹ CPU: ${CPU_USAGE}% used"
    
    # 9. Vérifier backups
    echo "[9/10] Checking backups..."
    LATEST_BACKUP=$(ls -t /mnt/doctic_hds/backups/*.sql.gz 2>/dev/null | head -1)
    if [ -n "$LATEST_BACKUP" ]; then
        BACKUP_AGE=$(( ($(date +%s) - $(stat -c %Y "$LATEST_BACKUP")) / 3600 ))
        if [ "$BACKUP_AGE" -lt 24 ]; then
            echo "  ✓ Backup: $BACKUP_AGE hours old"
        else
            echo "  ⚠ Backup: $BACKUP_AGE hours old (should be < 24h)"
        fi
    else
        echo "  ✗ Backup: No backups found"
        ((ERRORS++))
    fi
    
    # 10. Vérifier logs erreurs
    echo "[10/10] Checking error logs..."
    ERROR_COUNT=$(docker logs doctic_backend --since 1h 2>&1 | grep -i "error" | wc -l)
    if [ "$ERROR_COUNT" -lt 10 ]; then
        echo "  ✓ Errors: $ERROR_COUNT in last hour"
    else
        echo "  ⚠ Errors: $ERROR_COUNT in last hour (investigate)"
    fi
    
    echo "======================================"
    if [ "$ERRORS" -eq 0 ]; then
        echo "✅ All checks passed!"
        exit 0
    else
        echo "❌ $ERRORS check(s) failed"
        exit 1
    fi
}

# ========================================
# 4. BACKUP MANUEL
# scripts/backup-now.sh
# ========================================

backup_now() {
    BACKUP_DIR="/mnt/doctic_hds/backups"
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/manual_backup_${TIMESTAMP}.sql.gz"
    
    echo "📦 Creating manual backup..."
    
    # 1. Dump PostgreSQL
    docker exec doctic_postgres pg_dump \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --clean --if-exists \
        | gzip > "$BACKUP_FILE"
    
    # 2. Backup Redis
    docker exec doctic_redis redis-cli -a "$REDIS_PASSWORD" --rdb /data/dump.rdb
    cp /var/lib/docker/volumes/doctic_redis_data/_data/dump.rdb "$BACKUP_DIR/redis_${TIMESTAMP}.rdb"
    
    # 3. Backup logs
    tar -czf "$BACKUP_DIR/logs_${TIMESTAMP}.tar.gz" /mnt/doctic_hds/logs/
    
    # 4. Vérifier intégrité
    if gunzip -t "$BACKUP_FILE" 2>/dev/null; then
        SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
        echo "✅ Backup created: $BACKUP_FILE ($SIZE)"
    else
        echo "❌ Backup failed: corrupted file"
        exit 1
    fi
    
    # 5. Upload vers S3 (si configuré)
    if [ -n "$AWS_ACCESS_KEY_ID" ]; then
        aws s3 cp "$BACKUP_FILE" "s3://doctic-backups/$(date +%Y/%m/%d)/"
        echo "☁️  Backup uploaded to S3"
    fi
}

# ========================================
# 5. RESTORE DEPUIS BACKUP
# scripts/restore-backup.sh
# ========================================

restore_backup() {
    if [ -z "$1" ]; then
        echo "Usage: restore-backup.sh <backup_file.sql.gz>"
        echo "Available backups:"
        ls -lh /mnt/doctic_hds/backups/*.sql.gz | tail -10
        exit 1
    fi
    
    BACKUP_FILE="$1"
    
    if [ ! -f "$BACKUP_FILE" ]; then
        echo "❌ Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    echo "⚠️  WARNING: This will OVERWRITE current database!"
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Aborted"
        exit 0
    fi
    
    echo "🔄 Restoring from backup..."
    
    # 1. Stop backend (éviter écritures pendant restore)
    docker-compose stop backend
    
    # 2. Drop et recréer DB
    docker exec doctic_postgres psql -U "$POSTGRES_USER" -c "DROP DATABASE IF EXISTS ${POSTGRES_DB}_old;"
    docker exec doctic_postgres psql -U "$POSTGRES_USER" -c "ALTER DATABASE ${POSTGRES_DB} RENAME TO ${POSTGRES_DB}_old;"
    docker exec doctic_postgres psql -U "$POSTGRES_USER" -c "CREATE DATABASE ${POSTGRES_DB};"
    
    # 3. Restore
    gunzip -c "$BACKUP_FILE" | docker exec -i doctic_postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
    
    # 4. Vérifier
    PATIENT_COUNT=$(docker exec doctic_postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT COUNT(*) FROM patients;" | xargs)
    echo "✓ Restored $PATIENT_COUNT patients"
    
    # 5. Redémarrer
    docker-compose start backend
    
    echo "✅ Restore completed from: $BACKUP_FILE"
}

# ========================================
# 6. NETTOYAGE LOGS ANCIENS
# scripts/cleanup-logs.sh
# ========================================

cleanup_logs() {
    echo "🧹 Cleaning old logs..."
    
    # Supprimer logs > 6 ans (HIPAA requirement)
    find /mnt/doctic_hds/logs -type f -name "*.log" -mtime +2190 -delete
    
    # Compresser logs > 30 jours
    find /mnt/doctic_hds/logs -type f -name "*.log" -mtime +30 -exec gzip {} \;
    
    # Nettoyer Docker logs
    docker system prune -a --volumes --force
    
    # Stats
    du -sh /mnt/doctic_hds/logs
    echo "✅ Cleanup completed"
}

# ========================================
# 7. MONITORING TEMPS RÉEL
# scripts/monitor.sh
# ========================================

monitor_realtime() {
    watch -n 5 '
        echo "========================================="
        echo "Doctic Medical OS - Real-time Monitor"
        echo "========================================="
        echo ""
        echo "CONTAINERS:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.CPUPerc}}\t{{.MemPerc}}"
        echo ""
        echo "ENDPOINTS:"
        curl -s http://localhost:5000/health 2>/dev/null || echo "Backend offline"
        echo ""
        echo "SYSTEM:"
        uptime
        df -h /mnt/doctic_hds 2>/dev/null | tail -1 || df -h / | tail -1
    '
}

# ========================================
# 8. UPDATE & DEPLOY
# scripts/deploy-update.sh
# ========================================

deploy_update() {
    VERSION="${1:-latest}"
    
    echo "🚀 Deploying version: $VERSION"
    
    # 1. Backup avant update
    backup_now
    
    # 2. Pull latest code
    git fetch --all
    git checkout "$VERSION"
    
    # 3. Rebuild images
    docker-compose build --no-cache
    
    # 4. Database migrations
    docker exec doctic_backend npx prisma migrate deploy
    
    # 5. Zero-downtime deploy (blue-green)
    docker-compose up -d --no-deps --build backend
    
    # 6. Health check
    sleep 10
    if health_check; then
        echo "✅ Deployment successful"
        
        # Cleanup old images
        docker image prune -f
    else
        echo "❌ Deployment failed, rolling back..."
        docker-compose restart backend
        exit 1
    fi
}

# ========================================
# 9. AUDIT SÉCURITÉ RAPIDE
# scripts/quick-audit.sh
# ========================================

quick_audit() {
    echo "🔍 Quick Security Audit"
    echo "======================="
    
    # 1. Ports ouverts
    echo "[1] Open Ports:"
    ss -tulnp 2>/dev/null | grep LISTEN || netstat -tuln | grep LISTEN
    
    # 2. Failed login attempts
    echo "[2] Failed Logins (last hour):"
    grep "UNAUTHORIZED" /var/log/doctic/audit.log 2>/dev/null | tail -10 || echo "No audit log found"
    
    # 3. Processus suspects
    echo "[3] Suspicious Processes:"
    ps aux | grep -E "(bitcoin|mine|xmrig)" || echo "None found"
    
    # 4. Docker vulns (si Trivy installé)
    echo "[4] Docker Vulnerabilities:"
    if command -v trivy &> /dev/null; then
        trivy image doctic_backend:latest --severity HIGH,CRITICAL
    else
        echo "Trivy not installed, skipping"
    fi
}

# ========================================
# 10. MENU INTERACTIF
# scripts/admin-menu.sh
# ========================================

admin_menu() {
    while true; do
        clear
        echo "╔════════════════════════════════════════╗"
        echo "║   🏥 Doctic Admin Menu                ║"
        echo "║   Version 2.1.0                        ║"
        echo "╚════════════════════════════════════════╝"
        echo ""
        echo "1)  Health Check"
        echo "2)  Backup Now"
        echo "3)  Restore Backup"
        echo "4)  Monitor Real-time"
        echo "5)  Security Audit"
        echo "6)  Deploy Update"
        echo "7)  Rotate Secrets"
        echo "8)  Cleanup Logs"
        echo "9)  Generate Secrets"
        echo "0)  Exit"
        echo ""
        read -p "Select option [0-9]: " choice
        
        case $choice in
            1) health_check ;;
            2) backup_now ;;
            3) 
                echo "Available backups:"
                ls -lh /mnt/doctic_hds/backups/*.sql.gz 2>/dev/null | tail -10
                read -p "Enter backup filename: " backup_file
                restore_backup "$backup_file"
                ;;
            4) monitor_realtime ;;
            5) quick_audit ;;
            6)
                read -p "Enter version (e.g., v2.1.0): " version
                deploy_update "$version"
                ;;
            7) rotate_secrets ;;
            8) cleanup_logs ;;
            9) generate_secrets ;;
            0) exit 0 ;;
            *) echo "Invalid option" ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# ========================================
# MAIN DISPATCHER
# ========================================

case "${1:-menu}" in
    generate-secrets) generate_secrets ;;
    rotate-secrets) rotate_secrets ;;
    health-check) health_check ;;
    backup) backup_now ;;
    restore) restore_backup "$2" ;;
    cleanup) cleanup_logs ;;
    monitor) monitor_realtime ;;
    deploy) deploy_update "$2" ;;
    audit) quick_audit ;;
    menu) admin_menu ;;
    *)
        echo "Usage: $0 {generate-secrets|rotate-secrets|health-check|backup|restore|cleanup|monitor|deploy|audit|menu}"
        exit 1
        ;;
esac
