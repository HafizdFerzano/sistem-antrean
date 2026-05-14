// ==================== AUTH ====================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    user: User;
  };
}

// ==================== USER ====================
export interface User {
  id: number;
  name: string;
  email?: string;
  username?: string;
  google_id?: string;
  role: 'user' | 'admin';
  cabang_id?: number | null;
  created_at: string;
  updated_at: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  cabang_id?: number | null;
}

// ==================== CABANG ====================
export interface Cabang {
  id: number;
  nama: string;
  alamat: string;
  kota: string;
  no_telp: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

// ==================== ANTRIAN ====================
export type AntrianStatus = 'menunggu' | 'dipanggil' | 'selesai';

export interface Antrian {
  id: number;
  cabang_id: number;
  user_id?: number | null;
  nomor_antrian: number;
  status: AntrianStatus;
  nama_pemilik: string;
  no_hp: string;
  merk_motor: string;
  tipe_motor: string;
  no_rangka: string;
  no_mesin: string;
  tahun_pembuatan: number;
  tanggal_kedatangan: string;
  estimasi_jam: string;
  reminder_aktif: boolean;
  no_wa_reminder?: string | null;
  catatan?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AntrianStatusInfo {
  nomor_dipanggil: number | null;
  status_panggil: string;
  total_menunggu: number;
}

export interface CreateAntrianPayload {
  cabang_id: number;
  nama_pemilik: string;
  no_hp: string;
  merk_motor: string;
  tipe_motor: string;
  no_rangka: string;
  no_mesin: string;
  tahun_pembuatan: number;
  tanggal_kedatangan: string;
  estimasi_jam: string;
  catatan?: string;
  reminder_aktif?: boolean;
  no_wa_reminder?: string;
}

// ==================== BROADCAST ====================
export interface Broadcast {
  id: number;
  admin_id: number;
  judul: string;
  deskripsi: string;
  detail: string;
  gambar_url?: string | null;
  tipe: 'promo' | 'antrian';
  cabang_id?: number | null;
  created_at: string;
}

// ==================== USER PROFILE (GET /user/profile) ====================
export interface AntrianRiwayat {
  id: number;
  nomor_antrian: number;
  status: AntrianStatus;
  tanggal_kedatangan: string;
  estimasi_jam: string;
  merk_motor: string;
  tipe_motor: string;
  created_at: string;
  cabang: {
    id: number;
    nama: string;
    alamat: string;
    kota: string;
    no_telp: string;
  };
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  created_at: string;
  antrian: AntrianRiwayat[];
}

// ==================== KONTAK WA (/users/kontak) ====================
export interface UserKontak {
  user_id: number;
  no_wa: string;
}

// ==================== API RESPONSE ====================
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  total_antrian?: number;
}
