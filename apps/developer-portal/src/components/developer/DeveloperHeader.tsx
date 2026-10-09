import React, { useState, useEffect } from 'react';
import { usePlatform, AVATARS } from '../../context/PlatformContext';

interface DeveloperHeaderProps {
  onOpenMobileNav?: () => void;
}

export const DeveloperHeader: React.FC<DeveloperHeaderProps> = ({ onOpenMobileNav }) => {
  const { currentCompany, setPortal, developerPage, selectedProjectKey, setSelectedProjectKey } = usePlatform();
  const [jiraProjects, setJiraProjects] = useState<any[]>([]);
  const [userData, setUserData] = useState<{name?: string, email?: string} | null>(null);

  useEffect(() => {
    const localData = localStorage.getItem('user_data');
    if (localData) {
      try {
        setUserData(JSON.parse(localData));
      } catch (e) {}
    } else {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/auth/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
      })
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          localStorage.setItem('user_data', JSON.stringify(data));
          setUserData(data);
        }
      })
      .catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (developerPage === 'workbench' || developerPage === 'projects') {
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/developer/projects`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
      })
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setJiraProjects(data);
            if (!selectedProjectKey && data.length > 0) {
              setSelectedProjectKey(data[0].key);
            }
          }
        })
        .catch(console.error);
    }
  }, [developerPage, selectedProjectKey, setSelectedProjectKey]);

  return (
    <div className="flex flex-col border-b border-[#c7c4d8]/60 bg-white shrink-0" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Top Header Row */}
      <header className="h-14 px-3 sm:px-4 lg:px-6 flex items-center justify-between gap-2 sm:gap-3 shadow-sm">
        {/* Mobile menu trigger + Global Search */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 lg:flex-none lg:w-96">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-[#0b1c30] hover:bg-[#eff4ff] transition-colors"
            aria-label="Open navigation"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* Compact brand on phones (sidebar is hidden) */}
          <div className="flex sm:hidden items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#4f46e5] to-[#3525cd] flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[16px]">smart_toy</span>
            </div>
            <span className="text-sm font-semibold text-[#0b1c30] truncate">{currentCompany.name}</span>
          </div>

          <div className="relative w-full hidden sm:block">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Search Jira issues (e.g. PROJ-101), commits, PRs..."
              className="w-full h-9 lg:h-8 pl-9 pr-10 text-xs bg-[#f8f9ff] rounded-lg border border-[#c7c4d8] text-[#0b1c30] placeholder:text-[#777587] focus:outline-none focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/15 transition-shadow"
            />
            <kbd className="hidden md:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[#777587] bg-[#eff4ff] rounded border border-[#c7c4d8]">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Connected Integration Status Badges & Developer Profile */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
          <div className="hidden xl:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eff4ff] border border-[#c7c4d8] text-[11px] font-mono text-[#0b1c30]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">GitHub:</span> Connected
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#eff4ff] border border-[#c7c4d8] text-[11px] font-mono text-[#0b1c30]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-semibold">Jira:</span> Connected
            </div>
          </div>
          {/* Condensed status pill for tablets */}
          <div
            className="hidden md:flex xl:hidden items-center gap-1.5 px-2 py-1 rounded-md bg-[#eff4ff] border border-[#c7c4d8] text-[11px] font-mono text-[#0b1c30]"
            title="GitHub: Connected · Jira: Connected"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold">GitHub · Jira</span>
          </div>

          <div className="hidden md:block h-4 w-px bg-[#c7c4d8]"></div>

          <div className="flex items-center gap-0.5 sm:gap-1 text-[#565e74]">
            <button className="w-9 h-9 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors" aria-label="Notifications">
              <span className="material-symbols-outlined text-[20px] lg:text-[18px]">notifications</span>
            </button>
            <button
              className="hidden sm:flex w-9 h-9 lg:w-8 lg:h-8 rounded-lg items-center justify-center hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors"
              onClick={() => alert("Theme switching is currently unavailable.")}
              aria-label="Toggle theme"
            >
              <span className="material-symbols-outlined text-[20px] lg:text-[18px]">light_mode</span>
            </button>
            <button
              className="w-9 h-9 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center hover:bg-[#ffe5e5] hover:text-red-600 transition-colors"
              onClick={() => {
                localStorage.clear();
                setPortal('login');
              }}
              aria-label="Sign out"
              title="Sign out"
            >
              <span className="material-symbols-outlined text-[20px] lg:text-[18px]">logout</span>
            </button>
          </div>

          <div className="hidden sm:block h-4 w-px bg-[#c7c4d8]"></div>

          {/* Developer Profile */}
          <div className="flex items-center gap-3 pl-0.5 sm:pl-1">
            <div
              className="w-8 h-8 rounded-full border border-[#c7c4d8] bg-gradient-to-br from-[#eff4ff] to-[#e2dfff] text-[#3525cd] flex items-center justify-center font-bold text-xs ring-1 ring-[#c7c4d8] uppercase shrink-0"
              title={userData?.email || ''}
            >
              {(userData?.name || userData?.email || 'U').charAt(0)}
            </div>
            <div className="text-left leading-tight hidden lg:block">
              <p className="text-xs font-semibold text-[#0b1c30] truncate max-w-[150px]">
                {userData?.name || 'Unknown User'}
              </p>
              <p className="text-[11px] font-mono text-[#565e74] truncate max-w-[150px]" title={userData?.email || ''}>
                {userData?.email || 'no-email'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Switcher Sub-bar (Only on Workbench/My Tickets) */}
      {developerPage === 'workbench' && (
        <div className="bg-[#f8f9ff] border-t border-[#c7c4d8]/40 px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar touch-scroll py-0.5 w-full">
            <span className="text-[11px] font-mono text-[#565e74] uppercase tracking-wider whitespace-nowrap shrink-0">
              PROJECTS:
            </span>

            {jiraProjects.map((p) => {
              const isSelected = selectedProjectKey === p.key;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectKey(p.key)}
                  className={`flex items-center gap-2 px-3 py-1.5 sm:py-1 rounded-lg text-xs font-mono whitespace-nowrap shrink-0 shadow-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white border border-[#3525cd] text-[#3525cd] font-semibold ring-2 ring-[#3525cd]/10'
                      : 'bg-white border border-[#c7c4d8] text-[#565e74] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[15px]">folder_open</span>
                  <span className="text-[#0b1c30]">{p.name}</span>
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
