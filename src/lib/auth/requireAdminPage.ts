import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Guards an admin server page. The middleware only proves the visitor is
 * logged in, so every admin page that reads data must also check the role.
 *
 * Logged-in non-admins go to /403 rather than /admin/login: the middleware
 * sends logged-in users from /admin/login to /admin/dashboard, which would
 * loop back here.
 */
export async function requireAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/403");
  }

  return session;
}
