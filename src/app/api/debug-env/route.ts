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
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasDirectUrl: !!process.env.DIRECT_URL,
    },
    blob: {
      hasToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      hasStoreId: !!process.env.BLOB_STORE_ID,
    },
    site: {
      url: process.env.SITE_URL || 'not set',
    }
  });
}