/**
 * This is a temporary authentication module for the Vercel Blog
 * It uses a very simplified approach without real session management
 */

import { prisma } from "@/lib/db/prisma";
// Use bcryptjs instead of bcrypt to avoid native module issues
import * as bcryptjs from "bcryptjs";

// Mock session data for development
const MOCK_USER = {
  id: "1",
  name: "Admin",
  email: "admin@example.com",
  role: "ADMIN"
};

// A simple auth function that always returns our mock user
export async function auth() {
  return {
    user: MOCK_USER
  };
}

// A simple signIn function
export async function signInUser(email: string, password: string) {
  // For this simplified version, we'll just check against hardcoded values
  // In a real app, you'd verify against the database
  if (email === MOCK_USER.email && password === 'password') {
    return MOCK_USER;
  }
  
  // Try database check if hardcoded check fails
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

// A simple signOut function
export function signOut() {
  return true;
}