import { NextRequest, NextResponse } from 'next/server';
import { settingsRepository } from '@/lib/repositories/settings.repository';

// GET /api/settings - Get all public settings
export async function GET(req: NextRequest) {
  try {
    const settings = await settingsRepository.getAll();
    return NextResponse.json({ settings });
  } catch (error: any) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}