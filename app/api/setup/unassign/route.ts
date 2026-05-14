import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, setSessionUser, setSessionToken } from '@/lib/session';

const API_BASE = 'https://rakaascode.site/api';

/**
 * POST /api/setup/unassign
 * Melepas admin dari cabangnya (set cabang_id = null) agar menjadi Super Admin.
 * Hanya bisa dilakukan oleh admin yang sedang login.
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ success: false, message: 'Belum login' }, { status: 401 });
  }

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: 'Token tidak ditemukan' }, { status: 401 });
  }

  // Panggil DELETE /super/admins/:id/assign di backend
  const res = await fetch(`${API_BASE}/super/admins/${user.id}/assign`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    let msg = `Gagal (${res.status})`;
    try {
      const d = await res.json();
      msg = d.message || msg;
    } catch { /* ignore */ }
    return NextResponse.json({ success: false, message: msg }, { status: res.status });
  }

  // Update cookie user_data: set cabang_id = null
  const updatedUser = { ...user, cabang_id: null };
  const response = NextResponse.json({ success: true, message: 'Berhasil dilepas dari cabang. Silakan refresh halaman.' });
  response.cookies.set('user_data', JSON.stringify(updatedUser), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
