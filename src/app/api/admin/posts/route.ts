import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { postRepository } from '@/lib/repositories/post.repository';

export async function GET(req: NextRequest) {
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
    
    const posts = await postRepository.findAll();
    return NextResponse.json({ posts });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    
    // Validate required fields
    const missingFields: string[] = [];
    if (!data.title) missingFields.push('title');
    if (!data.slug) missingFields.push('slug');
    if (!data.content) missingFields.push('content');
    if (!data.excerpt) missingFields.push('excerpt');
    if (!data.authorId) missingFields.push('author');
    if (!data.categoryId) missingFields.push('category');
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Validate slug format
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      return NextResponse.json({ 
        error: 'Invalid slug format. Use lowercase letters, numbers, and hyphens only.' 
      }, { status: 400 });
    }
    
    // Handle the date properly 
    let postDate: Date;
    try {
      postDate = data.date ? new Date(data.date) : new Date();
      
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
    
    // Process tags - ensure it's an array of strings and handle empty values
    const tags = Array.isArray(data.tags) 
      ? data.tags.filter((tag: string) => !!tag) // Remove empty tags
      : data.tags 
        ? [data.tags].filter(Boolean) // Single tag case
        : [];
        
    // Validate that all tag IDs are strings
    if (tags.some(tag => typeof tag !== 'string')) {
      return NextResponse.json({ 
        error: 'Invalid tag format. Tags must be string IDs.' 
      }, { status: 400 });
    }
    
    // Create the post
    const post = await postRepository.create({
      title: data.title.trim(),
      slug: data.slug.trim().toLowerCase(),
      content: data.content,
      excerpt: data.excerpt.trim(),
      coverImage: data.coverImage?.trim() || null,
      authorId: data.authorId,
      categoryId: data.categoryId,
      featured: Boolean(data.featured),
      status: data.status || 'DRAFT', // Use the status from the form or default to DRAFT
      date: postDate,
      tags: tags
    });
    
    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating post:', error);
    
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
    
    return NextResponse.json({ 
      error: error.message || 'Failed to create post. Please try again.' 
    }, { status: 500 });
  }
}