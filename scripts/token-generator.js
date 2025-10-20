#!/usr/bin/env node
/**
 * Script to verify the Vercel Blob token and check if it's working properly
 * Run with: node scripts/token-generator.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create interface for reading input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for better readability
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m'
};

console.log(`${colors.bold}${colors.blue}===== Vercel Blob Token Generator =====\n${colors.reset}`);

// Check if Vercel CLI is installed
try {
  const vercelVersionProcess = spawn('vercel', ['--version'], { shell: true });
  
  vercelVersionProcess.on('error', (error) => {
    console.error(`${colors.red}Error: Vercel CLI not found. Please install it with: npm i -g vercel${colors.reset}`);
    process.exit(1);
  });
  
  // Start the token generation process
  vercelVersionProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`${colors.green}✓ Vercel CLI detected${colors.reset}`);
      askForStoreId();
    } else {
      console.error(`${colors.red}Error: Vercel CLI not found or not working properly.${colors.reset}`);
      console.log(`${colors.yellow}Please install it with: npm i -g vercel${colors.reset}`);
      process.exit(1);
    }
  });
} catch (error) {
  console.error(`${colors.red}Error checking Vercel CLI: ${error.message}${colors.reset}`);
  process.exit(1);
}

// Ask for the Store ID
function askForStoreId() {
  rl.question(`${colors.cyan}Enter your Vercel Blob Store ID (or leave empty to list available stores): ${colors.reset}`, (storeId) => {
    if (storeId && storeId.trim()) {
      generateToken(storeId.trim());
    } else {
      listStores();
    }
  });
}

// List available Blob stores
function listStores() {
  console.log(`${colors.blue}\nFetching available Blob stores...${colors.reset}`);
  
  const listProcess = spawn('vercel', ['blob', 'store', 'ls'], { shell: true });
  
  let output = '';
  
  listProcess.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  listProcess.stderr.on('data', (data) => {
    console.error(`${colors.red}${data.toString()}${colors.reset}`);
  });
  
  listProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`${colors.red}Failed to list Blob stores. Make sure you're logged in with 'vercel login'${colors.reset}`);
      askToLogin();
      return;
    }
    
    console.log(output);
    
    // Ask for store ID again now that they've seen the list
    rl.question(`${colors.cyan}Enter your Vercel Blob Store ID from the list above: ${colors.reset}`, (storeId) => {
      if (storeId && storeId.trim()) {
        generateToken(storeId.trim());
      } else {
        console.log(`${colors.yellow}No store ID provided. Exiting.${colors.reset}`);
        rl.close();
      }
    });
  });
}

// Ask user to login if needed
function askToLogin() {
  rl.question(`${colors.yellow}Would you like to login to Vercel now? (y/n): ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      console.log(`${colors.blue}Starting Vercel login process...${colors.reset}`);
      
      // Use spawn to make it interactive
      const loginProcess = spawn('vercel', ['login'], { 
        shell: true,
        stdio: 'inherit' 
      });
      
      loginProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`${colors.green}Login successful! Let's continue.${colors.reset}`);
          listStores();
        } else {
          console.error(`${colors.red}Login process failed with code ${code}.${colors.reset}`);
          rl.close();
        }
      });
    } else {
      console.log(`${colors.yellow}Please login with 'vercel login' and try again.${colors.reset}`);
      rl.close();
    }
  });
}

// Generate a token for the specified store
function generateToken(storeId) {
  console.log(`${colors.blue}\nGenerating token for store: ${colors.bold}${storeId}${colors.reset}`);
  
  const tokenProcess = spawn('vercel', ['blob', 'store', 'token', 'create', storeId, '--read-write'], { shell: true });
  
  let token = '';
  
  tokenProcess.stdout.on('data', (data) => {
    token += data.toString();
  });
  
  tokenProcess.stderr.on('data', (data) => {
    console.error(`${colors.red}${data.toString()}${colors.reset}`);
  });
  
  tokenProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`${colors.red}Failed to generate token. Make sure the store ID is correct.${colors.reset}`);
      rl.close();
      return;
    }
    
    // Extract token from output
    token = token.trim();
    
    console.log(`${colors.green}✓ Token generated successfully!${colors.reset}`);
    
    // Ask what to do with the token
    askForAction(token, storeId);
  });
}

// Ask what to do with the generated token
function askForAction(token, storeId) {
  console.log(`\n${colors.blue}What would you like to do with this token?${colors.reset}`);
  console.log(`${colors.cyan}1. Update .env.local file automatically${colors.reset}`);
  console.log(`${colors.cyan}2. Just show me the token${colors.reset}`);
  console.log(`${colors.cyan}3. Exit${colors.reset}`);
  
  rl.question(`${colors.yellow}Enter your choice (1-3): ${colors.reset}`, (choice) => {
    switch (choice) {
      case '1':
        updateEnvFile(token, storeId);
        break;
      case '2':
        showToken(token, storeId);
        break;
      default:
        console.log(`${colors.yellow}Exiting. Make sure to save your token!${colors.reset}`);
        rl.close();
        break;
    }
  });
}

// Update the .env.local file with the new token
function updateEnvFile(token, storeId) {
  const envFilePath = path.join(process.cwd(), '.env.local');
  
  try {
    // Check if file exists
    let envContent = '';
    if (fs.existsSync(envFilePath)) {
      envContent = fs.readFileSync(envFilePath, 'utf8');
    }
    
    // Update or add the token
    if (envContent.includes('BLOB_READ_WRITE_TOKEN=')) {
      // Replace existing token
      envContent = envContent.replace(
        /BLOB_READ_WRITE_TOKEN=.*/g,
        `BLOB_READ_WRITE_TOKEN=${token}`
      );
    } else {
      // Add new token
      envContent += `\nBLOB_READ_WRITE_TOKEN=${token}\n`;
    }
    
    // Update or add the store ID if needed
    if (!envContent.includes('NEXT_PUBLIC_STORE_ID=')) {
      envContent += `NEXT_PUBLIC_STORE_ID=${storeId}\n`;
    }
    
    // Write back to file
    fs.writeFileSync(envFilePath, envContent);
    
    console.log(`${colors.green}✓ Updated ${envFilePath} with the new token!${colors.reset}`);
    console.log(`${colors.yellow}Don't forget to restart your development server for changes to take effect.${colors.reset}`);
    
    rl.close();
  } catch (error) {
    console.error(`${colors.red}Error updating .env.local file: ${error.message}${colors.reset}`);
    showToken(token, storeId);
  }
}

// Just display the token for manual copying
function showToken(token, storeId) {
  console.log(`\n${colors.yellow}Copy these lines to your .env.local file:${colors.reset}`);
  console.log(`${colors.green}BLOB_READ_WRITE_TOKEN=${token}${colors.reset}`);
  console.log(`${colors.green}NEXT_PUBLIC_STORE_ID=${storeId}${colors.reset}`);
  
  console.log(`\n${colors.blue}Make sure to restart your development server after updating the environment variables.${colors.reset}`);
  
  rl.close();
}