import { put, list, del } from '@vercel/blob';

// For better environment variable loading in development
if (process.env.NODE_ENV !== 'production') {
  // We use require for dotenv since it's a CommonJS module
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    console.warn('Could not load dotenv', e);
  }
}

// Get tokens from environment variables - use edge runtime compatible approach
// This ensures the token is accessed at runtime when the function is called
// not just during module initialization
const getToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  // Log token info for debugging (but don't expose full token)
  if (process.env.NODE_ENV === 'development') {
    if (!token) {
      console.warn('BLOB_READ_WRITE_TOKEN is not set!');
    } else {
      console.log(`BLOB_READ_WRITE_TOKEN exists (${token.length} chars)`);
    }
  }
  return token;
};
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID;

// Helper function to upload a file to Vercel Blob
export async function uploadToBlob(
  file: File | Blob,
  filename: string,
  folder: string = 'uploads'
): Promise<{ url: string, type?: string }> {
  try {
    // Get token at runtime
    const token = getToken();
    if (!token) {
      console.warn('BLOB_READ_WRITE_TOKEN environment variable is not set - returning fallback URL');
      // Return a fallback URL for development/testing
      return {
        url: `https://placehold.co/600x400?text=Blob+Storage+Not+Configured`,
        type: 'image/png'
      };
    }

    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const uniqueFilename = `${timestamp}-${filename}`;
    const path = `${folder}/${uniqueFilename}`;
    
    console.log('[DEBUG] Uploading to Vercel Blob:', {
      path,
      folder,
      tokenLength: token.length,
      tokenPrefix: token.substring(0, 10) + '...'
    });

    // Upload to Vercel Blob
    const { url } = await put(path, file, {
      access: 'public',
      addRandomSuffix: false,
      token: token,
    });
    
    console.log('[DEBUG] Successfully uploaded to Vercel Blob:', url);
    
    return {
      url,
      type: file instanceof File ? file.type : undefined
    };
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    
    // Enhanced error logging with proper type checking
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('Access denied')) {
      console.error('[ERROR] Vercel Blob token access denied. The token may be invalid or expired.');
      console.error('[ERROR] Please generate a new token for your blob store.');
    } else if (errorMessage.includes('not found')) {
      console.error('[ERROR] Blob store not found. Check your NEXT_PUBLIC_STORE_ID.');
    }
    
    throw error;
  }
}

// Helper function to list images in a folder
export async function listBlobImages(
  folder: string = 'uploads',
  limit: number = 100
): Promise<{ url: string, pathname: string, size: number, uploadedAt: Date, type?: string }[]> {
  try {
    // Get token at runtime
    const token = getToken();
    if (!token) {
      console.warn('BLOB_READ_WRITE_TOKEN environment variable is not set - returning empty list');
      return [];
    }

    const { blobs } = await list({
      prefix: folder,
      limit,
      token: token,
    });

    return blobs.map(blob => ({
      url: blob.url,
      pathname: blob.pathname,
      size: blob.size,
      uploadedAt: new Date(blob.uploadedAt),
    }));
  } catch (error) {
    console.error('Error listing Vercel Blob images:', error);
    return [];
  }
}

// Helper function to delete an image from Vercel Blob
export async function deleteFromBlob(url: string): Promise<boolean> {
  try {
    // Get token at runtime
    const token = getToken();
    if (!token) {
      console.warn('BLOB_READ_WRITE_TOKEN environment variable is not set - skipping delete operation');
      return false;
    }

    await del(url, { token: token });
    return true;
  } catch (error) {
    console.error('Error deleting from Vercel Blob:', error);
    return false;
  }
}