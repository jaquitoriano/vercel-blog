/**
 * This file replaces the static mock data with real data from PostgreSQL
 * It maintains the same API as the original data module
 */
import { PostWithRelations, Post, Comment, Author, Category, Tag } from '@/types';
import type { Comment as DbComment } from '@prisma/client';
import * as pg from './fetchPostgresData';

/**
 * Get a post with all its relations (author, category, tags)
 */
export async function getPostWithRelations(postId: string): Promise<PostWithRelations | null> {
  // Get all posts and find the one with matching ID
  const posts = await pg.getAllPosts();
  const post = posts.find(post => post.id === postId);
  
  if (!post) return null;
  
  return post as unknown as PostWithRelations;
}

/**
 * Get a post with all its relations by slug
 */
export async function getPostBySlugWithRelations(
  slug: string
): Promise<(PostWithRelations & { comments: DbComment[] }) | null> {
  const post = await pg.getPostBySlug(slug);
  
  if (!post) return null;
  
  return post as unknown as PostWithRelations & { comments: DbComment[] };
}

/**
 * Get all posts with their relations
 */
export async function getAllPostsWithRelations(): Promise<PostWithRelations[]> {
  const posts = await pg.getAllPosts();
  return posts as unknown as PostWithRelations[];
}

/**
 * Get featured posts with their relations
 */
export async function getFeaturedPostsWithRelations(): Promise<PostWithRelations[]> {
  const posts = await pg.getFeaturedPosts();
  return posts as unknown as PostWithRelations[];
}

/**
 * Get recent posts with their relations
 */
export async function getRecentPostsWithRelations(limit: number = 5): Promise<PostWithRelations[]> {
  const posts = await pg.getAllPosts();
  const recentPosts = posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
    
  return recentPosts as unknown as PostWithRelations[];
}

/**
 * Get related posts based on tags, most shared tags first
 */
export async function getRelatedPosts(
  currentPostId: string,
  limit: number = 3
): Promise<PostWithRelations[]> {
  const posts = await pg.getRelatedPosts(currentPostId, limit);
  return posts as unknown as PostWithRelations[];
}

/**
 * Search posts by query
 */
export async function searchPosts(query: string): Promise<PostWithRelations[]> {
  const posts = await pg.searchPosts(query);
  return posts as unknown as PostWithRelations[];
}

/**
 * Filter posts by category
 */
export async function getPostsByCategory(categorySlug: string): Promise<PostWithRelations[]> {
  const posts = await pg.getPostsByCategory(categorySlug);
  return posts as unknown as PostWithRelations[];
}

/**
 * Filter posts by tag
 */
export async function getPostsByTag(tagSlug: string): Promise<PostWithRelations[]> {
  const posts = await pg.getPostsByTag(tagSlug);
  return posts as unknown as PostWithRelations[];
}

/**
 * Filter posts by author
 */
export async function getPostsByAuthor(authorId: string): Promise<PostWithRelations[]> {
  const posts = await pg.getPostsByAuthor(authorId);
  return posts as unknown as PostWithRelations[];
}

/**
 * Get all authors
 */
export async function getAllAuthors(): Promise<Author[]> {
  const authors = await pg.getAllAuthors();
  return authors as unknown as Author[];
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<Category[]> {
  const categories = await pg.getAllCategories();
  return categories as unknown as Category[];
}

/**
 * Get all tags
 */
export async function getAllTags(): Promise<Tag[]> {
  const tags = await pg.getAllTags();
  return tags as unknown as Tag[];
}

/**
 * Add a comment to a post
 */
export async function addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
  const newComment = await pg.addComment(postId, comment);
  return newComment as unknown as Comment;
}