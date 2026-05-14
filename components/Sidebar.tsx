'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';

interface NavItem {
  href: string;
  icon: string;
  label: string;
}

const SUPER_ADMIN_NAV: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/dashboard/antrian', icon: 'monitoring', label: 'Monitor Antrian' },
  { href: '/dashboard/cabang', icon: 'storefront', label: 'Data Cabang' },
  { href: '/dashboard/users', icon: 'manage_accounts', label: 'Admin Cabang' },
];

const ADMIN_CABANG_NAV: NavItem[] = [
  { href: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
  { href: '/dashboard/antrian', icon: 'format_list_numbered', label: 'Antrian Service' },
  { href: '/dashboard/cabang', icon: 'storefront', label: 'Profil Cabang' },
];

interface SidebarProps {
  adminName?: string;
  adminRole?: string;
  isSuperAdmin?: boolean;
}

export default function Sidebar({
  adminName = 'Admin',
  adminRole = 'Admin Cabang',
  isSuperAdmin = false,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = isSuperAdmin ? SUPER_ADMIN_NAV : ADMIN_CABANG_NAV;

  // Warna tema: Super Admin = biru/indigo, Admin Cabang = hijau
  const theme = isSuperAdmin
    ? {
        sidebarBg: 'linear-gradient(180deg, #1a237e 0%, #283593 60%, #1a237e 100%)',
        brandColor: 'text-white',
        brandSubColor: 'text-white/60',
        navActiveBg: 'rgba(255,255,255,0.15)',
        navActiveText: 'text-white',
        navActiveIcon: 'text-white',
        navHoverBg: 'rgba(255,255,255,0.08)',
        navText: 'text-white/70',
        navIcon: 'text-white/50',
        badge: 'bg-white/15 border-white/20 text-white',
        divider: 'border-white/10',
        logoutText: 'text-red-300 hover:bg-red-500/20',
        profileBg: 'bg-white/10',
        profileText: 'text-white',
        profileSub: 'text-white/60',
        roleBadge: 'bg-white/15 border border-white/20 text-white',
        roleIcon: 'admin_panel_settings',
      }
    : {
        sidebarBg: 'linear-gradient(180deg, #1b5e20 0%, #2e7d32 60%, #1b5e20 100%)',
        brandColor: 'text-white',
        brandSubColor: 'text-white/60',
        navActiveBg: 'rgba(255,255,255,0.15)',
        navActiveText: 'text-white',
        navActiveIcon: 'text-white',
        navHoverBg: 'rgba(255,255,255,0.08)',
        navText: 'text-white/70',
        navIcon: 'text-white/50',
        badge: 'bg-white/15 border-white/20 text-white',
        divider: 'border-white/10',
        logoutText: 'text-red-300 hover:bg-red-500/20',
        profileBg: 'bg-white/10',
        profileText: 'text-white',
        profileSub: 'text-white/60',
        roleBadge: 'bg-white/15 border border-white/20 text-white',
        roleIcon: 'store',
      };

  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 flex flex-col z-50 shadow-2xl"
      style={{ background: theme.sidebarBg }}
    >
      {/* Brand */}
      <div className={`px-6 py-6 border-b ${theme.divider}`}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
            <span className="material-symbols-outlined text-white text-[22px]">garage</span>
          </div>
          <div>
            <h1 className={`font-bold text-lg leading-tight ${theme.brandColor}`}>Lautan Teduh</h1>
            <p className={`text-[10px] ${theme.brandSubColor}`}>Manajemen Antrian</p>
          </div>
        </div>
        {/* Role badge */}
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${theme.roleBadge}`}>
          <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {theme.roleIcon}
          </span>
          {isSuperAdmin ? 'Kantor Pusat' : 'Kantor Cabang'}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col p-3 gap-1 overflow-y-auto">
        {/* Section label */}
        <p className={`px-3 py-2 text-[9px] font-bold uppercase tracking-widest ${theme.brandSubColor}`}>
          {isSuperAdmin ? 'Menu Utama' : 'Menu Cabang'}
        </p>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 active:scale-95 ${
                isActive ? theme.navActiveText : `${theme.navText} hover:text-white`
              }`}
              style={{
                backgroundColor: isActive ? theme.navActiveBg : undefined,
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = theme.navHoverBg;
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = '';
              }}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? theme.navActiveIcon : theme.navIcon}`}
                style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 400" }}
              >
                {item.icon}
              </span>
              <span className="font-medium text-sm">{item.label}</span>
              {/* Badge khusus: "Monitor" untuk Super Admin di menu antrian */}
              {isSuperAdmin && item.href === '/dashboard/antrian' && (
                <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${theme.badge}`}>
                  View
                </span>
              )}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div className={`border-t ${theme.divider} p-4`}>
        <div className={`flex items-center gap-3 px-3 py-3 rounded-xl mb-2 ${theme.profileBg}`}>
          <div className="w-9 h-9 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-bold text-sm text-white shrink-0">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate ${theme.profileText}`}>{adminName}</p>
            <p className={`text-[11px] truncate ${theme.profileSub}`}>
              {isSuperAdmin ? 'Super Admin' : adminRole}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all active:scale-95 duration-150 text-sm font-medium ${theme.logoutText}`}
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Keluar</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
