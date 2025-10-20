/**
 * This file updates the BLOB_READ_WRITE_TOKEN in .env.local
 * Run it with: node update-blob-token.js <new-token>
 */
const fs = require('fs');

function updateBlobToken(newToken) {
  if (!newToken) {
    console.error('Please provide a new token as an argument');
    console.log('Usage: node update-blob-token.js <new-token>');
    process.exit(1);
  }

  try {
    // Read .env.local file
    const envPath = '.env.local';
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Update the token
    const oldEnvContent = envContent;
    envContent = envContent.replace(
      /BLOB_READ_WRITE_TOKEN="[^"]*"/g, 
      `BLOB_READ_WRITE_TOKEN="${newToken}"`
    );
    
    // Check if the content was actually changed
    if (oldEnvContent === envContent) {
      console.log('⚠️ No change made. Make sure the format in .env.local matches BLOB_READ_WRITE_TOKEN="value"');
    } else {
      // Write the updated content back
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Token updated successfully in .env.local');
      console.log('Please restart your Next.js development server for changes to take effect');
    }
  } catch (error) {
    console.error('❌ Error updating token:', error.message);
    process.exit(1);
  }
}

// Get the new token from command line
const newToken = process.argv[2];
updateBlobToken(newToken);