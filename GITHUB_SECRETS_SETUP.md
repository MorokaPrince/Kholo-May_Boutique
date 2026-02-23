# GitHub Secrets Setup Guide

## Required GitHub Secrets for CI/CD Pipeline

To enable automated deployment to Azure, you need to configure the following secrets in your GitHub repository.

### How to Add Secrets

1. Go to your GitHub repository: https://github.com/MorokaPrince/Kholo-May_Boutique
2. Click on **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add each secret below

---

## Required Secrets

### 1. AZURE_CREDENTIALS (Required for Deployment)

Create a Service Principal by running this Azure CLI command:

```bash
az ad sp create-for-rbac --name "kholo-may-boutique-deploy" --role contributor --scopes /subscriptions/<subscription-id>/resourceGroups/kholo-may-boutique-rg --sdk-auth
```

Then use the JSON output as the secret value.

### 2. DATABASE_URL

Get from your `.env.local` file - the Prisma-compatible connection string.

### 3. JWT_SECRET

Generate a random 32-character string or use:

```bash
openssl rand -base64 32
```

### 4. NEXTAUTH_SECRET

Same as JWT_SECRET or generate another random string.

### 5. NEXTAUTH_URL

Your production URL: `https://kholo-may-boutique.azurewebsites.net`

### 6. AZURE_STORAGE_ACCOUNT_NAME

Your Azure Storage account name (from Azure Portal).

### 7. AZURE_STORAGE_ACCOUNT_KEY

Get from Azure Portal > Storage Account > Access Keys.

### 8. AZURE_STORAGE_CONNECTION_STRING

Get from Azure Portal > Storage Account > Access Keys > Connection String.

---

## Payment Gateway Secrets (Configure when you have accounts)

### PayFast
- `PAYFAST_MERCHANT_ID` - Your PayFast merchant ID
- `PAYFAST_MERCHANT_KEY` - Your PayFast merchant key
- `PAYFAST_PASSPHRASE` - Your PayFast passphrase

### Payflex
- `PAYFLEX_API_KEY` - Your Payflex API key
- `PAYFLEX_API_SECRET` - Your Payflex API secret
- `PAYFLEX_MERCHANT_ID` - Your Payflex merchant ID

### PayJustNow
- `PAYJUSTNOW_API_KEY` - Your PayJustNow API key
- `PAYJUSTNOW_API_SECRET` - Your PayJustNow API secret
- `PAYJUSTNOW_MERCHANT_ID` - Your PayJustNow merchant ID

---

## After Setting Secrets

1. Go to the **Actions** tab in your GitHub repository
2. You should see the workflow running or you can manually trigger it
3. The workflow will:
   - Build your Next.js application
   - Deploy to Azure Web App
   - Run database migrations

## Troubleshooting

If the deployment fails:
1. Check that all secrets are correctly set
2. Verify the Azure Web App is running
3. Check the workflow logs in the Actions tab
4. Ensure the Service Principal has the correct permissions

## Security Notes

- Keep these credentials secure
- Rotate secrets periodically
- Never commit secrets to the repository
- The `.env.local` file is excluded from Git via `.gitignore`
- Use GitHub Secrets for all sensitive values
