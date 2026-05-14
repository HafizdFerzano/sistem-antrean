'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientFetch } from '@/lib/api';
import { Cabang, ApiResponse } from '@/types';

// Helper: baca user dari cookie (coba beberapa nama cookie)
function getUserFromCookie(): { cabang_id: number | null; role: string } | null {
  if (typeof document === 'undefined') return null;
  for (const key of ['user_data', 'userData', 'user']) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + key + '=([^;]*)'));
    if (match) {
      try { return JSON.parse(decodeURIComponent(match[1])); } catch { continue; }
    }
  }
  return null;
}

// ─── Form default ────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  nama: '', alamat: '', kota: '', no_telp: '', latitude: '', longitude: '',
};

// ─── Sub-components ──────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }: { msg: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-lg right-lg z-50 flex items-center gap-sm px-lg py-md rounded-xl shadow-xl font-label-md animate-fade-in ${type === 'success' ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-error-container text-error'}`}>
      <span className="material-symbols-outlined text-[20px]">{type === 'success' ? 'check_circle' : 'error'}</span>
      <span className="flex-1">{msg}</span>
      <button onClick={onClose} className="ml-sm opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

interface FormModalProps {
  mode: 'create' | 'edit';
  initial: typeof EMPTY_FORM;
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM) => Promise<void>;
  submitting: boolean;
}

function FormModal({ mode, initial, onClose, onSave, submitting }: FormModalProps) {
  const [form, setForm] = useState(initial);

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fields: { key: keyof typeof EMPTY_FORM; label: string; placeholder: string; required: boolean; type?: string }[] = [
    { key: 'nama', label: 'Nama Cabang', placeholder: 'Lautan Teduh Kedaton', required: true },
    { key: 'alamat', label: 'Alamat Lengkap', placeholder: 'Jl. Teuku Umar No.15D, Kedaton', required: true },
    { key: 'kota', label: 'Kota', placeholder: 'Bandar Lampung', required: true },
    { key: 'no_telp', label: 'No. Telepon', placeholder: '081367846069', required: false },
    { key: 'latitude', label: 'Latitude', placeholder: '-5.3795', required: false, type: 'number' },
    { key: 'longitude', label: 'Longitude', placeholder: '105.261', required: false, type: 'number' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-outline-variant shrink-0">
          <div>
            <h3 className="font-h3 text-h3 text-on-surface">
              {mode === 'create' ? 'Tambah Cabang Baru' : 'Edit Data Cabang'}
            </h3>
            <p className="font-body-sm text-on-surface-variant mt-1">
              {mode === 'create' ? 'Isi semua field wajib (*) untuk membuat cabang baru' : 'Perbarui informasi cabang'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form – scrollable body */}
        <div className="overflow-y-auto flex-1">
          <form
            onSubmit={async (e) => { e.preventDefault(); await onSave(form); }}
            className="px-8 py-6 grid grid-cols-2 gap-5"
          >
            {fields.map(({ key, label, placeholder, required, type }) => (
              <div key={key} className={`flex flex-col gap-1 ${key === 'nama' || key === 'alamat' ? 'col-span-2' : ''}`}>
                <label className="font-label-md text-on-surface-variant">
                  {label} {required && <span className="text-error">*</span>}
                </label>
                <input
                  type={type ?? 'text'}
                  step={type === 'number' ? 'any' : undefined}
                  value={form[key]}
                  onChange={set(key)}
                  required={required}
                  placeholder={placeholder}
                  className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-base text-on-surface placeholder:text-on-surface-variant/50 disabled:opacity-60"
                  disabled={submitting}
                />
              </div>
            ))}

            {/* Map preview hint */}
            {form.latitude && form.longitude && (
              <div className="col-span-2 flex items-center gap-2 px-4 py-3 bg-primary-fixed rounded-xl font-body-sm text-primary">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                <a
                  href={`https://maps.google.com/?q=${form.latitude},${form.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Lihat di Google Maps ↗
                </a>
              </div>
            )}

            {/* Actions */}
            <div className="col-span-2 flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl font-label-md border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-xl font-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 shadow-sm"
              >
                {submitting
                  ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <span className="material-symbols-outlined text-[20px]">save</span>}
                {mode === 'create' ? 'Buat Cabang' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CabangPage() {
  const [cabangList, setCabangList] = useState<Cabang[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');

  // Role & cabang — dideteksi dari cookie, fallback ke /api/session
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminCabangId, setAdminCabangId] = useState<number | null>(null);
  const [roleChecked, setRoleChecked] = useState(false);

  useEffect(() => {
    const u = getUserFromCookie();
    if (u) {
      setIsSuperAdmin(u.role === 'admin' && !u.cabang_id);
      setAdminCabangId(u.cabang_id ?? null);
      setRoleChecked(true);
      return;
    }
    // Fallback: tanya server jika cookie tidak terbaca
    fetch('/api/session', { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const user = data?.user ?? data;
        if (user?.role) {
          setIsSuperAdmin(user.role === 'admin' && !user.cabang_id);
          setAdminCabangId(user.cabang_id ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setRoleChecked(true));
  }, []);

  // Modal state
  const [modal, setModal] = useState<null | { mode: 'create' | 'edit'; data: Cabang | null }>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch all ──────────────────────────────────────────────────────────────
  const loadCabang = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch<ApiResponse<Cabang[]>>('/cabang');
      setCabangList((res as ApiResponse<Cabang[]>).data ?? []);
    } catch {
      showToast('Gagal memuat data cabang', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCabang(); }, [loadCabang]);

  // ── Create ─────────────────────────────────────────────────────────────────
  async function handleCreate(form: typeof EMPTY_FORM) {
    // Guard: hanya Super Admin yang bisa membuat cabang baru
    if (!isSuperAdmin) {
      showToast('Hanya Super Admin yang dapat membuat cabang baru.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await clientFetch('/cabang', {
        method: 'POST',
        body: JSON.stringify({
          nama: form.nama,
          alamat: form.alamat,
          kota: form.kota,
          ...(form.no_telp ? { no_telp: form.no_telp } : {}),
          ...(form.latitude ? { latitude: parseFloat(form.latitude) } : {}),
          ...(form.longitude ? { longitude: parseFloat(form.longitude) } : {}),
        }),
      });
      showToast(`Cabang "${form.nama}" berhasil dibuat!`, 'success');
      setModal(null);
      await loadCabang();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal membuat cabang', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Update ─────────────────────────────────────────────────────────────────
  async function handleUpdate(form: typeof EMPTY_FORM) {
    if (!modal?.data) return;
    // Guard: Admin Cabang hanya boleh update cabangnya sendiri
    if (!isSuperAdmin && modal.data.id !== adminCabangId) {
      showToast('Anda hanya dapat memperbarui data cabang Anda sendiri.', 'error');
      setModal(null);
      return;
    }
    setSubmitting(true);
    try {
      await clientFetch(`/cabang/${modal.data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          nama: form.nama,
          alamat: form.alamat,
          kota: form.kota,
          ...(form.no_telp ? { no_telp: form.no_telp } : {}),
          ...(form.latitude ? { latitude: parseFloat(form.latitude) } : {}),
          ...(form.longitude ? { longitude: parseFloat(form.longitude) } : {}),
        }),
      });
      showToast(`Cabang "${form.nama}" berhasil diperbarui!`, 'success');
      setModal(null);
      await loadCabang();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal memperbarui cabang', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete(c: Cabang) {
    // Guard: hanya Super Admin yang bisa menghapus cabang
    if (!isSuperAdmin) {
      showToast('Hanya Super Admin yang dapat menghapus cabang.', 'error');
      return;
    }
    if (!confirm(`Yakin ingin menghapus cabang "${c.nama}"?\nTindakan ini tidak dapat dibatalkan.`)) return;
    setDeletingId(c.id);
    try {
      await clientFetch(`/cabang/${c.id}`, { method: 'DELETE' });
      showToast(`Cabang "${c.nama}" berhasil dihapus.`, 'success');
      await loadCabang();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal menghapus cabang', 'error');
    } finally {
      setDeletingId(null);
    }
  }

  // ── Filtered list ──────────────────────────────────────────────────────────
  // Admin Cabang: hanya tampilkan cabangnya sendiri
  const visibleList = isSuperAdmin
    ? cabangList
    : cabangList.filter((c) => c.id === adminCabangId);

  const filtered = visibleList.filter((c) =>
    c.nama.toLowerCase().includes(search.toLowerCase()) ||
    c.kota.toLowerCase().includes(search.toLowerCase()) ||
    c.alamat.toLowerCase().includes(search.toLowerCase())
  );

  // ── Modal initial value helper ─────────────────────────────────────────────
  const toForm = (c: Cabang): typeof EMPTY_FORM => ({
    nama: c.nama,
    alamat: c.alamat,
    kota: c.kota,
    no_telp: c.no_telp ?? '',
    latitude: c.latitude != null ? String(c.latitude) : '',
    longitude: c.longitude != null ? String(c.longitude) : '',
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Guard: tunggu role terdeteksi
  if (!roleChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <span style={{
        display: 'inline-block', width: '2.5rem', height: '2.5rem',
        border: '4px solid #e2e8f0', borderTopColor: '#3b5bdb',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-lg animate-fade-in">
      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modal */}
      {modal && (
        <FormModal
          mode={modal.mode}
          initial={modal.data ? toForm(modal.data) : EMPTY_FORM}
          onClose={() => !submitting && setModal(null)}
          onSave={modal.mode === 'create' ? handleCreate : handleUpdate}
          submitting={submitting}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-md">
        <div>
          <h2 className="font-h1 text-h1 text-on-surface">
            {isSuperAdmin ? 'Data Cabang' : 'Profil Cabang'}
          </h2>
          <p className="font-body-base text-on-surface-variant">
            {isSuperAdmin
              ? `Kelola seluruh cabang Lautan Teduh — ${cabangList.length} cabang terdaftar`
              : 'Informasi dan data cabang Anda'}
          </p>
        </div>
        {/* Tombol Tambah Cabang hanya untuk Super Admin */}
        {isSuperAdmin && (
          <button
            onClick={() => setModal({ mode: 'create', data: null })}
            className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-xl font-label-md hover:bg-primary-container active:scale-95 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined">add_business</span>
            Tambah Cabang
          </button>
        )}
      </div>

      {/* Summary Cards — hanya untuk Super Admin */}
      {isSuperAdmin && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          {[
            { label: 'Total Cabang', value: cabangList.length, icon: 'storefront', color: 'text-primary', bg: 'bg-primary-fixed' },
            { label: 'Bandar Lampung', value: cabangList.filter(c => c.kota.toLowerCase().includes('bandar lampung')).length, icon: 'location_city', color: 'text-secondary', bg: 'bg-secondary-fixed' },
            { label: 'Luar Bandar Lampung', value: cabangList.filter(c => !c.kota.toLowerCase().includes('bandar lampung')).length, icon: 'map', color: 'text-tertiary', bg: 'bg-tertiary-fixed' },
            { label: 'Ada Koordinat', value: cabangList.filter(c => c.latitude && c.longitude).length, icon: 'my_location', color: 'text-[#15803d]', bg: 'bg-[#dcfce7]' },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant shadow-sm">
              <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color} mb-sm`}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </div>
              <p className="font-label-md text-on-surface-variant">{label}</p>
              <p className={`font-h1 text-h1 ${color} mt-xs`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Info Banner — hanya untuk Admin Cabang */}
      {!isSuperAdmin && (
        <div className="flex items-start gap-md px-lg py-md bg-primary-fixed border border-primary/20 rounded-xl">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-on-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          </div>
          <div>
            <p className="font-label-md text-primary font-bold">Hak Akses Terbatas</p>
            <p className="font-body-sm text-primary/80 mt-xs">
              Sebagai Admin Cabang, Anda hanya dapat melihat dan memperbarui data <strong>cabang Anda sendiri</strong>.
              Untuk membuat atau menghapus cabang, hubungi Super Admin kantor pusat.
            </p>
          </div>
        </div>
      )}

      {/* Search — hanya untuk Super Admin (Admin Cabang hanya ada 1 cabang) */}
      {isSuperAdmin && (
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari cabang berdasarkan nama, kota, atau alamat..."
            className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none font-body-base text-on-surface transition-all"
          />
        </div>
      )}

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-h3 text-h3 text-on-surface">Daftar Cabang</h3>
          <button onClick={loadCabang} className="flex items-center gap-1 text-primary font-label-md hover:underline">
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-md text-on-surface-variant">
            <span className="w-10 h-10 border-4 border-primary-fixed border-t-primary rounded-full animate-spin" />
            <p className="font-body-base">Memuat data cabang...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
            <span className="material-symbols-outlined text-[56px] opacity-30 mb-md">storefront</span>
            <p className="font-body-base">Tidak ada cabang ditemukan</p>
            {search && <p className="font-body-sm text-on-surface-variant mt-xs">Coba ubah kata pencarian</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low/60 border-b border-outline-variant">
                <tr>
                  {['#', 'Nama Cabang', 'Alamat', 'Kota', 'No. Telepon', 'Koordinat', 'Aksi'].map((h) => (
                    <th key={h} className="px-lg py-3 font-label-caps text-on-surface-variant whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-container transition-colors group">
                    <td className="px-lg py-md font-bold text-primary text-[18px]">#{c.id}</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                        </div>
                        <p className="font-label-md text-on-surface">{c.nama}</p>
                      </div>
                    </td>
                    <td className="px-lg py-md text-on-surface-variant font-body-sm max-w-[220px]">
                      <p className="truncate">{c.alamat}</p>
                    </td>
                    <td className="px-lg py-md">
                      <span className="px-2 py-1 bg-surface-container rounded-full text-[12px] font-bold text-on-surface-variant whitespace-nowrap">
                        {c.kota}
                      </span>
                    </td>
                    <td className="px-lg py-md text-on-surface font-body-sm">{c.no_telp || '—'}</td>
                    <td className="px-lg py-md">
                      {c.latitude && c.longitude ? (
                        <a
                          href={`https://maps.google.com/?q=${c.latitude},${c.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline font-body-sm"
                        >
                          <span className="material-symbols-outlined text-[14px]">location_on</span>
                          {Number(c.latitude).toFixed(4)}, {Number(c.longitude).toFixed(4)}
                        </a>
                      ) : (
                        <span className="text-on-surface-variant font-body-sm">—</span>
                      )}
                    </td>
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-sm">
                        {/* Edit — Super Admin bisa edit semua, Admin Cabang hanya cabangnya */}
                        {(isSuperAdmin || c.id === adminCabangId) ? (
                          <button
                            onClick={() => setModal({ mode: 'edit', data: c })}
                            className="flex items-center gap-1 border border-primary text-primary hover:bg-primary-fixed px-sm py-1.5 rounded-lg transition-all font-label-md text-body-sm"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Edit
                          </button>
                        ) : (
                          <span
                            title="Anda hanya bisa mengedit cabang Anda sendiri"
                            className="flex items-center gap-1 border border-outline-variant text-on-surface-variant opacity-40 px-sm py-1.5 rounded-lg font-label-md text-body-sm cursor-not-allowed"
                          >
                            <span className="material-symbols-outlined text-[16px]">lock</span>
                            Edit
                          </span>
                        )}
                        {/* Delete — hanya Super Admin */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDelete(c)}
                            disabled={deletingId === c.id}
                            className="flex items-center gap-1 border border-error text-error hover:bg-error-container px-sm py-1.5 rounded-lg transition-all font-label-md text-body-sm disabled:opacity-60"
                          >
                            {deletingId === c.id
                              ? <span className="w-4 h-4 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                              : <span className="material-symbols-outlined text-[16px]">delete</span>}
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
