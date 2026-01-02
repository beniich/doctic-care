# ========================================
# DOCTIC MEDICAL OS - Windows Admin Utils
# Version PowerShell pour Windows
# Version: 2.1.0
# ========================================

# ========================================
# 1. GÉNÉRATION SECRETS
# ========================================

function Generate-Secrets {
    Write-Host "# =========================================" -ForegroundColor Cyan
    Write-Host "# DOCTIC SECRETS - Generated $(Get-Date)" -ForegroundColor Cyan
    Write-Host "# ⚠️  KEEP THESE SECRET - NEVER COMMIT!" -ForegroundColor Yellow
    Write-Host "# =========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "# JWT Secrets (256-bit)" -ForegroundColor Green
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    Write-Host "JWT_SECRET=$([Convert]::ToHexString($bytes).ToLower())"
    
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    Write-Host "JWT_REFRESH_SECRET=$([Convert]::ToHexString($bytes).ToLower())"
    
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    Write-Host "SESSION_SECRET=$([Convert]::ToHexString($bytes).ToLower())"
    Write-Host ""
    
    Write-Host "# Database Password" -ForegroundColor Green
    [Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
    Write-Host "POSTGRES_PASSWORD=$([Convert]::ToBase64String($bytes))"
}

# ========================================
# 2. HEALTH CHECK LOCAL
# ========================================

function Test-Health {
    Write-Host "🏥 Doctic Health Check - $(Get-Date)" -ForegroundColor Cyan
    Write-Host "======================================" -ForegroundColor Cyan
    
    $errors = 0
    
    # 1. Frontend (Vite)
    Write-Host "[1/5] Checking Frontend..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Frontend: Running" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✗ Frontend: DOWN" -ForegroundColor Red
        $errors++
    }
    
    # 2. Backend
    Write-Host "[2/5] Checking Backend API..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/patients" -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "  ✓ Backend: Running" -ForegroundColor Green
        }
    } catch {
        Write-Host "  ✗ Backend: DOWN" -ForegroundColor Red
        $errors++
    }
    
    # 3. Port 3001
    Write-Host "[3/5] Checking Ports..." -ForegroundColor Yellow
    $port3001 = Get-NetTCPConnection -LocalPort 3001 -State Listen -ErrorAction SilentlyContinue
    $port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue
    
    if ($port3001) {
        Write-Host "  ✓ Port 3001: Listening" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Port 3001: Not listening" -ForegroundColor Red
        $errors++
    }
    
    if ($port5000) {
        Write-Host "  ✓ Port 5000: Listening" -ForegroundColor Green
    } else {
        Write-Host "  ✗ Port 5000: Not listening" -ForegroundColor Red
        $errors++
    }
    
    # 4. Disk Space
    Write-Host "[4/5] Checking Disk Space..." -ForegroundColor Yellow
    $drive = Get-PSDrive C
    $usedPercent = [math]::Round(($drive.Used / ($drive.Used + $drive.Free)) * 100, 2)
    if ($usedPercent -lt 80) {
        Write-Host "  ✓ Disk C: ${usedPercent}% used" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Disk C: ${usedPercent}% used (cleanup needed)" -ForegroundColor Yellow
    }
    
    # 5. Memory
    Write-Host "[5/5] Checking Memory..." -ForegroundColor Yellow
    $os = Get-CimInstance Win32_OperatingSystem
    $memoryPercent = [math]::Round((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100, 2)
    if ($memoryPercent -lt 90) {
        Write-Host "  ✓ Memory: ${memoryPercent}% used" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Memory: ${memoryPercent}% used" -ForegroundColor Yellow
    }
    
    Write-Host "======================================" -ForegroundColor Cyan
    if ($errors -eq 0) {
        Write-Host "✅ All checks passed!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $errors check(s) failed" -ForegroundColor Red
        return $false
    }
}

# ========================================
# 3. BACKUP LOCAL (Dev)
# ========================================

function Invoke-Backup {
    $backupDir = "backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$backupDir\backup_${timestamp}.zip"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    Write-Host "📦 Creating backup..." -ForegroundColor Cyan
    
    # Backup code + config
    $filesToBackup = @(
        "src",
        "prisma",
        "middleware",
        "config",
        "tests",
        "package.json",
        ".env"
    )
    
    Compress-Archive -Path $filesToBackup -DestinationPath $backupFile -Force
    
    $size = (Get-Item $backupFile).Length / 1MB
    $sizeFormatted = [math]::Round($size, 2)
    Write-Host "✅ Backup created: $backupFile (${sizeFormatted} MB)" -ForegroundColor Green
}

# ========================================
# 4. MONITORING TEMPS RÉEL
# ========================================

