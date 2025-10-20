import { prisma } from '@/lib/db/prisma';

// Define simplified types for our repository
interface Author {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  social?: any;
  createdAt: Date;
  updatedAt: Date;
}

// Define PrismaError for error handling
interface PrismaError extends Error {
  code: string;
  meta?: Record<string, any>;
}

export const authorRepository = {
  async findAll(): Promise<(Author & { postCount: number })[]> {
    try {
      // Get all authors
      const authors = await prisma.author.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      
      // Get post counts for each author
      const postCounts = await Promise.all(
        authors.map(async (author) => {
          const count = await prisma.post.count({
            where: { authorId: author.id }
          });
          return { authorId: author.id, count };
        })
      );
      
      // Create a map for easy lookup
      const postCountMap = new Map(postCounts.map(item => [item.authorId, item.count]));
      
      // Combine the data
      return authors.map(author => ({
        ...author,
        postCount: postCountMap.get(author.id) || 0
      }));
    } catch (error) {
      console.error('Error finding all authors:', error);
      throw error;
    }
  },
  
  async findById(id: string): Promise<Author | null> {
    try {
      const author = await prisma.author.findUnique({
        where: { id },
      });
      
      return author;
    } catch (error) {
      console.error(`Error finding author by id ${id}:`, error);
      throw error;
    }
  },
  
  async create(data: { 
    name: string; 
    avatar?: string | null; 
    bio?: string | null; 
    social?: any;
  }): Promise<Author> {
    try {
      const author = await prisma.author.create({
        data,
      });
      
      return author;
    } catch (error) {
      console.error('Error creating author:', error);
      throw error;
    }
  },
  
  async update(id: string, data: { 
    name?: string; 
    avatar?: string | null; 
    bio?: string | null; 
    social?: any;
  }): Promise<Author> {
    try {
      const author = await prisma.author.update({
        where: { id },
        data,
      });
      
      return author;
    } catch (error) {
      console.error(`Error updating author ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // First check if there are any posts by this author
      const postsCount = await prisma.post.count({
        where: { authorId: id },
      });
      
      if (postsCount > 0) {
        throw new Error(`Cannot delete author because they have ${postsCount} posts`);
      }
      
      // If no posts by this author, delete it
      await prisma.author.delete({
        where: { id },
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting author ${id}:`, error);
      throw error;
    }
  }
};