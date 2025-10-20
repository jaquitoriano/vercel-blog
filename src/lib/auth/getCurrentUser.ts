import { cookies } from 'next/headers';
import { getUserByEmail } from '@/lib/auth/user';

export type UserStatus = {
  isLoggedIn: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  } | null;
};

export async function getCurrentUser(): Promise<UserStatus> {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('admin-auth');
  
  if (!authCookie?.value) {
    return {
      isLoggedIn: false,
      user: null
    };
  }

  try {
    const email = authCookie.value;
    const user = await getUserByEmail(email);
    
    if (!user) {
      return {
        isLoggedIn: false,
        user: null
      };
    }

    // Remove sensitive data
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      isLoggedIn: true,
      user: userWithoutPassword as any
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    return {
      isLoggedIn: false,
      user: null
    };
  }
}