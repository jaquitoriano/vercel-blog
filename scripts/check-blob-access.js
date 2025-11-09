const fs = require('fs').promises;
const path = require('path');

async function checkBlobConfig() {
  try {
    // Get current manifest
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));

    // Extract favicon URL from manifest
    const faviconUrl = manifest.icons[0]?.src;
    if (!faviconUrl) {
      console.error('No favicon URL found in manifest');
      return;
    }

    console.log('Current favicon URL:', faviconUrl);

    // Try to fetch the favicon
    try {
      const response = await fetch(faviconUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log('✅ Favicon URL is accessible');
      
      // Check content type
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);
      
      // Check if content type matches manifest
      const manifestType = manifest.icons[0]?.type;
      if (manifestType && contentType && !contentType.includes(manifestType.split('/')[1])) {
        console.warn(`⚠️ Content type mismatch: Manifest says ${manifestType}, but server returns ${contentType}`);
      }
    } catch (error) {
      console.error('❌ Failed to access favicon URL:', error.message);
    }
  } catch (error) {
    console.error('Error checking blob config:', error);
  }
}

checkBlobConfig();