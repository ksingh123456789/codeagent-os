import React from 'react';
import { usePlatform } from '../../context/PlatformContext';

export const GlobalPortalSwitcher: React.FC = () => {
  const {
    portal,
    setPortal,
    companies,
    selectedTenantId,
    setSelectedTenantId,
    activeAgentsCount,
    resetDemoState,
    triggerAgentRun,
    agentRunningTicketKey
  } = usePlatform();

  return (
    <div className="bg-gradient-to-r from-[#0b1c30] via-[#131b2e] to-[#0f172a] text-white border-b border-[#213145] text-xs py-1.5 px-4 flex flex-wrap items-center justify-between gap-3 shadow-md z-40 select-none sticky top-0">
      {/* Left: Portals Navigation Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 mr-2 pr-3 border-r border-[#334155]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-tight text-slate-200 uppercase text-[10px] font-mono">
            SYNCED MESH
          </span>
        </div>

        <div className="flex items-center bg-[#1e293b]/90 rounded-lg p-0.5 border border-[#334155]/80">
          {portal === 'super-admin' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-[#4f46e5] text-white shadow-sm">
              <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
              <span>Super Admin Console</span>
              <span className="text-[9px] bg-black/30 px-1 rounded text-slate-300">All Orgs</span>
            </div>
          )}

          {portal === 'tenant-admin' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-[#4f46e5] text-white shadow-sm">
              <span className="material-symbols-outlined text-[15px]">corporate_fare</span>
              <span>Tenant Admin Portal</span>
              <span className="text-[9px] bg-emerald-900/60 text-emerald-300 px-1 rounded border border-emerald-500/30">
                Quotas
              </span>
            </div>
          )}

          {portal === 'developer' && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-[#4f46e5] text-white shadow-sm">
              <span className="material-symbols-outlined text-[15px]">terminal</span>
              <span>Developer Workbench</span>
              <span className="text-[9px] bg-amber-900/60 text-amber-300 px-1 rounded border border-amber-500/30">
                AI Agent
              </span>
            </div>
          )}

          <button
            onClick={() => setPortal('login')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-all text-slate-400 hover:text-white hover:bg-slate-800/60 ml-2"
          >
            <span className="material-symbols-outlined text-[15px]">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Right: Tenant Switcher & Quick Demo Controls */}
      <div className="flex items-center gap-3">
        {/* Active Tenant Context Switcher */}
        {portal !== 'super-admin' && portal !== 'login' && (
          <div className="flex items-center gap-1.5 bg-[#1e293b] px-2 py-0.5 rounded border border-[#334155]">
            <span className="text-slate-400 text-[10px] uppercase font-mono">Tenant:</span>
            <select
              value={selectedTenantId}
              onChange={(e) => setSelectedTenantId(e.target.value)}
              className="bg-transparent text-white text-[11px] font-medium focus:outline-none cursor-pointer py-0.5"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#1e293b] text-white">
                  {c.name} ({c.licensePlanTier})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="hidden xl:flex items-center gap-2 text-slate-300 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>{activeAgentsCount} Agents Online</span>
          <span>·</span>
          <span>FastAPI + LangGraph</span>
        </div>

        {/* Quick Simulation Trigger */}
        <button
          onClick={() => {
            setPortal('developer');
            triggerAgentRun(agentRunningTicketKey || 'PROJ-101');
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#4f46e5]/40 hover:bg-[#4f46e5] text-indigo-100 hover:text-white border border-indigo-400/40 text-[11px] transition-colors"
          title="Run LangGraph Agent simulation on active ticket"
        >
          <span className="material-symbols-outlined text-[14px]">play_arrow</span>
          <span>Simulate Agent Run</span>
        </button>

        <button
          onClick={resetDemoState}
          className="text-slate-400 hover:text-slate-200 text-[10px] font-mono underline"
          title="Reset sample data"
        >
          Reset Demo
        </button>
      </div>
    </div>
  );
};
