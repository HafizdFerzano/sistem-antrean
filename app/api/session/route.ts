import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/session';

/**
 * GET /api/session
 * Mengembalikan data user yang sedang login dari cookie server-side.
 * Ini bekerja meskipun cookie user_data bersifat httpOnly.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user });
}
