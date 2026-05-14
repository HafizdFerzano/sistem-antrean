import axios, { AxiosRequestConfig } from 'axios';
import { getSessionToken } from './session';
import { ApiResponse } from '@/types';

const API_BASE = 'https://rakaascode.site/api';

// ─── Server-side fetch (Server Components / Server Actions) ──────────────────
/**
 * fetchApi — Fungsi fetch utama dengan JWT Bearer Token otomatis.
 * Gunakan ini di semua Server Components / Server Actions.
 */
export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const token = await getSessionToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server tidak merespons dengan benar (${response.status})`);
  }

  if (!response.ok) {
    throw new Error(data.message || `Kesalahan server: ${response.status}`);
  }

  return data;
}

// ─── Axios instance untuk Client Components (melalui proxy route handler) ────
/**
 * proxyApi — Axios instance yang mengirim request ke /api/proxy (server-side proxy).
 * Route handler di /api/proxy/[...path]/route.ts meneruskan request ke backend,
 * membaca cookie auth_token dari server-side (lebih reliable), dan menambahkan
 * Authorization: Bearer header secara otomatis.
 */
export const proxyApi = axios.create({
  baseURL: '/api/proxy',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper: baca satu cookie dari document.cookie
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : null;
}

// Request interceptor: suntikkan token ke setiap request
proxyApi.interceptors.request.use((config) => {
  const token = getCookie('auth_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: lempar error yang informatif, handle 401 auto-redirect
proxyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      'Terjadi kesalahan';

    // Jika 401: sesi expired — hapus cookie & redirect ke halaman login
    if (status === 401 && typeof window !== 'undefined') {
      // Hapus cookie dari browser
      document.cookie = 'auth_token=; path=/; max-age=0';
      document.cookie = 'user_data=; path=/; max-age=0';
      // Redirect ke login dengan pesan
      window.location.href = '/?expired=1';
      return Promise.reject(new Error('Sesi berakhir. Silakan login ulang.'));
    }

    return Promise.reject(new Error(msg));
  }
);

// ─── clientFetch (backward compat, gunakan axios di balik layar) ─────────────
/**
 * clientFetch — Wrapper axios untuk Client Components.
 * Mendukung format fetch lama (body: JSON.stringify) maupun axios baru (data: object).
 */
export async function clientFetch<T>(
  path: string,
  options: AxiosRequestConfig & { body?: string } = {}
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();

  // Backward-compat: fetch lama pakai body: JSON.stringify({...})
  // Axios butuh data sebagai object (bukan string) agar tidak double-encode
  let data = options.data;
  if (!data && options.body) {
    try {
      data = JSON.parse(options.body);
    } catch {
      data = options.body; // fallback: kirim as-is
    }
  }

  const response = await proxyApi.request<T>({
    url: path,
    method,
    data,
    params: options.params,
  });

  return response.data;
}
