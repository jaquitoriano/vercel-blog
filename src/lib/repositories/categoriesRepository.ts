import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';

export async function getAllCategories() {
  return executeQuery(async () => {
    // Get all categories
    const categories = await prisma.category.findMany();
    
    // Get post count for each category separately
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const postCount = await prisma.post.count({
          where: { categoryId: category.id },
        });
        
        return {
          ...category,
          _count: {
            posts: postCount,
          },
        };
      })
    );
    
    return categoriesWithCount;
  });
}

export async function getCategoryById(id: string) {
  return executeQuery(async () => {
    return await prisma.category.findUnique({
      where: { id },
    });
  });
}

export async function getCategoryBySlug(slug: string) {
  return executeQuery(async () => {
    return await prisma.category.findUnique({
      where: { slug },
    });
  });
}

export async function createCategory(data: any) {
  return executeQuery(async () => {
    return await prisma.category.create({
      data,
    });
  });
}

export async function updateCategory(id: string, data: any) {
  return executeQuery(async () => {
    return await prisma.category.update({
      where: { id },
      data,
    });
  });
}

export async function deleteCategory(id: string) {
  return executeQuery(async () => {
    return await prisma.category.delete({
      where: { id },
    });
  });
}