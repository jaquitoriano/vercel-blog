import { prisma } from '@/lib/db/prisma';

// Define simplified types for our repository
interface Tag {
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

export const tagRepository = {
  async findAll(): Promise<(Tag & { postCount: number })[]> {
    try {
      // Get all tags
      const tags = await prisma.tag.findMany({
        orderBy: {
          name: 'asc',
        },
      });
      
      // Get post counts for each tag
      const postCounts = await Promise.all(
        tags.map(async (tag) => {
          const count = await prisma.postTag.count({
            where: { tagId: tag.id }
          });
          return { tagId: tag.id, count };
        })
      );
      
      // Create a map for easy lookup
      const postCountMap = new Map(postCounts.map(item => [item.tagId, item.count]));
      
      // Combine the data
      return tags.map(tag => ({
        ...tag,
        postCount: postCountMap.get(tag.id) || 0
      }));
    } catch (error) {
      console.error('Error finding all tags:', error);
      throw error;
    }
  },
  
  async findById(id: string): Promise<Tag | null> {
    try {
      const tag = await prisma.tag.findUnique({
        where: { id },
      });
      
      return tag;
    } catch (error) {
      console.error(`Error finding tag by id ${id}:`, error);
      throw error;
    }
  },
  
  async findBySlug(slug: string): Promise<Tag | null> {
    try {
      const tag = await prisma.tag.findUnique({
        where: { slug },
      });
      
      return tag;
    } catch (error) {
      console.error(`Error finding tag by slug ${slug}:`, error);
      throw error;
    }
  },
  
  async create(data: { name: string, slug: string }): Promise<Tag> {
    try {
      const tag = await prisma.tag.create({
        data,
      });
      
      return tag;
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A tag with this slug already exists');
      }
      console.error('Error creating tag:', error);
      throw error;
    }
  },
  
  async update(id: string, data: { name?: string, slug?: string }): Promise<Tag> {
    try {
      const tag = await prisma.tag.update({
        where: { id },
        data,
      });
      
      return tag;
    } catch (error) {
      const prismaError = error as PrismaError;
      if (prismaError.code === 'P2002') {
        throw new Error('A tag with this slug already exists');
      }
      console.error(`Error updating tag ${id}:`, error);
      throw error;
    }
  },
  
  async delete(id: string): Promise<boolean> {
    try {
      // First check if there are any posts using this tag
      const postsCount = await prisma.postTag.count({
        where: { tagId: id },
      });
      
      if (postsCount > 0) {
        throw new Error(`Cannot delete tag because it's used by ${postsCount} posts`);
      }
      
      // If no posts are using this tag, delete it
      await prisma.tag.delete({
        where: { id },
      });
      
      return true;
    } catch (error) {
      console.error(`Error deleting tag ${id}:`, error);
      throw error;
    }
  }
};