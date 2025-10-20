import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user || session.user.role?.toUpperCase() !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get formData from the request
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Generate a unique path for the test upload
    const filename = `test-uploads/${Date.now()}-${file.name}`;
    
    // Use Vercel Blob directly for upload
    const result = await put(filename, file, {
      access: 'public',
    });
    
    if (!result || !result.url) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
    
    return NextResponse.json({
      url: result.url,
      // PutBlobResult doesn't expose size directly in recent versions
      size: file.size, // Use the original file size
      message: 'Upload successful',
      testResult: 'success'
    });
  } catch (error: any) {
    console.error('Error in blob upload test endpoint:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file', testResult: 'failure' },
      { status: 500 }
    );
  }
}