import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToBlob } from '@/lib/blob/blob-client';
import { logBlobConfigStatus } from '@/lib/blob/check-blob-config';

// GET /api/admin/uploads - List all uploads (in specific folder)
export async function GET(req: NextRequest) {
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
    
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get('folder') || 'uploads';
    
    const { listBlobImages } = await import('@/lib/blob/blob-client');
    const images = await listBlobImages(folder);
    
    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Error listing uploads:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to list uploads' },
      { status: 500 }
    );
  }
}

// POST /api/admin/uploads - Upload a new image
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
    const folder = formData.get('folder') as string || 'uploads';
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Upload the file to Vercel Blob
    const url = await uploadToBlob(file, file.name, folder);
    
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

// DELETE /api/admin/uploads?url=... - Delete an image
export async function DELETE(req: NextRequest) {
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
    
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'No URL provided' },
        { status: 400 }
      );
    }
    
    const { deleteFromBlob } = await import('@/lib/blob/blob-client');
    const success = await deleteFromBlob(url);
    
    if (success) {
      return NextResponse.json({ 
        success: true,
        message: 'Image deleted successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to delete image' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete file' },
      { status: 500 }
    );
  }
}