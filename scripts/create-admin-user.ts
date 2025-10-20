import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');
const envFilePath = path.join(rootDir, '.env.local');

if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, 'utf8');
  const envVars = envContent.split('\n');
  
  for (const line of envVars) {
    if (line.trim() && !line.startsWith('#')) {
      const [key, ...valueParts] = line.split('=');
      const value = valueParts.join('=').replace(/^["']|["']$/g, '');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  }
  
  console.log('Loaded environment variables from .env.local');
} else {
  console.warn('No .env.local file found');
}

// Initialize Prisma client
const prisma = new PrismaClient();

async function createAdminUser() {
  console.log('Creating admin user...');
  
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating password...');
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await prisma.user.update({
        where: { email: 'admin@example.com' },
        data: {
          password: hashedPassword,
        },
      });
      console.log('✅ Admin password updated successfully!');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin', // Note: lowercase 'admin'
        },
      });
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('Login credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute function
createAdminUser();