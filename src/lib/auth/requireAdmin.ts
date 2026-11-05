import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * Guards an API route handler. Returns an error response to send back when the
 * request isn't from a logged-in admin, or null when it may continue.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
