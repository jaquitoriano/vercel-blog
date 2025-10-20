import { prisma } from '@/lib/db/prisma';
import bcryptjs from 'bcryptjs';

export async function createAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { email: 'admin@example.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return existingAdmin;
    }

    // Create admin if doesn't exist
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    
    const newAdmin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created successfully');
    return newAdmin;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await prisma.user.findFirst({
      where: { email }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

export async function validateUserPassword(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);
    
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error validating user password:', error);
    return null;
  }
}