import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import { usePlatform } from '../../context/PlatformContext';

export const EditCompanyModal: React.FC<{ companyId: number | null; onClose: () => void }> = ({ companyId, onClose }) => {
  const queryClient = useQueryClient();
  const { licensePlans } = usePlatform();
  const { data: company, isLoading } = useQuery({
    queryKey: ['superAdminCompany', companyId],
    queryFn: () => api.superAdmin.getCompany(companyId!),
    enabled: !!companyId
  });

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [adminContact, setAdminContact] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [tempAdminName, setTempAdminName] = useState('');
  const [tempAdminEmail, setTempAdminEmail] = useState('');
  const [gitProvider, setGitProvider] = useState('');
  const [isOperational, setIsOperational] = useState(true);
  const [selectedTier, setSelectedTier] = useState('starter');
  const [allocatedSeats, setAllocatedSeats] = useState(20);
  const [concurrentLimit, setConcurrentLimit] = useState(5);
  const [monthlyRunCap, setMonthlyRunCap] = useState(15000);
  const [ssoEnforced, setSsoEnforced] = useState(false);
  const [mfaEnforced, setMfaEnforced] = useState(false);
  const [circuitBreaker, setCircuitBreaker] = useState(true);
  const [jiraSync, setJiraSync] = useState(false);
  
  const [copiedOrgId, setCopiedOrgId] = useState(false);

  useEffect(() => {
    if (company) {
      setName(company.name || '');
      setSlug(company.domain?.replace('.codeagent.io', '') || '');
      setAdminName(company.admin_name || '');
      setAdminEmail(company.admin_email || '');
      // Temporary fallback for missing admin data
      setAdminContact(company.admin_name && company.admin_email ? `${company.admin_name} (${company.admin_email})` : `Tenant Admin (admin@company.com)`);
      setGitProvider(company.git_provider || 'GitHub Enterprise (@techcorp-inc)');
      setIsOperational(company.status === 'ACTIVE');
      
      const tier = company.license_tier || '20 Dev Starter';
      const matchedPlan = licensePlans.find(p => p.name === tier);
      if (matchedPlan) setSelectedTier(matchedPlan.id);
      else setSelectedTier('');

      setAllocatedSeats(company.allocated_seats || 20);
      setConcurrentLimit(company.concurrent_limit || 5);
      setMonthlyRunCap(company.run_cap || 15000);
      setSsoEnforced(company.sso_enforced || false);
      setMfaEnforced(company.mfa_enforced || false);
      setCircuitBreaker(company.circuit_breaker ?? true);
      setJiraSync(company.jira_sync || false);
    }
  }, [company]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.superAdmin.updateCompany({ id: companyId!, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminCompanies'] });
      toast.success('Company details updated successfully!');
      onClose();
    },
    onError: (err: any) => {
      toast.error(`Error updating company: ${err.message}`);
    }
  });

  const handleCopyOrgId = () => {
    if (!companyId) return;
    navigator.clipboard.writeText(`tenant_${companyId}`);
    setCopiedOrgId(true);
    setTimeout(() => setCopiedOrgId(false), 2000);
  };

  const handleTierChange = (tierId: string) => {
    setSelectedTier(tierId);
    const plan = licensePlans.find(p => p.id === tierId);
    if (plan) {
      setAllocatedSeats(plan.seatLimitNum);
      setConcurrentLimit(parseInt(plan.agentConcurrency.toString()) || 5);
      setMonthlyRunCap(plan.seatLimitNum * 1000);
    }
  };

  const handleSave = () => {
    const plan = licensePlans.find(p => p.id === selectedTier) || licensePlans[0];
    updateMutation.mutate({
      name,
      domain: slug.includes('.codeagent.io') ? slug : `${slug}.codeagent.io`,
      admin_name: adminName,
      admin_email: adminEmail,
      status: isOperational ? 'ACTIVE' : 'SUSPENDED',
      git_provider: gitProvider,
      license_id: plan ? parseInt(plan.id) : undefined,
      license_tier: plan?.name,
      allocated_seats: allocatedSeats,
      concurrent_limit: concurrentLimit,
      run_cap: monthlyRunCap,
      sso_enforced: ssoEnforced,
      mfa_enforced: mfaEnforced,
      circuit_breaker: circuitBreaker,
      jira_sync: jiraSync
    });
  };

  if (!companyId) return null;
  if (isLoading) return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm"><div className="bg-white p-6 rounded-lg text-black font-semibold">Loading...</div></div>;

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
              <span className="material-symbols-outlined text-[20px]">domain_verification</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-semibold text-[#0b1c30] tracking-tight">Edit Company Details</h2>
                <span className="px-2 py-0.5 text-[11px] font-mono bg-[#eff4ff] text-[#565e74] rounded uppercase tracking-wider font-semibold border border-[#c7c4d8]/60">
                  TENANT CONFIGURATION & STATUS
                </span>
              </div>
              <p className="text-[12px] text-[#565e74] mt-0.5">
                Manage root organization settings, seat allocations, LangGraph guardrails, and tenant lifecycle state.
              </p>
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
                        <span className="w-1.5 h-1.5 rounded-full bg-[#005338] animate-pulse"></span>
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
                      <button
                        onClick={handleCopyOrgId}
                        className="hover:text-[#3525cd] ml-0.5 cursor-pointer"
                        title="Copy Org ID"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedOrgId ? 'check' : 'content_copy'}
                        </span>
                      </button>
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
                  onClick={() => setIsOperational(!isOperational)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

            {/* Architecture Flow Alert Ribbon */}
            <div className="mt-3.5 p-2.5 bg-[#eff4ff] border border-[#c7c4d8]/60 rounded-lg flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[#565e74] text-[18px] mt-0.5 shrink-0">info</span>
              <div className="text-[12px] text-[#464555] leading-relaxed">
                <span className="font-semibold text-[#0b1c30]">Company Suspension Flow: </span>
                When suspended by Super Admin, all Company Admins & Developers will encounter an{' '}
                <code className="font-mono bg-white px-1 py-0.5 rounded text-[#ba1a1a] border border-[#c7c4d8]/60">
                  Access Denied
                </code>{' '}
                banner, terminating active browser sessions and immediately pausing autonomous agent execution threads.
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
              <span className="text-[11px] font-mono text-[#565e74]">Scope: Global Metadata</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Company Legal Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                  Company Legal Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-8 px-2.5 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] text-[#0b1c30]"
                  type="text"
                />
                <p className="text-[11px] text-[#565e74]">Official commercial entity name displayed on invoices.</p>
              </div>

              {/* Workspace Domain Slug */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                    Workspace Domain Slug
                  </label>
                  <span className="text-[11px] font-mono text-[#005338] flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span> Verified SSL Active
                  </span>
                </div>
                <div className="flex rounded-lg border border-[#c7c4d8]/80 focus-within:border-[#3525cd] focus-within:ring-1 focus-within:ring-[#3525cd] overflow-hidden h-8">
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-2.5 text-[13px] font-mono bg-white border-0 focus:outline-none text-[#0b1c30]"
                    type="text"
                  />
                  <span className="inline-flex items-center px-3 bg-[#eff4ff] text-[#565e74] text-[11px] font-mono border-l border-[#c7c4d8]/80">
                    .codeagent.io
                  </span>
                </div>
                <p className="text-[11px] text-[#565e74]">Route: https://{slug}.codeagent.io</p>
              </div>

              {/* Primary Admin Contact */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                    Primary Admin Contact
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTempAdminName(adminName);
                      setTempAdminEmail(adminEmail);
                      setShowReassignModal(true);
                    }}
                    className="text-[11px] font-mono text-[#3525cd] hover:underline cursor-pointer"
                  >
                    Reassign Primary Admin
                  </button>
                </div>
                <div className="relative">
                  <input
                    value={adminContact}
                    onChange={(e) => setAdminContact(e.target.value)}
                    className="w-full h-8 pl-8 pr-2.5 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] text-[#0b1c30]"
                    type="text"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-[#565e74]">
                    person
                  </span>
                </div>
                <p className="text-[11px] text-[#565e74]">Holds the tenant root ownership token & receives audit alerts.</p>
              </div>

              {/* Git Provider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-mono text-[#565e74] uppercase tracking-wider">
                    Primary Stack / Git Provider
                  </label>
                  <span className="text-[11px] font-mono text-[#005338] flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#005338]"></span> Connected
                  </span>
                </div>
                <div className="relative">
                  <select
                    value={gitProvider}
                    onChange={(e) => setGitProvider(e.target.value)}
                    className="w-full h-8 pl-8 pr-8 text-[13px] bg-white rounded-lg border border-[#c7c4d8]/80 focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] text-[#0b1c30] appearance-none"
                  >
                    <option value="GitHub Enterprise (@techcorp-inc)">GitHub Enterprise (@techcorp-inc)</option>
                    <option value="GitHub Enterprise (@innosoft-labs)">GitHub Enterprise (@innosoft-labs)</option>
                    <option value="GitLab Self-Managed (gitlab.techcorp.internal)">GitLab Self-Managed</option>
                    <option value="Bitbucket Cloud (workspace: techcorp)">Bitbucket Cloud</option>
                  </select>
                  <span className="material-symbols-outlined absolute left-2 top-2 text-[16px] text-[#565e74]">
                    integration_instructions
                  </span>
                  <span className="material-symbols-outlined absolute right-2 top-2 text-[16px] text-[#565e74] pointer-events-none">
                    expand_more
                  </span>
                </div>
                <p className="text-[11px] text-[#565e74]">Grants agent permissions for automated PR commits & code diffs.</p>
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
                <p className="text-[11px] text-[#565e74]">Configure subscription tiers and hardware compute bounds.</p>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-[#565e74]">Active Tier:</span>
                <span className="font-mono text-[12px] font-semibold text-[#3525cd] ml-1">
                  {licensePlans.find(p => p.id === selectedTier)?.name || 'None'}
                </span>
              </div>
            </div>

            {/* Tier Cards Picker */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {licensePlans.map((plan) => (
                <label
                  key={plan.id}
                  onClick={() => handleTierChange(plan.id)}
                  className={`relative flex flex-col p-3 rounded-xl cursor-pointer shadow-xs transition-all ${
                    selectedTier === plan.id || (!selectedTier && licensePlans[0]?.id === plan.id)
                      ? 'border-2 border-[#3525cd] bg-[#e2dfff]/20 ring-1 ring-[#3525cd]'
                      : 'border border-[#c7c4d8]/80 bg-white hover:bg-[#eff4ff]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-mono font-bold text-[#0b1c30]">{plan.name}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedTier === plan.id || (!selectedTier && licensePlans[0]?.id === plan.id) ? 'border-4 border-[#3525cd] bg-white' : 'border-[#c7c4d8]'
                      }`}
                    ></span>
                  </div>
                  <div className="text-[18px] font-bold text-[#3525cd] mb-1">
                    ${plan.price}<span className="text-[11px] text-[#565e74] font-normal"> /{plan.billingPeriod}</span>
                  </div>
                  <ul className="text-[11px] text-[#565e74] space-y-1 mt-1 font-mono">
                    <li className="flex items-center gap-1 text-[#0b1c30]">
                      <span className="material-symbols-outlined text-[14px] text-[#005338]">check</span> {plan.seatLimit}
                    </li>
                    <li className="flex items-center gap-1 text-[#0b1c30]">
                      <span className="material-symbols-outlined text-[14px] text-[#005338]">check</span> {plan.agentConcurrency}
                    </li>
                    <li className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-[#005338]">check</span> {plan.infrastructure}
                    </li>
                  </ul>
                </label>
              ))}
            </div>

            {/* Steppers & Quotas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {/* Stepper 1: Allocated Seats */}
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Allocated Seats</span>
                  <span className="text-[#3525cd] font-bold">
                    {usedSeats} / {allocatedSeats} in use
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setAllocatedSeats(Math.max(usedSeats, allocatedSeats - 5))}
                    className="w-7 h-7 bg-white border border-[#c7c4d8]/80 rounded flex items-center justify-center font-bold text-[#565e74] hover:text-[#0b1c30] hover:bg-white cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    value={allocatedSeats}
                    onChange={(e) => setAllocatedSeats(Number(e.target.value) || allocatedSeats)}
                    className="h-7 w-full text-center text-[13px] font-mono bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]"
                    type="number"
                  />
                  <button
                    type="button"
                    onClick={() => setAllocatedSeats(allocatedSeats + 5)}
                    className="w-7 h-7 bg-white border border-[#c7c4d8]/80 rounded flex items-center justify-center font-bold text-[#565e74] hover:text-[#0b1c30] hover:bg-white cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <div className="w-full bg-[#c7c4d8]/50 h-1.5 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-[#3525cd] h-full rounded-full transition-all duration-300"
                    style={{ width: `${seatPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Stepper 2: Concurrency Limit */}
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Concurrent Limit</span>
                  <span className="font-mono text-[#0b1c30] font-semibold">{concurrentLimit} workers</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setConcurrentLimit(Math.max(1, concurrentLimit - 1))}
                    className="w-7 h-7 bg-white border border-[#c7c4d8]/80 rounded flex items-center justify-center font-bold text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    value={concurrentLimit}
                    onChange={(e) => setConcurrentLimit(Number(e.target.value) || concurrentLimit)}
                    className="h-7 w-full text-center text-[13px] font-mono bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]"
                    type="number"
                  />
                  <button
                    type="button"
                    onClick={() => setConcurrentLimit(concurrentLimit + 1)}
                    className="w-7 h-7 bg-white border border-[#c7c4d8]/80 rounded flex items-center justify-center font-bold text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <p className="text-[11px] text-[#565e74] font-mono mt-1">LangGraph node parallel factor</p>
              </div>

              {/* Stepper 3: Monthly Agent Run Cap */}
              <div className="p-3 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/60 space-y-1">
                <div className="flex justify-between items-center text-[11px] font-mono">
                  <span className="text-[#565e74] font-semibold uppercase">Run Cap (90% Alert)</span>
                  <span className="font-mono text-[#0b1c30] font-semibold">
                    {monthlyRunCap.toLocaleString()} runs
                  </span>
                </div>
                <div className="relative mt-1">
                  <input
                    value={monthlyRunCap}
                    onChange={(e) => setMonthlyRunCap(Number(e.target.value) || monthlyRunCap)}
                    className="h-7 w-full text-[13px] font-mono pl-2 pr-16 bg-white rounded border border-[#c7c4d8]/80 text-[#0b1c30]"
                    type="number"
                  />
                  <span className="absolute right-2 top-1.5 text-[11px] font-mono text-[#565e74]">runs/mo</span>
                </div>
                <p className="text-[11px] text-[#005338] font-mono mt-1">
                  Current: {currentMonthlyRuns.toLocaleString()} runs ({runPercentage}%)
                </p>
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
              <span className="text-[11px] font-mono text-[#005338] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[14px]">lock</span> ISO-27001 Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Toggle 1: SSO */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80 hover:bg-[#eff4ff] transition-colors">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span>Enforce Tenant SSO / SAML</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#dae2fd] text-[#5c647a] rounded font-mono">
                      Okta
                    </span>
                  </span>
                  <p className="text-[11px] text-[#565e74] mt-0.5">
                    Restrict user authentication strictly through corporate identity provider.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSsoEnforced(!ssoEnforced)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    ssoEnforced ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      ssoEnforced ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: MFA */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80 hover:bg-[#eff4ff] transition-colors">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30]">Mandatory Multi-Factor (MFA)</span>
                  <p className="text-[11px] text-[#565e74] mt-0.5">
                    Require hardware keys (FIDO2) or TOTP authenticator app on all seat sessions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMfaEnforced(!mfaEnforced)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    mfaEnforced ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      mfaEnforced ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Circuit Breaker */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80 hover:bg-[#eff4ff] transition-colors">
                <div className="pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-semibold text-[#0b1c30]">LangGraph Circuit-Breaker</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#6ffbbe]/50 text-[#005338] font-bold">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-[#565e74] mt-0.5">
                    Auto-halts agent execution loops if runaway token spend exceeds $25 in a single session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCircuitBreaker(!circuitBreaker)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    circuitBreaker ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      circuitBreaker ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Jira Sync */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-[#c7c4d8]/80 hover:bg-[#eff4ff] transition-colors">
                <div className="pr-2">
                  <span className="text-[13px] font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span>Webhook & Jira Event Sync</span>
                    <span className="font-mono text-[10px] text-[#565e74] bg-[#eff4ff] px-1 rounded">2-way</span>
                  </span>
                  <p className="text-[11px] text-[#565e74] mt-0.5">
                    Stream agent branch creations, test pass logs, and PR links directly into Jira tickets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setJiraSync(!jiraSync)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    jiraSync ? 'bg-[#3525cd]' : 'bg-[#bec6e0]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      jiraSync ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 5. DANGER ZONE / TENANT LIFECYCLE */}
          <div className="bg-white border border-[#ffdad6] rounded-xl p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#ffdad6]">
              <div className="flex items-center gap-2 text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[20px]">warning</span>
                <h4 className="text-[15px] font-semibold">Danger Zone & Workspace Suspension</h4>
              </div>
              <span className="text-[11px] font-mono text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-0.5 rounded font-medium">
                Elevated Super Admin Action
              </span>
            </div>

            <div className="mt-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4 p-3.5 rounded-lg bg-[#eff4ff] border border-[#ba1a1a]/20">
              <div className="space-y-0.5 max-w-xl">
                <div className="text-[13px] font-semibold text-[#0b1c30]">
                  {isOperational ? `Suspend ${name} Workspace` : `Reactivate ${name} Workspace`}
                </div>
                <p className="text-[11px] text-[#565e74] leading-relaxed">
                  Immediately terminates developer API tokens, suspends continuous LangGraph agent workers, and
                  displays an <span className="font-medium text-[#ba1a1a]">Access Denied (Company Suspended)</span> prompt
                  upon tenant login attempts. Data remains encrypted on disk.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOperational(!isOperational)}
                className={`px-3 py-1.5 text-[12px] font-medium rounded transition-colors shrink-0 flex items-center gap-1.5 shadow-xs cursor-pointer ${
                  isOperational
                    ? 'text-[#ba1a1a] bg-white border border-[#ba1a1a] hover:bg-[#ffdad6]'
                    : 'text-[#005338] bg-white border border-[#005338] hover:bg-emerald-50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isOperational ? 'block' : 'check_circle'}
                </span>
                <span>{isOperational ? 'Suspend Workspace' : 'Reactivate Workspace'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Sticky Actions */}
        <div className="px-6 py-3.5 border-t border-[#c7c4d8]/60 bg-white flex items-center justify-between sticky bottom-0 z-10 shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#565e74]">
            <span className="material-symbols-outlined text-[15px]">history</span>
            <span>
              Last modified by <span className="font-mono text-[#0b1c30] font-semibold">root.admin</span> Just now
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 h-9 text-[13px] font-medium text-[#565e74] hover:text-[#0b1c30] hover:bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/80 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="px-5 h-9 text-[13px] font-semibold bg-[#3525cd] hover:bg-[#4d44e3] text-white rounded-lg flex items-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">check</span>
              <span>{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {showReassignModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#213145]/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#c7c4d8] max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]">
              <h3 className="text-base font-semibold text-[#0b1c30]">Reassign Primary Admin</h3>
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="text-[#777587] hover:text-black cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">New Admin Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={tempAdminName}
                  onChange={(e) => setTempAdminName(e.target.value)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs text-[#0b1c30] focus:border-[#3525cd] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">New Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="alex@company.com"
                  value={tempAdminEmail}
                  onChange={(e) => setTempAdminEmail(e.target.value)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs text-[#0b1c30] focus:border-[#3525cd] focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#c7c4d8]">
              <button
                type="button"
                onClick={() => setShowReassignModal(false)}
                className="px-3 py-1.5 border border-[#c7c4d8] rounded text-xs text-[#565e74] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminName(tempAdminName);
                  setAdminEmail(tempAdminEmail);
                  setAdminContact(`${tempAdminName} (${tempAdminEmail})`);
                  setShowReassignModal(false);
                }}
                className="px-4 py-1.5 bg-[#3525cd] text-white rounded text-xs font-semibold cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
