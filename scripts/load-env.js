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
  const requiredDatabaseVars = ['POSTGRES_URL', 'POSTGRES_PRISMA_URL', 'DATABASE_URL'];
  const hasDatabaseVar = requiredDatabaseVars.some(varName => !!process.env[varName]);
  
  if (!hasDatabaseVar) {
    console.warn('⚠️ No database connection variables found!');
    console.warn('Required one of:', requiredDatabaseVars.join(', '));
  } else {
    console.log('✅ Database connection variables loaded');
  }
  
  // Output all loaded environment variables
  console.log('\nLoaded environment variables:');
  console.log('- Database URL:', process.env.POSTGRES_URL ? '✅ Set' : '❌ Not set');
  console.log('- Prisma URL:', process.env.POSTGRES_PRISMA_URL ? '✅ Set' : '❌ Not set');
  console.log('- Fallback URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
  console.log('- Blob token:', process.env.BLOB_READ_WRITE_TOKEN ? '✅ Set' : '❌ Not set');
  console.log('- Store ID:', process.env.NEXT_PUBLIC_STORE_ID ? '✅ Set' : '❌ Not set');
  console.log('- Site URL:', process.env.NEXT_PUBLIC_SITE_URL || 'Not set');
  
  // Return success
  process.exit(0);
}

main();