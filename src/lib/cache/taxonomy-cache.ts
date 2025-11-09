import { prisma } from '@/lib/db/prisma';
import { cacheData } from '@/lib/cache/page-cache';

export async function getAllCategoriesWithCache() {
  const cacheKey = 'categories:public:all';
  
  return cacheData(
    cacheKey,
    async () => {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return categories;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['categories', 'public']
    }
  );
}

export async function getAllTagsWithCache() {
  const cacheKey = 'tags:public:all';
  
  return cacheData(
    cacheKey,
    async () => {
      const tags = await prisma.tag.findMany({
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });
      
      return tags;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['tags', 'public']
    }
  );
}

export async function getCategoryBySlugWithCache(slug: string) {
  const cacheKey = `categories:public:slug:${slug}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      });
      
      return category;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['categories', 'public', `category:${slug}`]
    }
  );
}

export async function getTagBySlugWithCache(slug: string) {
  const cacheKey = `tags:public:slug:${slug}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const tag = await prisma.tag.findUnique({
        where: { slug },
        include: {
          _count: {
            select: {
              posts: true
            }
          }
        }
      });
      
      return tag;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['tags', 'public', `tag:${slug}`]
    }
  );
}