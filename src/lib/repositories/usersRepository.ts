import { prisma } from '../db/prisma';
import { executeQuery } from '../db/utils';
import bcrypt from 'bcrypt';

export async function getUserByEmail(email: string) {
  return executeQuery(async () => {
    return await prisma.user.findUnique({
      where: { email },
    });
  });
}

export async function getUserById(id: string) {
  return executeQuery(async () => {
    return await prisma.user.findUnique({
      where: { id },
    });
  });
}

export async function createUser(data: any) {
  return executeQuery(async () => {
    const { password, ...userData } = data;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    return await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  });
}

export async function updateUser(id: string, data: any) {
  return executeQuery(async () => {
    const { password, ...userData } = data;
    
    // If password is being updated, hash it
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData.password = hashedPassword;
    }
    
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  });
}

export async function deleteUser(id: string) {
  return executeQuery(async () => {
    return await prisma.user.delete({
      where: { id },
    });
  });
}

export async function validateUserCredentials(email: string, password: string) {
  return executeQuery(async () => {
    console.log('Validating credentials for email:', email);
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      console.log('User not found');
      return null;
    }
    
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      console.log('Invalid password');
      return null;
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    console.log('User authenticated:', userWithoutPassword);
    return userWithoutPassword;
  });
}