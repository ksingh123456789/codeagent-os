import React from 'react';
import { usePlatform, AVATARS } from '../../context/PlatformContext';

interface TenantAdminHeaderProps {
  onOpenInviteModal?: () => void;
  onOpenMobileNav?: () => void;
}

export const TenantAdminHeader: React.FC<TenantAdminHeaderProps> = ({ onOpenInviteModal, onOpenMobileNav }) => {
  const { currentCompany, setPortal, tenantAdminPage } = usePlatform();

  return (
    <header
      className="sticky top-0 right-0 w-full z-20 bg-white/95 backdrop-blur border-b border-[#c7c4d8]/60 shadow-sm flex items-center justify-between gap-2 sm:gap-3 min-h-14 px-3 sm:px-4 lg:px-6 shrink-0"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Search Bar & Context */}
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0 max-w-xl">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden w-9 h-9 -ml-1 shrink-0 rounded-lg flex items-center justify-center text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        {/* Compact brand on phones */}
        <div className="flex sm:hidden items-center gap-2 min-w-0">
          <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#3525cd] flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
          </div>
          <span className="text-sm font-semibold text-[#0b1c30] truncate">{currentCompany.name}</span>
        </div>
        <div className="relative w-full max-w-sm hidden sm:block">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder={
              tenantAdminPage === 'developers' ? 'Search developer, role or email...' :
              tenantAdminPage === 'projects' ? 'Search projects or repositories...' :
              tenantAdminPage === 'license-usage' ? 'Search developer, project, or audit log...' :
              'Search developers, repos, Jira tickets...'
            }
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#c7c4d8] rounded-lg text-[#0b1c30] placeholder:text-[#777587] focus:outline-none focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/15 transition-shadow"
          />
        </div>
      </div>

      {/* Action Items & User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {tenantAdminPage === 'developers' && (
          <div className="flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white text-[#3525cd] text-[11px] font-mono font-semibold border border-[#c7c4d8]/60 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>20 Dev Tier</span>
            </div>
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white text-[#565e74] text-xs font-semibold border border-[#c7c4d8]/60 shadow-sm hover:bg-[#f8f9ff] transition-colors">
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV</span>
            </button>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-invite-developer-modal'))}
              className="flex items-center gap-1.5 bg-[#4f46e5] text-white hover:bg-[#3525cd] text-xs font-semibold px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-md shadow-sm transition-all active:scale-[0.98]"
              aria-label="Invite developer"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              <span className="hidden sm:inline">Invite Developer</span>
            </button>
          </div>
        )}

        {tenantAdminPage === 'projects' && (
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white text-[#3525cd] text-[11px] font-mono font-semibold border border-[#c7c4d8]/60 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>20 Dev Tier</span>
            </div>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-add-project-modal'))}
              className="flex items-center gap-1.5 bg-[#4f46e5] text-white hover:bg-[#3525cd] text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              <span>Add Project</span>
            </button>
          </div>
        )}

        {tenantAdminPage === 'license-usage' && (
          <div className="hidden md:flex items-center gap-2">
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white text-[#3525cd] text-[11px] font-mono font-semibold border border-[#c7c4d8]/60 shadow-sm">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>20 Dev Tier ($199/mo)</span>
            </div>
            <button className="flex items-center gap-1.5 bg-[#4f46e5] text-white hover:bg-[#3525cd] text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-all active:scale-[0.98]">
              <span className="material-symbols-outlined text-[16px]">upgrade</span>
              <span>Upgrade Tier</span>
            </button>
          </div>
        )}

        {tenantAdminPage === 'overview' && (
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#dae2fd]/50 border border-[#c7c4d8]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="text-[10px] font-mono text-[#0b1c30] font-semibold leading-tight flex flex-col">
                <span>Plan Active: 20</span>
                <span>Dev Tier</span>
              </span>
            </div>
          </div>
        )}

        <div className="h-5 w-px bg-[#c7c4d8] hidden md:block ml-1"></div>

        {/* Utility Action Icons */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 sm:p-1.5 text-[#565e74] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg relative transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
          </button>
          <button
            className="hidden sm:inline-flex p-1.5 text-[#565e74] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg transition-colors"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle theme"
            onClick={() => alert("Theme switching is currently unavailable.")}
          >
            <span className="material-symbols-outlined text-[18px]">light_mode</span>
          </button>

          <button
            className="p-2 sm:p-1.5 text-[#565e74] hover:text-red-600 hover:bg-[#ffe5e5] rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign out"
            onClick={async () => {
              try {
                const url = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
                await fetch(`${url}/auth/logout`, {
                  method: 'POST',
                  headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
                });
              } catch (e) { console.error(e); }
              localStorage.clear();
              setPortal('login');
            }}
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>

        {/* Profile Chip */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer">
          <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-[#eff4ff] to-[#e2dfff] ring-1 ring-[#c7c4d8] text-[#3525cd] font-bold font-mono flex items-center justify-center text-xs">
            TC
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-[#0b1c30] leading-tight">
              admin@techcorp.com
            </span>
            <span className="text-[10px] font-mono text-[#565e74]">Tenant Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
};
