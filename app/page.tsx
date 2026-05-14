'use client';

import { useActionState, useEffect, useState } from 'react';
import { loginAction, LoginState } from '@/app/actions/auth';

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [activeTab, setActiveTab] = useState<'superadmin' | 'cabang'>('superadmin');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired') === '1') {
      setSessionExpired(true);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-background text-on-surface overflow-hidden">
      {/* ── Left Panel (branding) ── */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-14 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 40%, #3949ab 80%, #5c6bc0 100%)' }}>
        {/* Decorative circles */}
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7986cb 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shadow-lg border border-white/20">
              <span className="material-symbols-outlined text-[32px] text-white">garage</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Lautan Teduh</h1>
              <p className="text-white/60 text-sm">Sistem Manajemen Antrian</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Kelola Antrian<br />dengan Mudah &<br />Efisien
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-sm">
              Platform manajemen antrian multi-cabang yang dirancang khusus untuk bengkel motor Lautan Teduh.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              { icon: 'storefront', text: 'Multi-Cabang Real-time' },
              { icon: 'admin_panel_settings', text: 'Kontrol Akses Berbasis Peran' },
              { icon: 'monitoring', text: 'Monitor Terpusat Kantor Pusat' },
              { icon: 'record_voice_over', text: 'Panggil Antrian Otomatis' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <span className="text-white/80 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">© 2024 Lautan Teduh. Semua hak dilindungi.</p>
        </div>
      </div>

      {/* ── Right Panel (login form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">garage</span>
            </div>
            <span className="font-bold text-xl text-primary">Lautan Teduh</span>
          </div>

          <h2 className="text-3xl font-bold text-on-surface mb-1 tracking-tight">Selamat Datang</h2>
          <p className="text-on-surface-variant text-sm mb-8">Masuk ke sistem manajemen antrian</p>

          {/* Session expired banner */}
          {sessionExpired && (
            <div className="mb-5 flex items-start gap-3 bg-[#fefce8] border border-[#ca8a04]/30 text-[#854d0e] px-4 py-3 rounded-xl text-sm animate-fade-in">
              <span className="material-symbols-outlined text-[20px] text-[#ca8a04] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <p className="font-bold">Sesi Berakhir</p>
                <p className="opacity-80 text-xs mt-0.5">Token tidak valid. Silakan masuk kembali.</p>
              </div>
            </div>
          )}

          {/* Role tabs */}
          <div className="mb-6 bg-surface-container rounded-xl p-1 flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('superadmin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'superadmin'
                  ? 'bg-surface-container-lowest shadow-sm text-primary border border-outline-variant'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'superadmin' ? "'FILL' 1" : "'FILL' 0" }}>
                admin_panel_settings
              </span>
              Kantor Pusat
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cabang')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'cabang'
                  ? 'bg-surface-container-lowest shadow-sm text-secondary border border-outline-variant'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: activeTab === 'cabang' ? "'FILL' 1" : "'FILL' 0" }}>
                storefront
              </span>
              Admin Cabang
            </button>
          </div>

          {/* Role hint banner */}
          <div className={`mb-5 flex items-start gap-3 px-4 py-3 rounded-xl text-sm border transition-all ${
            activeTab === 'superadmin'
              ? 'bg-primary-fixed border-primary/20 text-primary'
              : 'bg-secondary-fixed border-secondary/20 text-secondary'
          }`}>
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>
              {activeTab === 'superadmin' ? 'admin_panel_settings' : 'store'}
            </span>
            <div>
              <p className="font-bold text-[13px]">
                {activeTab === 'superadmin' ? 'Super Admin — Kantor Pusat' : 'Admin Cabang'}
              </p>
              <p className="opacity-80 text-[11px] mt-0.5 leading-relaxed">
                {activeTab === 'superadmin'
                  ? 'Akses penuh: kelola semua cabang, buat akun admin cabang, monitor antrian.'
                  : 'Akses terbatas: kelola antrian di cabang sendiri, update data cabang.'}
              </p>
            </div>
          </div>

          {/* Error */}
          {state.error && (
            <div className="mb-5 flex items-center gap-2 bg-error-container text-error px-4 py-3 rounded-xl text-sm font-medium animate-fade-in">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="login_type" value={activeTab} />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="username">Username</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">person</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={activeTab === 'superadmin' ? 'admin_antrian' : 'admin_kedaton'}
                  autoComplete="username"
                  required
                  disabled={pending}
                  className="w-full pl-11 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface disabled:opacity-60"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="password">Password</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={pending}
                  className="w-full pl-11 pr-12 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-on-surface disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute right-3.5 text-outline hover:text-on-surface-variant transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={pending}
              className={`mt-2 w-full text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed ${
                activeTab === 'superadmin'
                  ? 'bg-primary hover:opacity-90'
                  : 'bg-secondary hover:opacity-90'
              }`}
            >
              {pending ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                </>
              )}
            </button>
          </form>

          {/* Footer info */}
          <div className="mt-8 pt-6 border-t border-outline-variant">
            <p className="text-center text-xs text-on-surface-variant">
              Sistem Antrian Lautan Teduh · v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}