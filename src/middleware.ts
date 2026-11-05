import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth/session";

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApiPath = request.nextUrl.pathname.startsWith("/api/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";
  const isLogoutPath = request.nextUrl.pathname === "/admin/logout";
  const isPostPath = request.nextUrl.pathname.startsWith("/posts/");
  
  // The auth cookie holds a signed session token, so verify it rather than
  // trusting that the cookie exists
  const authCookie = request.cookies.get(SESSION_COOKIE_NAME);
  const isLoggedIn = !!(await verifySessionToken(authCookie?.value));
  
  // Debug logging for auth state
  console.log('Middleware auth check:', {
    path: request.nextUrl.pathname,
    isAdminPath,
    isLoginPath,
    hasAuthCookie: !!authCookie,
    cookieName: authCookie?.name,
    isLoggedIn,
    allCookies: request.cookies.getAll().map(c => c.name),
    host: request.headers.get('host'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer')
  });
  
  // Add security headers
  const response = NextResponse.next();
  
  // Add X-Robots-Tag header for admin pages and API routes to prevent indexing
  if (isAdminPath || isAdminApiPath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  // Add security headers for post pages
  if (isPostPath) {
    response.headers.set(
      'X-Robots-Tag',
      'index, follow'
    );
  }
  
  // Login page is accessible to everyone, but redirects if already logged in
  if (isLoginPath) {
    if (isLoggedIn) {
      const redirectResponse = NextResponse.redirect(new URL("/admin/dashboard", request.url));
      redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
      return redirectResponse;
    }
    return response;
  }
  
  // Admin API routes get a 401 rather than a redirect to the login page
  if (isAdminApiPath && !isLoggedIn) {
    const unauthorizedResponse = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    unauthorizedResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return unauthorizedResponse;
  }

  // Redirect to login if accessing admin pages without being logged in
  if (isAdminPath && !isLoggedIn && !isLoginPath && !isLogoutPath) {
    const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
    redirectResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    return redirectResponse;
  }
  
  // If logged in, allow access
  return response;
}

export const config = {
  matcher: [
    "/admin/:path*", 
    "/api/admin/:path*",
    "/posts/:path*"
  ],
};