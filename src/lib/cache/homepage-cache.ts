import { prisma } from '@/lib/db/prisma';
import { cacheData } from '@/lib/cache/page-cache';
import { PostStatus } from '@prisma/client';
import { transformPost } from './transform-post';

export async function getFeaturedPostsWithCache() {
  const cacheKey = 'posts:public:featured';
  
  return cacheData(
    cacheKey,
    async () => {
      const posts = await prisma.post.findMany({
        where: {
          status: PostStatus.PUBLISHED,
          featured: true
        },
        orderBy: {
          date: 'desc'
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true
            }
          },
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        }
      });
      
      return posts.map(transformPost);
    },
    {
      ttl: 3600, // 1 hour
      tags: ['posts', 'public', 'featured']
    }
  );
}

export async function getRecentPostsWithCache(limit: number = 5) {
  const cacheKey = `posts:public:recent:${limit}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const posts = await prisma.post.findMany({
        where: {
          status: PostStatus.PUBLISHED
        },
        orderBy: {
          date: 'desc'
        },
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
              bio: true
            }
          },
          category: {
            select: {
              name: true,
              slug: true
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  slug: true
                }
              }
            }
          }
        }
      });
      
      return posts.map(transformPost);
    },
    {
      ttl: 3600, // 1 hour
      tags: ['posts', 'public', 'recent']
    }
  );
}