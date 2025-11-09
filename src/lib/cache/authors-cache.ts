import { cacheData } from '@/lib/cache/page-cache';
import { authorRepository } from '@/lib/repositories/author.repository';

export interface Author {
  id: string;
  name: string;
  avatar?: string | null;
  bio?: string | null;
  social?: any;
  createdAt: Date;
  updatedAt: Date;
  postCount?: number;
}

export async function getAllAuthorsWithCache() {
  const cacheKey = 'authors:public:all';
  
  return cacheData(
    cacheKey,
    async () => {
      const authors = await authorRepository.findAll();
      return authors;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['authors', 'public']
    }
  );
}

export async function getAuthorByIdWithCache(id: string) {
  const cacheKey = `authors:public:id:${id}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const author = await authorRepository.findById(id);
      return author;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['authors', 'public', `author:${id}`]
    }
  );
}