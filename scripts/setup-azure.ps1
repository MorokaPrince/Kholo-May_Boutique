# ===========================================
# Azure Resources Setup Script for Kholo and May Boutique
# ===========================================
# Run this script after installing Azure CLI and logging in with 'az login'
# This script creates all required Azure Free Tier resources

param(
    [string]$ResourceGroup = "kholo-may-boutique-rg",
    [string]$Location = "southafricanorth",
    [string]$AppName = "kholo-may-boutique",
    [string]$DbServerName = "kholo-may-db-server",
    [string]$DbName = "kholo-may-boutique-db",
    [string]$StorageAccountName = "kholomaystorage"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Kholo and May Boutique - Azure Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Azure CLI is installed
Write-Host "Checking Azure CLI installation..." -ForegroundColor Yellow
$azVersion = az --version 2>$null
if (-not $azVersion) {
    Write-Host "Azure CLI is not installed. Please install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}
Write-Host "Azure CLI is installed" -ForegroundColor Green

# Check if logged in to Azure
Write-Host "Checking Azure login status..." -ForegroundColor Yellow
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Host "Please log in to Azure..." -ForegroundColor Yellow
    az login
    $account = az account show | ConvertFrom-Json
}
Write-Host "Logged in as: $($account.user.name)" -ForegroundColor Green
Write-Host "  Subscription: $($account.name)" -ForegroundColor Gray

# Set default subscription if needed
Write-Host ""
Write-Host "Available subscriptions:" -ForegroundColor Yellow
az account list --output table
Write-Host ""

$continue = Read-Host "Continue with current subscription? (Y/n)"
if ($continue -eq "n" -or $continue -eq "N") {
    $subId = Read-Host "Enter subscription ID to use"
    az account set --subscription $subId
}

# Create Resource Group
Write-Host ""
Write-Host "Creating Resource Group: $ResourceGroup" -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location
Write-Host "Resource Group created" -ForegroundColor Green

# ===========================================
# 1. Azure SQL Database (Free Tier)
# ===========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Creating Azure SQL Database (Free Tier)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Generate random password for SQL admin
$sqlPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 16 | ForEach-Object {[char]$_})
$sqlPassword = "KmBoutique@$sqlPassword"

Write-Host "Creating SQL Server: $DbServerName" -ForegroundColor Yellow
az sql server create `
    --name $DbServerName `
    --resource-group $ResourceGroup `
    --location $Location `
    --admin-user "sqladmin" `
    --admin-password $sqlPassword

Write-Host "SQL Server created" -ForegroundColor Green

# Create firewall rule to allow Azure services
Write-Host "Configuring firewall rules..." -ForegroundColor Yellow
az sql server firewall-rule create `
    --name "AllowAzureServices" `
    --server $DbServerName `
    --resource-group $ResourceGroup `
    --start-ip-address "0.0.0.0" `
    --end-ip-address "0.0.0.0"

# Add your current IP for development
$myIp = (Invoke-RestMethod -Uri "https://api.ipify.org").ToString()
Write-Host "Adding your IP ($myIp) to firewall..." -ForegroundColor Yellow
az sql server firewall-rule create `
    --name "AllowDevIP" `
    --server $DbServerName `
    --resource-group $ResourceGroup `
    --start-ip-address $myIp `
    --end-ip-address $myIp

Write-Host "Firewall rules configured" -ForegroundColor Green

# Create database with free tier (Basic tier - lowest cost option)
Write-Host "Creating SQL Database: $DbName (Basic tier)" -ForegroundColor Yellow
az sql db create `
    --name $DbName `
    --server $DbServerName `
    --resource-group $ResourceGroup `
    --service-objective "Basic" `
    --max-size "2GB"

Write-Host "SQL Database created" -ForegroundColor Green

# Get connection string
$connectionString = az sql db show-connection-string `
    --name $DbName `
    --server $DbServerName `
    --client "ado.net" `
    --output tsv

$connectionString = $connectionString.Replace("{your_password}", $sqlPassword)

Write-Host ""
Write-Host "SQL Connection String (save this for .env.local):" -ForegroundColor Green
Write-Host $connectionString -ForegroundColor White

# ===========================================
# 2. Azure Blob Storage (Free Tier)
# ===========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "2. Creating Azure Blob Storage" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Storage account name must be globally unique and lowercase
$storageAccountName = $storageAccountName.ToLower()

Write-Host "Creating Storage Account: $storageAccountName" -ForegroundColor Yellow
az storage account create `
    --name $storageAccountName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku "Standard_LRS" `
    --kind "StorageV2" `
    --access-tier "Hot" `
    --allow-blob-public-access true

Write-Host "Storage Account created" -ForegroundColor Green

# Get storage account key
$storageKey = az storage account keys list `
    --account-name $storageAccountName `
    --resource-group $ResourceGroup `
    --query "[0].value" `
    --output tsv

# Create containers
Write-Host "Creating blob containers..." -ForegroundColor Yellow
az storage container create --name "products" --account-name $storageAccountName --account-key $storageKey --public-access "blob"
az storage container create --name "catalogs" --account-name $storageAccountName --account-key $storageKey --public-access "blob"
az storage container create --name "banners" --account-name $storageAccountName --account-key $storageKey --public-access "blob"

