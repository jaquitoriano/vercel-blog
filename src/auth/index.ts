import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";
import { getUserById } from "@/lib/auth/user";

export async function auth() {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  const userId = await verifySessionToken(token);

  if (!userId) {
    return null;
  }

  try {
    const user = await getUserById(userId);

    if (!user) {
      return null;
    }

    // Don't expose the password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: {
        ...userWithoutPassword,
        // Some seed scripts store "admin" while role checks expect "ADMIN"
        role: user.role.toUpperCase() === "ADMIN" ? "ADMIN" : user.role,
      },
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}
