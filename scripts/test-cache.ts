import { getAllPostsWithCache } from '../src/lib/cache/posts-cache';
import { invalidateAllPublicCache } from '../src/lib/cache/invalidate-cache';
import { redis } from '../src/lib/db/redis';
import { prisma } from '../src/lib/db/prisma';
import { PostStatus } from '@prisma/client';

async function testPostsCaching() {
  console.log('🔍 Testing posts caching...\n');

  try {
    // Clear Redis cache first
    await redis.flushDb();
    console.log('✨ Redis cache cleared\n');

    // First fetch - should hit database
    console.log('1️⃣ First fetch (should hit database)...');
    console.time('First fetch');
    const firstFetch = await getAllPostsWithCache();
    console.timeEnd('First fetch');
    console.log(`📊 Retrieved ${firstFetch.length} posts\n`);

    // Second fetch - should hit cache
    console.log('2️⃣ Second fetch (should hit cache)...');
    console.time('Second fetch');
    const secondFetch = await getAllPostsWithCache();
    console.timeEnd('Second fetch');
    console.log(`📊 Retrieved ${secondFetch.length} posts\n`);

    // Modify a post to test cache invalidation
    console.log('3️⃣ Modifying a post...');
    const postToModify = firstFetch[0];
    if (postToModify) {
      await prisma.post.update({
        where: { id: postToModify.id },
        data: {
          title: `${postToModify.title} (Updated at ${new Date().toISOString()})`
        }
      });
      await invalidateAllPublicCache();
      console.log('✅ Post modified and cache invalidated\n');
    }

    // Third fetch - should hit database again
    console.log('4️⃣ Third fetch (should hit database due to modification)...');
    console.time('Third fetch');
    const thirdFetch = await getAllPostsWithCache();
    console.timeEnd('Third fetch');
    console.log(`📊 Retrieved ${thirdFetch.length} posts\n`);

    // Compare results
    const firstTitle = firstFetch[0]?.title;
    const thirdTitle = thirdFetch[0]?.title;
    console.log('📋 Results comparison:');
    console.log('First fetch title:', firstTitle);
    console.log('Third fetch title:', thirdTitle);

    // Check cache keys
    const keys = await redis.keys('posts:*');
    console.log('\n🔑 Redis cache keys:', keys);

    // Cleanup - restore original title
    if (postToModify) {
      await prisma.post.update({
        where: { id: postToModify.id },
        data: {
          title: postToModify.title
        }
      });
      console.log('\n🧹 Restored original post title');
    }

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    // Close connections
    await Promise.all([
      redis.quit(),
      prisma.$disconnect()
    ]);
    console.log('\n👋 Test complete - connections closed');
  }
}

// Run the test
testPostsCaching();