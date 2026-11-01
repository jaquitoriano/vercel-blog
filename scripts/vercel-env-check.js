#!/usr/bin/env node

// Load environment variables from .env.production if running locally
if (!process.env.VERCEL) {
  try {
    console.log('Loading environment variables from .env.production');
    require('dotenv').config({ path: '.env.production' });
  } catch (error) {
    console.error('Error loading .env.production:', error);
  }
}

console.log('🔍 Running pre-build environment check...');
console.log('Build platform:', process.env.VERCEL ? 'Vercel' : 'Local/Other');

// Define required environment variables with more flexible validation
const requiredVars = {
  // Database connection - runtime and migration URLs are both required
  database: {
    required: ['DATABASE_URL', 'DIRECT_URL'],
    minRequired: 2,
    message: 'DATABASE_URL and DIRECT_URL must be provided'
  },
  // Blob storage - make it optional for now
  blob: {
    required: ['BLOB_READ_WRITE_TOKEN', 'NEXT_PUBLIC_STORE_ID'],
    minRequired: 0, // Make it optional (set to 0)
    message: 'Blob storage configuration is incomplete but optional for deployment'
  }
};

// Check which variables are present
const status = {};
let hasErrors = false;

// Check each group
Object.entries(requiredVars).forEach(([groupName, group]) => {
  const presentVars = group.required.filter(varName => !!process.env[varName]);
  const missingVars = group.required.filter(varName => !process.env[varName]);
  
  status[groupName] = {
    required: group.required.length,
    present: presentVars.length,
    missing: missingVars,
    hasMinimum: presentVars.length >= group.minRequired,
  };
  
  if (!status[groupName].hasMinimum) {
    hasErrors = true;
  }
});

// Report results
console.log('\n=== Environment Check Results ===\n');

Object.entries(status).forEach(([groupName, group]) => {
  if (group.hasMinimum) {
    console.log(`✅ ${groupName}: ${group.present}/${group.required} variables set (minimum ${requiredVars[groupName].minRequired} required)`);
    if (group.missing.length > 0) {
      console.log(`   Optional missing: ${group.missing.join(', ')}`);
    }
  } else {
    console.error(`❌ ${groupName}: ${group.present}/${group.required} variables set (minimum ${requiredVars[groupName].minRequired} required)`);
    console.error(`   Missing: ${group.missing.join(', ')}`);
    console.error(`   Error: ${requiredVars[groupName].message}`);
  }
});

// Print diagnostic info for database connections
if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  console.log('\nDatabase diagnostics:');
  console.log(`- Host: ${url.hostname}`);
  console.log(`- Protocol: ${url.protocol}`);
  console.log(`- Has password: ${!!url.password}`);
  console.log(`- Has username: ${!!url.username}`);
  console.log(`- Has pathname: ${!!url.pathname && url.pathname !== '/'}`);
  console.log(`- Has search params: ${!!url.search && url.search !== '?'}`);
}

// Print Next.js site URL info
console.log('\nSite URL configuration:');
console.log(`- NEXT_PUBLIC_SITE_URL: ${process.env.NEXT_PUBLIC_SITE_URL || 'Not set (using default)'}`);

// Print Node environment
console.log('\nNode environment:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`- NODE_VERSION: ${process.version}`);

if (hasErrors) {
  console.error('\n❌ Pre-build check failed! Please fix the errors above.');
  process.exit(1); // Failure - will stop the build
} else {
  console.log('\n✅ All required environment variables are set! Build can proceed.');
  process.exit(0); // Success
}