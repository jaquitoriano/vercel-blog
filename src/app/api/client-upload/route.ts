import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { uploadToBlob } from '@/lib/blob/blob-client';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const url = await uploadToBlob(file, file.name, folder);
    
    return NextResponse.json({ 
      success: true, 
      url,
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