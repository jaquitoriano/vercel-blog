#!/usr/bin/env node

// Simple script to verify that environment variables are available in .env.local
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

// Check for required variables
const requiredVars = [
  'BLOB_READ_WRITE_TOKEN',
  'NEXT_PUBLIC_STORE_ID'
];

let hasErrors = false;
requiredVars.forEach(varName => {
  if (!envConfig[varName]) {
    console.error(`❌ Missing required variable: ${varName}`);
    hasErrors = true;
  } else {
    const value = envConfig[varName];
    const truncatedValue = value.length > 10 
      ? `${value.substring(0, 5)}...${value.substring(value.length - 5)}`
      : value;
    console.log(`✅ ${varName} is set: ${truncatedValue}`);
  }
});

if (hasErrors) {
  console.error('\n❌ Some required environment variables are missing. Please fix your .env.local file.');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are set in .env.local');
}

// Now check if Next.js can read these variables
console.log('\nSimulating Next.js environment variable loading:');
try {
  // Load variables as Next.js would
  process.env.BLOB_READ_WRITE_TOKEN = envConfig.BLOB_READ_WRITE_TOKEN;
  process.env.NEXT_PUBLIC_STORE_ID = envConfig.NEXT_PUBLIC_STORE_ID;
  
  console.log(`✅ Successfully loaded BLOB_READ_WRITE_TOKEN: ${process.env.BLOB_READ_WRITE_TOKEN ? 'Value set' : 'Not set'}`);
  console.log(`✅ Successfully loaded NEXT_PUBLIC_STORE_ID: ${process.env.NEXT_PUBLIC_STORE_ID || 'Not set'}`);
  
  console.log('\n✅ Environment setup looks good!');
  console.log('If you are still experiencing issues, try:');
  console.log('1. Restart your Next.js development server');
  console.log('2. Check your server logs for more details');
  console.log('3. Visit /admin/diagnostics to run more tests');
} catch (error) {
  console.error('\n❌ Error simulating Next.js environment loading:', error.message);
  process.exit(1);
}