import { createClient } from 'redis';

// Without REDIS_URL the client would default to localhost and keep retrying,
// so only create one when a URL is configured
const redis = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : null;

if (redis) {
  // Handle redis errors
  redis.on('error', (err) => console.error('Redis Client Error', err));

  // Connect to redis on startup
  redis.connect().catch(console.error);
}

export async function cachePrismaQuery<T>(
  key: string,
  queryFn: () => Promise<T>,
  ttl: number = 300 // 5 minutes default
): Promise<T> {
  // While Redis is missing, connecting or down, query the database directly.
  // Sending commands then would queue them until Redis came back.
  if (!redis?.isReady) {
    return queryFn();
  }

  let cached: string | null = null;
  try {
    cached = await redis.get(key);
  } catch (error) {
    console.error('Cache read error:', error);
  }
  if (cached) {
    return JSON.parse(cached) as T;
  }

  // Outside the try blocks, so a database error is raised once rather than
  // triggering a second query
  const result = await queryFn();

  try {
    await redis.set(key, JSON.stringify(result), { EX: ttl });
  } catch (error) {
    console.error('Cache write error:', error);
  }

  return result;
}
