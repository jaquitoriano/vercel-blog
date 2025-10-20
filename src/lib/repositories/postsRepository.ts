import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';
import { Post, PostWithRelations } from '@/types';

export async function getAllPosts() {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  });
}

export async function getPostBySlug(slug: string) {
  return executeQuery(async () => {
    return await prisma.post.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: true,
      },
    });
  });
}

export async function getFeaturedPosts() {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      where: { featured: true },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  });
}

export async function getRecentPosts(limit: number = 5) {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      take: limit,
      orderBy: {
        date: 'desc',
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  });
}

export async function getPostsByCategory(categorySlug: string) {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });
}

export async function getPostsByTag(tagSlug: string) {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      where: {
        tags: {
          some: {
            tag: {
              slug: tagSlug,
            },
          },
        },
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });
}

export async function getPostsByAuthor(authorId: string) {
  return executeQuery(async () => {
    return await prisma.post.findMany({
      where: {
        authorId,
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });
}

export async function searchPosts(query: string) {
  return executeQuery(async () => {
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    if (searchTerms.length === 0) return [];
    
    return await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            content: {
              contains: query,
            },
          },
          {
            excerpt: {
              contains: query,
            },
          },
        ],
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  });
}

export async function createPost(data: any) {
  return executeQuery(async () => {
    const { tags, ...postData } = data;
    
    return await prisma.post.create({
      data: {
        ...postData,
        tags: {
          create: tags?.map((tagId: string) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })) || [],
        },
      },
    });
  });
}

export async function updatePost(id: string, data: any) {
  return executeQuery(async () => {
    const { tags, ...postData } = data;
    
    // First delete existing tag relationships
    if (tags) {
      await prisma.postTag.deleteMany({
        where: {
          postId: id,
        },
      });
    }
    
    return await prisma.post.update({
      where: {
        id,
      },
      data: {
        ...postData,
        tags: tags ? {
          create: tags.map((tagId: string) => ({
            tag: {
              connect: {
                id: tagId,
              },
            },
          })),
        } : undefined,
      },
    });
  });
}

export async function deletePost(id: string) {
  return executeQuery(async () => {
    return await prisma.post.delete({
      where: {
        id,
      },
    });
  });
}

export async function incrementPostViews(id: string) {
  return executeQuery(async () => {
    return await prisma.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  });
}