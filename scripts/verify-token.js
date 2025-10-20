#!/usr/bin/env node
/**
 * Script to verify that Vercel Blob token is properly loaded and valid
 * Run with: node scripts/verify-token.js
 */

require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}===== Vercel Blob Token Verification =====\n${colors.reset}`);

// Check token presence and format
const token = process.env.BLOB_READ_WRITE_TOKEN;
const storeId = process.env.NEXT_PUBLIC_STORE_ID;

if (!token) {
  console.error(`${colors.red}ERROR: BLOB_READ_WRITE_TOKEN is not set${colors.reset}`);
  console.log(`${colors.yellow}Make sure you have the token in your .env.local file${colors.reset}`);
  process.exit(1);
} else {
  console.log(`${colors.green}✓ BLOB_READ_WRITE_TOKEN is present${colors.reset}`);
  console.log(`${colors.dim}  Length: ${token.length} characters${colors.reset}`);
  
  // Validate token format
  if (token.startsWith('vercel_blob_rw_')) {
    console.log(`${colors.green}✓ Token has correct prefix 'vercel_blob_rw_'${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ Token has incorrect prefix - should start with 'vercel_blob_rw_'${colors.reset}`);
  }
  
  // Check if token contains store ID (without 'store_' prefix)
  if (storeId) {
    const storeIdWithoutPrefix = storeId.replace('store_', '');
    if (token.includes(storeIdWithoutPrefix)) {
      console.log(`${colors.green}✓ Token contains store ID identifier${colors.reset}`);
    } else {
      console.log(`${colors.yellow}⚠ Token doesn't seem to include store ID identifier${colors.reset}`);
    }
  }
}

if (!storeId) {
  console.error(`${colors.red}ERROR: NEXT_PUBLIC_STORE_ID is not set${colors.reset}`);
} else {
  console.log(`${colors.green}✓ NEXT_PUBLIC_STORE_ID is present: ${storeId}${colors.reset}`);
}

console.log(`\n${colors.blue}=== Environment Loading Information ===${colors.reset}`);
console.log(`${colors.cyan}NODE_ENV:${colors.reset} ${process.env.NODE_ENV || 'not set'}`);

console.log(`\n${colors.green}If both checks passed, your environment is properly configured.${colors.reset}`);
console.log(`${colors.yellow}Try restarting your Next.js development server: npm run dev${colors.reset}`);