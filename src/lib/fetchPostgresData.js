/**
 * This module provides functions to fetch data from PostgreSQL database
 * instead of using mock data
 */

import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Ensure we have only one instance of PrismaClient in development
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Get all posts with related data
 */
export async function getAllPosts() {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED'  // Only get published posts for public display
    },
    orderBy: {
      date: 'desc',
    },
    include: {
      // Note: We can't directly include relations that aren't in the schema
      // We'll need to fetch related data separately
    }
  });

  // Enhance each post with author, category, and tags data
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const author = await prisma.author.findUnique({
      where: { id: post.authorId }
    });
    
    const category = await prisma.category.findUnique({
      where: { id: post.categoryId }
    });
    
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Get a post by slug with all related data
 */
export async function getPostBySlug(slug) {
  const post = await prisma.post.findUnique({
    where: { 
      slug,
      status: 'PUBLISHED' // Only get published posts for public display
    }
  });
  
  if (!post) return null;
  
  const author = await prisma.author.findUnique({
    where: { id: post.authorId }
  });
  
  const category = await prisma.category.findUnique({
    where: { id: post.categoryId }
  });
  
  const postTags = await prisma.postTag.findMany({
    where: { postId: post.id }
  });
  
  const tags = await Promise.all(
    postTags.map(async (pt) => {
      return prisma.tag.findUnique({
        where: { id: pt.tagId }
      });
    })
  );
  
  const comments = await prisma.comment.findMany({
    where: { postId: post.id },
    orderBy: { createdAt: 'desc' }
  });
  
  return {
    ...post,
    author,
    category,
    tags: tags.filter(Boolean),
    comments
  };
}

/**
 * Get featured posts
 */
export async function getFeaturedPosts() {
  const posts = await prisma.post.findMany({
    where: { 
      featured: true,
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' },
    take: 3
  });
  
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const author = await prisma.author.findUnique({
      where: { id: post.authorId }
    });
    
    const category = await prisma.category.findUnique({
      where: { id: post.categoryId }
    });
    
    // Get tags for each post
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Get all tags
 */
export async function getAllTags() {
  return prisma.tag.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Get all authors
 */
export async function getAllAuthors() {
  return prisma.author.findMany({
    orderBy: { name: 'asc' }
  });
}

/**
 * Get posts by category slug
 */
export async function getPostsByCategory(categorySlug) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug }
  });
  
  if (!category) return [];
  
  const posts = await prisma.post.findMany({
    where: { 
      categoryId: category.id,
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' }
  });
  
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const author = await prisma.author.findUnique({
      where: { id: post.authorId }
    });
    
    // Get tags for each post
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Get posts by tag slug
 */
export async function getPostsByTag(tagSlug) {
  const tag = await prisma.tag.findUnique({
    where: { slug: tagSlug }
  });
  
  if (!tag) return [];
  
  const postTags = await prisma.postTag.findMany({
    where: { tagId: tag.id }
  });
  
  const postIds = postTags.map(pt => pt.postId);
  
  const posts = await prisma.post.findMany({
    where: { 
      id: { 
        in: postIds 
      },
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' }
  });
  
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const author = await prisma.author.findUnique({
      where: { id: post.authorId }
    });
    
    const category = await prisma.category.findUnique({
      where: { id: post.categoryId }
    });
    
    // Get all tags for the post, not just the current tag
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Get posts by author ID
 */
export async function getPostsByAuthor(authorId) {
  const posts = await prisma.post.findMany({
    where: { 
      authorId,
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' }
  });
  
  const author = await prisma.author.findUnique({
    where: { id: authorId }
  });
  
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const category = await prisma.category.findUnique({
      where: { id: post.categoryId }
    });
    
    // Get tags for each post
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Add a comment to a post
 */
export async function addComment(postId, comment) {
  return prisma.comment.create({
    data: {
      content: comment.content,
      authorName: comment.authorName,
      authorEmail: comment.authorEmail,
      postId
    }
  });
}

/**
 * Search posts
 */
export async function searchPosts(searchTerm) {
  const posts = await prisma.post.findMany({
    where: {
      AND: [
        { status: 'PUBLISHED' }, // Only get published posts for public display
        {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { content: { contains: searchTerm, mode: 'insensitive' } },
            { excerpt: { contains: searchTerm, mode: 'insensitive' } }
          ]
        }
      ]
    },
    orderBy: { date: 'desc' }
  });
  
  const enhancedPosts = await Promise.all(posts.map(async (post) => {
    const author = await prisma.author.findUnique({
      where: { id: post.authorId }
    });
    
    const category = await prisma.category.findUnique({
      where: { id: post.categoryId }
    });
    
    // Get tags for each post
    const postTags = await prisma.postTag.findMany({
      where: { postId: post.id }
    });
    
    const tags = await Promise.all(
      postTags.map(async (pt) => {
        return prisma.tag.findUnique({
          where: { id: pt.tagId }
        });
      })
    );
    
    return {
      ...post,
      author,
      category,
      tags: tags.filter(Boolean)
    };
  }));
  
  return enhancedPosts;
}

/**
 * Increment post views
 */
export async function incrementPostViews(id) {
  return prisma.post.update({
    where: { id },
    data: {
      views: {
        increment: 1
      }
    }
  });
}