Write-Host "Blob containers created (products, catalogs, banners)" -ForegroundColor Green

Write-Host ""
Write-Host "Storage Credentials (save these for .env.local):" -ForegroundColor Green
Write-Host "AZURE_STORAGE_ACCOUNT_NAME: $storageAccountName" -ForegroundColor White
Write-Host "AZURE_STORAGE_ACCOUNT_KEY: $storageKey" -ForegroundColor White
Write-Host "AZURE_STORAGE_CONNECTION_STRING: DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=$storageKey;EndpointSuffix=core.windows.net" -ForegroundColor White

# ===========================================
# 3. Azure App Service (Free Tier)
# ===========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "3. Creating Azure App Service (Free Tier)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create App Service Plan (Free tier)
$appServicePlan = "$AppName-plan"
Write-Host "Creating App Service Plan: $appServicePlan (F1 Free tier)" -ForegroundColor Yellow
az appservice plan create `
    --name $appServicePlan `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku "F1" `
    --is-linux

Write-Host "App Service Plan created" -ForegroundColor Green

# Create Web App
Write-Host "Creating Web App: $AppName" -ForegroundColor Yellow
$runtime = "NODE:18-lts"
az webapp create `
    --name $AppName `
    --resource-group $ResourceGroup `
    --plan $appServicePlan `
    --runtime $runtime

Write-Host "Web App created" -ForegroundColor Green

# Configure environment variables for the web app
Write-Host "Configuring app settings..." -ForegroundColor Yellow

# Generate JWT secret
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

$storageConnectionString = "DefaultEndpointsProtocol=https;AccountName=$storageAccountName;AccountKey=$storageKey;EndpointSuffix=core.windows.net"

az webapp config appsettings set `
    --name $AppName `
    --resource-group $ResourceGroup `
    --settings `
        "DATABASE_URL=$connectionString" `
        "JWT_SECRET=$jwtSecret" `
        "AZURE_STORAGE_ACCOUNT_NAME=$storageAccountName" `
        "AZURE_STORAGE_ACCOUNT_KEY=$storageKey" `
        "AZURE_STORAGE_CONNECTION_STRING=$storageConnectionString" `
        "NODE_ENV=production"

Write-Host "App settings configured" -ForegroundColor Green

# Get the web app URL
$appUrl = az webapp show --name $AppName --resource-group $ResourceGroup --query "defaultHostName" --output tsv

Write-Host ""
Write-Host "Web App URL: https://$appUrl" -ForegroundColor Green

# ===========================================
# 4. Output Summary
# ===========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created Resources:" -ForegroundColor Yellow
Write-Host "  - Resource Group: $ResourceGroup"
Write-Host "  - SQL Server: $DbServerName.database.windows.net"
Write-Host "  - SQL Database: $DbName"
Write-Host "  - Storage Account: $storageAccountName"
Write-Host "  - App Service Plan: $appServicePlan (F1 Free)"
Write-Host "  - Web App: $AppName"
Write-Host ""
Write-Host "Important: Save the following credentials securely!" -ForegroundColor Red
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "ENVIRONMENT VARIABLES FOR .env.local" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "# Database"
Write-Host "DATABASE_URL=`"$connectionString`""
Write-Host ""
Write-Host "# Authentication"
Write-Host "JWT_SECRET=`"$jwtSecret`""
Write-Host ""
Write-Host "# Azure Storage"
Write-Host "AZURE_STORAGE_ACCOUNT_NAME=`"$storageAccountName`""
Write-Host "AZURE_STORAGE_ACCOUNT_KEY=`"$storageKey`""
Write-Host "AZURE_STORAGE_CONNECTION_STRING=`"$storageConnectionString`""
Write-Host ""
Write-Host "# SQL Admin Credentials"
Write-Host "SQL_ADMIN_USER=sqladmin"
Write-Host "SQL_ADMIN_PASSWORD=$sqlPassword"
Write-Host ""
Write-Host "# App URL"
Write-Host "NEXT_PUBLIC_APP_URL=https://$appUrl"
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "NEXT STEPS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "1. Copy the environment variables above to .env.local"
Write-Host "2. Run: npx prisma migrate deploy"
Write-Host "3. Push to GitHub to trigger CI/CD deployment"
Write-Host "4. Configure payment gateway credentials in Azure App Settings"
Write-Host "5. Configure custom domain (optional)"
Write-Host ""

# Save credentials to file
$credentialsFile = "azure-credentials.txt"
$credentials = @"
========================================
Kholo and May Boutique - Azure Credentials
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
========================================

RESOURCE GROUP: $ResourceGroup
LOCATION: $Location

SQL SERVER: $DbServerName.database.windows.net
SQL DATABASE: $DbName
SQL ADMIN USER: sqladmin
SQL ADMIN PASSWORD: $sqlPassword

DATABASE_URL=$connectionString

STORAGE ACCOUNT: $storageAccountName
STORAGE KEY: $storageKey

WEB APP: $AppName
WEB APP URL: https://$appUrl

JWT_SECRET=$jwtSecret

========================================
"@

$credentials | Out-File -FilePath $credentialsFile -Encoding UTF8
Write-Host "Credentials saved to: $credentialsFile" -ForegroundColor Green
Write-Host "IMPORTANT: Keep this file secure and do not commit to Git!" -ForegroundColor Red
