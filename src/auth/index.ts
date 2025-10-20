import { cookies } from "next/headers";
import { getUserByEmail } from "@/lib/auth/user";

export async function auth() {
  const cookieStore = cookies();
  const authCookie = cookieStore.get("admin-auth");
  
  if (!authCookie || !authCookie.value) {
    return null;
  }

  try {
    // The cookie value should be the user's email
    const email = authCookie.value;
    const user = await getUserByEmail(email);
    
    if (!user) {
      return null;
    }

    // Don't expose the password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}