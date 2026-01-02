#!/bin/bash
# ========================================
# DOCTIC - Generate Test Data
# Génère 10,000 patients et 50,000 appointments
# ========================================

set -e

echo "🔄 Generating test data for load testing..."
echo "=========================================="

# Configuration
API_URL="${API_URL:-http://localhost:5000}"
AUTH_TOKEN="${AUTH_TOKEN:-mock-jwt-token-12345}"  # Mock token pour dev

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ========================================
# 1. Générer 10,000 patients
# ========================================

echo -e "${YELLOW}[1/2] Creating 10,000 patients...${NC}"

PATIENTS_CREATED=0

for i in {1..10000}; do
  # Données patient fictives
  FIRST_NAME="Patient"
  LAST_NAME="Test-${i}"
  EMAIL="patient-${i}@test.doctic.fr"
  PHONE="0$(printf '%09d' $i)"
  AGE=$((20 + RANDOM % 60))
  
  # Créer patient (en arrière-plan pour parallélisme)
  curl -s -X POST "${API_URL}/api/patients" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"firstName\": \"${FIRST_NAME}\",
      \"lastName\": \"${LAST_NAME}\",
      \"email\": \"${EMAIL}\",
      \"phone\": \"${PHONE}\",
      \"age\": ${AGE},
      \"status\": \"Actif\"
    }" > /dev/null 2>&1 &
  
  ((PATIENTS_CREATED++))
  
  # Batch de 100 pour éviter surcharge
  if [ $((i % 100)) -eq 0 ]; then
    wait  # Attendre que tous les processus du batch finissent
    echo -e "${GREEN}  ✓ Created ${i}/10,000 patients${NC}"
  fi
done

wait  # Attendre derniers patients
echo -e "${GREEN}✅ 10,000 patients created${NC}"
echo ""

# ========================================
# 2. Générer 50,000 appointments
# ========================================

echo -e "${YELLOW}[2/2] Creating 50,000 appointments...${NC}"

APPOINTMENTS_CREATED=0

for i in {1..50000}; do
  # Patient aléatoire
  PATIENT_ID=$((1 + RANDOM % 10000))
  
  # Date aléatoire (Janvier 2026)
  DAY=$((10 + RANDOM % 20))
  HOUR=$((8 + RANDOM % 10))  # 8h-18h
  
  # Type de consultation
  TYPES=("Consultation" "Follow-Up" "Telehealth" "Urgence")
  TYPE=${TYPES[$((RANDOM % 4))]}
  
  # Créer appointment
  curl -s -X POST "${API_URL}/api/appointments" \
    -H "Authorization: Bearer ${AUTH_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
      \"patient\": \"Patient Test-${PATIENT_ID}\",
      \"type\": \"${TYPE}\",
      \"date\": \"2026-01-${DAY}T${HOUR}:00\",
      \"time\": \"${HOUR}:00\",
      \"duration\": \"30m\",
      \"status\": \"scheduled\",
      \"provider\": \"Dr. Test\"
    }" > /dev/null 2>&1 &
  
  ((APPOINTMENTS_CREATED++))
  
  # Batch de 100
  if [ $((i % 100)) -eq 0 ]; then
    wait
    echo -e "${GREEN}  ✓ Created ${i}/50,000 appointments${NC}"
  fi
done

wait
echo -e "${GREEN}✅ 50,000 appointments created${NC}"
echo ""

# ========================================
# 3. Vérification
# ========================================

echo "=========================================="
echo "🔍 Verification..."

# Compter patients
PATIENT_COUNT=$(curl -s "${API_URL}/api/patients" | jq '. | length')
echo -e "  Patients in DB: ${GREEN}${PATIENT_COUNT}${NC}"

# Compter appointments
APPOINTMENT_COUNT=$(curl -s "${API_URL}/api/appointments" | jq '. | length')
echo -e "  Appointments in DB: ${GREEN}${APPOINTMENT_COUNT}${NC}"

echo "=========================================="
echo -e "${GREEN}✅ Test data generation completed!${NC}"
echo ""
echo "Next steps:"
echo "  1. Run smoke test:    k6 run --vus 10 --duration 5m tests/load/k6-full-scenario.js"
echo "  2. Run load test:     k6 run --vus 100 --duration 10m tests/load/k6-full-scenario.js"
echo "  3. Run stress test:   k6 run tests/load/k6-full-scenario.js"
