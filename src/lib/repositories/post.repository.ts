import { prisma } from '@/lib/db/prisma';
import type { PrismaClient } from '@prisma/client';

// Define simplified types for our repository
interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Author {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostTag {
  postId: string;
  tagId: string;
  createdAt: Date;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  date: Date;
  featured: boolean;
  status: string;
  views: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  categoryId: string;
}

type FormattedPost = Post & {
  author: Author | null;
  category: Category | null;
  tags: Tag[];
};

// Define PrismaError for error handling
interface PrismaError extends Error {
  code: string;
  meta?: Record<string, any>;
}

export const postRepository = {
  async findAll(): Promise<FormattedPost[]> {
    try {
      const posts = await prisma.post.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      // Fetch all related data in parallel for better performance
      const authors = await prisma.author.findMany();
      const categories = await prisma.category.findMany();
      const postTags = await prisma.postTag.findMany();
      
      // Get all tag IDs from post-tag relations
      const tagIds = Array.from(new Set(postTags.map(pt => pt.tagId)));
      
      // Fetch all tags
      const tags = tagIds.length > 0
        ? await prisma.tag.findMany({
            where: { id: { in: tagIds } },
          })
        : [];
      
      // Create maps for fast lookups
      const authorsMap = new Map(authors.map(author => [author.id, author]));
      const categoriesMap = new Map(categories.map(category => [category.id, category]));
      const tagsMap = new Map(tags.map(tag => [tag.id, tag]));
      
      // Create a map to group tags by post ID
      const postTagsMap = new Map();
      postTags.forEach(pt => {
        if (!postTagsMap.has(pt.postId)) {
          postTagsMap.set(pt.postId, []);
        }
        
        const tag = tagsMap.get(pt.tagId);
        if (tag) {
          postTagsMap.get(pt.postId).push(tag);
        }
      });
      
      // Combine all data
      return posts.map(post => ({
        ...post,
        author: authorsMap.get(post.authorId) || null,
        category: categoriesMap.get(post.categoryId) || null,
        tags: postTagsMap.get(post.id) || [],
      }));
    } catch (error) {
      console.error('Error finding all posts:', error);
      throw error;
    }
  },
  
  async findAllForAdmin() {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { date: 'desc' },
      });
      
      // Fetch all related data in parallel for better performance
      const authors = await prisma.author.findMany();
      const categories = await prisma.category.findMany();
      
      // Get counts for tags and comments
      const postTagCounts = await Promise.all(posts.map(async post => {
        const tagCount = await prisma.postTag.count({
          where: { postId: post.id }
        });
        return { id: post.id, tagCount };
      }));
      
      const commentCounts = await Promise.all(posts.map(async post => {
        const commentCount = await prisma.comment.count({
          where: { postId: post.id }
        });
        return { id: post.id, commentCount };
      }));
      
      // Create maps for fast lookups
      const authorsMap = new Map(authors.map(author => [author.id, author]));
      const categoriesMap = new Map(categories.map(category => [category.id, category]));
      const tagCountMap = new Map(postTagCounts.map(item => [item.id, item.tagCount]));
      const commentCountMap = new Map(commentCounts.map(item => [item.id, item.commentCount]));
      
      // Combine all data
      return posts.map(post => ({
        ...post,
        author: authorsMap.get(post.authorId) || null,
        category: categoriesMap.get(post.categoryId) || null,
        _count: {
          tags: tagCountMap.get(post.id) || 0,
          comments: commentCountMap.get(post.id) || 0
        }
      }));
    } catch (error) {
      console.error('Error finding posts for admin:', error);
      throw error;
    }
  },
  
  async findById(id: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { id },
      });
      
      if (!post) return null;
      
      // Manually fetch related data
      const author = await prisma.author.findUnique({ 
        where: { id: post.authorId }
      });
      
      const category = await prisma.category.findUnique({
        where: { id: post.categoryId }
      });
      
      // Get all PostTag relations for this post
      const postTags = await prisma.postTag.findMany({
        where: { postId: post.id },
      });
      
      // Get all tag IDs from the relations
      const tagIds = postTags.map(pt => pt.tagId);
      
      // Fetch all related tags
      const tags = tagIds.length > 0 
        ? await prisma.tag.findMany({
            where: { id: { in: tagIds } },
          })
        : [];
      
      // Return the complete post with its relationships
      return {
        ...post,
        author,
        category,
        tags,
      };
    } catch (error) {
      console.error(`Error finding post by id ${id}:`, error);
      throw error;
    }
  },
  
  async findBySlug(slug: string) {
    try {
      const post = await prisma.post.findUnique({
        where: { slug },
      });
      
      if (!post) return null;
      
      // Manually fetch related data
      const author = await prisma.author.findUnique({ 
        where: { id: post.authorId }
      });
      
      const category = await prisma.category.findUnique({
        where: { id: post.categoryId }
      });
      
      // Get all PostTag relations for this post
      const postTags = await prisma.postTag.findMany({
        where: { postId: post.id },
      });
      
      // Get all tag IDs from the relations
      const tagIds = postTags.map(pt => pt.tagId);
      
      // Fetch all related tags
      const tags = tagIds.length > 0 
        ? await prisma.tag.findMany({
            where: { id: { in: tagIds } },
          })
        : [];
      
      // Return the complete post with its relationships
      return {
        ...post,
        author,
        category,
        tags,
      };
    } catch (error) {
      console.error(`Error finding post by slug ${slug}:`, error);
      throw error;
    }
  },
  
  async create(data: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string | null;
    authorId: string;
    categoryId: string;
    featured: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'CORRECTED';
    date?: Date;
    tags: string[];
  }) {
    try {
      const { tags, ...postData } = data;
      
      // First create the post without tags
      const post = await prisma.post.create({
        data: {
          ...postData,
          date: data.date || new Date() // Use provided date or current date
        },
      });
      
      // Then create the tag relationships separately
      if (tags && tags.length > 0) {
        await Promise.all(
          tags.map(tagId => 
            prisma.postTag.create({
              data: {
                postId: post.id,
                tagId: tagId
              }
            })
          )
        );
      }
      
      // Manually fetch related data
      const author = await prisma.author.findUnique({ 
        where: { id: post.authorId }
      });
      
      const category = await prisma.category.findUnique({
        where: { id: post.categoryId }
      });
      
      // Fetch all tags for this post
      const postTags = await prisma.postTag.findMany({
        where: { postId: post.id },
      });
      
      const tagIds = postTags.map(pt => pt.tagId);
      const tagObjects = tagIds.length > 0 
        ? await prisma.tag.findMany({
            where: { id: { in: tagIds } },
          })
        : [];
      
      // Return the complete post with its relationships
      return {
        ...post,
        author,
        category,
        tags: tagObjects,
      };
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A post with this slug already exists');
      }
      console.error('Error creating post:', error);
      throw error;
    }
  },
  
  async update(id: string, data: {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string | null;
    authorId?: string;
    categoryId?: string;
    featured?: boolean;
    status?: 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED' | 'CORRECTED';
    date?: Date;
    tags?: string[];
  }) {
    try {
      const { tags, ...postData } = data;
      
      // Start a transaction to update the post and its tags
      return await prisma.$transaction(async (tx) => {
        // Update the post data
        const post = await tx.post.update({
          where: { id },
          data: postData,
        });
        
        // If tags are provided, update tag relationships
        if (tags !== undefined) {
          // Delete existing tag relationships
          await tx.postTag.deleteMany({
            where: { postId: id },
          });
          
          // Create new tag relationships
          if (tags.length > 0) {
            await Promise.all(
              tags.map(tagId => 
                tx.postTag.create({
                  data: {
                    postId: id,
                    tagId: tagId
                  }
                })
              )
            );
          }
        }
        
        // Manually fetch related data
        const author = await tx.author.findUnique({ 
          where: { id: post.authorId }
        });
        
        const category = await tx.category.findUnique({
          where: { id: post.categoryId }
        });
        
        // Fetch all tags for this post
        const postTags = await tx.postTag.findMany({
          where: { postId: post.id },
        });
        
        const tagIds = postTags.map(pt => pt.tagId);
        const tagObjects = tagIds.length > 0 
          ? await tx.tag.findMany({
              where: { id: { in: tagIds } },
            })
          : [];
        
        // Return the complete post with its relationships
        return {
          ...post,
          author,
          category,
          tags: tagObjects,
        };
      });
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A post with this slug already exists');
      }
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id: string) {
    try {
      // Delete related post tags first
      await prisma.postTag.deleteMany({
        where: { postId: id },
      });
      
      // Then delete the post
      await prisma.post.delete({
        where: { id },
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  }
};
