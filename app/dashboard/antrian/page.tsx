'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { clientFetch } from '@/lib/api';
import { Antrian, AntrianStatus, ApiResponse, Cabang } from '@/types';

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Helpers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function StatusBadge({ status }: { status: AntrianStatus }) {
  const cfg = {
    menunggu:  { cls: 'bg-tertiary-fixed text-tertiary',       label: 'Menunggu' },
    dipanggil: { cls: 'bg-[#dbeafe] text-[#1d4ed8]',           label: 'Dipanggil' },
    selesai:   { cls: 'bg-[#dcfce7] text-[#15803d]',           label: 'Selesai' },
  };
  const { cls, label } = cfg[status];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${cls}`}>{label}</span>;
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Detail Modal Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function DetailModal({
  q, onClose, onFinish, loadingId, isSuperAdmin,
}: {
  q: Antrian; onClose: () => void;
  onFinish: (id: number) => void;
  loadingId: number | null;
  isSuperAdmin: boolean;
}) {
  const infoRows: [string, string, string][] = [
    ['person',         'Nama Pemilik', q.nama_pemilik],
    ['call',           'No. HP',       q.no_hp],
    ['two_wheeler',    'Merk / Tipe',  `${q.merk_motor} ${q.tipe_motor}`],
    ['calendar_today', 'Tahun',        String(q.tahun_pembuatan)],
    ['schedule',       'Estimasi Jam', q.estimasi_jam],
    ['tag',            'No. Rangka',   q.no_rangka],
    ['settings',       'No. Mesin',    q.no_mesin],
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16, backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative', width: '100%', maxWidth: 460,
          background: 'var(--color-surface-container-lowest)',
          borderRadius: 16, border: '1px solid var(--color-outline-variant)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          animation: 'scaleIn 0.2s ease-out',
        }}
      >
        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Header Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid var(--color-outline-variant)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--color-primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>#{q.nomor_antrian}</span>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--color-on-surface)', lineHeight: 1.3 }}>Detail Antrian</p>
              <div style={{ marginTop: 4 }}><StatusBadge status={q.status} /></div>
            </div>
          </div>
          <button
            onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-container)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.15s' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-on-surface-variant)' }}>close</span>
          </button>
        </div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Body Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', maxHeight: '55vh' }}>

          {/* Tabel Info */}
          <div style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 12, overflow: 'hidden' }}>
            {infoRows.map(([icon, label, val], i) => (
              <div
                key={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderTop: i === 0 ? 'none' : '1px solid var(--color-outline-variant)',
                  background: 'var(--color-surface-container-lowest)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--color-on-surface-variant)', flexShrink: 0, width: 20, textAlign: 'center' as const }}>{icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-on-surface-variant)', width: 90, flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-on-surface)', flex: 1, textAlign: 'right' as const }}>{val || 'Ã¢â‚¬â€'}</span>
              </div>
            ))}
          </div>

          {/* Catatan */}
          {q.catatan && (
            <div style={{ border: '1px solid var(--color-outline-variant)', borderRadius: 10, padding: '10px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--color-on-surface-variant)' }}>sticky_note_2</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' as const, color: 'var(--color-on-surface-variant)' }}>Catatan</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface)' }}>{q.catatan}</p>
            </div>
          )}

          {/* Reminder */}
          {q.reminder_aktif && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--color-tertiary-fixed)', borderRadius: 10, padding: '10px 14px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-tertiary)', fontVariationSettings: "'FILL' 1" }}>notifications_active</span>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: 'var(--color-tertiary)' }}>Reminder WA: {q.no_wa_reminder ?? q.no_hp}</p>
            </div>
          )}
        </div>

        {/* Ã¢â€â‚¬Ã¢â€â‚¬ Footer Ã¢â€â‚¬Ã¢â€â‚¬ */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '12px 20px', borderTop: '1px solid var(--color-outline-variant)' }}>
          <button
            onClick={onClose}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-container)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: '1px solid var(--color-outline-variant)', background: 'transparent', color: 'var(--color-on-surface-variant)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            Tutup
          </button>

          {q.status === 'dipanggil' && (
            <button
              onClick={() => onFinish(q.id)}
              disabled={loadingId === q.id}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', borderRadius: 10, border: 'none', background: 'var(--color-primary)', color: 'var(--color-on-primary)', fontSize: 13, fontWeight: 500, cursor: loadingId === q.id ? 'not-allowed' : 'pointer', opacity: loadingId === q.id ? 0.6 : 1, transition: 'all 0.15s' }}
            >
              {loadingId === q.id
                ? <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 1s linear infinite' }} />
                : <span className="material-symbols-outlined" style={{ fontSize: 17 }}>task_alt</span>}
              Selesaikan
            </button>
          )}


        </div>
      </div>
    </div>
  );
}

function CabangSelector({ list, onSelect }: { list: Cabang[]; onSelect: (id: number, nama: string) => void }) {
  return (
    <div className="animate-fade-in space-y-lg">
      {/* Page Header */}
      <div>
        <h2 className="font-h1 text-on-surface">Monitor Antrian</h2>
        <p className="font-body-base text-on-surface-variant mt-xs">Pilih cabang untuk memantau status antrian secara real-time</p>
      </div>

      {/* Super Admin Info Banner */}
      <div className="bg-secondary-fixed border border-secondary/20 rounded-2xl px-xl py-lg flex items-center gap-lg">
        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-secondary text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
        </div>
        <div>
          <p className="font-h3 text-on-surface">Mode Monitor Kantor Pusat</p>
          <p className="font-body-sm text-on-surface-variant mt-xs">Sebagai Super Admin, Anda hanya dapat <strong>memantau</strong> antrian. Pengelolaan antrian dilakukan oleh Admin Cabang masing-masing.</p>
        </div>
      </div>

      {/* Branch Grid */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
        {list.length === 0 ? (
          <div className="flex items-center justify-center gap-sm text-on-surface-variant py-12">
            <span className="w-5 h-5 border-2 border-outline-variant border-t-primary rounded-full animate-spin" />
            <span className="font-body-sm">Memuat cabang...</span>
          </div>
        ) : (
          <>
            <p className="font-label-caps text-on-surface-variant mb-md">{list.length} Cabang Tersedia</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {list.map(c => (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id, c.nama)}
                  className="flex items-center gap-md p-md bg-surface-container rounded-xl border border-outline-variant hover:border-primary hover:bg-primary-fixed transition-all active:scale-95 text-left group w-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors">
                    <span className="material-symbols-outlined text-primary group-hover:text-on-primary text-[20px] transition-colors" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-label-md text-on-surface leading-snug truncate">{c.nama}</p>
                    <p className="font-body-sm text-on-surface-variant truncate">{c.kota}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Stat Card Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function StatCard({ label, value, icon, colorCls, bgCls }: {
  label: string; value: number; icon: string; colorCls: string; bgCls: string;
}) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md shadow-sm flex items-center gap-md">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgCls}`}>
        <span className={`material-symbols-outlined text-[20px] ${colorCls}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <div>
        <p className={`font-h2 leading-none ${colorCls}`}>{value}</p>
        <p className="font-label-caps text-on-surface-variant mt-xs">{label}</p>
      </div>
    </div>
  );
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Main Page Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
export default function AntrianPage() {
  const [antrian, setAntrian] = useState<Antrian[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [calling, setCalling] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | AntrianStatus>('all');
  const [selected, setSelected] = useState<Antrian | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [cabangId, setCabangId] = useState<number | null>(null);
  const [cabangNama, setCabangNama] = useState('');
  const [sessionReady, setSessionReady] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  // monitorMode = true saat Super Admin memilih cabang Ã¢â‚¬â€ sembunyikan semua aksi kelola
  // Admin Cabang TIDAK pernah dalam monitorMode (selalu bisa kelola antrian cabangnya)
  const [monitorMode, setMonitorMode] = useState(false);
  const [cabangList, setCabangList] = useState<Cabang[]>([]);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // Ã¢â€â‚¬Ã¢â€â‚¬ Init session Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    (async () => {
      try {
        // Coba baca dari cookie (beberapa kemungkinan nama key)
        let u: { role?: string; cabang_id?: number | null } | null = null;
        for (const key of ['user_data', 'userData', 'user']) {
          const match = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
          if (match) {
            try { u = JSON.parse(decodeURIComponent(match[1])); break; } catch { continue; }
          }
        }
        if (u) {
          if (u.cabang_id) { setCabangId(u.cabang_id); setSessionReady(true); return; }
          if (u.role === 'admin' && !u.cabang_id) { setIsSuperAdmin(true); setSessionReady(true); return; }
        }
        // Fallback ke /api/session
        const res = await fetch('/api/session', { credentials: 'include' });
        if (res.ok) {
          const { user } = await res.json();
          if (user?.cabang_id) { setCabangId(user.cabang_id); }
          else if (user?.role === 'admin' && !user?.cabang_id) { setIsSuperAdmin(true); }
          else { setIsSuperAdmin(true); }
        } else { setIsSuperAdmin(true); }
      } catch { setIsSuperAdmin(true); }
      finally { setSessionReady(true); }
    })();
  }, []);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Load cabang list for super admin Ã¢â€â‚¬Ã¢â€â‚¬
  useEffect(() => {
    if (!isSuperAdmin) return;
    clientFetch<ApiResponse<Cabang[]>>('/cabang')
      .then(r => setCabangList((r as ApiResponse<Cabang[]>).data ?? []))
      .catch(() => {});
  }, [isSuperAdmin]);

  // Ã¢â€â‚¬Ã¢â€â‚¬ Load antrian Ã¢â€â‚¬Ã¢â€â‚¬
  const loadAntrian = useCallback(async () => {
    if (!cabangId) return;
    setLoading(true);
    try {
      // Super Admin gunakan endpoint PUBLIK `/antrian` (tidak butuh token admin, sesuai docs)
      // Admin Cabang gunakan `/antrian/detail` Ã¢â‚¬â€ data lengkap termasuk No HP, No Rangka, dll
      // Gunakan isSuperAdmin (bukan monitorMode) agar tidak ada race condition
      const endpoint = isSuperAdmin
        ? `/cabang/${cabangId}/antrian`        // GET /cabang/:id/antrian Ã¢â‚¬â€ publik (docs baris 59)
        : `/cabang/${cabangId}/antrian/detail`; // GET /cabang/:id/antrian/detail Ã¢â‚¬â€ Admin (docs baris 61)
      const r = await clientFetch<ApiResponse<Antrian[]>>(endpoint);
      setAntrian((r as ApiResponse<Antrian[]>).data ?? []);
    } catch { showToast('Gagal memuat data antrian', false); }
    finally { setLoading(false); }
  }, [cabangId, isSuperAdmin]);

  useEffect(() => { if (sessionReady && cabangId) loadAntrian(); }, [loadAntrian, sessionReady, cabangId]);

  const filtered = useMemo(() => antrian
    .filter(q => {
      const s = search.toLowerCase();
      const matchSearch =
        q.nama_pemilik.toLowerCase().includes(s) ||
        String(q.nomor_antrian).includes(s) ||
        q.merk_motor.toLowerCase().includes(s);
      return matchSearch && (filterStatus === 'all' || q.status === filterStatus);
    })
    .sort((a, b) => a.nomor_antrian - b.nomor_antrian),
  [antrian, search, filterStatus]);

  const stats = useMemo(() => ({
    total: antrian.length,
    menunggu: antrian.filter(q => q.status === 'menunggu').length,
    dipanggil: antrian.filter(q => q.status === 'dipanggil').length,
    selesai: antrian.filter(q => q.status === 'selesai').length,
  }), [antrian]);

  async function callNext() {
    if (!cabangId) return;
    // Hard-block: Super Admin dalam monitorMode TIDAK BOLEH memanggil antrian
    if (monitorMode || isSuperAdmin) {
      showToast('Super Admin hanya bisa memantau antrian, tidak dapat memanggil.', false);
      return;
    }
    setCalling(true);
    try {
      // Gunakan /api/proxy/ (server-side) agar auth_token terbaca dari cookie
      // dan proxy route dapat menangani cabang_id untuk Super Admin
      const res = await fetch('/api/proxy/antrian/call-next', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cabang_id: cabangId }),
      });

      let resData: ApiResponse<Antrian> | null = null;
      try { resData = await res.json(); } catch { /* ignore */ }

      if (!res.ok) {
        const errMsg = resData?.message || `Error ${res.status}`;
        throw new Error(errMsg);
      }

      // Ã¢â€â‚¬Ã¢â€â‚¬ Umumkan nomor antrian via Web Speech API (TTS) Ã¢â€â‚¬Ã¢â€â‚¬
      const nomorDipanggil = resData?.data?.nomor_antrian;
      if (nomorDipanggil && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Nomor antrian ${nomorDipanggil}, silakan menuju loket`
        );
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        utterance.volume = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
      showToast(`Antrian #${nomorDipanggil ?? '?'} dipanggil!`);
      await loadAntrian();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal memanggil antrian', false);
    } finally {
      setCalling(false);
    }
  }

  async function finishAntrian(id: number) {
    // Hard-block: Super Admin dalam monitorMode TIDAK BOLEH menyelesaikan antrian
    if (monitorMode || isSuperAdmin) {
      showToast('Super Admin hanya bisa memantau antrian, tidak dapat mengubah status.', false);
      return;
    }
    setLoadingId(id);
    try {
      await clientFetch(`/antrian/${id}/selesai`, { method: 'PUT' });
      showToast('Antrian selesai!'); setSelected(null); await loadAntrian();
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : 'Gagal', false); }
    finally { setLoadingId(null); }
  }

  async function deleteAntrian(id: number, nomorAntrian: number) {
    if (monitorMode || isSuperAdmin) {
      showToast('Super Admin tidak dapat menghapus antrian.', false);
      return;
    }
    if (!confirm(`Hapus antrian #${nomorAntrian}? Tindakan ini tidak dapat dibatalkan.`)) return;
    setLoadingId(id);
    try {
      // Dokumentasi: DELETE /antrian/:id Ã¢â‚¬â€ Hapus/batalkan antrian
      await clientFetch(`/antrian/${id}`, { method: 'DELETE' });
      showToast(`Antrian #${nomorAntrian} berhasil dihapus.`);
      setSelected(null);
      await loadAntrian();
    } catch (e: unknown) { showToast(e instanceof Error ? e.message : 'Gagal menghapus antrian', false); }
    finally { setLoadingId(null); }
  }



  // Ã¢â€â‚¬Ã¢â€â‚¬ Loading sesi Ã¢â€â‚¬Ã¢â€â‚¬
  if (!sessionReady) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="w-10 h-10 border-4 border-primary-fixed border-t-primary rounded-full animate-spin" />
    </div>
  );

  // Ã¢â€â‚¬Ã¢â€â‚¬ Super Admin Ã¢â‚¬â€ pilih cabang (monitor) Ã¢â€â‚¬Ã¢â€â‚¬
  if (isSuperAdmin && !cabangId) return (
    <CabangSelector list={cabangList} onSelect={(id, nama) => {
      setCabangId(id);
      setCabangNama(nama);
      setMonitorMode(true); // tetap jadi monitor, semua aksi disembunyikan
    }} />
  );

  return (
    <div className="space-y-lg animate-fade-in">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Toast Ã¢â€â‚¬Ã¢â€â‚¬ */}
      {toast && (
        <div className={`fixed bottom-lg right-lg z-50 flex items-center gap-sm px-lg py-md rounded-xl shadow-xl font-label-md animate-fade-in ${toast.ok ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-error-container text-error'}`}>
          <span className="material-symbols-outlined text-[20px]">{toast.ok ? 'check_circle' : 'error'}</span>
          {toast.msg}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <DetailModal q={selected} onClose={() => setSelected(null)} onFinish={finishAntrian} loadingId={loadingId}
          isSuperAdmin={isSuperAdmin} />
      )}

      {/* ——— Header ——— */}
      <div className="flex flex-wrap items-center justify-between gap-md">
        <div>
          <h2 className="font-h1 text-on-surface">
            {isSuperAdmin ? 'Monitor Antrian' : 'Manajemen Antrian'}
          </h2>
          <div className="flex items-center gap-xs mt-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-[14px]">store</span>
            <p className="font-body-sm text-on-surface-variant">{cabangNama || 'Antrian cabang Anda'}</p>
            {monitorMode && (
              <button onClick={() => { setCabangId(null); setIsSuperAdmin(true); setMonitorMode(false); setAntrian([]); setCabangNama(''); }}
                className="ml-sm text-primary font-label-md hover:underline text-[12px]">
                Ganti cabang
              </button>
            )}
          </div>
        </div>
        {/* Super Admin: hanya bisa monitor, tidak ada tombol kelola */}
        {isSuperAdmin ? (
          <div className="flex items-center gap-sm px-md py-sm bg-secondary-fixed border border-secondary/20 rounded-xl">
            <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>visibility</span>
            <div>
              <p className="font-label-md text-secondary">Mode Monitor</p>
              <p className="text-[10px] text-secondary/70">Super Admin hanya bisa memantau antrian</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-sm">
            <button
              onClick={callNext} disabled={calling || stats.menunggu === 0}
              className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-xl font-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {calling
                ? <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                : <span className="material-symbols-outlined text-[20px]">record_voice_over</span>}
              Panggil Berikutnya
            </button>
          </div>
        )}
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Stats Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard label="Total Antrian"  value={stats.total}     icon="format_list_numbered" colorCls="text-primary"      bgCls="bg-primary-fixed" />
        <StatCard label="Menunggu"       value={stats.menunggu}  icon="hourglass_top"        colorCls="text-tertiary"     bgCls="bg-tertiary-fixed" />
        <StatCard label="Dipanggil"      value={stats.dipanggil} icon="record_voice_over"    colorCls="text-[#1d4ed8]"   bgCls="bg-[#dbeafe]" />
        <StatCard label="Selesai"        value={stats.selesai}   icon="task_alt"             colorCls="text-[#15803d]"   bgCls="bg-[#dcfce7]" />
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Filter Bar Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="flex flex-col sm:flex-row gap-sm items-stretch sm:items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm">
        {/* Search */}
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, no antrian, atau kendaraan..."
            className="w-full pl-9 pr-4 py-2 bg-surface-container rounded-lg focus:ring-2 focus:ring-primary outline-none font-body-sm text-on-surface border-none"
          />
        </div>
        {/* Filter buttons */}
        <div className="flex gap-xs">
          {(['all', 'menunggu', 'dipanggil', 'selesai'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={`px-md py-2 rounded-lg font-label-md capitalize transition-all text-[12px] whitespace-nowrap ${filterStatus === s ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
              {s === 'all' ? 'Semua' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={loadAntrian}
          className="flex items-center gap-xs px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all font-label-md text-[12px]">
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Refresh
        </button>
      </div>

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Table Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        {/* Table header info */}
        <div className="flex items-center justify-between px-lg py-sm border-b border-outline-variant bg-surface-container-low">
          <p className="font-label-caps text-on-surface-variant">{filtered.length} antrian ditemukan</p>
          {filterStatus !== 'all' && (
            <span className="font-label-md text-primary text-[12px]">Filter: {filterStatus}</span>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-md text-on-surface-variant">
            <span className="w-8 h-8 border-4 border-primary-fixed border-t-primary rounded-full animate-spin" />
            <p className="font-body-sm">Memuat data antrian...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant gap-sm">
            <span className="material-symbols-outlined text-[48px] opacity-20">inbox</span>
            <p className="font-body-base">Tidak ada antrian ditemukan</p>
            {search && <p className="font-body-sm opacity-60">Coba ubah kata pencarian</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low">
                  {['No.', 'Pemilik', 'Kendaraan', 'Estimasi', 'Reminder', 'Status', 'Aksi'].map(h => (
                    <th key={h} className="px-lg py-3 font-label-caps text-on-surface-variant whitespace-nowrap border-b border-outline-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((q, i) => (
                  <tr key={q.id} className={`hover:bg-surface-container-low transition-colors ${i % 2 === 0 ? '' : 'bg-surface-container-lowest/50'}`}>
                    {/* Nomor */}
                    <td className="px-lg py-md">
                      <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
                        <span className="font-bold text-primary text-[13px]">{q.nomor_antrian}</span>
                      </div>
                    </td>
                    {/* Pemilik Ã¢â‚¬â€ endpoint publik tidak ada no_hp */}
                    <td className="px-lg py-md">
                      <p className="font-label-md text-on-surface">{q.nama_pemilik ?? 'Ã¢â‚¬â€'}</p>
                      {q.no_hp && <p className="font-body-sm text-on-surface-variant">{q.no_hp}</p>}
                    </td>
                    {/* Kendaraan Ã¢â‚¬â€ endpoint publik tidak ada merk_motor dll */}
                    <td className="px-lg py-md">
                      {q.merk_motor
                        ? <p className="font-label-md text-on-surface">{q.merk_motor} {q.tipe_motor}</p>
                        : <span className="text-on-surface-variant opacity-50 text-[12px]">Ã¢â‚¬â€</span>}
                      {q.tahun_pembuatan && <p className="font-body-sm text-on-surface-variant">{q.tahun_pembuatan}</p>}
                    </td>
                    {/* Estimasi */}
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <span className="material-symbols-outlined text-on-surface-variant text-[14px]">schedule</span>
                        <span className="font-label-md text-on-surface">{q.estimasi_jam}</span>
                      </div>
                    </td>
                    {/* Reminder */}
                    <td className="px-lg py-md">
                      {q.reminder_aktif
                        ? <span className="flex items-center gap-xs text-[12px] text-tertiary font-label-md">
                            <span className="material-symbols-outlined text-[14px]">notifications_active</span>Aktif
                          </span>
                        : <span className="text-on-surface-variant opacity-40 text-[12px]">Ã¢â‚¬â€</span>}
                    </td>
                    {/* Status */}
                    <td className="px-lg py-md"><StatusBadge status={q.status} /></td>
                    {/* Aksi */}
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-xs">
                        <button onClick={() => setSelected(q)}
                          className="flex items-center gap-xs border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary px-sm py-1 rounded-lg transition-all font-label-md text-[12px]">
                          <span className="material-symbols-outlined text-[14px]">open_in_full</span>
                          Detail
                        </button>
                        {/* Tombol aksi: hanya Admin Cabang (!isSuperAdmin) yang bisa kelola antrian */}
                        {!isSuperAdmin && q.status === 'menunggu' && (
                          <button onClick={() => callNext()}
                            className="flex items-center gap-xs border border-primary text-primary hover:bg-primary-fixed px-sm py-1 rounded-lg transition-all font-label-md text-[12px]">
                            <span className="material-symbols-outlined text-[14px]">volume_up</span>
                            Panggil
                          </button>
                        )}
                        {!isSuperAdmin && q.status === 'dipanggil' && (
                          <button onClick={() => finishAntrian(q.id)} disabled={loadingId === q.id}
                            className="flex items-center gap-xs bg-primary text-on-primary hover:opacity-90 px-sm py-1 rounded-lg transition-all font-label-md text-[12px] disabled:opacity-60">
                            {loadingId === q.id
                              ? <span className="w-3 h-3 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                              : <span className="material-symbols-outlined text-[14px]">task_alt</span>}
                            Selesai
                          </button>
                        )}
                        {!isSuperAdmin && q.status !== 'selesai' && (
                          <button onClick={() => deleteAntrian(q.id, q.nomor_antrian)} disabled={loadingId === q.id}
                            className="flex items-center gap-xs border border-error text-error hover:bg-error-container px-sm py-1 rounded-lg transition-all font-label-md text-[12px] disabled:opacity-60">
                            {loadingId === q.id
                              ? <span className="w-3 h-3 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                              : <span className="material-symbols-outlined text-[14px]">delete</span>}
                            Hapus
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
