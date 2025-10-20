/**
 * Utility to check if Vercel Blob is properly configured
 * This can be used in client and server components to verify the configuration
 */

/**
 * Checks if the required environment variables for Vercel Blob are set
 * @param debug If true, will print debug information to the console
 */
export function checkBlobConfig(debug: boolean = false) {
  const errors: string[] = [];
  
  // Check for BLOB_READ_WRITE_TOKEN
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    errors.push('BLOB_READ_WRITE_TOKEN environment variable is not set');
  }
  
  // Check for NEXT_PUBLIC_STORE_ID
  const storeId = process.env.NEXT_PUBLIC_STORE_ID;
  if (!storeId) {
    errors.push('NEXT_PUBLIC_STORE_ID environment variable is not set');
  }
  
  if (debug) {
    console.log('Blob configuration check:', {
      environment: process.env.NODE_ENV,
      hasToken: !!token,
      hasStoreId: !!storeId,
      token: token ? `${token.substring(0, 5)}...` : 'not set',
      storeId: storeId || 'not set',
      errors: errors.length > 0 ? errors : 'none',
      envKeys: Object.keys(process.env).filter(key => 
        key.includes('BLOB') || 
        key.includes('STORE') || 
        key === 'NODE_ENV'
      ),
    });
  }
  
  return {
    isConfigured: errors.length === 0,
    errors,
    config: {
      hasToken: !!token,
      hasStoreId: !!storeId
    }
  };
}

/**
 * For server components - logs a warning if Vercel Blob is not properly configured
 * @param verbose If true, will print more detailed debug information
 */
export function logBlobConfigStatus(verbose: boolean = false) {
  const { isConfigured, errors } = checkBlobConfig(verbose);
  
  if (!isConfigured) {
    console.warn('⚠️ Vercel Blob is not properly configured:');
    errors.forEach(error => console.warn(`  - ${error}`));
    console.warn('Please check your environment variables.');
    
    if (verbose) {
      console.warn('Environment details:');
      console.warn('- NODE_ENV:', process.env.NODE_ENV);
      console.warn('- Running in:', typeof window === 'undefined' ? 'server' : 'client');
      console.warn('- Has token:', !!process.env.BLOB_READ_WRITE_TOKEN);
      console.warn('- Has store ID:', !!process.env.NEXT_PUBLIC_STORE_ID);
    }
  } else {
    console.log('✅ Vercel Blob is properly configured.');
  }
  
  return isConfigured;
}