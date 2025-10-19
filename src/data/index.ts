import { PostWithRelations, Post, Comment } from '@/types';
import { posts, getPostById } from './posts';
import { authors, getAuthorById } from './authors';
import { categories, getCategoryById } from './categories';
import { tags, getTagsByIds } from './tags';
import { comments, getCommentsByPostId } from './comments';

/**
 * Get a post with all its relations (author, category, tags)
 */
export function getPostWithRelations(postId: string): PostWithRelations | null {
  const post = getPostById(postId);
  
  if (!post) return null;
  
  const author = getAuthorById(post.authorId);
  const category = getCategoryById(post.categoryId);
  const postTags = getTagsByIds(post.tags);
  
  if (!author || !category) return null;
  
  return {
    ...post,
    author,
    category,
    tags: postTags
  };
}

/**
 * Get a post with all its relations by slug
 */
export function getPostBySlugWithRelations(slug: string): PostWithRelations | null {
  const post = posts.find(post => post.slug === slug);
  
  if (!post) return null;
  
  return getPostWithRelations(post.id);
}

/**
 * Get all posts with their relations
 */
export function getAllPostsWithRelations(): PostWithRelations[] {
  return posts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Get featured posts with their relations
 */
export function getFeaturedPostsWithRelations(): PostWithRelations[] {
  return posts
    .filter(post => post.featured)
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Get recent posts with their relations
 */
export function getRecentPostsWithRelations(limit: number = 5): PostWithRelations[] {
  return [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit)
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Get related posts based on tags
 */
export function getRelatedPosts(currentPostId: string, limit: number = 3): PostWithRelations[] {
  const currentPost = getPostById(currentPostId);
  
  if (!currentPost) return [];
  
  const relatedPosts = posts
    .filter(post => {
      // Don't include the current post
      if (post.id === currentPostId) return false;
      
      // Check if posts share at least one tag
      return post.tags.some(tag => currentPost.tags.includes(tag));
    })
    .sort((a, b) => {
      // Sort by number of matching tags (descending)
      const aMatches = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
      const bMatches = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
      return bMatches - aMatches;
    })
    .slice(0, limit);
  
  return relatedPosts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Search posts by query
 */
export function searchPosts(query: string): PostWithRelations[] {
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
  
  if (searchTerms.length === 0) return [];
  
  const matchingPosts = posts.filter(post => {
    const titleMatch = searchTerms.some(term => post.title.toLowerCase().includes(term));
    const contentMatch = searchTerms.some(term => post.content.toLowerCase().includes(term));
    const excerptMatch = searchTerms.some(term => post.excerpt.toLowerCase().includes(term));
    
    return titleMatch || contentMatch || excerptMatch;
  });
  
  return matchingPosts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Filter posts by category
 */
export function getPostsByCategory(categorySlug: string): PostWithRelations[] {
  const category = categories.find(cat => cat.slug === categorySlug);
  
  if (!category) return [];
  
  const matchingPosts = posts.filter(post => post.categoryId === category.id);
  
  return matchingPosts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Filter posts by tag
 */
export function getPostsByTag(tagSlug: string): PostWithRelations[] {
  const tag = tags.find(t => t.slug === tagSlug);
  
  if (!tag) return [];
  
  const matchingPosts = posts.filter(post => post.tags.includes(tag.id));
  
  return matchingPosts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Filter posts by author
 */
export function getPostsByAuthor(authorId: string): PostWithRelations[] {
  const matchingPosts = posts.filter(post => post.authorId === authorId);
  
  return matchingPosts
    .map(post => getPostWithRelations(post.id))
    .filter((post): post is PostWithRelations => post !== null);
}

/**
 * Get post with comments
 */
export function getPostWithComments(postId: string): (PostWithRelations & { comments: Comment[] }) | null {
  const post = getPostWithRelations(postId);
  
  if (!post) return null;
  
  const postComments = getCommentsByPostId(postId);
  
  return {
    ...post,
    comments: postComments
  };
}