#!/usr/bin/env node

/**
 * This script loads environment variables from .env.production for local builds
 * and creates a .env file for Vercel to use during deployment.
 */
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Determine if we're running on Vercel
const isVercel = !!process.env.VERCEL;

console.log(`Running in ${isVercel ? 'Vercel' : 'local'} environment`);

// Helper function to check if a file exists
function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}

// Load environment variables
function loadEnvironmentVariables() {
  const envPaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '.env.local'),
    path.resolve(process.cwd(), '.env.production')
  ];

  // Try loading from different env files
  for (const envPath of envPaths) {
    if (fileExists(envPath)) {
      console.log(`Loading environment variables from ${envPath}`);
      const envConfig = dotenv.parse(fs.readFileSync(envPath));

      // Set environment variables that don't exist
      Object.entries(envConfig).forEach(([key, value]) => {
        if (!process.env[key]) {
          process.env[key] = value;
          console.log(`- Set ${key}`);
        }
      });
      
      return envConfig;
    }
  }
  
  console.warn('No environment files found!');
  return {};
}

// Main function
function main() {
  // Load environment variables
  const envVars = loadEnvironmentVariables();
  
  // Create a .env file for Vercel if it doesn't exist
  if (isVercel) {
    const envFile = path.resolve(process.cwd(), '.env');
    if (!fileExists(envFile)) {
      console.log('Creating .env file for Vercel...');
      
      // Convert environment variables to string format
      const envContent = Object.entries(envVars)
        .map(([key, value]) => `${key}="${value}"`)
        .join('\n');
      
      // Write to .env file
      fs.writeFileSync(envFile, envContent);
      console.log('Created .env file for Vercel');
    }
  }
  
  // Validate critical environment variables
  const hasRuntimeDatabaseUrl = !!process.env.DATABASE_URL;
  const hasDirectDatabaseUrl = !!process.env.DIRECT_URL;

  if (!hasRuntimeDatabaseUrl || !hasDirectDatabaseUrl) {
    console.warn('⚠️ Database connection variables are incomplete!');
    console.warn('Required: DATABASE_URL and DIRECT_URL');
  } else {
    console.log('✅ Database connection variables loaded');
  }

  // Output all loaded environment variables
  console.log('\nLoaded environment variables:');
  console.log('- Runtime database URL:', hasRuntimeDatabaseUrl ? '✅ Set' : '❌ Not set');
  console.log('- Direct database URL:', hasDirectDatabaseUrl ? '✅ Set' : '❌ Not set');
  console.log('- Blob token:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('- Store ID:', process.env.NEXT_PUBLIC_STORE_ID ? '✅ Set' : '❌ Not set');
  console.log('- Site URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set');
  
  // Return success
  process.exit(0);
}

main();