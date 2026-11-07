/**
 * This module provides functions to fetch data from PostgreSQL database
 * instead of using mock data
 */

import { prisma } from './db/prisma';

// Load each post's author, category and tags in the same query, rather than
// one query per relation per post
const postInclude = {
  author: true,
  category: true,
  tags: { include: { tag: true } },
};

// Callers expect `tags` to be a plain array of tags, not PostTag join rows
const flattenTags = (post) => ({
  ...post,
  tags: post.tags.map((postTag) => postTag.tag),
});

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
    include: postInclude,
  });

  return posts.map(flattenTags);
}

/**
 * Get a post by slug with all related data
 */
export async function getPostBySlug(slug) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      status: 'PUBLISHED' // Only get published posts for public display
    },
    include: {
      ...postInclude,
      comments: { orderBy: { createdAt: 'desc' } },
    },
  });

  return post ? flattenTags(post) : null;
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
    take: 3,
    include: postInclude,
  });

  return posts.map(flattenTags);
}

/**
 * Get published posts that share at least one tag with the given post, most
 * shared tags first and newest first among equals
 */
export async function getRelatedPosts(postId, limit = 3) {
  const postTags = await prisma.postTag.findMany({
    where: { postId },
    select: { tagId: true },
  });
  const tagIds = postTags.map((pt) => pt.tagId);

  if (tagIds.length === 0) return [];

  const candidates = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      id: { not: postId },
      tags: { some: { tagId: { in: tagIds } } },
    },
    orderBy: { date: 'desc' },
    include: postInclude,
  });

  const sharedTagCount = (post) =>
    post.tags.filter((pt) => tagIds.includes(pt.tagId)).length;

  // Array.prototype.sort is stable, so equal counts keep newest-first order
  return candidates
    .sort((a, b) => sharedTagCount(b) - sharedTagCount(a))
    .slice(0, limit)
    .map(flattenTags);
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
  const posts = await prisma.post.findMany({
    where: {
      category: { slug: categorySlug },
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' },
    include: postInclude,
  });

  return posts.map(flattenTags);
}

/**
 * Get posts by tag slug
 */
export async function getPostsByTag(tagSlug) {
  const posts = await prisma.post.findMany({
    where: {
      tags: { some: { tag: { slug: tagSlug } } },
      status: 'PUBLISHED' // Only get published posts for public display
    },
    orderBy: { date: 'desc' },
    // Includes all of each post's tags, not just the requested one
    include: postInclude,
  });

  return posts.map(flattenTags);
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
    orderBy: { date: 'desc' },
    include: postInclude,
  });

  return posts.map(flattenTags);
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
    orderBy: { date: 'desc' },
    include: postInclude,
  });

  return posts.map(flattenTags);
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
