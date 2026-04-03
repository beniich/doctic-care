#!/bin/bash
# ============================================================
# Doctic Care — scripts/init-ollama.sh
# Téléchargement automatique des modèles IA médicaux
# ============================================================

echo "🚀 Initialisation d'Ollama et téléchargement des modèles..."

# Attend qu'Ollama soit prêt
until curl -s http://localhost:11434/api/tags > /dev/null; do
  echo "⏳ Attente du service Ollama (11434)..."
  sleep 2
done

echo "✅ Ollama est prêt."

# 1. Mistral (Chat & Généraliste)
echo "📥 Pulling Mistral:7b (Assistant général)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "mistral:7b"}'

# 2. LLaVA (Vision / Analyse d'image)
echo "📥 Pulling LLaVA:13b (Analyse d'images médicales)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "llava:13b"}'

# 3. MedAlpaca (Diagnostic Médical)
echo "📥 Pulling MedAlpaca:7b (Expertise clinique)..."
curl -X POST http://localhost:11434/api/pull -d '{"name": "medalpaca:13b"}'

echo "✨ Tous les modèles ont été téléchargés avec succès."
