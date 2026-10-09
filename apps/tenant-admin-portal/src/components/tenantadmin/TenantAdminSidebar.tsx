import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { TenantAdminPage } from '../../types/platform';

interface TenantAdminSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const TenantAdminSidebar: React.FC<TenantAdminSidebarProps> = ({ mobileOpen = false, onClose }) => {
  const {
    tenantAdminPage,
    setTenantAdminPage,
    currentCompany,
    currentTenantDevelopers,
    setPortal
  } = usePlatform();

  const totalSeats = currentCompany.totalLicenses;
  const usedSeats = currentTenantDevelopers.length;
  const pct = Math.round((usedSeats / Math.max(1, totalSeats)) * 100);

  const navItems: { id: TenantAdminPage; label: string; icon: string; badge?: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: 'dashboard' },
    { id: 'developers', label: 'Developers', icon: 'group', badge: `${usedSeats} / ${totalSeats}` },

    { id: 'license-usage', label: 'License Usage', icon: 'loyalty' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
    {/* Mobile backdrop */}
    {mobileOpen && (
      <div
        className="fixed inset-0 z-40 bg-[#0b1c30]/50 backdrop-blur-[2px] lg:hidden animate-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />
    )}
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:static lg:z-auto lg:w-60 lg:max-w-none bg-[#213145] text-white flex flex-col justify-between p-4 select-none shrink-0 border-r border-[#3f465c]/40 overflow-y-auto no-scrollbar transition-transform duration-200 ease-out lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      aria-label="Tenant admin navigation"
    >
      <div className="flex flex-col gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1.5 border-b border-[#3f465c]/30 pb-3">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#3525cd] flex items-center justify-center text-white shadow-md shadow-black/20">
            <span className="material-symbols-outlined text-[18px]">smart_toy</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold tracking-tight text-white leading-none">AI CodeAgent</span>
            <span className="text-[11px] font-mono text-[#eaf1ff]/70 mt-1">Tenant Console</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden ml-auto w-9 h-9 -mr-1 shrink-0 rounded-lg flex items-center justify-center text-[#eaf1ff]/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tenant Scope Context Selector */}
        <div className="bg-[#0b1c30]/50 border border-[#3f465c]/40 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-6 h-6 shrink-0 rounded bg-[#4f46e5]/20 text-[#c3c0ff] flex items-center justify-center font-bold text-xs">
              {currentCompany.name.slice(0, 1)}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-xs text-white font-medium truncate">{currentCompany.name} Inc.</span>
              <span className="text-[10px] text-[#c7c4d8] font-mono truncate">{currentCompany.slug}</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-sm">unfold_more</span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1 mt-1">
          <p className="px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[#eaf1ff]/40">Workspace</p>
          {navItems.map((item) => {
            const isActive = tenantAdminPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setTenantAdminPage(item.id); onClose?.(); }}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-lg text-[13px] lg:text-xs font-medium transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-[#3525cd] text-white shadow-md shadow-black/20'
                    : 'text-[#eaf1ff]/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Seat Usage Progress Meter */}
      <div className="flex flex-col gap-2 pt-3 border-t border-[#3f465c]/30">
        <div className="p-2.5 rounded-lg bg-[#0b1c30]/60 border border-[#3f465c]/30">
          <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
            <span className="text-slate-300">Seats Occupied</span>
            <span className="text-emerald-400 font-semibold">{usedSeats} / {totalSeats}</span>
          </div>
          <div className="w-full bg-[#131b2e] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${pct >= 90 ? 'bg-amber-400' : 'bg-gradient-to-r from-[#4f46e5] to-[#7c74ff]'}`}
              style={{ width: `${Math.min(100, pct)}%` }}
            ></div>
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              const url = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
              await fetch(`${url}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
              });
            } catch (e) { console.error(e); }
            localStorage.clear();
            setPortal("login");
          }}
          className="flex items-center gap-2.5 px-3 py-2 lg:py-1.5 mt-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full text-left text-xs"
        >
          <span className="material-symbols-outlined text-[16px]">logout</span>
          <span>Sign Out</span>
        </button>

        <div className="flex items-center justify-between text-slate-300 text-xs px-1 mt-1">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Operational</span>
          </span>
          <span className="font-mono text-[10px] text-slate-400">v2.4.1</span>
        </div>
      </div>
    </aside>
    </>
  );
};
