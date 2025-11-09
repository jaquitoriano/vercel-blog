import { NextRequest, NextResponse } from 'next/server';
import { getSettingsWithCache } from '@/lib/cache/settings-cache';

// GET /api/settings - Get all public settings with caching
export async function GET(req: NextRequest) {
  try {
    const settings = await getSettingsWithCache();
    
    return NextResponse.json({ settings }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
  } catch (error: any) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}