import { prisma } from '@/lib/db/prisma';
import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/auth';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Check if user has admin role
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // Don't include password for security
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(`Error fetching user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Check if user has admin role
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const { name, email, password, role } = await request.json();
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });
    
    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if trying to update email to an existing one
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: { 
          email,
          NOT: { id: params.id } 
        },
      });
      
      if (emailExists) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 409 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {
      name,
      email,
      role,
    };
    
    // Only update password if provided
    if (password) {
      updateData.password = await bcryptjs.hash(password, 10);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true,
        // Don't include password
      },
    });
    
    // If the user updated their own account and the email changed, update cookie
    const cookieStore = cookies();
    const authCookie = cookieStore.get('admin-auth');
    if (authCookie?.value === existingUser.email && email !== existingUser.email) {
      cookies().set({
        name: 'admin-auth',
        value: email,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: 'lax',
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(`Error updating user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const session = await auth();
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    // Check if user has admin role
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if trying to delete the last admin
    const isAdmin = await prisma.user.findFirst({
      where: {
        id: params.id,
        role: 'ADMIN',
      },
    });
    
    if (isAdmin) {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' },
      });
      
      if (adminCount <= 1) {
        return NextResponse.json(
          { success: false, message: 'Cannot delete the last admin account' },
          { status: 403 }
        );
      }
    }
    
    // Check if user is trying to delete their own account
    const cookieStore = cookies();
    const authCookie = cookieStore.get('admin-auth');
    
    if (authCookie?.value === user.email) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete your own account while logged in' },
        { status: 403 }
      );
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error(`Error deleting user ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    );
  }
}