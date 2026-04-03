#!/bin/bash
# ============================================================
# Doctic Care — scripts/renew-ssl.sh
# Script automatique pour renouvellement Certbot
# ============================================================

echo "🔔 Vérification du renouvellement des certificats SSL..."

# Commande Certbot en dry-run ou réel
# On utilise docker exec pour parler au conteneur certbot
docker compose exec certbot certbot renew --webroot -w /var/www/certbot --quiet

# Recharger Nginx pour appliquer les nouveaux certificats
if [ $? -eq 0 ]; then
    echo "✅ Certificats renouvelés (si nécessaire). Rechargement de Nginx..."
    docker compose exec nginx nginx -s reload
else
    echo "❌ Erreur lors du renouvellement SSL."
fi
