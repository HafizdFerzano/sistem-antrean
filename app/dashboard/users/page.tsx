'use client';

import { useCallback, useEffect, useState } from 'react';
import { clientFetch } from '@/lib/api';
import { User, Cabang, ApiResponse } from '@/types';
import { confirmDelete, confirmAction, toastSuccess, toastError } from '@/lib/swal';


type AdminForm = {
  name: string;
  username: string;
  password: string;
  cabang_id: string;
};

const EMPTY_FORM: AdminForm = { name: '', username: '', password: '', cabang_id: '' };

// ── Toast ──────────────────────────────────────────────────────────────────────
function Toast({ msg, ok, onClose }: { msg: string; ok: boolean; onClose: () => void }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl font-label-md animate-fade-in ${ok ? 'bg-[#dcfce7] text-[#15803d]' : 'bg-error-container text-error'}`}>
      <span className="material-symbols-outlined text-[20px]">{ok ? 'check_circle' : 'error'}</span>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
}

// ── Form Modal: Buat / Edit Admin Cabang ───────────────────────────────────────
function AdminFormModal({
  mode, initial, cabangList, onClose, onSave, submitting,
}: {
  mode: 'create' | 'edit';
  initial: AdminForm;
  cabangList: Cabang[];
  onClose: () => void;
  onSave: (form: AdminForm) => Promise<void>;
  submitting: boolean;
}) {
  const [form, setForm] = useState<AdminForm>(initial);

  const set = (k: keyof AdminForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
          <div>
            <h3 className="font-h3 text-on-surface">
              {mode === 'create' ? 'Buat Admin Cabang Baru' : 'Edit Admin Cabang'}
            </h3>
            <p className="font-body-sm text-on-surface-variant mt-1">
              {mode === 'create' ? 'Akun akan digunakan untuk login ke sistem' : 'Perbarui data akun admin cabang'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={async e => { e.preventDefault(); await onSave(form); }}
          className="px-6 py-5 flex flex-col gap-4"
        >
          {/* Nama */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">
              Nama Lengkap <span className="text-error">*</span>
            </label>
            <input
              value={form.name}
              onChange={set('name')}
              required
              placeholder="Admin Kedaton"
              className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none font-body-base text-on-surface"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">
              Username <span className="text-error">*</span>
            </label>
            <input
              value={form.username}
              onChange={set('username')}
              required
              placeholder="admin_kedaton"
              disabled={mode === 'edit'}
              className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none font-body-base text-on-surface disabled:opacity-50"
            />
            {mode === 'edit' && (
              <p className="text-[11px] text-on-surface-variant">Username tidak dapat diubah</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">
              Password {mode === 'create' ? <span className="text-error">*</span> : <span className="text-on-surface-variant/60">(kosongkan jika tidak ingin ganti)</span>}
            </label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              required={mode === 'create'}
              minLength={mode === 'create' ? 6 : 0}
              placeholder={mode === 'create' ? 'Min. 6 karakter' : 'Kosongkan jika tidak ingin ganti'}
              className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none font-body-base text-on-surface"
            />
          </div>

          {/* Cabang */}
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-on-surface-variant">
              Cabang yang Dikelola <span className="text-error">*</span>
            </label>
            <select
              value={form.cabang_id}
              onChange={set('cabang_id')}
              required
              className="px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none font-body-base text-on-surface"
            >
              <option value="">-- Pilih Cabang --</option>
              {cabangList.map(c => (
                <option key={c.id} value={c.id}>
                  #{c.id} — {c.nama} ({c.kota})
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-label-md border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-primary text-on-primary px-5 py-2.5 rounded-xl font-label-md hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 shadow-sm"
            >
              {submitting
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <span className="material-symbols-outlined text-[20px]">{mode === 'create' ? 'person_add' : 'save'}</span>}
              {mode === 'create' ? 'Buat Akun' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [cabangList, setCabangList] = useState<Cabang[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [modal, setModal] = useState<{ mode: 'create' | 'edit'; user: User | null } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  // Map cabang_id → nama cabang
  const cabangMap = Object.fromEntries(cabangList.map(c => [c.id, c]));

  // Load cabang list
  const loadCabang = useCallback(async () => {
    try {
      const res = await clientFetch<ApiResponse<Cabang[]>>('/cabang');
      setCabangList((res as ApiResponse<Cabang[]>).data ?? []);
    } catch { /* silent */ }
  }, []);

  // Load admin list — GET /users dan filter role=admin
  const loadAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await clientFetch<ApiResponse<User[]>>('/users');
      const raw = res as unknown as Record<string, unknown>;
      let list: User[] = [];
      if (Array.isArray(raw)) {
        list = raw as User[];
      } else if (Array.isArray(raw.data)) {
        list = raw.data as User[];
      }
      // Filter: tampilkan hanya yang role=admin
      setAdmins(list.filter(u => u.role === 'admin'));
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal memuat data admin', false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCabang();
    loadAdmins();
  }, [loadCabang, loadAdmins]);

  // Buat admin cabang baru — POST /users (kompatibel dengan token admin biasa)
  const handleCreate = async (form: AdminForm) => {
    setSubmitting(true);
    try {
      // Coba /super/admin/cabang terlebih dahulu (password di-hash bcrypt dengan benar)
      // Jika gagal (403 token bukan super admin murni), fallback ke /users
      try {
        await clientFetch('/super/admin/cabang', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            username: form.username,
            password: form.password,
            cabang_id: Number(form.cabang_id),
          }),
        });
      } catch {
        // Fallback: POST /users — bisa jadi password tidak ter-hash bcrypt
        await clientFetch('/users', {
          method: 'POST',
          body: JSON.stringify({
            name: form.name,
            username: form.username,
            password: form.password,
            role: 'admin',
            cabang_id: Number(form.cabang_id),
          }),
        });
      }
      showToast(`Admin "${form.name}" berhasil dibuat.`);
      setModal(null);
      await loadAdmins();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal membuat admin', false);
    } finally {
      setSubmitting(false);
    }
  };


  // Update admin cabang
  const handleUpdate = async (form: AdminForm) => {
    if (!modal?.user) return;
    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        cabang_id: Number(form.cabang_id),
      };
      if (form.password) payload.password = form.password;

      await clientFetch(`/users/${modal.user.id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      showToast(`Admin "${form.name}" berhasil diperbarui.`);
      setModal(null);
      await loadAdmins();
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Gagal memperbarui admin', false);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus admin
  const handleDelete = async (u: User) => {
    const ok = await confirmDelete(
      `Hapus Admin "${u.name}"?`,
      `Akun <strong>${u.username ?? u.name}</strong> akan dihapus permanen dari sistem.<br/>Tindakan ini <strong>tidak dapat dibatalkan</strong>.`,
      'Hapus Akun',
    );
    if (!ok) return;
    setDeleteLoading(u.id);
    try {
      await clientFetch(`/users/${u.id}`, { method: 'DELETE' });
      toastSuccess(`Admin "${u.name}" berhasil dihapus.`);
      await loadAdmins();
    } catch (e: unknown) {
      toastError(e instanceof Error ? e.message : 'Gagal menghapus admin');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Unassign: lepas admin dari cabang (jadi Super Admin)
  const handleUnassign = async (u: User) => {
    const ok = await confirmAction(
      `Lepas "${u.name}" dari Cabang?`,
      `Admin ini akan dilepas dari cabangnya dan berubah menjadi <strong>Super Admin</strong> yang tidak terikat ke cabang manapun.`,
      'Ya, Lepas dari Cabang',
    );
    if (!ok) return;
    setDeleteLoading(u.id);
    try {
      await clientFetch(`/super/admins/${u.id}/assign`, { method: 'DELETE' });
      toastSuccess(`"${u.name}" berhasil dilepas dari cabang.`);
      await loadAdmins();
    } catch (e: unknown) {
      toastError(e instanceof Error ? e.message : 'Gagal melepas admin dari cabang');
    } finally {
      setDeleteLoading(null);
    }
  };



  // Bangun initial form untuk edit
  const toForm = (u: User): AdminForm => ({
    name: u.name,
    username: u.username ?? '',
    password: '',
    cabang_id: u.cabang_id ? String(u.cabang_id) : '',
  });

  const isSuperAdmin = (u: User) => u.role === 'admin' && !u.cabang_id;

  return (
    <>
      {/* Toast */}
      {toast && <Toast msg={toast.msg} ok={toast.ok} onClose={() => setToast(null)} />}

      {/* Modal */}
      {modal && (
        <AdminFormModal
          mode={modal.mode}
          initial={modal.user ? toForm(modal.user) : EMPTY_FORM}
          cabangList={cabangList}
          onClose={() => !submitting && setModal(null)}
          onSave={modal.mode === 'create' ? handleCreate : handleUpdate}
          submitting={submitting}
        />
      )}

      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-bold" style={{ fontSize: '30px', color: 'var(--color-primary)', letterSpacing: '-0.02em' }}>
            Manajemen Admin Cabang
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
            Kelola akun admin untuk setiap kantor cabang Lautan Teduh.
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: 'create', user: null })}
          className="flex items-center gap-2 font-bold"
          style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '14px' }}
        >
          <span className="material-symbols-outlined">person_add</span>
          Buat Admin Cabang
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Admin', value: admins.length, icon: 'group', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
          { label: 'Admin Cabang', value: admins.filter(u => !!u.cabang_id).length, icon: 'manage_accounts', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
          { label: 'Super Admin (Pusat)', value: admins.filter(u => !u.cabang_id).length, icon: 'admin_panel_settings', color: 'var(--color-tertiary)', bg: 'var(--color-tertiary-fixed)' },
        ].map(({ label, value, icon, color, bg }) => (
          <div key={label} className="rounded-xl border shadow-sm p-5" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
              <span className="material-symbols-outlined text-[20px]" style={{ color }}>{icon}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{label}</p>
            <p className="font-bold" style={{ fontSize: '28px', color, marginTop: '2px' }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border shadow-sm overflow-hidden" style={{ backgroundColor: 'var(--color-surface-container-lowest)', borderColor: 'var(--color-outline-variant)' }}>
        {/* Table header bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b" style={{ backgroundColor: 'var(--color-surface-container-low)', borderColor: 'var(--color-outline-variant)' }}>
          <h3 className="font-bold" style={{ fontSize: '15px', color: 'var(--color-on-surface)' }}>
            Daftar Admin ({admins.length})
          </h3>
          <button
            onClick={loadAdmins}
            className="flex items-center gap-1 font-label-md hover:underline"
            style={{ color: 'var(--color-primary)', fontSize: '13px' }}
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ fontSize: '14px' }}>
            <thead style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)' }}>
              <tr>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest">ID</th>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest">Nama Admin</th>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest">Username</th>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest">Tipe</th>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest">Cabang yang Dikelola</th>
                <th className="px-6 py-3 font-bold text-xs uppercase tracking-widest text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-t animate-pulse" style={{ borderColor: 'var(--color-outline-variant)' }}>
                    {[1, 2, 3, 4, 5, 6].map(j => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 rounded" style={{ backgroundColor: 'var(--color-surface-container)' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <span className="material-symbols-outlined text-5xl block mb-2" style={{ color: 'var(--color-outline-variant)' }}>
                      manage_accounts
                    </span>
                    <p style={{ color: 'var(--color-on-surface-variant)' }}>Belum ada admin terdaftar</p>
                  </td>
                </tr>
              ) : (
                admins.map(u => {
                  const initials = u.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
                  const cabang = u.cabang_id ? cabangMap[u.cabang_id] : null;
                  const isSuper = isSuperAdmin(u);

                  return (
                    <tr
                      key={u.id}
                      className="border-t transition-colors"
                      style={{ borderColor: 'var(--color-outline-variant)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-surface-container-low)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}
                    >
                      {/* ID */}
                      <td className="px-6 py-4 font-bold" style={{ color: 'var(--color-outline)' }}>#{u.id}</td>

                      {/* Nama */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0"
                            style={{ backgroundColor: isSuper ? 'var(--color-primary-fixed)' : 'var(--color-secondary-fixed)', color: isSuper ? 'var(--color-primary)' : 'var(--color-secondary)' }}
                          >
                            {initials}
                          </div>
                          <span className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>{u.name}</span>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="px-6 py-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {u.username || '—'}
                      </td>

                      {/* Tipe */}
                      <td className="px-6 py-4">
                        {isSuper ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold uppercase"
                            style={{ backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-primary)' }}
                          >
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>admin_panel_settings</span>
                            Super Admin
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold uppercase"
                            style={{ backgroundColor: 'var(--color-secondary-fixed)', color: 'var(--color-secondary)' }}
                          >
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>store</span>
                            Admin Cabang
                          </span>
                        )}
                      </td>

                      {/* Cabang */}
                      <td className="px-6 py-4">
                        {cabang ? (
                          <div>
                            <p className="font-semibold" style={{ color: 'var(--color-on-surface)', fontSize: '13px' }}>{cabang.nama}</p>
                            <p style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px' }}>{cabang.kota}</p>
                          </div>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium"
                            style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}
                          >
                            <span className="material-symbols-outlined text-[12px]">domain</span>
                            Kantor Pusat
                          </span>
                        )}
                      </td>

                      {/* Aksi */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Edit */}
                          <button
                            onClick={() => setModal({ mode: 'edit', user: u })}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all"
                            style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-primary-fixed)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = ''}
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            Edit
                          </button>

                          {/* Unassign: hanya untuk Admin Cabang (yang punya cabang_id) */}
                          {u.cabang_id && (
                            <button
                              onClick={() => handleUnassign(u)}
                              disabled={deleteLoading === u.id}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs transition-all disabled:opacity-50"
                              style={{ border: '1px solid var(--color-tertiary)', color: 'var(--color-tertiary)' }}
                              title="Lepas dari cabang (jadikan Super Admin)"
                            >
                              <span className="material-symbols-outlined text-[14px]">link_off</span>
                              Lepas
                            </button>
                          )}

                          {/* Hapus */}
                          <button
                            onClick={() => handleDelete(u)}
                            disabled={deleteLoading === u.id}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-xs disabled:opacity-50 transition-all"
                            style={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-error)' }}
                          >
                            {deleteLoading === u.id
                              ? <span className="w-3 h-3 border-2 border-error/30 border-t-error rounded-full animate-spin" />
                              : <span className="material-symbols-outlined text-[14px]">delete</span>}
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!loading && admins.length > 0 && (
          <div className="px-6 py-3 border-t text-sm" style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface-variant)' }}>
            Total {admins.length} admin terdaftar · {admins.filter(u => !!u.cabang_id).length} admin cabang · {admins.filter(u => !u.cabang_id).length} super admin
          </div>
        )}
      </div>
    </>
  );
}
