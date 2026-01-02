# Installation K6

## Windows (PowerShell Admin)

### Option 1 : Chocolatey (Recommandé)
```powershell
choco install k6
```

### Option 2 : Winget
```powershell
winget install k6 --source winget
```

### Option 3 : Téléchargement manuel
1. Télécharger depuis https://github.com/grafana/k6/releases
2. Extraire `k6.exe` dans `C:\k6\`
3. Ajouter au PATH :
```powershell
$env:Path += ";C:\k6"
```

## Linux

### Ubuntu/Debian
```bash
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

### Mac
```bash
brew install k6
```

## Vérification

```bash
k6 version
# k6 v0.48.0
```

## Utilisation dans Doctic

```bash
# Smoke test local
k6 run --vus 10 --duration 1m tests/load/k6-full-scenario.js

# Load test (backend doit tourner)
k6 run --vus 100 --duration 5m tests/load/k6-full-scenario.js

# Full stress test
k6 run tests/load/k6-full-scenario.js
```

## Alternative : K6 Cloud (sans installation)

```bash
# Créer compte sur https://app.k6.io
k6 login cloud --token YOUR_K6_CLOUD_TOKEN

# Run dans le cloud
k6 cloud tests/load/k6-full-scenario.js
```

## CI/CD (GitHub Actions)

Voir `.github/workflows/load-test.yml` pour tests automatiques.
