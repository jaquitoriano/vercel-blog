import { NextResponse } from 'next/server';
import { authorRepository } from '@/lib/repositories/author.repository';

export async function GET() {
  try {
    const authors = await authorRepository.findAll();
    return NextResponse.json(authors);
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch authors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const author = await authorRepository.create(data);
    return NextResponse.json(author);
  } catch (error: any) {
    console.error('Error creating author:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create author' },
      { status: 500 }
    );
  }
}