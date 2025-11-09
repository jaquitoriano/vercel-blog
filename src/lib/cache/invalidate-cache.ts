import { NextResponse } from 'next/server';
import { invalidateByTags } from '@/lib/cache/page-cache';

export async function invalidatePageCache(tags: string[]) {
  try {
    await invalidateByTags(tags);
    return true;
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
    return false;
  }
}

export async function invalidatePostCache(postSlug: string) {
  try {
    await invalidateByTags(['posts', 'public', `post:${postSlug}`]);
    return true;
  } catch (error) {
    console.error('Failed to invalidate post cache:', error);
    return false;
  }
}

export async function invalidateCategoryCache(categorySlug: string) {
  try {
    await invalidateByTags(['posts', 'public', `category:${categorySlug}`]);
    return true;
  } catch (error) {
    console.error('Failed to invalidate category cache:', error);
    return false;
  }
}

export async function invalidateTagCache(tagSlug: string) {
  try {
    await invalidateByTags(['posts', 'public', `tag:${tagSlug}`]);
    return true;
  } catch (error) {
    console.error('Failed to invalidate tag cache:', error);
    return false;
  }
}

export async function invalidateAllPublicCache() {
  try {
    await invalidateByTags(['posts', 'public']);
    return true;
  } catch (error) {
    console.error('Failed to invalidate all public cache:', error);
    return false;
  }
}