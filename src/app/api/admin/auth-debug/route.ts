import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Get all cookies for debugging
  const allCookies = cookies().getAll();
  const authCookie = cookies().get("admin-auth");
  
  // Try to authenticate
  const authResult = await auth();
  
  return NextResponse.json({
    isAuthenticated: !!authResult,
    user: authResult?.user ? {
      id: authResult.user.id,
      name: authResult.user.name,
      email: authResult.user.email,
      role: authResult.user.role,
    } : null,
    cookies: {
      hasAuthCookie: !!authCookie,
      cookieCount: allCookies.length,
      cookieNames: allCookies.map(c => c.name),
    },
    headers: {
      host: request.headers.get('host'),
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
    },
    environment: process.env.NODE_ENV || 'unknown',
  });
}