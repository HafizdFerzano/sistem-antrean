'use server';

import { cookies } from 'next/headers';
import { User } from '@/types';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';
const COOKIE_OPTIONS = {
  httpOnly: false, // Harus false agar axios di browser bisa baca via document.cookie
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function setSessionToken(token: string) {
  const store = await cookies();
  store.set(TOKEN_KEY, token, COOKIE_OPTIONS);
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_KEY)?.value;
}

export async function deleteSession() {
  const store = await cookies();
  store.delete(TOKEN_KEY);
  store.delete(USER_KEY);
}

export async function setSessionUser(user: User) {
  const store = await cookies();
  store.set(USER_KEY, JSON.stringify(user), {
    httpOnly: false,   // HARUS false agar bisa dibaca via document.cookie di browser
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const raw = store.get(USER_KEY)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}
