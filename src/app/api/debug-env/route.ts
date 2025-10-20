import { NextResponse } from 'next/server';

export async function GET() {
  // Only return if environment is explicitly debug
  if (process.env.ENABLE_ENV_DEBUG !== 'true') {
    return NextResponse.json({ error: 'Debug not enabled' }, { status: 403 });
  }
  
  return NextResponse.json({
    // Return safe environment diagnostics, not actual values
    environment: process.env.NODE_ENV || 'unknown',
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