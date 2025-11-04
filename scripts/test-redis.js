const { createClient } = require('redis');

async function testRedisConnection() {
  console.log('🚀 Testing Redis connection...');
  
  const redis = createClient({
    url: process.env.REDIS_URL
  });

  redis.on('error', err => console.log('Redis Client Error', err));
  
  try {
    await redis.connect();
    console.log('✅ Successfully connected to Redis');
    
    // Test writing to Redis
    const testKey = 'test:connection';
    const testValue = { message: 'Hello Redis!', timestamp: Date.now() };
    
    console.log('\n📝 Writing test data...');
    await redis.set(testKey, JSON.stringify(testValue), {
      EX: 60 // Expire in 60 seconds
    });
    console.log('✅ Successfully wrote test data');
    
    // Test reading from Redis
    console.log('\n🔍 Reading test data...');
    const result = await redis.get(testKey);
    console.log('📄 Retrieved data:', JSON.parse(result));
    
    console.log('\n✨ Redis cache is working correctly!');
  } catch (error) {
    console.error('❌ Redis test failed:', error);
  } finally {
    await redis.quit();
  }
}

// Load environment variables
require('dotenv').config();

// Run the test
testRedisConnection().catch(console.error);