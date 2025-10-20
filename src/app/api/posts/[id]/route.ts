import { NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories/post.repository';
import { auth } from '@/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await postRepository.findById(params.id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching post ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Check if user has admin role
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const data = await request.json();
    const post = await postRepository.update(params.id, data);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error(`Error updating post ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Check if user has admin role
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    await postRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting post ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}