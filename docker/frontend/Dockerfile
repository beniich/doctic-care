# ============================================================
# Doctic Care — Frontend Dockerfile (Production Multi-stage)
# Optimisé pour le déploiement et la performance
# ============================================================

# ─── Étape 1 : Build ─────────────────────────────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app

# Dépendances (plus efficace avec cache)
COPY package*.json ./
RUN npm ci

# Code source
COPY . .

# Variables d'environnement pour le build Vite (Inlinées dans le JS)
# Note : Celles-ci doivent être passées en build-arg ou présentes ici
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build de l'application
RUN npm run build

# ─── Étape 2 : Production (Nginx) ────────────────────────────
FROM nginx:alpine AS production-stage

# Copie des fichiers buildés depuis l'étape 1
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Fichiers de configuration Nginx SPA (avec try_files pour React Router)
COPY docker/frontend/nginx-spa.conf /etc/nginx/conf.d/default.conf

EXPOSE 3001

# Lancement de Nginx en premier plan
CMD ["nginx", "-g", "daemon off;"]
