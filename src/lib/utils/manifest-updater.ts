import fs from 'fs/promises';
import path from 'path';

export async function updateManifestIcons(siteFavicon: string) {
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

    const favicon = siteFavicon.startsWith('/') || siteFavicon.startsWith('http')
      ? siteFavicon
      : `/${siteFavicon}`;

    // Update manifest icons
    // Replace all instances of {{site_favicon}} with the actual favicon
    const manifestContent = JSON.stringify(manifest, null, 2).replace(
      /"\{\{site_favicon\}\}"/g,
      `"${favicon}"`
    );

    // Write the updated manifest
    await fs.writeFile(manifestPath, manifestContent);

    // Write updated manifest
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  } catch (error) {
    console.error('Failed to update manifest.json:', error);
  }
}