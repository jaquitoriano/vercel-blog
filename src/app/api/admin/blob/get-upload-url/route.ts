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
    
    // Use Vercel Blob directly to get a signed URL
    // Note: uploadUrl doesn't exist in the current version of @vercel/blob
    // We're using a standard approach with PUT
    const { url } = await put(filename, file, {
      access: 'public',
    });
    
    return NextResponse.json({
      url,
      // For client-side upload testing, we'll use the same URL
      // In a real implementation, you'd use Vercel's client upload SDK
      uploadUrl: url,
      message: 'Upload URL generated successfully'
    });
  } catch (error: any) {
    console.error('Error generating upload URL:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}