import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import HeaderClient from './HeaderClient';
import { settingsRepository } from '@/lib/repositories/settings.repository';

async function getHeaderData() {
  // Initialize settings if needed and get them
  const settings = await settingsRepository.getByKeys(['site_title', 'site_description', 'site_logo']);
  console.log('Retrieved settings:', settings);

  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);
  console.log('Settings map:', settingsMap);

  return {
    siteTitle: settingsMap.site_title || 'Ikira',
    siteDescription: settingsMap.site_description || 'A Next.js Blog',
    siteLogo: settingsMap.site_logo || '',
  };
}

export default async function Header() {
  const userStatus = await getCurrentUser();
  const { siteTitle, siteDescription, siteLogo } = await getHeaderData();

  return (
    <HeaderClient 
      userStatus={userStatus}
      siteTitle={siteTitle}
      siteDescription={siteDescription}
      siteLogo={siteLogo}
    />
  );
}