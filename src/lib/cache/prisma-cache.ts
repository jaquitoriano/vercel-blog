import { createClient } from 'redis';

const redis = createClient({
  url: process.env.REDIS_URL
});

// Connect to redis on startup
redis.connect().catch(console.error);

// Handle redis errors
redis.on('error', (err) => console.error('Redis Client Error', err));

export async function cachePrismaQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  try {
    console.log('🔍 Checking cache for key:', key);
    // Try to get cached data
    const cached = await redis.get(key);
    if (cached) {
      console.log('✅ Cache HIT');
      return JSON.parse(cached) as T;
    }
    
    console.log('❌ Cache MISS - Fetching from database');
    // If no cache, execute the query
    const result = await queryFn();
    
    // Cache the result
    await redis.set(key, JSON.stringify(result), {
      EX: ttl
    });

    return result;
  } catch (error) {
    console.error('Cache error:', error);
    // If cache fails, fall back to direct query
    return queryFn();
  }
}