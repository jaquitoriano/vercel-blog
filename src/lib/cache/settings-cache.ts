import { cacheData } from '@/lib/cache/page-cache';
import { settingsRepository } from '@/lib/repositories/settings.repository';
import { invalidateByTags } from '@/lib/cache/page-cache';

export type SiteSettings = Record<string, string>;

export async function getSettingsWithCache(): Promise<SiteSettings> {
  const cacheKey = 'settings:public:all';
  
  return cacheData(
    cacheKey,
    async () => {
      const settings = await settingsRepository.getAll();
      return settings;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['settings', 'public']
    }
  );
}

export async function getSettingWithCache(key: string): Promise<string | null> {
  const cacheKey = `settings:public:key:${key}`;
  
  return cacheData(
    cacheKey,
    async () => {
      const value = await settingsRepository.getByKey(key);
      return value;
    },
    {
      ttl: 3600, // 1 hour
      tags: ['settings', 'public', `setting:${key}`]
    }
  );
}

export async function invalidateSettingsCache() {
  try {
    await invalidateByTags(['settings', 'public']);
    return true;
  } catch (error) {
    console.error('Failed to invalidate settings cache:', error);
    return false;
  }
}