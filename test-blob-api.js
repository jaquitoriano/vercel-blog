/**
 * This file is used to directly test Vercel Blob API connectivity
 * Run it with: node test-blob-api.js
 */
const { put } = require('@vercel/blob');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function testBlobUpload() {
  try {
    // Create a simple text file for testing
    const testFileName = `test-${Date.now()}.txt`;
    fs.writeFileSync(testFileName, 'Hello Vercel Blob!');
    
    console.log('Test file created:', testFileName);
    
    // Get the token from environment
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set');
    }
    
    console.log('Attempting to upload with token:', token.substring(0, 10) + '...' + token.substring(token.length - 5));
    
    // Try to upload to Vercel Blob
    const file = fs.readFileSync(testFileName);
    const { url } = await put(testFileName, file, {
      access: 'public',
      token: token
    });
    
    console.log('✅ Success! File uploaded to:', url);
    
    // Clean up
    fs.unlinkSync(testFileName);
    console.log('Test file deleted');
    
    return url;
  } catch (error) {
    console.error('❌ Error testing Blob API:', error.message);
    if (error.message.includes('Access denied')) {
      console.log('\n🔑 The token is invalid or expired. You need to generate a new one.');
      console.log('Please follow these instructions:');
      console.log('1. Go to https://vercel.com/dashboard');
      console.log('2. Select your project');
      console.log('3. Go to Settings → General → "Environment Variables"');
      console.log('4. Update BLOB_READ_WRITE_TOKEN with a new token');
      console.log('   (You can generate one in "Storage" section if available)');
    }
    throw error;
  }
}

// Run the test
testBlobUpload().catch(error => {
  process.exit(1);
});