const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setDefaultFavicon() {
  try {
    await prisma.siteSetting.upsert({
      where: { key: 'site_favicon' },
      update: { value: '/images/fallbacks/favicon.svg' },
      create: { 
        key: 'site_favicon',
        value: '/images/fallbacks/favicon.svg'
      }
    });
    console.log('Successfully set default favicon in site settings');
  } catch (error) {
    console.error('Error setting default favicon:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setDefaultFavicon();