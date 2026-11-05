import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { authorRepository } from '@/lib/repositories/author.repository';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const author = await authorRepository.findById(params.id);
    
    if (!author) {
      return NextResponse.json(
        { error: 'Author not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(author);
  } catch (error) {
    console.error(`Error fetching author ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch author' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const data = await request.json();
    const author = await authorRepository.update(params.id, data);
    return NextResponse.json(author);
  } catch (error: any) {
    console.error(`Error updating author ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update author' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await authorRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting author ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete author' },
      { status: 500 }
    );
  }
}