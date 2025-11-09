const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFavicon() {
  try {
    const setting = await prisma.siteSetting.findFirst({
      where: { key: 'site_favicon' }
    });
    console.log('Favicon setting:', setting);
  } catch (error) {
    console.error('Error checking favicon:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFavicon();