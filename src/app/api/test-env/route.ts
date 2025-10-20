import { NextResponse } from 'next/server';

export async function GET() {
  // Only check presence, don't return actual token values for security
  return NextResponse.json({
    blobTokenPresent: !!process.env.BLOB_READ_WRITE_TOKEN,
    storeIdPresent: !!process.env.NEXT_PUBLIC_STORE_ID,
    nodeEnv: process.env.NODE_ENV
  });
}