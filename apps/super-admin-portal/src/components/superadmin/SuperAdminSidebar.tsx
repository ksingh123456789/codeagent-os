import React from "react";
import { usePlatform } from "../../context/PlatformContext";
import { SuperAdminPage } from "../../types/platform";

interface SuperAdminSidebarProps {
  onOpenNewCompany: () => void;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export const SuperAdminSidebar: React.FC<SuperAdminSidebarProps> = ({
  onOpenNewCompany,
  mobileOpen = false,
  onClose,
}) => {
  const { superAdminPage, setSuperAdminPage, companies, setPortal } =
    usePlatform();

  const navItems: {
    id: SuperAdminPage;
    label: string;
    icon: string;
    badge?: string | number;
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    {
      id: "companies",
      label: "Companies",
      icon: "domain",
      badge: companies.length,
    },
    // {
    //   id: "projects",
    //   label: "Projects (Jira)",
    //   icon: "view_kanban",
    //   badge: "Sprint 24",
    // },
    { id: "license-plans", label: "License Plans", icon: "loyalty" },
    { id: "users", label: "Users", icon: "group" },
    { id: "settings", label: "Settings", icon: "settings" },
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
      aria-label="Super admin navigation"
    >
      <div className="flex flex-col gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#3525cd] flex items-center justify-center text-white shadow-md shadow-black/20 font-bold">
            <span className="material-symbols-outlined text-[18px]">
              terminal
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-white font-sans">
                CodeAgent OS
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-[#3525cd] text-white font-semibold">
                SA
              </span>
            </div>
            <span className="text-[11px] font-mono text-[#c7c4d8] truncate">
              Super Admin Console
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden ml-auto w-9 h-9 -mr-1 shrink-0 rounded-lg flex items-center justify-center text-[#eaf1ff]/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close navigation"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* CTA: + New Company */}
        <button
          onClick={onOpenNewCompany}
          className="w-full h-10 lg:h-8 px-3 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] shadow-md shadow-black/20 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Company</span>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1 mt-1">
          <p className="px-3 pb-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[#eaf1ff]/40">Platform</p>
          {navItems.map((item) => {
            const isActive = superAdminPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setSuperAdminPage(item.id); onClose?.(); }}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 lg:py-2 rounded-lg text-[13px] lg:text-xs font-medium transition-all text-left w-full cursor-pointer ${
                  isActive
                    ? "bg-[#3525cd] text-white shadow-md shadow-black/20"
                    : "text-[#eaf1ff]/80 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {item.icon}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-black/30 text-slate-300"
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

      {/* Footer Navigation & Status */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[#3f465c]/40 text-xs">
        <div className="flex flex-col gap-0.5">
          <button
            onClick={async () => {
              try {
                const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
                const url = envUrl.endsWith('/api/v1') ? envUrl.slice(0, -7) : envUrl;
                await fetch(`${url}/api/v1/auth/logout`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                });
              } catch (e) { console.error(e); }
              localStorage.clear();
              setPortal("login");
            }}
            className="flex items-center gap-2.5 px-3 py-2 lg:py-1.5 mt-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors w-full text-left"
          >
            <span className="material-symbols-outlined text-[16px]">
              logout
            </span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
    </>
  );
};
