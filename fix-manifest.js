// Fix manifest.json by setting a default favicon if one isn't set
const fs = require('fs/promises');
const path = require('path');

async function fixManifest() {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

    // Set default favicon if the template variable is still present
    const defaultFavicon = '/images/fallbacks/favicon.svg'; // Using a default fallback path
    const manifestContent = JSON.stringify(manifest, null, 2).replace(
      /"\{\{site_favicon\}\}"/g,
      `"${defaultFavicon}"`
    );

    // Write the updated manifest
    await fs.writeFile(manifestPath, manifestContent);
    console.log('Successfully updated manifest.json with default favicon');
  } catch (error) {
    console.error('Failed to update manifest.json:', error);
  }
}

fixManifest();