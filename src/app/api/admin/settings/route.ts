import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { settingsRepository } from '@/lib/repositories/settings.repository';

// GET /api/admin/settings - Get all settings
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const settings = await settingsRepository.getAll();
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update settings
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const data = await req.json();
    const settings = await settingsRepository.updateBatch(data);
    
    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings/reset - Reset settings to defaults
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    // Check if user is authenticated as admin
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized - Authentication required' }, { status: 401 });
    }
    
    const userRole = session.user.role?.toUpperCase();
    if (userRole !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden - Admin privileges required' }, { status: 403 });
    }
    
    const { action } = await req.json();
    
    if (action === 'reset') {
      const settings = await settingsRepository.resetToDefaults();
      return NextResponse.json({ 
        success: true, 
        message: 'Settings reset to defaults',
        settings 
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error processing settings action:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process settings action' },
      { status: 500 }
    );
  }
}