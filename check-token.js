#!/usr/bin/env node

// Simple script to debug Vercel Blob token
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envLocalPath = path.join(__dirname, '.env.local');
console.log(`Checking ${envLocalPath} for Vercel Blob configuration...`);

if (!fs.existsSync(envLocalPath)) {
  console.error('❌ .env.local file not found!');
  process.exit(1);
}

// Parse the .env.local file
const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));

// Check token
const token = envConfig.BLOB_READ_WRITE_TOKEN;
const storeId = envConfig.NEXT_PUBLIC_STORE_ID;

if (!token) {
  console.error('❌ BLOB_READ_WRITE_TOKEN is not defined!');
  process.exit(1);
}

if (!storeId) {
  console.error('❌ NEXT_PUBLIC_STORE_ID is not defined!');
  process.exit(1);
}

console.log(`✅ Found token: ${token.substring(0, 10)}...${token.substring(token.length - 5)}`);
console.log(`✅ Store ID: ${storeId}`);

// Basic token format check
if (!token.startsWith('vercel_blob_')) {
  console.error('⚠️ WARNING: Token does not start with "vercel_blob_" prefix!');
}

// Check if token contains store ID
if (!token.includes(storeId.replace('store_', ''))) {
  console.error('⚠️ WARNING: Token does not contain the store ID! This might be the issue.');
}

console.log('\n📋 Token Analysis:');
const parts = token.split('_');
console.log(`- Prefix: ${parts[0]}_${parts[1]}`);
console.log(`- Permissions: ${parts[2] || 'unknown'}`);
console.log(`- Store ID part: ${parts[3] || 'unknown'}`);
console.log(`- Token part: ${parts.slice(4).join('_')}`);

console.log('\n🔍 Instructions to fix:');
console.log('1. Run: npx vercel login (if not already logged in)');
console.log(`2. Run: npx vercel blob generate-token ${storeId}`);
console.log('3. Update the BLOB_READ_WRITE_TOKEN in .env.local with the new token');
console.log('4. Restart your Next.js development server');