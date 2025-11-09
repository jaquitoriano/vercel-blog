const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateFavicon() {
  try {
    await prisma.siteSetting.update({
      where: { key: 'site_favicon' },
      data: { value: '/images/fallbacks/favicon.png' }
    });
    console.log('Successfully updated favicon to use local path');
  } catch (error) {
    console.error('Error updating favicon:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFavicon();