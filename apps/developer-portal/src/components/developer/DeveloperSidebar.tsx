import React from 'react';
import toast from 'react-hot-toast';
import { usePlatform } from '../../context/PlatformContext';
import { DeveloperPage } from '../../types/platform';

interface DeveloperSidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const DeveloperSidebar: React.FC<DeveloperSidebarProps> = ({ mobileOpen = false, onClose }) => {
  const {
    developerPage,
    setDeveloperPage,
    currentCompany,
    activeTicketsCount,
    setPortal
  } = usePlatform();

  const navItems: { id: DeveloperPage; label: string; icon: string; badge?: string | number; dot?: boolean }[] = [
    { id: 'projects', label: 'Projects (Jira)', icon: 'view_kanban' },
    { id: 'workbench', label: 'My Tickets', icon: 'confirmation_number', badge: activeTicketsCount },
    { id: 'history', label: 'Execution History', icon: 'history' },
    { id: 'integrations', label: 'Integrations', icon: 'hub', dot: true },
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
      aria-label="Developer navigation"
    >
      <div className="flex flex-col gap-4 pt-1">
        {/* Workspace Brand & Team Context */}
        <div className="flex items-center gap-3 px-2 py-2 border-b border-[#3f465c]/40 pb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#3525cd] flex items-center justify-center text-white shadow-md shadow-black/20 font-bold shrink-0">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </div>
          <div className="overflow-hidden flex-1">
            <h1 className="text-sm font-semibold text-white tracking-tight leading-tight truncate">
              {currentCompany.name}
            </h1>
            <p className="text-[11px] font-mono text-[#eaf1ff]/70 truncate">Developer Portal</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-9 h-9 -mr-1 rounded-lg flex items-center justify-center text-[#eaf1ff]/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[#eaf1ff]/40">Workspace</p>
          {navItems.map((item) => {
            const isActive = developerPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setDeveloperPage(item.id); onClose?.(); }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-lg text-[13px] lg:text-xs font-medium transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? 'bg-[#3525cd] text-white shadow-md shadow-black/20'
                    : 'text-[#eaf1ff]/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.dot && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Telemetry Status Footer */}
      <div className="pt-4 border-t border-[#3f465c]/30 space-y-2 text-xs">
        <div className="flex flex-col gap-0.5">
          <a
            href="#docs"
            onClick={(e) => { e.preventDefault(); toast.success("Opening developer API & CLI documentation"); }}
            className="flex items-center gap-3 px-3 py-2 lg:py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">menu_book</span>
            <span>Docs</span>
          </a>
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg text-slate-300">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">shield_with_heart</span>
              <span>System Status</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <button
            onClick={() => {
              localStorage.clear();
              setPortal('login');
            }}
            className="flex items-center gap-3 px-3 py-2 lg:py-1.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/10 transition-colors cursor-pointer w-full text-left mt-2"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
