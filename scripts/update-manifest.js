const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs').promises;
const path = require('path');

async function updateManifestIcons(siteFavicon) {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

    const favicon = siteFavicon.startsWith('/') || siteFavicon.startsWith('http')
      ? siteFavicon
      : `/${siteFavicon}`;

    // Determine file type based on extension or URL
    const fileType = favicon.toLowerCase().endsWith('.svg') 
      ? 'image/svg+xml'
      : favicon.toLowerCase().endsWith('.png')
      ? 'image/png'
      : favicon.toLowerCase().endsWith('.jpg') || favicon.toLowerCase().endsWith('.jpeg')
      ? 'image/jpeg'
      : 'image/svg+xml';

    // Update manifest icons
    manifest.icons = [
      {
        src: favicon,
        sizes: "192x192",
        type: fileType,
        purpose: "any"
      },
      {
        src: favicon,
        sizes: "512x512",
        type: fileType,
        purpose: "any"
      }
    ];

    // Write the updated manifest
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Failed to update manifest.json:', error);
  }
}

async function updateFaviconAndManifest() {
  try {
    // Get current favicon setting
    const setting = await prisma.siteSetting.findFirst({
      where: { key: 'site_favicon' }
    });

    if (setting) {
      // Update manifest with current favicon
      await updateManifestIcons(setting.value);
      console.log('Successfully updated manifest with current favicon:', setting.value);
    } else {
      console.log('No favicon setting found');
    }
  } catch (error) {
    console.error('Error updating manifest:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateFaviconAndManifest();