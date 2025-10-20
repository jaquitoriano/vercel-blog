import { NextResponse } from 'next/server';
import { categoryRepository } from '@/lib/repositories/category.repository';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const category = await categoryRepository.findById(params.id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    const category = await categoryRepository.update(params.id, data);
    return NextResponse.json(category);
  } catch (error: any) {
    console.error(`Error updating category ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    await categoryRepository.delete(params.id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error deleting category ${params.id}:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}