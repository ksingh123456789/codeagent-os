import React from "react";
import { usePlatform, AVATARS } from "../../context/PlatformContext";
import { useQuery } from '@tanstack/react-query';
import { api } from "../../api/client";

interface SuperAdminHeaderProps {
  title?: string;
  onOpenNewCompany?: () => void;
  onOpenMobileNav?: () => void;
}

export const SuperAdminHeader: React.FC<SuperAdminHeaderProps> = ({
  title,
  onOpenMobileNav,
}) => {
  const { superAdminPage, setSuperAdminPage, clusterLoad, setPortal } =
    usePlatform();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';
      const url = envUrl.endsWith('/api/v1') ? envUrl.slice(0, -7) : envUrl;
      const res = await fetch(`${url}/api/v1/auth/me`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      if (!res.ok) throw new Error('Not logged in');
      return res.json();
    }
  });

  return (
    <header
      className="sticky top-0 right-0 w-full z-20 bg-white/95 backdrop-blur border-b border-[#c7c4d8]/60 shadow-sm min-h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 shrink-0"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Left side: Title & Cluster Load */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden w-9 h-9 -ml-1 shrink-0 rounded-lg flex items-center justify-center text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
          aria-label="Open navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline text-xs text-[#565e74] shrink-0">Global /</span>
          <h1 className="text-sm font-bold text-[#0b1c30] truncate">{title || 'Super Admin Dashboard'}</h1>
        </div>

        <div className="hidden md:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#eafbf1] border border-[#a6f0cc] text-[11px] font-mono font-medium text-[#006e4b] whitespace-nowrap shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00b074] animate-pulse"></div>
          Cluster Load: {clusterLoad}%
        </div>
      </div>

      {/* Global Search */}
      <div className="hidden xl:flex items-center gap-3 flex-1 max-w-96 ml-6 mr-auto">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search tenants, runs, policies... (⌘K)"
            className="w-full h-8 pl-9 pr-8 text-xs bg-[#eff4ff] border border-[#c7c4d8]/60 rounded-lg focus:outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 focus:bg-white transition-all text-[#0b1c30] placeholder:text-[#777587]"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        <button
          className="p-2 sm:p-1.5 text-[#565e74] hover:text-[#0b1c30] rounded-lg hover:bg-[#e5eeff] transition-colors relative"
          title="Platform Notifications"
          aria-label="Platform notifications"
        >
          <span className="material-symbols-outlined text-[18px]">
            notifications
          </span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
        </button>
        <button
          className="hidden sm:inline-flex p-1.5 text-[#565e74] hover:text-[#0b1c30] rounded-lg hover:bg-[#e5eeff] transition-colors"
          title="Platform Super Admin Support"
          aria-label="Support"
        >
          <span className="material-symbols-outlined text-[18px]">
            help_outline
          </span>
        </button>

        <div className="hidden sm:block h-5 w-px bg-[#c7c4d8]/50 mx-1"></div>

        {/* Admin Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-1 cursor-pointer group">
          <img
            src={AVATARS.alexWright}
            alt={currentUser?.name || "Admin"}
            className="w-8 h-8 sm:w-7 sm:h-7 shrink-0 rounded-full object-cover ring-1 ring-[#c7c4d8] group-hover:ring-[#4f46e5] transition-all"
          />
          <div className="hidden lg:flex flex-col text-left max-w-[180px]">
            <span className="text-xs text-[#0b1c30] leading-tight font-semibold truncate">
              {currentUser?.name || "Loading..."}
            </span>
            <span className="text-[10px] font-mono text-[#565e74] font-medium leading-none truncate">
              {currentUser?.email || ""}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
