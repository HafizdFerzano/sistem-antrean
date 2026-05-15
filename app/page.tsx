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

  const isSuperAdmin = activeTab === 'superadmin';

  return (
    <div className="min-h-screen flex bg-[#f0f4ff] text-on-surface overflow-hidden">

      {/* ══ LEFT PANEL ══════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex w-[48%] relative flex-col overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a1628 0%, #0d2040 35%, #102a52 65%, #1a3a6e 100%)' }}
      >
        {/* Animated background orbs */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(66,133,244,0.18) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: '-8%', left: '-8%',
            width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(92,107,192,0.22) 0%, transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', top: '42%', left: '55%',
            width: 220, height: 220, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(100,181,246,0.10) 0%, transparent 70%)',
          }} />
          {/* Grid pattern overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Top logo */}
        <div className="relative z-10 p-10 pb-0">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 26, fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.2 }}>Lautan Teduh</p>
              <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>Antrian System</p>
            </div>
          </div>
        </div>

        {/* Main content — center */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 py-8">

          {/* Hero text */}
          <div style={{ marginBottom: 40 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(66,133,244,0.2)',
              border: '1px solid rgba(66,133,244,0.35)',
              borderRadius: 100, padding: '5px 14px',
              marginBottom: 20,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#64b5f6', boxShadow: '0 0 8px #64b5f6' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#90caf9', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Platform Manajemen Antrian
              </span>
            </div>

            <h2 style={{ margin: 0, fontSize: 38, fontWeight: 800, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Kelola Antrian<br />
              <span style={{ background: 'linear-gradient(90deg, #64b5f6, #90caf9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Lebih Mudah
              </span>
              {' '}& Efisien
            </h2>

            <p style={{ margin: '16px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 340 }}>
              Platform digital khusus Bengkel Motor Lautan Teduh untuk manajemen antrian multi-cabang secara real-time.
            </p>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: 'storefront', label: 'Multi-Cabang', desc: 'Pantau semua cabang dalam satu dashboard', color: '#64b5f6' },
              { icon: 'admin_panel_settings', label: 'Akses Berbasis Peran', desc: 'Super Admin & Admin Cabang terpisah', color: '#81c784' },
              { icon: 'record_voice_over', label: 'Panggil Antrian Otomatis', desc: 'TTS otomatis saat nomor dipanggil', color: '#ffb74d' },
              { icon: 'monitoring', label: 'Monitor Real-time', desc: 'Status antrian diperbarui secara langsung', color: '#ce93d8' },
            ].map(({ icon, label, desc, color }) => {
              const rgba = color === '#64b5f6' ? '100,181,246' : color === '#81c784' ? '129,199,132' : color === '#ffb74d' ? '255,183,77' : '206,147,216';
              return (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14, padding: '12px 16px',
                  backdropFilter: 'blur(4px)',
                }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                    background: `rgba(${rgba},0.15)`,
                    border: `1px solid rgba(${rgba},0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative z-10 px-10 pb-8">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>© 2026 Lautan Teduh. All rights reserved.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf50', boxShadow: '0 0 6px #4caf50' }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>v1.0 Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL ═════════════════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12" style={{ background: '#f0f4ff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #002c60, #1a3a6e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,44,96,0.3)',
            }}>
              <span className="material-symbols-outlined text-white" style={{ fontSize: 22, fontVariationSettings: "'FILL' 1" }}>two_wheeler</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#002c60', lineHeight: 1.1 }}>Lautan Teduh</p>
              <p style={{ margin: 0, fontSize: 10, color: '#8090a8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Antrian System</p>
            </div>
          </div>

          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#0b1c30', letterSpacing: '-0.4px', lineHeight: 1.2 }}>
              Selamat Datang 👋
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: 14, color: '#6b7280', lineHeight: 1.5 }}>
              Masuk untuk mengelola sistem antrian
            </p>
          </div>

          {/* Session expired banner */}
          {sessionExpired && (
            <div style={{
              marginBottom: 16,
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: '#fefce8', border: '1px solid rgba(202,138,4,0.3)',
              color: '#854d0e', padding: '12px 14px', borderRadius: 12,
              fontSize: 13,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#ca8a04', flexShrink: 0, marginTop: 1, fontVariationSettings: "'FILL' 1" }}>warning</span>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13 }}>Sesi Berakhir</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, opacity: 0.8 }}>Token tidak valid. Silakan masuk kembali.</p>
              </div>
            </div>
          )}

          {/* Role tabs */}
          <div style={{ marginBottom: 16, background: '#e4ecf8', borderRadius: 14, padding: 4, display: 'flex', gap: 4 }}>
            {([
              { id: 'superadmin', icon: 'admin_panel_settings', label: 'Kantor Pusat' },
              { id: 'cabang', icon: 'storefront', label: 'Admin Cabang' },
            ] as const).map(tab => {
              const active = activeTab === tab.id;
              const isSA = tab.id === 'superadmin';
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '10px 12px',
                    borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontSize: 13, fontWeight: 700,
                    transition: 'all 0.2s ease',
                    background: active ? '#ffffff' : 'transparent',
                    color: active ? (isSA ? '#002c60' : '#1b5e20') : '#6b7280',
                    boxShadow: active ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
                    transform: active ? 'scale(1)' : 'scale(0.98)',
                    fontFamily: 'inherit',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Role info banner */}
          <div style={{
            marginBottom: 20,
            display: 'flex', alignItems: 'flex-start', gap: 10,
            padding: '11px 14px', borderRadius: 12, fontSize: 13,
            background: isSuperAdmin ? '#e8eeff' : '#e8f5e9',
            border: `1px solid ${isSuperAdmin ? 'rgba(0,44,96,0.15)' : 'rgba(27,94,32,0.15)'}`,
            color: isSuperAdmin ? '#002c60' : '#1b5e20',
            transition: 'all 0.3s ease',
          }}>
            <span className="material-symbols-outlined" style={{
              fontSize: 17, flexShrink: 0, marginTop: 1,
              fontVariationSettings: "'FILL' 1",
              color: isSuperAdmin ? '#3949ab' : '#2e7d32',
            }}>
              {isSuperAdmin ? 'admin_panel_settings' : 'store'}
            </span>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 12 }}>
                {isSuperAdmin ? 'Super Admin — Kantor Pusat' : 'Admin Cabang'}
              </p>
              <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.75, lineHeight: 1.5 }}>
                {isSuperAdmin
                  ? 'Kelola semua cabang, buat akun admin, dan monitor antrian.'
                  : 'Kelola antrian di cabang sendiri & update data cabang.'}
              </p>
            </div>
          </div>

          {/* Error */}
          {state.error && (
            <div style={{
              marginBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#fde8e8', border: '1px solid rgba(186,26,26,0.2)',
              color: '#ba1a1a', padding: '11px 14px', borderRadius: 12,
              fontSize: 13, fontWeight: 500,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 17, fontVariationSettings: "'FILL' 1" }}>error</span>
              {state.error}
            </div>
          )}

          {/* Form */}
          <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input type="hidden" name="login_type" value={activeTab} />

            {/* Username */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, letterSpacing: '0.02em' }} htmlFor="username">
                USERNAME
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 18, color: '#9ca3af', pointerEvents: 'none',
                }}>person</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder={isSuperAdmin ? 'admin_antrian' : 'admin_kedaton'}
                  autoComplete="username"
                  required
                  disabled={pending}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 42, paddingRight: 14, paddingTop: 12, paddingBottom: 12,
                    background: '#ffffff', border: '1.5px solid #e5e7eb',
                    borderRadius: 12, outline: 'none',
                    fontSize: 14, color: '#0b1c30',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onFocus={e => { e.target.style.border = `1.5px solid ${isSuperAdmin ? '#002c60' : '#2e7d32'}`; e.target.style.boxShadow = `0 0 0 3px ${isSuperAdmin ? 'rgba(0,44,96,0.1)' : 'rgba(46,125,50,0.1)'}`; }}
                  onBlur={e => { e.target.style.border = '1.5px solid #e5e7eb'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 6, letterSpacing: '0.02em' }} htmlFor="password">
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{
                  position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
                  fontSize: 18, color: '#9ca3af', pointerEvents: 'none',
                }}>lock</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={pending}
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    paddingLeft: 42, paddingRight: 46, paddingTop: 12, paddingBottom: 12,
                    background: '#ffffff', border: '1.5px solid #e5e7eb',
                    borderRadius: 12, outline: 'none',
                    fontSize: 14, color: '#0b1c30',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                  onFocus={e => { e.target.style.border = `1.5px solid ${isSuperAdmin ? '#002c60' : '#2e7d32'}`; e.target.style.boxShadow = `0 0 0 3px ${isSuperAdmin ? 'rgba(0,44,96,0.1)' : 'rgba(46,125,50,0.1)'}`; }}
                  onBlur={e => { e.target.style.border = '1.5px solid #e5e7eb'; e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', padding: 2, display: 'flex', alignItems: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={pending}
              style={{
                marginTop: 6,
                width: '100%', padding: '13px 20px',
                borderRadius: 12, border: 'none', cursor: pending ? 'not-allowed' : 'pointer',
                background: isSuperAdmin
                  ? 'linear-gradient(135deg, #002c60, #1a3a6e)'
                  : 'linear-gradient(135deg, #1b5e20, #2e7d32)',
                color: '#ffffff',
                fontSize: 14, fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: isSuperAdmin
                  ? '0 4px 16px rgba(0,44,96,0.35)'
                  : '0 4px 16px rgba(27,94,32,0.35)',
                opacity: pending ? 0.65 : 1,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { if (!pending) (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
            >
              {pending ? (
                <>
                  <span style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Sistem</span>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>
              Sistem Antrian Lautan Teduh &middot; v1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
