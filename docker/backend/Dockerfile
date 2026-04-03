# ============================================================
# Doctic Care — Backend Dockerfile (Production)
# Node.js 20 Alpine + Prisma ORM
# ============================================================
FROM node:20-alpine AS production

# Dépendances système pour Prisma et bcrypt
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    wget

WORKDIR /app

# Dépendances (production uniquement)
COPY package*.json ./
RUN npm ci --only=production --frozen-lockfile

# Code source backend
COPY backend/ ./backend/
COPY prisma/ ./prisma/

# Génère le client Prisma
RUN npx prisma generate

# Répertoire pour uploads temporaires
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Utilisateur non-root (sécurité)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs
RUN chown -R nodeuser:nodejs /app
USER nodeuser

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "backend/server-cluster.js"]
