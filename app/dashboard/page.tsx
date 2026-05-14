import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { getSessionUser } from '@/lib/session';
import { Antrian, AntrianStatusInfo, Cabang, ApiResponse } from '@/types';

function formatTanggal(date: Date) {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    menunggu: 'bg-amber-100 text-amber-700',
    dipanggil: 'bg-blue-100 text-blue-700',
    selesai: 'bg-emerald-100 text-emerald-700',
  };
  const label: Record<string, string> = {
    menunggu: 'Menunggu', dipanggil: 'Dipanggil', selesai: 'Selesai',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${map[status] ?? 'bg-surface-container text-on-surface'}`}>
      {label[status] ?? status}
    </span>
  );
}

// ─── Super Admin Dashboard ────────────────────────────────────────────────────
async function SuperAdminDashboard({ user }: { user: { name: string } }) {
  let cabangList: Cabang[] = [];
  try {
    const res = await fetchApi<Cabang[]>('/cabang');
    cabangList = res.data ?? [];
  } catch { /* fallback kosong */ }

  const statusResults = await Promise.allSettled(
    cabangList.map((c) => fetchApi<AntrianStatusInfo>(`/cabang/${c.id}/antrian/status`))
  );

  const cabangStatus = cabangList.map((c, i) => {
    const res = statusResults[i];
    const info = res.status === 'fulfilled' ? res.value.data : null;
    return {
      cabang: c,
      totalMenunggu: info?.total_menunggu ?? 0,
      nomorDipanggil: info?.nomor_dipanggil ?? null,
    };
  });

  const totalCabang = cabangList.length;
  const totalMenungguAll = cabangStatus.reduce((s, c) => s + c.totalMenunggu, 0);
  const cabangAktif = cabangStatus.filter((c) => c.nomorDipanggil !== null).length;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* ── Hero Header Super Admin ── */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-indigo-300 blur-2xl" />
        </div>
        <div className="relative z-10 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                Super Admin · Kantor Pusat
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white">Selamat datang, {user.name}</h2>
            <p className="text-white/60 text-sm mt-1">{formatTanggal(new Date())} · Akses Penuh Sistem</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/cabang"
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all backdrop-blur-sm">
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              Tambah Cabang
            </Link>
            <Link href="/dashboard/users"
              className="flex items-center gap-2 bg-white text-indigo-800 hover:bg-white/90 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Buat Admin Cabang
            </Link>
          </div>
        </div>
      </div>

      {/* ── Summary Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Total Cabang</p>
          </div>
          <p className="text-4xl font-bold text-indigo-600">{totalCabang}</p>
          <p className="text-on-surface-variant text-xs mt-1">cabang terdaftar</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Total Menunggu</p>
          </div>
          <p className="text-4xl font-bold text-amber-600">{totalMenungguAll}</p>
          <p className="text-on-surface-variant text-xs mt-1">dari semua cabang</p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>record_voice_over</span>
            </div>
            <p className="text-on-surface-variant text-sm font-medium">Cabang Aktif</p>
          </div>
          <p className="text-4xl font-bold text-emerald-600">{cabangAktif}</p>
          <p className="text-on-surface-variant text-xs mt-1">sedang melayani</p>
        </div>
      </div>

      {/* ── Status Per Cabang ── */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            <h3 className="font-bold text-on-surface">Status Antrian Real-time Per Cabang</h3>
          </div>
          <Link href="/dashboard/antrian" className="flex items-center gap-1 text-indigo-600 text-sm font-bold hover:underline">
            <span className="material-symbols-outlined text-[16px]">open_in_full</span>
            Monitor Semua
          </Link>
        </div>

        {cabangStatus.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-30 mb-3">storefront</span>
            <p>Belum ada data cabang</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant">
            {cabangStatus.map(({ cabang, totalMenunggu, nomorDipanggil }) => (
              <div key={cabang.id} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-indigo-600 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-on-surface text-sm truncate">{cabang.nama}</p>
                  <p className="text-on-surface-variant text-xs">{cabang.kota} · {cabang.alamat}</p>
                </div>
                <div className="text-center shrink-0 w-24">
                  {nomorDipanggil ? (
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Dipanggil</p>
                      <p className="font-bold text-indigo-600 text-lg">#{nomorDipanggil}</p>
                    </div>
                  ) : (
                    <span className="text-on-surface-variant opacity-40 text-xs">Belum ada</span>
                  )}
                </div>
                <div className="shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl text-[12px] font-bold ${totalMenunggu > 0 ? 'bg-amber-100 text-amber-700' : 'bg-surface-container text-on-surface-variant'}`}>
                    {totalMenunggu} menunggu
                  </span>
                </div>
                <Link href="/dashboard/antrian"
                  className="flex items-center gap-1 text-indigo-600 hover:bg-indigo-50 px-2 py-1.5 rounded-lg transition-all shrink-0 text-xs font-bold">
                  <span className="material-symbols-outlined text-[14px]">open_in_full</span>
                  Monitor
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Quick Actions Super Admin ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            href: '/dashboard/antrian',
            icon: 'monitoring',
            iconBg: 'bg-indigo-100',
            iconColor: 'text-indigo-600',
            title: 'Monitor Antrian',
            desc: 'Pantau status antrian per cabang secara real-time',
            badge: 'View Only',
            badgeCls: 'bg-indigo-100 text-indigo-600',
          },
          {
            href: '/dashboard/cabang',
            icon: 'storefront',
            iconBg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
            title: 'Kelola Cabang',
            desc: 'Tambah, edit, dan hapus data kantor cabang',
            badge: 'Full Access',
            badgeCls: 'bg-emerald-100 text-emerald-700',
          },
          {
            href: '/dashboard/users',
            icon: 'manage_accounts',
            iconBg: 'bg-purple-100',
            iconColor: 'text-purple-600',
            title: 'Admin Cabang',
            desc: 'Buat dan kelola akun admin untuk tiap cabang',
            badge: 'Full Access',
            badgeCls: 'bg-purple-100 text-purple-700',
          },
        ].map(({ href, icon, iconBg, iconColor, title, desc, badge, badgeCls }) => (
          <Link key={href} href={href}
            className="flex flex-col gap-3 p-5 bg-surface-container-lowest border border-outline-variant rounded-2xl hover:shadow-md hover:border-outline transition-all group">
            <div className="flex items-start justify-between">
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[22px] ${iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${badgeCls}`}>{badge}</span>
            </div>
            <div>
              <p className="font-bold text-on-surface">{title}</p>
              <p className="text-on-surface-variant text-xs mt-1">{desc}</p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-primary group-hover:gap-2 transition-all">
              Buka <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── Admin Cabang Dashboard ───────────────────────────────────────────────────
async function AdminCabangDashboard({ user }: { user: { name: string; cabang_id?: number | null } }) {
  const cabangId = user.cabang_id;

  let statusInfo: AntrianStatusInfo | null = null;
  let antrian: Antrian[] = [];
  let antrianSelesai = 0;
  let cabangInfo: Cabang | null = null;

  if (cabangId) {
    try {
      const [statusRes, detailRes, selesaiRes, cabangRes] = await Promise.allSettled([
        fetchApi<AntrianStatusInfo>(`/cabang/${cabangId}/antrian/status`),
        fetchApi<Antrian[]>(`/cabang/${cabangId}/antrian/detail?status=menunggu`),
        fetchApi<Antrian[]>(`/cabang/${cabangId}/antrian/detail?status=selesai`),
        fetchApi<Cabang>(`/cabang/${cabangId}`),
      ]);
      if (statusRes.status === 'fulfilled' && statusRes.value.data) statusInfo = statusRes.value.data;
      if (detailRes.status === 'fulfilled' && detailRes.value.data) antrian = detailRes.value.data;
      if (selesaiRes.status === 'fulfilled' && selesaiRes.value.data) antrianSelesai = selesaiRes.value.data.length;
      if (cabangRes.status === 'fulfilled' && cabangRes.value.data) cabangInfo = cabangRes.value.data;
    } catch { /* tampilkan data kosong */ }
  }

  const totalMenunggu = statusInfo?.total_menunggu ?? antrian.length;
  const nomorDipanggil = statusInfo?.nomor_dipanggil;
  const totalSelesai = antrianSelesai;
  const totalAntrian = totalMenunggu + totalSelesai + (nomorDipanggil ? 1 : 0);
  const pctSelesai = totalAntrian > 0 ? Math.round((totalSelesai / totalAntrian) * 100) : 0;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* ── Hero Header Admin Cabang ── */}
      <div className="relative rounded-2xl overflow-hidden shadow-lg"
        style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #388e3c 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative z-10 px-8 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                Admin Cabang
              </span>
              {cabangInfo && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-medium">
                  <span className="material-symbols-outlined text-[12px]">location_on</span>
                  {cabangInfo.nama}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">Selamat datang, {user.name}</h2>
            <p className="text-white/60 text-sm mt-1">{formatTanggal(new Date())} · {cabangInfo?.kota ?? 'Cabang'}</p>
          </div>
          <Link href="/dashboard/antrian"
            className="flex items-center gap-2 bg-white text-green-800 hover:bg-white/90 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">format_list_numbered</span>
            Kelola Antrian
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Antrian', value: totalAntrian, icon: 'group', color: 'text-emerald-700', bg: 'bg-emerald-100' },
          { label: 'Menunggu', value: totalMenunggu, icon: 'hourglass_top', color: 'text-amber-600', bg: 'bg-amber-100', note: 'perlu dilayani' },
          { label: 'Dipanggil', value: nomorDipanggil ? 1 : 0, icon: 'record_voice_over', color: 'text-blue-700', bg: 'bg-blue-100', note: nomorDipanggil ? `No. #${nomorDipanggil}` : 'belum ada' },
          { label: 'Selesai', value: totalSelesai, icon: 'task_alt', color: 'text-green-700', bg: 'bg-green-100', note: `${pctSelesai}% dari total` },
        ].map(({ label, value, icon, color, bg, note }) => (
          <div key={label} className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-[20px] ${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
            </div>
            <p className="text-on-surface-variant text-xs font-medium">{label}</p>
            <p className={`text-3xl font-bold ${color} mt-1`}>{value}</p>
            {note && <p className="text-on-surface-variant text-[11px] mt-1">{note}</p>}
          </div>
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Antrian Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>format_list_numbered</span>
              <h3 className="font-bold text-on-surface">Antrian Menunggu</h3>
            </div>
            <Link href="/dashboard/antrian" className="text-emerald-700 text-sm font-bold hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {antrian.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-3 opacity-30">inbox</span>
              <p className="text-sm">Tidak ada antrian menunggu</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    {['No.', 'Pemilik', 'Kendaraan', 'Estimasi', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {antrian.slice(0, 6).map((q) => (
                    <tr key={q.id} className="hover:bg-surface-container transition-colors">
                      <td className="px-5 py-3">
                        <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center">
                          {q.nomor_antrian}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-semibold text-on-surface text-sm">{q.nama_pemilik}</p>
                        <p className="text-on-surface-variant text-xs">{q.no_hp?.slice(0, -4).replace(/./g, '•') + q.no_hp?.slice(-4)}</p>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-on-surface text-sm font-medium">{q.merk_motor} {q.tipe_motor}</p>
                        <p className="text-on-surface-variant text-xs">{q.tahun_pembuatan}</p>
                      </td>
                      <td className="px-5 py-3 text-on-surface-variant text-sm">{q.estimasi_jam}</td>
                      <td className="px-5 py-3"><StatusBadge status={q.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-4">
          {/* Live status card */}
          <div className="relative rounded-2xl p-6 overflow-hidden shadow-md"
            style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)' }}>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-[100px]">confirmation_number</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <p className="text-white/70 text-xs font-bold uppercase tracking-wider">Live Status</p>
              </div>
              {nomorDipanggil ? (
                <>
                  <p className="text-white/70 text-sm">Sedang Dilayani</p>
                  <p className="text-white font-bold text-[52px] leading-none">#{nomorDipanggil}</p>
                  <p className="text-white/60 text-xs mt-2">{totalMenunggu} antrian masih menunggu</p>
                </>
              ) : (
                <>
                  <p className="text-white/70 text-sm">Status Antrian</p>
                  <p className="text-white font-bold text-2xl mt-1">Belum Ada</p>
                  <p className="text-white/60 text-xs mt-2">{totalMenunggu} antrian menunggu dipanggil</p>
                </>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
            <h3 className="font-bold text-on-surface mb-4">Aksi Cepat</h3>
            <div className="flex flex-col gap-2">
              <Link href="/dashboard/antrian"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <span className="material-symbols-outlined text-emerald-700 text-[18px]">format_list_numbered</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-on-surface text-sm">Kelola Antrian</p>
                  <p className="text-on-surface-variant text-xs">Panggil & selesaikan antrian</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
              </Link>
              <Link href="/dashboard/cabang"
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="material-symbols-outlined text-blue-700 text-[18px]">storefront</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-on-surface text-sm">Profil Cabang</p>
                  <p className="text-on-surface-variant text-xs">Info & update data cabang</p>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root Page ────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const user = await getSessionUser();
  const isSuperAdmin = user?.role === 'admin' && !user?.cabang_id;

  if (isSuperAdmin) {
    return <SuperAdminDashboard user={{ name: user?.name ?? 'Admin' }} />;
  }
  return <AdminCabangDashboard user={{ name: user?.name ?? 'Admin', cabang_id: user?.cabang_id }} />;
}
