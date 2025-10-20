import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get environment information (without exposing actual tokens)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      blobTokenSet: !!process.env.BLOB_READ_WRITE_TOKEN,
      storeIdSet: !!process.env.NEXT_PUBLIC_STORE_ID,
      publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL,
      envVariables: Object.keys(process.env).filter(key => 
        !key.includes('TOKEN') && 
        !key.includes('SECRET') && 
        !key.includes('PASSWORD') &&
        !key.includes('KEY')
      ),
      timestamp: new Date().toISOString()
    };
    
    // Log for debugging
    console.log('Environment diagnostic information:', envInfo);
    
    return NextResponse.json(envInfo);
  } catch (error: any) {
    console.error('Error in environment diagnostic:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get environment information' },
      { status: 500 }
    );
  }
}