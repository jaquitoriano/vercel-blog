import { NextResponse } from 'next/server';
import { postRepository } from '@/lib/repositories/post.repository';
import { auth } from '@/auth';

export async function GET() {
  try {
    const posts = await postRepository.findAll();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
    const post = await postRepository.create(data);
    return NextResponse.json(post);
  } catch (error: any) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}