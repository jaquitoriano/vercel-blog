import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

// Force dynamic execution for accurate env var testing
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get detailed information about the blob token
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN || '';
    const tokenInfo = {
      exists: !!blobToken,
      length: blobToken.length,
      firstChars: blobToken ? blobToken.substring(0, 15) + '...' : 'N/A',
      isInNextConfig: !!process.env.NEXT_CONFIG_BLOB_TOKEN,
      envSource: getEnvSource(),
    };
    
    // Also check for the store ID
    const storeId = process.env.NEXT_PUBLIC_STORE_ID || '';
    
    return NextResponse.json({
      tokenInfo,
      storeId,
      allEnvKeys: Object.keys(process.env).filter(key => 
        !key.includes('TOKEN') && 
        !key.includes('SECRET') && 
        !key.includes('PASSWORD') &&
        !key.includes('KEY')
      ),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in token debug endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to debug token' },
      { status: 500 }
    );
  }
}

// Helper function to try to determine where env vars are coming from
function getEnvSource(): string {
  // Check various environment indicators
  if (process.env.NODE_ENV === 'development') {
    if (process.env.VERCEL) {
      return 'Vercel Development';
    } else if (process.env.NEXT_RUNTIME === 'edge') {
      return 'Edge Runtime';
    } else {
      return 'Local Development (.env.local)';
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (process.env.VERCEL) {
      return 'Vercel Production';
    } else {
      return 'Production (non-Vercel)';
    }
  } else {
    return 'Unknown Environment';
  }
}