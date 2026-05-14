import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://rakaascode.site/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'PUT');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, params, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
) {
  const { path } = await params;
  const apiPath = path.join('/');

  // Teruskan query string jika ada
  const searchParams = new URLSearchParams(request.nextUrl.searchParams.toString());

  // Baca body untuk semua method kecuali GET
  let body: string | undefined;
  let parsedBody: Record<string, unknown> | null = null;
  if (method !== 'GET') {
    try {
      const text = await request.text();
      if (text) {
        body = text;
        try { parsedBody = JSON.parse(text); } catch { /* not JSON */ }
      }
    } catch { /* empty body */ }
  }

  // ── Khusus call-next: jika ada cabang_id di body, pindahkan ke query param ──
  if (apiPath === 'antrian/call-next' && parsedBody?.cabang_id) {
    searchParams.set('cabang_id', String(parsedBody.cabang_id));
    body = undefined;
  }

  const queryStr = searchParams.toString();
  const url = `${API_BASE}/${apiPath}${queryStr ? `?${queryStr}` : ''}`;

  // Ambil token dari cookie (server selalu bisa baca semua cookie)
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    console.warn(`[proxy] WARN: auth_token cookie tidak ditemukan untuk ${method} /${apiPath}`);
    // Kembalikan 401 agar frontend redirect ke login
    return NextResponse.json(
      { success: false, message: 'Sesi tidak ditemukan. Silakan login ulang. [401]' },
      { status: 401 }
    );
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  try {
    const res = await fetch(url, { method, headers, body });
    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = { message: `Server error ${res.status}` };
    }

    if (!res.ok) {
      console.error(`[proxy] ${method} ${url} → ${res.status}`, data);
      const d = data as Record<string, unknown>;
      if (!d.message && d.error) {
        d.message = d.error;
      } else if (!d.message) {
        d.message = `Permintaan gagal (${res.status})`;
      }
      // Sertakan status code di message untuk deteksi error di frontend
      if (typeof d.message === 'string' && !d.message.includes(String(res.status))) {
        d.message = `${d.message} [${res.status}]`;
      }

      // ── Jika 401: token expired/invalid — hapus cookies agar frontend redirect ke login ──
      if (res.status === 401) {
        const response = NextResponse.json(d, { status: 401 });
        // Hapus auth cookies yang expired
        response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
        response.cookies.set('user_data', '', { maxAge: 0, path: '/' });
        return response;
      }
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error(`[proxy] Gagal menghubungi backend:`, err);
    return NextResponse.json(
      { success: false, message: 'Gagal menghubungi server' },
      { status: 502 }
    );
  }
}
