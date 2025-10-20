#!/usr/bin/env node
/**
 * Script to create an admin user for the blog
 * Run with: node scripts/create-admin-user.js
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

// Import the PrismaClient
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    // Default admin credentials
    const email = 'admin@example.com';
    const password = 'admin123';
    
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log('Admin user already exists. Resetting password...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update the user with new password
      await prisma.user.update({
        where: { email },
        data: { 
          password: hashedPassword
        }
      });
      
      console.log('Admin password has been reset!');
      console.log('Email:', email);
      console.log('Password:', password);
    } else {
      // Create a new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const user = await prisma.user.create({
        data: {
          name: 'Admin User',
          email,
          password: hashedPassword,
          role: 'ADMIN'
        }
      });
      
      console.log('Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
    }
  } catch (error) {
    console.error('Error creating/updating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createAdminUser();