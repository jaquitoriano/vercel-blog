import { PutBlobResult, del, put } from '@vercel/blob';

// Get token from environment variable at runtime to ensure edge compatibility
const getToken = () => process.env.BLOB_READ_WRITE_TOKEN;

/**
 * Uploads a file to Vercel Blob storage
 * @param file The file to upload
 * @param folder Optional folder path within the blob storage
 * @returns Promise with the upload result
 */
export async function uploadToBlob(
  file: File | Blob, 
  folder: string = 'uploads'
): Promise<PutBlobResult> {
  try {
    // Get token at runtime
    const token = getToken();
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }

    // Sanitize filename
    const fileName = file instanceof File 
      ? file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      : `upload-${Date.now()}.${getExtensionFromMimeType(file.type)}`;

    // Generate a timestamp for the file path
    const timestamp = new Date().toISOString().replace(/[:T.]/g, '-').split('Z')[0];
    
    // Create the full pathname with folder structure
    const pathname = `${folder}/${timestamp}-${fileName}`;

    // Upload to Vercel Blob
    const blob = await put(pathname, file, {
      access: 'public',
      multipart: true,
      addRandomSuffix: false, // We already have timestamp for uniqueness
      token: token,
    });

    return blob;
  } catch (error) {
    console.error('Error uploading to Blob:', error);
    throw new Error('Failed to upload file');
  }
}

/**
 * Deletes a file from Vercel Blob storage
 * @param url URL of the file to delete
 * @returns Promise with the delete result
 */
export async function deleteFromBlob(url: string): Promise<void> {
  try {
    // Get token at runtime
    const token = getToken();
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }
    
    await del(url, { token: token });
  } catch (error) {
    console.error('Error deleting from Blob:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Gets a file extension from a MIME type
 */
function getExtensionFromMimeType(mimeType: string): string {
  const mapping: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg',
    'application/pdf': 'pdf',
  };
  
  return mapping[mimeType] || 'bin';
}

/**
 * Validates if a file is an acceptable image and within size limits
 * @param file File to validate
 * @param maxSize Maximum file size in bytes (default: 5MB)
 * @returns Boolean indicating if file is valid and an error message if not
 */
export function validateImage(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean; error?: string } {
  // Check file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return { 
      valid: false, 
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, WebP or SVG image.'
    };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit.`
    };
  }
  
  return { valid: true };
}