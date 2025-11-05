import { Redis } from '@upstash/redis';
import { settingsRepository } from '@/lib/repositories/settings.repository';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

const CACHE_KEY = 'site:metadata';
const CACHE_TTL = 3600; // 1 hour

export async function getMetadataWithCache() {
  try {
    // Try to get from cache first
    const cachedMetadata = await redis.get(CACHE_KEY);
    if (cachedMetadata) {
      return cachedMetadata;
    }

    // If not in cache, get from database
    const settings = await settingsRepository.getAll();
    
    // Cache the results
    await redis.set(CACHE_KEY, settings, {
      ex: CACHE_TTL
    });

    return settings;
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