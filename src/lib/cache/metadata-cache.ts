import { createClient } from 'redis';
import { settingsRepository } from '@/lib/repositories/settings.repository';

const redis = createClient({
  url: process.env.REDIS_URL || undefined
});

// Connect to redis on startup
redis.connect().catch(console.error);

// Handle redis errors
redis.on('error', (err) => console.error('Redis Client Error', err));

const CACHE_KEY = 'site:metadata';
const CACHE_TTL = 3600; // 1 hour

export type SiteMetadata = {
  meta_title?: string;
  site_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
  twitter_handle?: string;
  site_favicon?: string;
};

export async function getMetadataWithCache(): Promise<SiteMetadata> {
  try {
    // Try to get from cache first
    const cachedMetadata = await redis.get(CACHE_KEY);
    if (cachedMetadata) {
      return JSON.parse(cachedMetadata) as SiteMetadata;
    }

    // If not in cache, get from database
    const settings = await settingsRepository.getAll();
    
    // Cache the results
    await redis.set(CACHE_KEY, JSON.stringify(settings), {
      EX: CACHE_TTL
    });

    return settings as SiteMetadata;
  } catch (error) {
    console.error('Failed to get metadata:', error);
    return {};
  }
}

export async function invalidateMetadataCache() {
  try {
    await redis.del(CACHE_KEY);
  } catch (error) {
    console.error('Failed to invalidate metadata cache:', error);
  }
}