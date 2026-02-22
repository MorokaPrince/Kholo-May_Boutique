// ===========================================
// Azure Blob Storage Integration
// For product images and catalog PDFs
// ===========================================

import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';

// ===========================================
// Configuration
// ===========================================

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || '';
const productsContainerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'products';
const catalogsContainerName = process.env.AZURE_STORAGE_CATALOG_CONTAINER || 'catalogs';

// ===========================================
// Blob Service Client
// ===========================================

let blobServiceClient: BlobServiceClient | null = null;

function getBlobServiceClient(): BlobServiceClient {
  if (!blobServiceClient) {
    if (!connectionString) {
      throw new Error('Azure Storage connection string not configured');
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }
  return blobServiceClient;
}

// ===========================================
// Container Clients
// ===========================================

function getProductsContainer(): ContainerClient {
  return getBlobServiceClient().getContainerClient(productsContainerName);
}

function getCatalogsContainer(): ContainerClient {
  return getBlobServiceClient().getContainerClient(catalogsContainerName);
}

// ===========================================
// Initialize Containers
// ===========================================

export async function initializeContainers(): Promise<void> {
  try {
    const productsContainer = getProductsContainer();
    const catalogsContainer = getCatalogsContainer();

    await Promise.all([
      productsContainer.createIfNotExists({ access: 'blob' }),
      catalogsContainer.createIfNotExists({ access: 'blob' }),
    ]);

    console.log('Azure Storage containers initialized');
  } catch (error) {
    console.error('Failed to initialize Azure Storage containers:', error);
    throw error;
  }
}

// ===========================================
// Upload Product Image
// ===========================================

interface UploadResult {
  success: boolean;
  url?: string;
  blobName?: string;
  error?: string;
}

export async function uploadProductImage(
  file: File | Buffer,
  productId: string,
  filename: string
): Promise<UploadResult> {
  try {
    const container = getProductsContainer();
    const blobName = `products/${productId}/${filename}`;
    const blockBlobClient = container.getBlockBlobClient(blobName);

    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file instanceof File ? file.type : 'image/jpeg',
      },
    });

    return {
      success: true,
      url: blockBlobClient.url,
      blobName,
    };
  } catch (error) {
    console.error('Failed to upload product image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// ===========================================
// Upload Multiple Product Images
// ===========================================

export async function uploadProductImages(
  files: (File | Buffer)[],
  productId: string
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file, index) => {
      const filename = file instanceof File 
        ? file.name 
        : `image-${index}-${Date.now()}.jpg`;
      return uploadProductImage(file, productId, filename);
    })
  );
  return results;
}

// ===========================================
// Upload Catalog PDF
// ===========================================

export async function uploadCatalog(
  file: File | Buffer,
  catalogId: string,
  filename: string
): Promise<UploadResult> {
  try {
    const container = getCatalogsContainer();
    const blobName = `catalogs/${catalogId}/${filename}`;
    const blockBlobClient = container.getBlockBlobClient(blobName);

    const buffer = file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file instanceof File ? file.type : 'application/pdf',
      },
    });

    return {
      success: true,
      url: blockBlobClient.url,
      blobName,
    };
  } catch (error) {
    console.error('Failed to upload catalog:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// ===========================================
// Delete Blob
// ===========================================

export async function deleteBlob(blobUrl: string): Promise<boolean> {
  try {
    const container = getProductsContainer();
    const blobName = blobUrl.split('/').slice(-2).join('/');
    const blockBlobClient = container.getBlockBlobClient(blobName);
    await blockBlobClient.delete();
    return true;
  } catch (error) {
    console.error('Failed to delete blob:', error);
    return false;
  }
}

// ===========================================
// Delete Product Images
// ===========================================

export async function deleteProductImages(productId: string): Promise<boolean> {
  try {
    const container = getProductsContainer();
    const prefix = `products/${productId}/`;

    for await (const blob of container.listBlobsFlat({ prefix })) {
      const blockBlobClient = container.getBlockBlobClient(blob.name);
      await blockBlobClient.delete();
    }

    return true;
  } catch (error) {
    console.error('Failed to delete product images:', error);
    return false;
  }
}

// ===========================================
// Get Blob URL
// ===========================================

export function getBlobUrl(containerName: string, blobName: string): string {
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`;
}

// ===========================================
// Generate SAS Token (for temporary access)
// ===========================================

import {
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';

export function generateSasToken(
  containerName: string,
  blobName: string,
  expiryMinutes: number = 60
): string {
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    connectionString.match(/AccountKey=([^;]+)/)?.[1] || ''
  );

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse('r'),
      expiresOn: new Date(Date.now() + expiryMinutes * 60 * 1000),
    },
    sharedKeyCredential
  ).toString();

  return sasToken;
}

// ===========================================
// Get Secure Blob URL with SAS
// ===========================================

export function getSecureBlobUrl(
  containerName: string,
  blobName: string,
  expiryMinutes: number = 60
): string {
  const baseUrl = getBlobUrl(containerName, blobName);
  const sasToken = generateSasToken(containerName, blobName, expiryMinutes);
  return `${baseUrl}?${sasToken}`;
}
