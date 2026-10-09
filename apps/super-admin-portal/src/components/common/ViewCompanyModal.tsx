import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/client';
import { usePlatform } from '../../context/PlatformContext';

export const ViewCompanyModal: React.FC<{ companyId: number | null; onClose: () => void }> = ({ companyId, onClose }) => {
  const { data: company, isLoading } = useQuery({
    queryKey: ['superAdminCompany', companyId],
    queryFn: () => api.superAdmin.getCompany(companyId!),
    enabled: !!companyId
  });

  const [copiedOrgId, setCopiedOrgId] = useState(false);
  const { licensePlans } = usePlatform();

  if (!companyId) return null;
  if (isLoading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm"><div className="bg-white p-6 rounded-lg text-black font-semibold">Loading...</div></div>;

  const name = company?.name || '';
  const slug = company?.domain?.replace('.codeagent.io', '') || '';
  const adminContact = company?.admin_name && company?.admin_email ? `${company.admin_name} (${company.admin_email})` : `Tenant Admin (admin@company.com)`;
  const gitProvider = company?.git_provider || 'GitHub Enterprise (@techcorp-inc)';
  const isOperational = company?.status === 'ACTIVE';
  
  let selectedTier = '';
  const tier = company?.license_tier || '20 Dev Starter';
  const matchedPlan = licensePlans.find(p => p.name === tier);
  if (matchedPlan) selectedTier = matchedPlan.id;
  
  const allocatedSeats = company?.allocated_seats || 20;
  const concurrentLimit = company?.concurrent_limit || 5;
  const monthlyRunCap = company?.run_cap || 15000;
  const ssoEnforced = company?.sso_enforced || false;
  const mfaEnforced = company?.mfa_enforced || false;
  const circuitBreaker = company?.circuit_breaker ?? true;
  const jiraSync = company?.jira_sync || false;

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText(`tenant_${companyId}`);
    setCopiedOrgId(true);
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const usedSeats = 1; // mocked
  const currentMonthlyRuns = 0; // mocked
  const runPercentage = Math.round((currentMonthlyRuns / monthlyRunCap) * 100) || 0;
  const seatPercentage = Math.min(100, Math.round((usedSeats / allocatedSeats) * 100)) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-2xl border border-[#c7c4d8]/80 flex flex-col max-h-[92vh] my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-3.5 border-b border-[#c7c4d8]/60 bg-white flex items-center justify-between sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-semibold text-[#0b1c30] tracking-tight">View Company Details</h2>
                <span className="px-2 py-0.5 text-[11px] font-mono bg-[#eff4ff] text-[#565e74] rounded uppercase tracking-wider font-semibold border border-[#c7c4d8]/60">
                  READ ONLY
                </span>
              </div>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
            title="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 bg-[#f8f9ff] custom-scrollbar">
          {/* 1. HEADER & QUICK STATUS STRIP */}
          <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c7c4d8]/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#e0e7ff] text-[#3730a3] font-bold text-[18px] flex items-center justify-center shadow-xs">
                  {name.substring(0, 2).toUpperCase() || 'NC'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[18px] font-bold text-[#0b1c30]">{name}</h3>
                    {isOperational ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#6ffbbe]/40 text-[#005338] border border-[#4edea3] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005338]"></span>
                        Operational
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-[#565e74]">
                    <div className="flex items-center gap-1">
                      <span>Org ID:</span>
                      <span className="font-mono text-[#0b1c30] bg-[#eff4ff] px-1.5 py-0.5 rounded border border-[#c7c4d8]/60">
                        tenant_{companyId}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operational Status Switch */}
              <div className="flex items-center gap-3 bg-[#eff4ff] px-3 py-2 rounded-lg border border-[#c7c4d8]/60">
                <div className="text-right">
                  <div className="text-[12px] font-mono text-[#0b1c30] font-semibold">Tenant State</div>
                  <div className={`text-[11px] font-medium ${isOperational ? 'text-[#005338]' : 'text-[#ba1a1a]'}`}>
                    {isOperational ? 'Active (Operational)' : 'Suspended (Blocked)'}
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  type="button"
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isOperational ? 'bg-[#005338]' : 'bg-[#bec6e0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isOperational ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 2. GENERAL INFORMATION & IDENTITY */}
          <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#c7c4d8]/60">
              <h4 className="text-[15px] font-semibold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[19px]">badge</span>
                <span>Identity & Workspace Connectivity</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                  Company Legal Name
                </label>
                <input
                  readOnly
                  value={name}
                  className="w-full h-8 px-2.5 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 text-[#0b1c30]"
                  type="text"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                    Workspace Domain Slug
                  </label>
                </div>
                <div className="flex rounded-lg border border-[#c7c4d8]/80 overflow-hidden h-8">
                  <input
                    readOnly
                    value={slug}
                    className="flex-1 px-2.5 text-[13px] font-mono bg-white border-0 text-[#0b1c30]"
                    type="text"
                  />
                  <span className="inline-flex items-center px-3 bg-[#eff4ff] text-[#565e74] text-[11px] font-mono border-l border-[#c7c4d8]/80">
                    .codeagent.io
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                  Primary Admin Contact
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value={adminContact}
                    className="w-full h-8 pl-8 pr-2.5 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 text-[#0b1c30]"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-[#565e74]">
                    person
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                  Primary Stack / Git Provider
                </label>
                <div className="relative">
                  <input
                    readOnly
                    value={gitProvider}
                    className="w-full h-8 pl-8 pr-8 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 text-[#0b1c30]"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-[#565e74]">
                    integration_instructions
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. LICENSE PLAN & RESOURCE QUOTAS */}
          <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#c7c4d8]/60">
              <div>
                <h4 className="text-[15px] font-semibold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[19px]">payments</span>
                  <span>License Plan & Concurrency Quotas</span>
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {licensePlans.map(plan => (
                <label key={plan.id} className={`relative flex flex-col p-3 rounded-xl shadow-xs transition-all ${
                    selectedTier === plan.id || (!selectedTier && licensePlans[0]?.id === plan.id)
                      ? 'border-2 border-[#3525cd] bg-[#e2dfff]/20 ring-1 ring-[#3525cd]'
                      : 'border border-[#c7c4d8]/80 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-mono font-bold text-[#0b1c30]">{plan.name}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedTier === plan.id || (!selectedTier && licensePlans[0]?.id === plan.id) ? 'border-4 border-[#3525cd] bg-white' : 'border-[#c7c4d8]'}`}></span>
                  </div>
                  <div className="text-[18px] font-bold text-[#3525cd] mb-1">
                    ${plan.price}<span className="text-[11px] text-[#565e74] font-normal"> /{plan.billingPeriod}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Allocated Seats</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input readOnly value={allocatedSeats} className="h-7 w-full text-center text-[13px] font-mono bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]" />
                </div>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Concurrent Limit</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input readOnly value={concurrentLimit} className="h-7 w-full text-center text-[13px] font-mono bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]" />
                </div>
              </div>
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Run Cap (90% Alert)</span>
                </div>
                <div className="relative mt-1">
                  <input readOnly value={monthlyRunCap} className="h-7 w-full text-[13px] font-mono pl-2 bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]" />
                </div>
              </div>
            </div>
          </div>

          {/* 4. GUARDRAILS & SECURITY POLICIES */}
          <div className="bg-white border border-[#c7c4d8]/80 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#c7c4d8]/60">
              <h4 className="text-[15px] font-semibold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-[19px]">security</span>
                <span>Governance & Execution Circuit-Breakers</span>
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span>Enforce Tenant SSO / SAML</span>
                  </span>
                </div>
                <button type="button" className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${ssoEnforced ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ssoEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30]">Mandatory Multi-Factor (MFA)</span>
                </div>
                <button type="button" className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${mfaEnforced ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaEnforced ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30]">LangGraph Circuit-Breaker</span>
                </div>
                <button type="button" className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${circuitBreaker ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${circuitBreaker ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span>Webhook & Jira Event Sync</span>
                  </span>
                </div>
                <button type="button" className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${jiraSync ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'}`}>
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${jiraSync ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Sticky Actions */}
        <div className="px-6 py-3.5 border-t border-[#c7c4d8]/60 bg-white flex items-center justify-end sticky bottom-0 z-10 shrink-0">
          <button
            onClick={onClose}
            className="px-6 h-9 text-[13px] font-medium text-[#565e74] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/80 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
