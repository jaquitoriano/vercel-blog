import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToBlob } from '@/lib/blob/blob-client';
import { logBlobConfigStatus } from '@/lib/blob/check-blob-config';

// POST /api/admin/media/upload - Upload a file to blob storage
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check blob configuration with verbose logging
    const isConfigured = logBlobConfigStatus(true);
    if (!isConfigured) {
      return NextResponse.json({ 
        error: 'Vercel Blob is not properly configured. Check server logs for details.' 
      }, { status: 500 });
    }
    
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const filename = formData.get('filename') as string || '';
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    console.log('Uploading file to blob storage:', {
      filename: filename || file.name,
      folder,
      size: file.size,
      type: file.type
    });
    
    // Upload the file to Vercel Blob
    const url = await uploadToBlob(file, filename || file.name, folder);
    
    return NextResponse.json({ 
      success: true, 
      url,
      message: 'Image uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}