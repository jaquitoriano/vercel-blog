/**
 * This file replaces the static mock data with real data from PostgreSQL
 * It maintains the same API as the original data module
 */
import { PostWithRelations, Post, Comment, Author, Category, Tag } from '@/types';
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
export async function getPostBySlugWithRelations(slug: string): Promise<PostWithRelations | null> {
  const post = await pg.getPostBySlug(slug);
  
  if (!post) return null;
  
  return post as unknown as PostWithRelations;
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
 * Get related posts based on tags
 */
export async function getRelatedPosts(currentPostId: string, limit: number = 3): Promise<PostWithRelations[]> {
  const allPosts = await pg.getAllPosts();
  const currentPost = allPosts.find(post => post.id === currentPostId);
  
  if (!currentPost || !currentPost.tags) return [];
  
  const currentPostTagIds = currentPost.tags.map(tag => tag.id);
  
  const relatedPosts = allPosts
    .filter(post => {
      // Don't include the current post
      if (post.id === currentPostId) return false;
      
      // Check if posts share at least one tag
      if (!post.tags) return false;
      const postTagIds = post.tags.map(tag => tag.id);
      return postTagIds.some(tagId => currentPostTagIds.includes(tagId));
    })
    .sort((a, b) => {
      // Sort by number of matching tags (descending)
      if (!a.tags || !b.tags) return 0;
      
      const aMatches = a.tags.filter(tag => currentPostTagIds.includes(tag.id)).length;
      const bMatches = b.tags.filter(tag => currentPostTagIds.includes(tag.id)).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
  
  return relatedPosts as unknown as PostWithRelations[];
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
 * Get post with comments
 */
export async function getPostWithComments(postId: string): Promise<(PostWithRelations & { comments: Comment[] }) | null> {
  const allPosts = await pg.getAllPosts();
  const post = allPosts.find(p => p.id === postId);
  
  if (!post) return null;
  
  const fullPost = await pg.getPostBySlug(post.slug);
  
  if (!fullPost) return null;
  
  return fullPost as unknown as (PostWithRelations & { comments: Comment[] });
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