import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { logBlobConfigStatus } from '@/lib/blob/check-blob-config';

/**
 * This API endpoint provides detailed diagnostic information about 
 * the current Vercel Blob configuration and token status
 */
export const dynamic = 'force-dynamic'; // Ensure we don't cache this response

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check current token 
    logBlobConfigStatus(true);
    
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const storeId = process.env.NEXT_PUBLIC_STORE_ID;
    
    // Analyze token format without exposing full token
    let tokenInfo: any = {
      exists: !!token,
      storeIdExists: !!storeId,
      length: token?.length || 0,
      timestamp: new Date().toISOString(),
    };
    
    if (token) {
      // Check if token follows the correct format
      const hasCorrectPrefix = token.startsWith('vercel_blob_rw_');
      const parts = token.split('_');
      
      tokenInfo.prefix = hasCorrectPrefix ? 'correct' : 'incorrect';
      tokenInfo.format = token.match(/^vercel_blob_rw_[A-Za-z0-9_-]+$/) ? 'valid' : 'invalid';
      tokenInfo.permissions = parts[2] === 'rw' ? 'read-write' : 'unknown';
      
      // Check if token contains a part matching the store ID
      const storeIdWithoutPrefix = storeId?.replace('store_', '');
      tokenInfo.storeIdPartMatch = storeIdWithoutPrefix ? 
        token.includes(storeIdWithoutPrefix) : false;
    }
    
    // Get help info for getting a new token
    const helpInfo = {
      message: 'If you need a new token, you can generate one from the Vercel dashboard or CLI',
      steps: [
        'Go to https://vercel.com/dashboard',
        'Navigate to your project > Storage',
        'Select your Blob store with ID: ' + (storeId || '[store ID not set]'),
        'Click "Create Token" and select "Read & Write" permissions',
        'Copy the new token (it should start with "vercel_blob_rw_")',
        'Update your .env.local file with: BLOB_READ_WRITE_TOKEN=your_new_token',
        'Restart your development server'
      ],
      cliCommand: `vercel blob store ls\nvercel blob store get ${storeId || 'your-store-id'}\nvercel env pull .env.local`,
    };
    
    return NextResponse.json({
      status: 'success',
      tokenInfo,
      helpInfo,
    });
  } catch (error: any) {
    console.error('Error in token diagnostic endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check token status' },
      { status: 500 }
    );
  }
}