import { NextRequest } from 'next/server';
import { auth } from '@/auth';
import { updateManifestIcons } from '@/lib/utils/manifest-updater';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (session?.user.role !== 'ADMIN') {
      return new Response(JSON.stringify({ error: 'Forbidden - Admin privileges required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { favicon } = await request.json();

    if (!favicon) {
      return new Response(JSON.stringify({ error: 'Favicon is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await updateManifestIcons(favicon);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Failed to update manifest:', error);
    return new Response(JSON.stringify({ error: 'Failed to update manifest' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}