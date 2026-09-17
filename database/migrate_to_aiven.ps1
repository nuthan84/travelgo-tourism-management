# TravelGo — Aiven Cloud MySQL Secure Migration Script
# Imports database/schema.sql and database/seed.sql into Aiven MySQL over SSL
# Password is never printed or logged.

param (
    [string]$HostName,
    [int]$Port = 3306,
    [string]$User = "avnadmin",
    [string]$Database = "tourism_db"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "       TravelGo - Aiven MySQL Cloud Database Migration   " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Locate mysql.exe
$mysqlExe = (Get-Command mysql.exe -ErrorAction SilentlyContinue).Source
if (-not $mysqlExe) {
    if (Test-Path "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe") {
        $mysqlExe = "C:\Program Files\MySQL\MySQL Server 9.6\bin\mysql.exe"
    } elseif (Test-Path "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe") {
        $mysqlExe = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
    } else {
        Write-Error "mysql.exe client not found in PATH or standard installation directories."
        exit 1
    }
}
Write-Host "[✓] MySQL Client: $mysqlExe" -ForegroundColor Green

# 2. Prompt for Aiven Host if not provided
if (-not $HostName) {
    $HostName = Read-Host "Enter Aiven MySQL Host (e.g. mysql-xxxx-yyyy.aivencloud.com)"
}
if (-not $Port -or $Port -eq 3306) {
    $portInput = Read-Host "Enter Aiven MySQL Port [Default: $Port]"
    if ($portInput) { $Port = [int]$portInput }
}
if (-not $User) {
    $User = Read-Host "Enter Aiven MySQL Username [Default: avnadmin]"
    if (-not $User) { $User = "avnadmin" }
}

# 3. Securely prompt for password
Write-Host "Enter Aiven MySQL Password (input will be hidden):" -ForegroundColor Yellow
$secPass = Read-Host -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPass)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

# Set MYSQL_PWD environment variable for the process to avoid CLI argument leakage
$env:MYSQL_PWD = $plainPassword

$schemaPath = Join-Path $PSScriptRoot "schema.sql"
$seedPath = Join-Path $PSScriptRoot "seed.sql"

if (-not (Test-Path $schemaPath)) {
    Write-Error "schema.sql not found at $schemaPath"
    $env:MYSQL_PWD = $null
    exit 1
}

Write-Host "`n[*] Connecting to Aiven MySQL ($HostName`:$Port) and creating database '$Database'..." -ForegroundColor Cyan

# Step 1: Ensure database exists
$createDbCmd = "CREATE DATABASE IF NOT EXISTS \`$Database\`;"
& $mysqlExe -h $HostName -P $Port -u $User --ssl-mode=REQUIRED -e $createDbCmd 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Could not connect or create database. Please verify host, port, credentials and SSL." -ForegroundColor Red
    $env:MYSQL_PWD = $null
    exit 1
}
Write-Host "[✓] Database '$Database' verified." -ForegroundColor Green

# Step 2: Import schema.sql
Write-Host "[*] Importing schema.sql..." -ForegroundColor Cyan
Get-Content -Path $schemaPath -Raw | & $mysqlExe -h $HostName -P $Port -u $User --ssl-mode=REQUIRED $Database 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[!] Failed to import schema.sql" -ForegroundColor Red
    $env:MYSQL_PWD = $null
    exit 1
}
Write-Host "[✓] Schema imported successfully." -ForegroundColor Green

# Step 3: Import seed.sql
if (Test-Path $seedPath) {
    Write-Host "[*] Importing seed.sql..." -ForegroundColor Cyan
    Get-Content -Path $seedPath -Raw | & $mysqlExe -h $HostName -P $Port -u $User --ssl-mode=REQUIRED $Database 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[!] Failed to import seed.sql" -ForegroundColor Red
        $env:MYSQL_PWD = $null
        exit 1
    }
    Write-Host "[✓] Seed data imported successfully." -ForegroundColor Green
}

# Step 4: Verification Query
Write-Host "`n[*] Verifying table row counts in '$Database'..." -ForegroundColor Cyan
$verifySql = @"
SELECT 'users' AS tableName, COUNT(*) AS rowCount FROM users
UNION ALL
SELECT 'destinations', COUNT(*) FROM destinations
UNION ALL
SELECT 'tour_packages', COUNT(*) FROM tour_packages
UNION ALL
SELECT 'package_images', COUNT(*) FROM package_images
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'wishlist', COUNT(*) FROM wishlist;
"@

& $mysqlExe -h $HostName -P $Port -u $User --ssl-mode=REQUIRED $Database -e $verifySql

# Clean up memory
$env:MYSQL_PWD = $null
$plainPassword = $null

Write-Host "`n[✓] Aiven MySQL migration completed successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
