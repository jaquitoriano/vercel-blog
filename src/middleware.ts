import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");
  const isAdminApiPath = request.nextUrl.pathname.startsWith("/api/admin");
  const isLoginPath = request.nextUrl.pathname === "/admin/login";
  const isLogoutPath = request.nextUrl.pathname === "/admin/logout";
  
  // Get the auth cookie which contains the user's email
  const authCookie = request.cookies.get("admin-auth");
  const isLoggedIn = !!authCookie;
  
  // Debug logging for auth state
  console.log('Middleware auth check:', {
    path: request.nextUrl.pathname,
    isAdminPath,
    isLoginPath,
    hasAuthCookie: !!authCookie,
    authCookieValue: authCookie ? `${authCookie.value.substring(0, 3)}...` : 'none',
    cookieName: authCookie?.name,
    isLoggedIn,
    allCookies: request.cookies.getAll().map(c => c.name),
    host: request.headers.get('host'),
    origin: request.headers.get('origin'),
    referer: request.headers.get('referer')
  });
  
  // Add security headers for admin paths
  const response = NextResponse.next();
  
  // Add X-Robots-Tag header for admin pages and API routes to prevent indexing
  if (isAdminPath || isAdminApiPath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};