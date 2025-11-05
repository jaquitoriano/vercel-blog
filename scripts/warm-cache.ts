import { getMetadataWithCache } from '@/lib/cache/metadata-cache';

async function warmCache() {
  console.log('Warming up metadata cache...');
  try {
    await getMetadataWithCache();
    console.log('Successfully warmed up metadata cache');
  } catch (error) {
    console.error('Failed to warm up metadata cache:', error);
    process.exit(1);
  }
}

warmCache();