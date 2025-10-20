import { prisma } from '@/lib/db/prisma';
import * as bcryptjs from 'bcryptjs';

interface AdminUser {
  name: string;
  email: string;
  password: string;
}

export async function createAdminUser({ name, email, password }: AdminUser) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create the user with ADMIN role
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Return the user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}