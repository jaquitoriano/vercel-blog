import { NextResponse } from 'next/server';
import { tagRepository } from '@/lib/repositories/tag.repository';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const tag = await tagRepository.findById(params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(tag);
  } catch (error) {
    console.error(`Error fetching tag ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch tag' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    const tag = await tagRepository.update(params.id, data);
    return NextResponse.json(tag);
  } catch (error: any) {
    console.error(`Error updating tag ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update tag' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await tagRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting tag ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete tag' },
      { status: 500 }
    );
  }
}