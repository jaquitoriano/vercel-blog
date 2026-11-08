import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { uploadToBlob } from '@/lib/blob/blob-client';
import { logBlobConfigStatus } from '@/lib/blob/check-blob-config';

export async function POST(req: NextRequest) {
  try {
    // Uploads write to the public Blob store, so only admins may use them,
    // as with the /api/admin upload routes
    const unauthorized = await requireAdmin();
    if (unauthorized) return unauthorized;

    // Without a token uploadToBlob returns a placeholder URL, which must not
    // be reported as a successful upload
    if (!logBlobConfigStatus()) {
      return NextResponse.json(
        { error: 'Vercel Blob is not properly configured. Check server logs for details.' },
        { status: 500 }
      );
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'client-uploads';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload the file to Vercel Blob using the server-side token
    const result = await uploadToBlob(file, file.name, folder);
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      message: 'File uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}
