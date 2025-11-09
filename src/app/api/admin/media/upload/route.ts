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
    const file = formData.get('file');
    const filename = formData.get('filename') as string || '';
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { error: 'No valid file provided' },
        { status: 400 }
      );
    }

    // Ensure we have a valid Blob-like object
    if (!('arrayBuffer' in file) || typeof file.arrayBuffer !== 'function') {
      return NextResponse.json(
        { error: 'Invalid file format' },
        { status: 400 }
      );
    }

    const fileSize = 'size' in file ? file.size : undefined;
    const fileType = 'type' in file ? file.type : undefined;
    const fileName = 'name' in file ? file.name : `upload-${Date.now()}`;
    
    console.log('Uploading file to blob storage:', {
      filename: filename || fileName,
      folder,
      size: fileSize,
      type: fileType
    });
    
    // Generate a unique filename with timestamp
    const timestamp = new Date().getTime();
    const finalFilename = filename || fileName;
    const uniqueFilename = `${timestamp}-${finalFilename}`;
    
    // Upload the file to Vercel Blob
    const result = await uploadToBlob(file, uniqueFilename, folder);
    
    return NextResponse.json({ 
      success: true, 
      url: result.url,
      type: result.type,
      pathname: `${folder}/${uniqueFilename}`,
      uploadedAt: new Date().toISOString(),
      size: fileSize || 0,
      message: 'File uploaded successfully'
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
}