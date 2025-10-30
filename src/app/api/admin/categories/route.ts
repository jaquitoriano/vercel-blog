import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, slug, description } = body;

    if (!name || !slug) {
      return new NextResponse('Name and slug are required', { status: 400 });
    }

    // Check if category with this slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });

    if (existingCategory) {
      return new NextResponse('A category with this slug already exists', { status: 400 });
    }

    // Create new category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description
      }
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error('[CATEGORIES_POST]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, name, slug, description } = body;

    if (!id || !name || !slug) {
      return new NextResponse('ID, name and slug are required', { status: 400 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return new NextResponse('Category not found', { status: 404 });
    }

    // Check if another category with this slug exists
    const duplicateSlug = await prisma.category.findFirst({
      where: {
        slug,
        NOT: {
          id
        }
      }
    });

    if (duplicateSlug) {
      return new NextResponse('A category with this slug already exists', { status: 400 });
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description
      }
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('[CATEGORIES_PUT]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Category ID is required', { status: 400 });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return new NextResponse('Category not found', { status: 404 });
    }

    // Check if there are any posts using this category
    const postsCount = await prisma.post.count({
      where: { categoryId: id }
    });

    if (postsCount > 0) {
      return new NextResponse(
        'Cannot delete category: it has associated posts. Please reassign or delete the posts first.', 
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.category.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('[CATEGORIES_DELETE]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}