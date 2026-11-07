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

export async function getUserById(id: string) {
  try {
    return await prisma.user.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// A real cost-10 hash of a random value nobody knows. Comparing against it when
// the email is unknown makes that path as slow as a wrong password, so response
// time doesn't reveal which emails have accounts.
const DUMMY_PASSWORD_HASH = '$2b$10$FB7NNSM/LE5MFVEsGcRRu.ycfT94EjS7bzJ1coujc6TibU.HetRwu';

export async function validateUserPassword(email: string, password: string) {
  try {
    const user = await getUserByEmail(email);

    const isPasswordValid = await bcryptjs.compare(password, user?.password ?? DUMMY_PASSWORD_HASH);

    if (!user || !isPasswordValid) {
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