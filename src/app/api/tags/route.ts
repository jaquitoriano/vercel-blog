import { NextResponse } from 'next/server';
import { tagRepository } from '@/lib/repositories/tag.repository';

export async function GET() {
  try {
    const tags = await tagRepository.findAll();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const tag = await tagRepository.create(data);
    return NextResponse.json(tag);
  } catch (error: any) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create tag' },
      { status: 500 }
    );
  }
}