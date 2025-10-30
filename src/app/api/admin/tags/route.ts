import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if tag with this slug already exists
    const existingTag = await prisma.tag.findUnique({
      where: { slug }
    });

    if (existingTag) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Create new tag
    const tag = await prisma.tag.create({
      data: {
        name,
        slug
      }
    });

    return NextResponse.json(tag);
    } catch (error) {
    console.error('[TAGS_POST]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
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
    const { id, name, slug } = body;

    if (!id || !name || !slug) {
      return NextResponse.json(
        { error: 'ID, name and slug are required' },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if another tag with this slug exists
    const duplicateSlug = await prisma.tag.findFirst({
      where: {
        slug,
        NOT: {
          id
        }
      }
    });

    if (duplicateSlug) {
      return NextResponse.json(
        { error: 'A tag with this slug already exists' },
        { status: 400 }
      );
    }

    // Update tag
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name,
        slug
      }
    });

    return NextResponse.json(updatedTag);
    } catch (error) {
    console.error('[TAGS_PUT]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await prisma.tag.findUnique({
      where: { id }
    });

    if (!existingTag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // First delete all post associations
    await prisma.postTag.deleteMany({
      where: { tagId: id }
    });

    // Then delete the tag
    await prisma.tag.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
    } catch (error) {
    console.error('[TAGS_DELETE]', error);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    );
  }
}