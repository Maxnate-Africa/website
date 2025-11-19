param(
    [switch]$Clean
)

$ErrorActionPreference = 'Stop'

# Resolve repo root as current script's parent parent
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$Dist = Join-Path $RepoRoot 'dist'
$DistWebsite = Join-Path $Dist 'website'
$DistAdmin = Join-Path $Dist 'admin'

Write-Host "Preparing dist folders for Appwrite Hosting..." -ForegroundColor Cyan

if ($Clean.IsPresent -and (Test-Path $Dist)) {
    Write-Host "Cleaning existing dist folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $Dist
}

# Ensure dist directories exist
New-Item -ItemType Directory -Force -Path $DistWebsite | Out-Null
New-Item -ItemType Directory -Force -Path $DistAdmin | Out-Null

Write-Host "Copying website files..." -ForegroundColor Yellow

# Copy website (exclude admin, dist, and tooling folders)
$excludeDirs = @('admin', 'dist', '.git', '.github', '.vscode', 'deploy', 'scripts', 'node_modules')
Get-ChildItem -Path $RepoRoot -Exclude $excludeDirs | ForEach-Object {
    if ($_.PSIsContainer) {
        if ($excludeDirs -notcontains $_.Name) {
            Copy-Item -Path $_.FullName -Destination $DistWebsite -Recurse -Force
        }
    } else {
        if ($_.Extension -ne '.ps1') {
            Copy-Item -Path $_.FullName -Destination $DistWebsite -Force
        }
    }
}

Write-Host "Copying admin files..." -ForegroundColor Yellow

# Copy admin folder
$AdminSrc = Join-Path $RepoRoot 'admin'
if (Test-Path $AdminSrc) {
    Copy-Item -Path "$AdminSrc\*" -Destination $DistAdmin -Recurse -Force
}

Write-Host "Done. Upload these to Appwrite Hosting:" -ForegroundColor Green
Write-Host " - Website: $DistWebsite" -ForegroundColor Green
Write-Host " - Admin:   $DistAdmin" -ForegroundColor Green
