import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import { getSessionUser } from '@/lib/session';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const user = await getSessionUser();

  const isSuperAdmin = user?.role === 'admin' && !user?.cabang_id;
  const adminRole = isSuperAdmin ? 'Super Admin' : 'Admin Cabang';

  // Warna header sesuai role
  const headerBg = isSuperAdmin
    ? 'bg-[#1a237e]/5 border-[#283593]/10'
    : 'bg-[#1b5e20]/5 border-[#2e7d32]/10';
  const accentColor = isSuperAdmin ? 'text-indigo-700' : 'text-emerald-700';
  const accentBg = isSuperAdmin ? 'bg-indigo-100' : 'bg-emerald-100';

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Sidebar
        adminName={user?.name ?? 'Admin'}
        adminRole={adminRole}
        isSuperAdmin={isSuperAdmin}
      />
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <header className={`sticky top-0 h-16 ${headerBg} border-b backdrop-blur-sm flex justify-between items-center px-6 z-40`}>
          <div className="flex items-center gap-3">
            {/* Role indicator pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 ${accentBg} rounded-full`}>
              <span className={`material-symbols-outlined text-[14px] ${accentColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {isSuperAdmin ? 'admin_panel_settings' : 'store'}
              </span>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${accentColor}`}>
                {isSuperAdmin ? 'Kantor Pusat' : 'Kantor Cabang'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification & help buttons */}
            <div className="flex gap-1">
              <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full cursor-pointer active:opacity-70 transition-all">
                <span className="material-symbols-outlined text-[20px]">notifications</span>
              </button>
              <button className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:bg-surface-container rounded-full cursor-pointer active:opacity-70 transition-all">
                <span className="material-symbols-outlined text-[20px]">help_outline</span>
              </button>
            </div>

            {/* User chip */}
            <div className="flex items-center gap-2.5 border-l border-outline-variant pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-on-surface">{user?.name ?? 'Admin'}</p>
                <p className={`text-[10px] font-bold uppercase tracking-wider ${accentColor}`}>
                  {adminRole}
                </p>
              </div>
              <div className={`w-9 h-9 rounded-full ${accentBg} flex items-center justify-center font-bold text-sm border ${isSuperAdmin ? 'border-indigo-200' : 'border-emerald-200'} ${accentColor}`}>
                {(user?.name ?? 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
