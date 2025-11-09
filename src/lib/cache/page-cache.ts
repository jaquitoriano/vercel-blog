import { redis } from '@/lib/db/redis';

const DEFAULT_TTL = 3600; // 1 hour in seconds

export type CacheConfig = {
  ttl?: number;
  tags?: string[];
};

async function ensureConnection() {
  // Prevent multiple simultaneous connection attempts
  if (!redis.isOpen && !redis.isConnecting) {
    await redis.connect().catch(err => {
      console.error('Redis connection error:', err);
      throw err;
    });
  }
  return redis;
}

export async function cacheData<T>(
  key: string,
  fetchData: () => Promise<T>,
  config: CacheConfig = {}
): Promise<T> {
  const { ttl = DEFAULT_TTL, tags = [] } = config;

  try {
    await ensureConnection();
    
    // Try to get from cache first
    const cachedData = await redis.get(key);
    if (cachedData && typeof cachedData === 'string') {
      return JSON.parse(cachedData) as T;
    }

    // If not in cache, fetch fresh data
    const data = await fetchData();
    
    // Cache the results
    await redis.setEx(key, ttl, JSON.stringify(data));

    // Store tags for cache invalidation
    if (tags.length > 0) {
      await Promise.all(
        tags.map(tag => redis.sAdd(`cache:tags:${tag}`, key))
      );
    }

    return data;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);
    // If cache fails, fall back to direct fetch
    return fetchData();
  }
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    await ensureConnection();
    await redis.del(key);
  } catch (error) {
    console.error(`Failed to invalidate cache for key ${key}:`, error);
  }
}

export async function invalidateByTags(tags: string[]): Promise<void> {
  try {
    await ensureConnection();
    
    // Get all keys for the given tags
    const tagKeys = await Promise.all(
      tags.map(tag => redis.sMembers(`cache:tags:${tag}`))
    );

    // Flatten and convert to array
    const uniqueKeys = Array.from(new Set(tagKeys.flat()));

    if (uniqueKeys.length > 0) {
      // Delete all keys and their tag associations
      await Promise.all([
        ...uniqueKeys.map(key => redis.del(key)),
        ...tags.map(tag => redis.del(`cache:tags:${tag}`))
      ]);
    }
  } catch (error) {
    console.error('Failed to invalidate cache by tags:', error);
  }
}

export function generateCacheKey(prefix: string, params: Record<string, any> = {}): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join(':');

  return `${prefix}${sortedParams ? ':' + sortedParams : ''}`;
}