function Start-Monitor {
    while ($true) {
        Clear-Host
        Write-Host "=========================================" -ForegroundColor Cyan
        Write-Host "Doctic Medical OS - Real-time Monitor" -ForegroundColor Cyan
        Write-Host "=========================================" -ForegroundColor Cyan
        Write-Host ""
        
        # Processus Node.js
        Write-Host "NODE PROCESSES:" -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Format-Table ProcessName, Id, CPU, WorkingSet -AutoSize
        
        # Endpoints
        Write-Host "ENDPOINTS:" -ForegroundColor Yellow
        try {
            $frontend = Invoke-WebRequest -Uri "http://localhost:3001" -UseBasicParsing -TimeoutSec 2
            Write-Host "  Frontend (3001): ✓ UP" -ForegroundColor Green
        } catch {
            Write-Host "  Frontend (3001): ✗ DOWN" -ForegroundColor Red
        }
        
        try {
            $backend = Invoke-WebRequest -Uri "http://localhost:5000/api/patients" -UseBasicParsing -TimeoutSec 2
            Write-Host "  Backend (5000): ✓ UP" -ForegroundColor Green
        } catch {
            Write-Host "  Backend (5000): ✗ DOWN" -ForegroundColor Red
        }
        
        # System
        Write-Host ""
        Write-Host "SYSTEM:" -ForegroundColor Yellow
        $os = Get-CimInstance Win32_OperatingSystem
        $cpu = Get-CimInstance Win32_Processor
        $memPercent = [math]::Round((($os.TotalVisibleMemorySize - $os.FreePhysicalMemory) / $os.TotalVisibleMemorySize) * 100, 2)
        Write-Host "  Memory: ${memPercent}%"
        Write-Host "  Uptime: $([math]::Round((Get-Date) - $os.LastBootUpTime).TotalHours, 2) hours"
        
        Write-Host ""
        Write-Host "Press Ctrl+C to exit..." -ForegroundColor Gray
        Start-Sleep -Seconds 5
    }
}

# ========================================
# 5. CLEANUP
# ========================================

function Invoke-Cleanup {
    Write-Host "🧹 Cleaning up..." -ForegroundColor Cyan
    
    # Nettoyer node_modules cache
    Write-Host "Clearing npm cache..."
    npm cache clean --force
    
    # Nettoyer dist
    if (Test-Path "dist") {
        Remove-Item "dist" -Recurse -Force
        Write-Host "  ✓ Removed dist/" -ForegroundColor Green
    }
    
    # Nettoyer vieux backups (> 30 jours)
    if (Test-Path "backups") {
        $oldBackups = Get-ChildItem "backups\*.zip" | Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-30)}
        foreach ($backup in $oldBackups) {
            Remove-Item $backup.FullName
            Write-Host "  ✓ Removed old backup: $($backup.Name)" -ForegroundColor Green
        }
    }
    
    Write-Host "✅ Cleanup completed" -ForegroundColor Green
}

# ========================================
# 6. MENU ADMIN
# ========================================

function Show-AdminMenu {
    while ($true) {
        Clear-Host
        Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "║   🏥 Doctic Admin Menu (Windows)     ║" -ForegroundColor Cyan
        Write-Host "║   Version 2.1.0                        ║" -ForegroundColor Cyan
        Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "1)  Health Check" -ForegroundColor White
        Write-Host "2)  Backup Now" -ForegroundColor White
        Write-Host "3)  Monitor Real-time" -ForegroundColor White
        Write-Host "4)  Generate Secrets" -ForegroundColor White
        Write-Host "5)  Cleanup" -ForegroundColor White
        Write-Host "6)  Start Dev Servers" -ForegroundColor White
        Write-Host "7)  Run Tests" -ForegroundColor White
        Write-Host "0)  Exit" -ForegroundColor White
        Write-Host ""
        
        $choice = Read-Host "Select option [0-7]"
        
        switch ($choice) {
            "1" { Test-Health }
            "2" { Invoke-Backup }
            "3" { Start-Monitor }
            "4" { Generate-Secrets }
            "5" { Invoke-Cleanup }
            "6" {
                Write-Host "Starting Frontend..." -ForegroundColor Yellow
                Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"
                Start-Sleep -Seconds 3
                Write-Host "Starting Backend..." -ForegroundColor Yellow
                Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; node server.js"
            }
            "7" {
                Write-Host "Running tests..." -ForegroundColor Yellow
                npm test
            }
            "0" { return }
            default { Write-Host "Invalid option" -ForegroundColor Red }
        }
        
        Write-Host ""
        Read-Host "Press Enter to continue"
    }
}

# ========================================
# MAIN
# ========================================

param(
    [Parameter(Position=0)]
    [string]$Command = "menu"
)

switch ($Command.ToLower()) {
    "generate-secrets" { Generate-Secrets }
    "health-check" { Test-Health }
    "backup" { Invoke-Backup }
    "monitor" { Start-Monitor }
    "cleanup" { Invoke-Cleanup }
    "menu" { Show-AdminMenu }
    default {
        Write-Host "Usage: .\admin-utils.ps1 [generate-secrets|health-check|backup|monitor|cleanup|menu]" -ForegroundColor Yellow
    }
}
