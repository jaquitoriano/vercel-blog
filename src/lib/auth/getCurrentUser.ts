import { auth } from '@/auth';

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
  const session = await auth();

  return {
    isLoggedIn: !!session,
    user: session?.user ?? null
  };
}
