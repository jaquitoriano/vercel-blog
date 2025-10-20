/**
 * This file generates a new Vercel Blob token using the client ID and client secret approach
 * Run it with: node generate-blob-token.js
 */
const axios = require('axios');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

// Store ID is already defined in the environment
const storeId = process.env.NEXT_PUBLIC_STORE_ID;

async function generateBlobToken(clientId, clientSecret) {
  if (!storeId) {
    throw new Error('NEXT_PUBLIC_STORE_ID environment variable is not set');
  }

  if (!clientId || !clientSecret) {
    console.error('You need to provide a client ID and client secret as arguments');
    console.log('Usage: node generate-blob-token.js <client-id> <client-secret>');
    process.exit(1);
  }

  console.log('Generating a new token for blob store:', storeId);
  
  try {
    // First get an access token using client credentials
    const tokenResponse = await axios.post('https://api.vercel.com/v2/oauth/access_token', {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
      scope: 'store_write'
    });
    
    if (!tokenResponse.data.access_token) {
      throw new Error('Failed to get access token');
    }
    
    const accessToken = tokenResponse.data.access_token;
    console.log('✅ Access token generated');
    
    // Now use the access token to generate a blob token
    const blobTokenResponse = await axios.post(
      `https://api.vercel.com/v2/blob/stores/${storeId}/tokens`, 
      { type: 'read_write' },
      { headers: { 'Authorization': `Bearer ${accessToken}` } }
    );
    
    if (!blobTokenResponse.data.token) {
      throw new Error('Failed to generate blob token');
    }
    
    const newBlobToken = blobTokenResponse.data.token;
    console.log('✅ New blob token generated:', newBlobToken.substring(0, 10) + '...');
    
    // Update the .env.local file with the new token
    let envContent = fs.readFileSync('.env.local', 'utf8');
    envContent = envContent.replace(
      /BLOB_READ_WRITE_TOKEN="[^"]*"/g, 
      `BLOB_READ_WRITE_TOKEN="${newBlobToken}"`
    );
    fs.writeFileSync('.env.local', envContent);
    
    console.log('✅ Updated .env.local file with new token');
    console.log('Please restart your Next.js development server to apply the changes');
    
    return newBlobToken;
  } catch (error) {
    console.error('❌ Error generating blob token:', error.response?.data || error.message);
    throw error;
  }
}

// Get command line arguments
const args = process.argv.slice(2);
generateBlobToken(args[0], args[1]).catch(error => {
  process.exit(1);
});