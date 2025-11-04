import { prisma } from '@/lib/db/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { createCleanExcerpt } from '@/lib/utils/text';

// This API handler works with runtime-dependent request data and Prisma
// (server runtime). Mark it as force-dynamic so Next won't attempt to
// statically render pages that call it during build.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
  // Use the standard URL API instead of `nextUrl` (edge-only) so this
  // route is compatible with Node runtime and static generation checks.
  const url = new URL(request.url);
  const searchParams = url.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const sort = (searchParams.get('sort') || 'relevance') as 'relevance' | 'date' | 'title';
    const perPage = 10;

    if (!query) {
      return NextResponse.json({ 
        posts: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    // Build the where clause for search
    const where = {
      AND: [
        {
          OR: [
            { title: { contains: query, mode: 'insensitive' as const } },
            { excerpt: { contains: query, mode: 'insensitive' as const } },
            { content: { contains: query, mode: 'insensitive' as const } },
          ],
        },
        { status: 'PUBLISHED' as const },
        // Add category filter if provided
        ...(category ? [{
          category: {
            slug: category
          }
        }] : []),
        // Add tag filter if provided
        ...(tag ? [{
          tags: {
            some: {
              tag: {
                slug: tag
              }
            }
          }
        }] : [])
      ]
    };

    // Get total count for pagination
    const total = await prisma.post.count({ where });
    const totalPages = Math.ceil(total / perPage);

    // Get paginated results with proper sorting
    const orderBy = (() => {
      switch (sort) {
        case 'date':
          return { date: 'desc' as const };
        case 'title':
          return { title: 'asc' as const };
        case 'relevance':
        default:
          // For relevance, we'll prioritize title matches then sort by date
          return [
            { title: 'desc' as const },
            { date: 'desc' as const }
          ];
      }
    })();

    const posts = await prisma.post.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      }
    });

    // Transform posts to match frontend interface and clean content
    const transformedPosts = posts.map(post => ({
      ...post,
      // Create clean content preview without HTML tags
      content: createCleanExcerpt(post.content, 300),
      tags: post.tags.map(t => t.tag)
    }));

    return NextResponse.json({
      posts: transformedPosts,
      total,
      page,
      totalPages
    });

  } catch (error: unknown) {
    // Log full error to server logs for debugging
    console.error('Search error:', error);

    // In development, return detailed error message and stack to help debugging.
    if (process.env.NODE_ENV !== 'production') {
      const message = (error as Error)?.message ?? String(error);
      const stack = (error as Error)?.stack ?? undefined;
      return NextResponse.json({ error: 'Failed to perform search', message, stack }, { status: 500 });
    }

    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}