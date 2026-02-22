# Kholo & May Boutique - Azure Deployment Guide

This guide provides step-by-step instructions for deploying the e-commerce platform to Microsoft Azure Free Tier.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Azure Services Setup](#azure-services-setup)
3. [Database Configuration](#database-configuration)
4. [Storage Configuration](#storage-configuration)
5. [Application Deployment](#application-deployment)
6. [Environment Variables](#environment-variables)
7. [Payment Gateway Setup](#payment-gateway-setup)
8. [Custom Domain Configuration](#custom-domain-configuration)
9. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

Before you begin, ensure you have:

- An Azure account with Free Tier eligibility
- A GitHub account
- Node.js 18+ installed locally
- Git installed locally
- Azure CLI installed (optional but recommended)

---

## Azure Services Setup

### 1. Create Azure Account

1. Visit [Azure Free Account](https://azure.microsoft.com/free/)
2. Sign up with your email
3. Verify your identity (credit card required for verification, but you won't be charged)

### 2. Create Resource Group

```bash
# Login to Azure
az login

# Create resource group
az group create --name kholomayboutique-rg --location southafricanorth
```

---

## Database Configuration

### Option A: Azure SQL Database Free Tier

1. **Create SQL Server:**
   ```bash
   az sql server create \
     --name kholomayboutique-sql \
     --resource-group kholomayboutique-rg \
     --location southafricanorth \
     --admin-user sqladmin \
     --admin-password "YourSecurePassword123!"
   ```

2. **Create Free Tier Database:**
   ```bash
   az sql db create \
     --resource-group kholomayboutique-rg \
     --server kholomayboutique-sql \
     --name kholomayboutique \
     --service-objective Free
   ```

3. **Configure Firewall:**
   ```bash
   # Allow Azure services
   az sql server firewall-rule create \
     --resource-group kholomayboutique-rg \
     --server kholomayboutique-sql \
     --name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0

   # Allow your IP for development
   az sql server firewall-rule create \
     --resource-group kholomayboutique-rg \
     --server kholomayboutique-sql \
     --name AllowDevelopment \
     --start-ip-address YOUR_IP \
     --end-ip-address YOUR_IP
   ```

4. **Get Connection String:**
   ```bash
   az sql db show-connection-string \
     --server kholomayboutique-sql \
     --name kholomayboutique \
     --client ado.net
   ```

### Option B: Local Development with SQLite

For local development, you can use SQLite:

```env
DATABASE_URL="file:./dev.db"
```

---

## Storage Configuration

### Azure Blob Storage Setup

1. **Create Storage Account:**
   ```bash
   az storage account create \
     --name kholomayboutique \
     --resource-group kholomayboutique-rg \
     --location southafricanorth \
     --sku Standard_LRS \
     --kind StorageV2 \
     --access-tier Hot
   ```

2. **Get Connection String:**
   ```bash
   az storage account show-connection-string \
     --name kholomayboutique \
     --resource-group kholomayboutique-rg
   ```

3. **Create Containers:**
   ```bash
   # Products container
   az storage container create \
     --name products \
     --account-name kholomayboutique \
     --public-access blob

   # Catalogs container
   az storage container create \
     --name catalogs \
     --account-name kholomayboutique \
     --public-access blob
   ```

---

## Application Deployment

### 1. Create Azure Web App

```bash
# Create App Service Plan (Free Tier)
az appservice plan create \
  --name kholomayboutique-plan \
  --resource-group kholomayboutique-rg \
  --sku F1 \
  --is-linux

# Create Web App
az webapp create \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --plan kholomayboutique-plan \
  --runtime "NODE|18-lts"
```

### 2. Configure Web App Settings

```bash
# Set Node.js version
az webapp config appsettings set \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --settings WEBSITE_NODE_DEFAULT_VERSION=18-lts

# Enable logging
az webapp log config \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --application-logging filesystem \
  --level information
```

### 3. Set Environment Variables

```bash
az webapp config appsettings set \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --settings \
    DATABASE_URL="your-connection-string" \
    JWT_SECRET="your-jwt-secret" \
    NEXTAUTH_SECRET="your-nextauth-secret" \
    NEXTAUTH_URL="https://kholomayboutique.azurewebsites.net" \
    AZURE_STORAGE_CONNECTION_STRING="your-storage-connection-string" \
    AZURE_STORAGE_ACCOUNT_NAME="kholomayboutique"
```

### 4. Deploy via GitHub Actions

1. **Create Service Principal for GitHub Actions:**
   ```bash
   az ad sp create-for-rbac \
     --name "kholomayboutique-github" \
     --role contributor \
     --scopes /subscriptions/<subscription-id>/resourceGroups/kholomayboutique-rg \
     --sdk-auth
   ```

2. **Add GitHub Secrets:**
   Go to your GitHub repository → Settings → Secrets and variables → Actions

   Add the following secrets:
   - `AZURE_CREDENTIALS` - The JSON output from the previous command
   - `DATABASE_URL` - Your database connection string
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
   - `NEXTAUTH_URL` - Your production URL
   - `AZURE_STORAGE_CONNECTION_STRING` - Storage connection string
   - `AZURE_STORAGE_ACCOUNT_NAME` - Storage account name
   - Payment gateway credentials (see Payment Gateway Setup)

3. **Push to Deploy:**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

---

## Environment Variables

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `sqlserver://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `NEXTAUTH_SECRET` | NextAuth.js secret | `your-nextauth-secret` |
| `NEXTAUTH_URL` | Production URL | `https://yourdomain.com` |
| `AZURE_STORAGE_CONNECTION_STRING` | Azure Storage connection | `DefaultEndpointsProtocol=...` |
| `AZURE_STORAGE_ACCOUNT_NAME` | Storage account name | `kholomayboutique` |

### Payment Gateway Variables

| Variable | Description |
|----------|-------------|
| `PAYFAST_MERCHANT_ID` | PayFast merchant ID |
| `PAYFAST_MERCHANT_KEY` | PayFast merchant key |
| `PAYFAST_PASSPHRASE` | PayFast passphrase |
| `PAYFLEX_API_KEY` | Payflex API key |
| `PAYFLEX_API_SECRET` | Payflex API secret |
| `PAYFLEX_MERCHANT_ID` | Payflex merchant ID |
| `PAYJUSTNOW_API_KEY` | PayJustNow API key |
| `PAYJUSTNOW_API_SECRET` | PayJustNow API secret |
| `PAYJUSTNOW_MERCHANT_ID` | PayJustNow merchant ID |

---

## Payment Gateway Setup

### PayFast Setup

1. Register at [PayFast](https://www.payfast.co.za/)
2. Complete merchant verification
3. Get your credentials from the Settings page
4. Set up Instant Payment Notification (IPN) URL:
   - Production: `https://yourdomain.com/api/webhooks/payment/payfast`
   - Sandbox: Use sandbox credentials for testing

### Payflex Setup

1. Register at [Payflex](https://payflex.co.za/)
2. Complete merchant onboarding
3. Get API credentials from the merchant portal
4. Configure webhook URL for payment confirmations

### PayJustNow Setup

1. Register at [PayJustNow](https://payjustnow.co.za/)
2. Complete merchant verification
3. Get API credentials
4. Configure callback URLs

---

## Custom Domain Configuration

### 1. Add Custom Domain

```bash
az webapp config hostname add \
  --webapp-name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --hostname yourdomain.com
```

### 2. Configure DNS

Add the following DNS records to your domain:

**A Record:**
- Name: `@`
- Value: Azure Web App IP address

**CNAME Record:**
- Name: `www`
- Value: `kholomayboutique.azurewebsites.net`

### 3. Enable HTTPS

```bash
az webapp config ssl bind \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg \
  --certificate-thumbprint <thumbprint> \
  --ssl-type SNI
```

---

## Monitoring & Maintenance

### Application Insights

```bash
az monitor app-insights component create \
  --app kholomayboutique-insights \
  --location southafricanorth \
  --resource-group kholomayboutique-rg
```

### Log Streaming

```bash
az webapp log tail \
  --name kholomayboutique \
  --resource-group kholomayboutique-rg
```

### Database Backups

Azure SQL Database Free Tier includes basic backup:
- Retention: 7 days
- Automatic backups enabled

For additional backup options, upgrade to a paid tier.

### Scaling Considerations

When you need to scale beyond Free Tier:

1. **App Service:** Upgrade to Basic (B1) or Standard (S1) tier
2. **Database:** Upgrade to Basic or Standard tier
3. **Storage:** Consider Premium storage for better performance

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors:**
   - Check firewall rules
   - Verify connection string format
   - Ensure Azure services are allowed

2. **Application Startup Failures:**
   - Check application logs
   - Verify all environment variables are set
   - Ensure Node.js version compatibility

3. **Storage Upload Issues:**
   - Verify storage account key
   - Check container permissions
   - Ensure CORS is configured

### Useful Commands

```bash
# Check web app status
az webapp show --name kholomayboutique --resource-group kholomayboutique-rg

# Restart web app
az webapp restart --name kholomayboutique --resource-group kholomayboutique-rg

# View deployment logs
az webapp deployment log show --name kholomayboutique --resource-group kholomayboutique-rg
```

---

## Security Checklist

- [ ] All secrets stored in Azure Key Vault or GitHub Secrets
- [ ] HTTPS enforced
- [ ] Database firewall configured
- [ ] Storage containers have appropriate access levels
- [ ] JWT secrets are strong and unique
- [ ] Payment gateway credentials are secure
- [ ] Regular security updates applied

---

## Support

For issues or questions:
- Azure Documentation: https://docs.microsoft.com/azure/
- Next.js Documentation: https://nextjs.org/docs
- Prisma Documentation: https://www.prisma.io/docs

---

**Last Updated:** January 2024
**Version:** 1.0.0
