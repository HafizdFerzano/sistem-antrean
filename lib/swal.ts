/**
 * SweetAlert2 Utility Wrapper
 * Konfigurasi terpusat untuk semua dialog konfirmasi dan notifikasi di aplikasi.
 */
import Swal from 'sweetalert2';

// ── Tema dasar sesuai design system aplikasi ──────────────────────────────────
const BASE = Swal.mixin({
  customClass: {
    popup:         'swal-popup',
    title:         'swal-title',
    htmlContainer: 'swal-html',
    confirmButton: 'swal-btn-confirm',
    cancelButton:  'swal-btn-cancel',
  },
  buttonsStyling: false,
  showClass:  { popup: 'swal-show' },
  hideClass:  { popup: 'swal-hide' },
});

// ── Dialog konfirmasi hapus (merah) ──────────────────────────────────────────
export async function confirmDelete(
  title: string,
  text: string,
  confirmText = 'Hapus',
): Promise<boolean> {
  const result = await BASE.fire({
    icon: 'warning',
    title,
    html: text,
    showCancelButton: true,
    confirmButtonText: `<span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle">delete</span> ${confirmText}`,
    cancelButtonText:  'Batal',
    reverseButtons: true,
    customClass: {
      popup:         'swal-popup',
      title:         'swal-title',
      htmlContainer: 'swal-html',
      confirmButton: 'swal-btn-danger',
      cancelButton:  'swal-btn-cancel',
    },

  });
  return result.isConfirmed;
}

// ── Dialog konfirmasi umum (primary/biru) ────────────────────────────────────
export async function confirmAction(
  title: string,
  text: string,
  confirmText = 'Ya, Lanjutkan',
): Promise<boolean> {
  const result = await BASE.fire({
    icon: 'question',
    title,
    html: text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: 'Batal',
    reverseButtons: true,
  });
  return result.isConfirmed;
}

// ── Toast notifikasi sukses / gagal ──────────────────────────────────────────
export const Toast = Swal.mixin({
  toast: true,
  position: 'bottom-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  customClass: { popup: 'swal-toast' },
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

export function toastSuccess(message: string) {
  Toast.fire({ icon: 'success', title: message });
}

export function toastError(message: string) {
  Toast.fire({ icon: 'error', title: message });
}

export function toastInfo(message: string) {
  Toast.fire({ icon: 'info', title: message });
}

export default BASE;
