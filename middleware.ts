import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Root `/` is the login page
const PUBLIC_PATHS = ['/', '/_next'];

// Routes yang hanya bisa diakses Super Admin (role=admin, cabang_id=null)
const SUPER_ADMIN_ONLY = ['/dashboard/users'];



export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths without auth
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith('/_next'))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;

  // Tidak ada token → redirect ke login
  if (!token) {
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Baca user data dari cookie (tersedia di server karena middleware berjalan server-side)
  const userDataRaw = request.cookies.get('user_data')?.value;
  let userData: { role?: string; cabang_id?: number | null } | null = null;
  if (userDataRaw) {
    try {
      userData = JSON.parse(decodeURIComponent(userDataRaw));
    } catch {
      // Cookie rusak → biarkan client-side guard yang handle
    }
  }

  const isSuperAdmin = userData?.role === 'admin' && !userData?.cabang_id;
  const isAdminCabang = userData?.role === 'admin' && !!userData?.cabang_id;

  // Cek RBAC: route khusus Super Admin
  if (SUPER_ADMIN_ONLY.some((p) => pathname === p || pathname.startsWith(p))) {
    if (userData && !isSuperAdmin) {
      // Admin Cabang mencoba akses halaman Manajemen User → redirect ke dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }



  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
