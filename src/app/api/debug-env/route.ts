import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const runtime = 'edge'; // Use edge runtime for faster execution

export async function GET(request: Request) {
  const headersList = headers();
  const authHeader = headersList.get('x-vercel-debug-token') || '';
  const url = new URL(request.url);
  const debugParam = url.searchParams.get('debug');
  
  // Check for either header or query param for security
  const isDebugAuthorized = authHeader === 'debug-vercel-deployment' || 
                           debugParam === 'debug-vercel-deployment';
  
  if (!isDebugAuthorized) {
    return NextResponse.json({ 
      message: 'Debug diagnostics are protected',
      info: 'Add ?debug=debug-vercel-deployment to URL to view environment diagnostics' 
    }, { status: 403 });
  }
  
  return NextResponse.json({
    // Return safe environment diagnostics, not actual values
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    platform: process.env.VERCEL ? 'vercel' : 'unknown',
    region: process.env.VERCEL_REGION || 'unknown',
    database: {
      hasUrl: !!process.env.POSTGRES_URL,
      hasPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
      hasNonPoolingUrl: !!process.env.POSTGRES_URL_NON_POOLING,
      hasUser: !!process.env.POSTGRES_USER,
      hasPassword: !!process.env.POSTGRES_PASSWORD,
    },
    blob: {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasStoreId: !!process.env.NEXT_PUBLIC_STORE_ID,
    },
    site: {
      url: process.env.NEXT_PUBLIC_SITE_URL || 'not set',
    }
  });
}