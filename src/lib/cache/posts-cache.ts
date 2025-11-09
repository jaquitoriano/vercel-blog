import { prisma } from '@/lib/db/prisma';
import { cacheData } from '@/lib/cache/page-cache';
import { Post, PostStatus } from '@prisma/client';
import { transformPost } from './transform-post';

export interface PostWithRelations extends Post {
  author: {
    id: string;
    name: string;
    avatar: string | null;
    bio: string | null;
  };
  category: {
    name: string;
    slug: string;
  };
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export async function getAllPostsWithCache() {
  const cacheKey = 'posts:public:all';
  
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
      tags: ['posts', 'public']
    }
  );
}

export async function getPostBySlugWithCache(slug: string) {
  const cacheKey = `posts:public:slug:${slug}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const post = await prisma.post.findFirst({
        where: {
          slug,
          status: PostStatus.PUBLISHED
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
      
      return post ? transformPost(post) : null;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['posts', 'public', `post:${slug}`]
    }
  );
}

export async function getCategoryPostsWithCache(categorySlug: string) {
  const cacheKey = `posts:public:category:${categorySlug}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const posts = await prisma.post.findMany({
        where: {
          category: {
            slug: categorySlug
          },
          status: PostStatus.PUBLISHED
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
      tags: ['posts', 'public', `category:${categorySlug}`]
    }
  );
}

export async function getTagPostsWithCache(tagSlug: string) {
  const cacheKey = `posts:public:tag:${tagSlug}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const posts = await prisma.post.findMany({
        where: {
          tags: {
            some: {
              tag: {
                slug: tagSlug
              }
            }
          },
          status: PostStatus.PUBLISHED
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
      tags: ['posts', 'public', `tag:${tagSlug}`]
    }
  );
}