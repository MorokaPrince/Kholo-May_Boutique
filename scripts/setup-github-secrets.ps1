# ===========================================
# GitHub Secrets Setup Script for Kholo and May Boutique
# ===========================================
# This script sets up GitHub secrets for CI/CD pipeline
# Run this after creating Azure resources

param(
    [string]$RepoOwner = "MorokaPrince",
    [string]$RepoName = "Kholo-May_Boutique"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Secrets Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if GitHub CLI is installed
Write-Host "Checking GitHub CLI installation..." -ForegroundColor Yellow
$ghVersion = gh --version 2>$null
if (-not $ghVersion) {
    Write-Host "GitHub CLI is not installed. Please install from: https://cli.github.com/" -ForegroundColor Red
    Write-Host "Alternatively, you can set secrets manually in the GitHub web interface." -ForegroundColor Yellow
    exit 1
}
Write-Host "GitHub CLI is installed" -ForegroundColor Green

# Check if authenticated
Write-Host "Checking GitHub authentication..." -ForegroundColor Yellow
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please authenticate with GitHub CLI:" -ForegroundColor Yellow
    gh auth login
}
Write-Host "GitHub authentication verified" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Setting up secrets" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Prompt for secrets
$secrets = @{}

# Database
Write-Host "Enter your DATABASE_URL (Prisma connection string):" -ForegroundColor Cyan
$secrets["DATABASE_URL"] = Read-Host

# Authentication
Write-Host "Enter your JWT_SECRET (or press Enter to generate):" -ForegroundColor Cyan
$jwtSecret = Read-Host
if ([string]::IsNullOrWhiteSpace($jwtSecret)) {
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
    Write-Host "Generated JWT_SECRET: $jwtSecret" -ForegroundColor Gray
}
$secrets["JWT_SECRET"] = $jwtSecret
$secrets["NEXTAUTH_SECRET"] = $jwtSecret

# NextAuth URL
Write-Host "Enter your NEXTAUTH_URL (e.g., https://your-app.azurewebsites.net):" -ForegroundColor Cyan
$secrets["NEXTAUTH_URL"] = Read-Host

# Azure Storage
Write-Host "Enter your AZURE_STORAGE_ACCOUNT_NAME:" -ForegroundColor Cyan
$secrets["AZURE_STORAGE_ACCOUNT_NAME"] = Read-Host

Write-Host "Enter your AZURE_STORAGE_ACCOUNT_KEY:" -ForegroundColor Cyan
$secrets["AZURE_STORAGE_ACCOUNT_KEY"] = Read-Host

Write-Host "Enter your AZURE_STORAGE_CONNECTION_STRING:" -ForegroundColor Cyan
$secrets["AZURE_STORAGE_CONNECTION_STRING"] = Read-Host

# Set secrets
Write-Host ""
Write-Host "Setting secrets in GitHub..." -ForegroundColor Yellow

foreach ($secret in $secrets.GetEnumerator()) {
    Write-Host "Setting secret: $($secret.Key)" -ForegroundColor Gray
    $secret.Value | gh secret set $secret.Key --repo "$RepoOwner/$RepoName"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Azure Credentials for CI/CD" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "To enable CI/CD deployment, you need to create an Azure Service Principal"
Write-Host "and add its credentials as AZURE_CREDENTIALS secret."
Write-Host ""
Write-Host "Run the following Azure CLI command to create a Service Principal:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  az ad sp create-for-rbac --name 'kholo-may-boutique-deploy' --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/kholo-may-boutique-rg --sdk-auth" -ForegroundColor White
Write-Host ""
Write-Host "Then copy the JSON output and set it as AZURE_CREDENTIALS secret:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  `<json-output`> | gh secret set AZURE_CREDENTIALS --repo '$RepoOwner/$RepoName'" -ForegroundColor White
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Secrets setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Create Azure Service Principal for deployment"
Write-Host "2. Set AZURE_CREDENTIALS secret"
Write-Host "3. Update payment gateway credentials with actual values"
Write-Host "4. Push changes to trigger CI/CD pipeline"
Write-Host ""
