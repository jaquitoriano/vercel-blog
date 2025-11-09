import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

const getRedisClient = () => {
  if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
  }

  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Max Redis reconnection attempts reached');
            return new Error('Max Redis reconnection attempts reached');
          }
          // Reconnect after retries * 100ms (exponential backoff)
          return Math.min(retries * 100, 3000);
        }
      }
    });

    redisClient.on('error', (err) => console.error('Redis Client Error:', err));
    redisClient.on('connect', () => console.log('Redis Client Connected'));
    redisClient.on('reconnecting', () => console.log('Redis Client Reconnecting'));
    redisClient.on('end', () => console.log('Redis Client Connection Ended'));
  }

  return redisClient;
};

// Create the Redis client
const redis = getRedisClient();

// Connect to redis on startup if we're not in a production environment
// In production, we'll connect on-demand
if (process.env.NODE_ENV !== 'production') {
  redis.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });
}

export { redis };