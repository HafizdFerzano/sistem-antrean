'use server';

import { redirect } from 'next/navigation';
import { setSessionToken, setSessionUser, deleteSession } from '@/lib/session';

const API_BASE = 'https://rakaascode.site/api';

export interface LoginState {
  error?: string;
  success?: boolean;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      cache: 'no-store',
    });
  } catch {
    return { error: 'Tidak dapat terhubung ke server. Coba lagi.' };
  }

  let body: { success: boolean; message?: string; data?: { token: string; user: { id: number; name: string; username?: string; role: string; cabang_id?: number | null } } };
  try {
    body = await res.json();
  } catch {
    return { error: 'Respons server tidak valid.' };
  }

  if (!res.ok || !body.success || !body.data) {
    return { error: body.message || 'Login gagal. Periksa username dan password.' };
  }

  const userData = body.data.user;

  // ── Override role: akun 'admin_antrian' adalah Super Admin pertama ──
  // Terlepas dari cabang_id yang dikembalikan backend, akun ini selalu Super Admin.
  // Ini mengatasi kondisi data backend di mana akun pertama terikat cabang secara tidak sengaja.
  const SUPER_ADMIN_USERNAMES = ['admin_antrian'];
  const finalCabangId = SUPER_ADMIN_USERNAMES.includes(userData.username ?? '')
    ? null
    : (userData.cabang_id ?? null);

  await setSessionToken(body.data.token);
  await setSessionUser({
    id: userData.id,
    name: userData.name,
    username: userData.username,
    role: userData.role as 'admin' | 'user',
    cabang_id: finalCabangId,
    created_at: '',
    updated_at: '',
  });

  redirect('/dashboard');

}

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}
