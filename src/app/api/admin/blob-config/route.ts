import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkBlobConfig } from '@/lib/blob/check-blob-config';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check blob configuration on server side with verbose logging
    const config = checkBlobConfig(true);
    
    // Enhanced debugging
    console.log('Checking Blob config on server side:', {
      isConfigured: config.isConfigured,
      hasToken: config.config.hasToken,
      hasStoreId: config.config.hasStoreId,
      directEnvCheck: {
        hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
        hasStoreId: !!process.env.NEXT_PUBLIC_STORE_ID,
        tokenPrefix: process.env.BLOB_READ_WRITE_TOKEN ? process.env.BLOB_READ_WRITE_TOKEN.substring(0, 5) + '...' : 'not set'
      }
    });
    
    // For security, don't return actual token values
    return NextResponse.json({
      isConfigured: config.isConfigured,
      hasToken: config.config.hasToken,
      hasStoreId: config.config.hasStoreId,
    });
  } catch (error: any) {
    console.error('Error checking blob config:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check blob configuration' },
      { status: 500 }
    );
  }
}