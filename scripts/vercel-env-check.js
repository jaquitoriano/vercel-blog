#!/usr/bin/env node

console.log('🔍 Running pre-build environment check...');

// Define required environment variables
const requiredVars = [
  'POSTGRES_URL',
  'POSTGRES_PRISMA_URL',
  'POSTGRES_URL_NON_POOLING',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
  'BLOB_READ_WRITE_TOKEN',
  'NEXT_PUBLIC_STORE_ID',
];

// Check for missing variables
const missing = requiredVars.filter(varName => !process.env[varName]);

// Report results
if (missing.length === 0) {
  console.log('✅ All required environment variables are set!');
  console.log('Database URL starts with:', process.env.POSTGRES_URL?.substring(0, 15) + '...');
  console.log('BLOB token prefix:', process.env.BLOB_READ_WRITE_TOKEN?.substring(0, 10) + '...');
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set (optional)');
  process.exit(0); // Success
} else {
  console.error('❌ Missing required environment variables:');
  missing.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease set these variables in your Vercel project settings.');
  process.exit(1); // Failure - will stop the build
}