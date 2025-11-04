// Simple script to test Redis caching
async function testCache() {
  const testQueries = [
    'http://localhost:3000/api/search?q=test',
    'http://localhost:3000/api/search?q=test&page=1',
    'http://localhost:3000/api/search?q=example'
  ];

  console.log('🚀 Starting cache test...');

  for (const query of testQueries) {
    console.log(`\n📡 Testing query: ${query}`);
    
    // First request - should be a cache miss
    console.log('\nFirst request (should be cache MISS):');
    const start1 = Date.now();
    const response1 = await fetch(query);
    const time1 = Date.now() - start1;
    console.log(`Time taken: ${time1}ms`);
    
    // Wait a second
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Second request - should be a cache hit
    console.log('\nSecond request (should be cache HIT):');
    const start2 = Date.now();
    const response2 = await fetch(query);
    const time2 = Date.now() - start2;
    console.log(`Time taken: ${time2}ms`);
    
    // Compare times
    const improvement = ((time1 - time2) / time1 * 100).toFixed(2);
    console.log(`\n📊 Cache improvement: ${improvement}% faster`);
  }
}

testCache().catch(console.error);