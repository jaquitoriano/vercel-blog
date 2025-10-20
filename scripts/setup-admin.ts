// This script initializes a database with an admin user
// It's designed to be run directly without requiring a full database seed
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local and .env
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

console.log('Using database URL:', process.env.POSTGRES_URL || '(not set)');

// If we're using SQLite, ensure the file exists
if (process.env.POSTGRES_URL?.startsWith('file:')) {
  // Extract SQLite file path
  const dbPath = process.env.POSTGRES_URL.replace('file:', '');
  const prismaDir = path.dirname(dbPath);
  
  // Ensure the prisma directory exists
  if (!fs.existsSync(prismaDir)) {
    fs.mkdirSync(prismaDir, { recursive: true });
    console.log(`Created directory: ${prismaDir}`);
  }
  
  // Touch the database file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '');
    console.log(`Created empty SQLite database file: ${dbPath}`);
  }
}

// Initialize Prisma client
const prisma = new PrismaClient();

async function main() {
  console.log('Setting up basic database with admin user...');
  
  try {
    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    
    // Upsert (create if not exists, update if exists)
    await prisma.user.upsert({
      where: { 
        email: 'admin@example.com' 
      },
      update: {
        password: hashedPassword
      },
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    
    console.log('Admin user created successfully!');
    console.log('Login credentials: admin@example.com / Admin@123');
  } catch (error) {
    console.error('Error during setup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Setup completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });