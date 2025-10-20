import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { postRepository } from '@/lib/repositories/post.repository';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
    }
    
    const post = await postRepository.findById(params.id);
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ post });
  } catch (error: any) {
    console.error(`Error fetching post ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Check if the post exists
    const existingPost = await postRepository.findById(params.id);
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Validate required fields
    const missingFields: string[] = [];
    if (data.title !== undefined && !data.title) missingFields.push('title');
    if (data.slug !== undefined && !data.slug) missingFields.push('slug');
    if (data.content !== undefined && !data.content) missingFields.push('content');
    if (data.excerpt !== undefined && !data.excerpt) missingFields.push('excerpt');
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Validate slug format if it's being updated
    if (data.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      return NextResponse.json({ 
        error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' 
      }, { status: 400 });
    }
    
    // Handle the date properly if it's provided
    let postDate: Date | undefined = undefined;
    if (data.date) {
      try {
        postDate = new Date(data.date);
        
        // Check if date is valid
        if (isNaN(postDate.getTime())) {
          return NextResponse.json({ 
            error: 'Invalid date format. Please use YYYY-MM-DD format.' 
          }, { status: 400 });
        }
      } catch (error) {
        return NextResponse.json({ 
          error: 'Invalid date format. Please use YYYY-MM-DD format.' 
        }, { status: 400 });
      }
    }
    
    // Process tags - ensure it's an array of strings and handle empty values
    const tags = Array.isArray(data.tags) 
      ? data.tags.filter((tag: string) => !!tag) // Remove empty tags
      : data.tags 
        ? [data.tags].filter(Boolean) // Single tag case
        : undefined; // Don't update tags if not provided
        
    // Validate that all tag IDs are strings if tags are provided
    if (tags && tags.some(tag => typeof tag !== 'string')) {
      return NextResponse.json({ 
        error: 'Invalid tag format. Tags must be string IDs.' 
      }, { status: 400 });
    }
    
    // Prepare the update data
    const updateData: any = {};
    
    // Only include fields that are explicitly provided
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.slug !== undefined) updateData.slug = data.slug.trim().toLowerCase();
    if (data.content !== undefined) updateData.content = data.content;
    if (data.excerpt !== undefined) updateData.excerpt = data.excerpt.trim();
    if (data.coverImage !== undefined) updateData.coverImage = data.coverImage?.trim() || null;
    if (data.authorId !== undefined) updateData.authorId = data.authorId;
    if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
    if (data.featured !== undefined) updateData.featured = Boolean(data.featured);
    if (data.status !== undefined) updateData.status = data.status;
    if (postDate !== undefined) updateData.date = postDate;
    if (tags !== undefined) updateData.tags = tags;
    
    // Update the post
    const updatedPost = await postRepository.update(params.id, updateData);
    
    return NextResponse.json({ post: updatedPost });
  } catch (error: any) {
    console.error(`Error updating post ${params.id}:`, error);
    
    // Check for specific error types
    if (error.message?.includes('slug already exists')) {
      return NextResponse.json({ 
        error: 'A post with this slug already exists. Please choose a different slug.' 
      }, { status: 400 });
    }
    
    if (error.message?.includes('foreign key constraint fails')) {
      return NextResponse.json({ 
        error: 'Invalid author, category, or tag ID. Please check your selection.' 
      }, { status: 400 });
    }
    
    if (error.code === 'P2003') {
      const field = error.meta?.field_name || 'field';
      return NextResponse.json({ 
        error: `Invalid reference: ${field}. Please check your form input.` 
      }, { status: 400 });
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json({ 
        error: 'Record not found. The post may have been deleted.' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      error: error.message || 'Failed to update post. Please try again.' 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 });
    }
    
    // Check if the post exists
    const existingPost = await postRepository.findById(params.id);
    
    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Delete the post
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