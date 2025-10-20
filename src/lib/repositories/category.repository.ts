import { prisma } from '@/lib/db/prisma';

// Define simplified types for our repository
interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define PrismaError for error handling
interface PrismaError extends Error {
  code: string;
  meta?: Record<string, any>;
}

export const categoryRepository = {
  async findAll(): Promise<(Category & { postCount: number })[]> {
    try {
      // Get all categories
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      
      // Get post counts for each category
      const postCounts = await Promise.all(
        categories.map(async (category) => {
          const count = await prisma.post.count({
            where: { categoryId: category.id }
          });
          return { categoryId: category.id, count };
        })
      );
      
      // Create a map for easy lookup
      const postCountMap = new Map(postCounts.map(item => [item.categoryId, item.count]));
      
      // Combine the data
      return categories.map(category => ({
        ...category,
        postCount: postCountMap.get(category.id) || 0
      }));
    } catch (error) {
      console.error('Error finding all categories:', error);
      throw error;
    }
  },
  
  async findById(id: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });
      
      return category;
    } catch (error) {
      console.error(`Error finding category by id ${id}:`, error);
      throw error;
    }
  },
  
  async findBySlug(slug: string): Promise<Category | null> {
    try {
      const category = await prisma.category.findUnique({
        where: { slug },
      });
      
      return category;
    } catch (error) {
      console.error(`Error finding category by slug ${slug}:`, error);
      throw error;
    }
  },
  
  async create(data: { name: string, slug: string }): Promise<Category> {
    try {
      const category = await prisma.category.create({
        data,
      });
      
      return category;
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A category with this slug already exists');
      }
      console.error('Error creating category:', error);
      throw error;
    }
  },
  
  async update(id: string, data: { name?: string, slug?: string }): Promise<Category> {
    try {
      const category = await prisma.category.update({
        where: { id },
        data,
      });
      
      return category;
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A category with this slug already exists');
      }
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // First check if there are any posts using this category
      const postsCount = await prisma.post.count({
        where: { categoryId: id },
      });
      
      if (postsCount > 0) {
        throw new Error(`Cannot delete category because it's used by ${postsCount} posts`);
      }
      
      // If no posts are using this category, delete it
      await prisma.category.delete({
        where: { id },
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  }
};