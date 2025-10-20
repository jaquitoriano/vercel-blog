import { validateUserPassword } from "@/lib/auth/user";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await validateUserPassword(email, password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Set cookie with user's email (not including sensitive data)
    // Log the cookie settings for debugging
    console.log('Setting auth cookie with these options:', {
      name: "admin-auth",
      value: user.email,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      domain: request.headers.get('host')?.split(':')[0] || undefined,
      environment: process.env.NODE_ENV || 'unknown'
    });
    
    // In development, use less restrictive settings to ensure cookies work properly
    const isProduction = process.env.NODE_ENV === "production";
    const host = request.headers.get('host') || '';
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    
    // Determine the appropriate sameSite value
    let sameSiteValue: "lax" | "strict" | "none" = "lax";
    if (!isLocalhost && !isProduction) {
      sameSiteValue = "none";
    }
    
    console.log('Setting cookie with options:', {
      name: "admin-auth",
      value: `${user.email.substring(0, 3)}...`,
      httpOnly: true,
      path: "/",
      secure: isProduction,
      maxAge: 60 * 60 * 24,
      sameSite: sameSiteValue,
      host,
      isLocalhost,
      isProduction
    });
    
    // Set the cookie with appropriate settings
    cookies().set({
      name: "admin-auth",
      value: user.email,
      httpOnly: true,
      path: "/",
      secure: isProduction, // Only use secure in production
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: sameSiteValue
    });

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}