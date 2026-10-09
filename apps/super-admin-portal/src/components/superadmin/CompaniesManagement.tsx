import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../api/client';
import { EditCompanyModal } from '../common/EditCompanyModal';
import { ViewCompanyModal } from '../common/ViewCompanyModal';

interface CompaniesManagementProps {
  onOpenNewCompany: () => void;
}

export const CompaniesManagement: React.FC<CompaniesManagementProps> = ({ onOpenNewCompany }) => {
  const { updateCompanyStatus, setPortal, setSelectedTenantId, activeAgentsCount, licensePlans } = usePlatform();
  const queryClient = useQueryClient();
  const { data: companies = [], isLoading, error } = useQuery({
    queryKey: ['superAdminCompanies'],
    queryFn: api.superAdmin.getCompanies,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Suspended'>('All');
  const [tierFilter, setTierFilter] = useState('');
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [viewCompanyId, setViewCompanyId] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: api.superAdmin.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['superAdminCompanies'] });
    }
  });

  const filteredCompanies = companies.filter((c: any) => {
    const slug = c.slug || c.domain.split('.')[0];
    const tier = c.licensePlanTier || 'Enterprise';
    
    const matchesSearch =
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.domain || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (slug || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status.toUpperCase() === statusFilter.toUpperCase();
    const matchesTier = !tierFilter || tier.includes(tierFilter);
    return matchesSearch && matchesStatus && matchesTier;
  });

  const totalAlloc = companies.reduce((acc: number, c: any) => {
    const plan = licensePlans?.find(p => p.name === c.licensePlanTier);
    return acc + (plan?.seatLimitNum || c.allocated_seats || 20);
  }, 0);

  const totalUsed = companies.reduce((acc: number, c: any) => {
    return acc + (c.usedLicenses || Math.floor((c.allocated_seats || 20) * 0.75));
  }, 0);

  const utilization = Math.round((totalUsed / Math.max(1, totalAlloc)) * 100);
  
  const dynamicActiveAgents = companies.reduce((acc: number, c: any) => {
    const plan = licensePlans?.find(p => p.name === c.licensePlanTier);
    const concurrency = parseInt((plan?.agentConcurrency || '5').split(' ')[0]);
    return acc + (c.activeAgents || Math.floor(concurrency * 20));
  }, 0);

  const suspendedCount = companies.filter((c: any) => c.status.toUpperCase() === 'SUSPENDED').length;

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#f8f9ff] flex flex-col gap-5 sm:gap-6 max-w-7xl w-full mx-auto">
      {/* Header Title & Primary Operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Companies & Tenant Management</h1>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-[#dce9ff] text-[#3525cd] font-semibold border border-[#d3e4fe]">
              Arch §8 Active
            </span>
          </div>
          <p className="text-sm text-[#565e74] mt-0.5">
            Manage registered enterprise client organizations, license entitlements, and status.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              const headers = "Name,Domain,Slug,Plan,UsedLicenses,TotalLicenses,Status\n";
              const rows = companies.map((c: any) => `"${c.name}","${c.domain}","${c.slug || c.domain.split('.')[0]}","${c.licensePlanTier || 'Enterprise'}",${c.usedLicenses || 0},${c.totalLicenses || 20},"${c.status}"`).join("\n");
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'codeagent_tenants.csv';
              a.click();
            }}
            className="h-8 px-3 rounded-lg border border-[#c7c4d8]/80 bg-white text-[#0b1c30] hover:bg-[#eff4ff] text-xs font-mono font-medium flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenNewCompany}
            className="h-8 px-3.5 rounded-lg bg-[#4f46e5] hover:bg-[#3525cd] text-white text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.99] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Top KPI Summary Bento Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Companies */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#565e74]">Total Companies</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#3525cd]">
              <span className="material-symbols-outlined text-[18px]">domain</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0b1c30]">{companies.length}</span>
            <span className="flex items-center text-xs font-mono text-[#006e4b] bg-[#dce9ff] px-1.5 py-0.5 rounded font-medium">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
              +12% MoM
            </span>
          </div>
          <div className="mt-3 text-xs text-[#565e74] flex items-center justify-between border-t border-[#c7c4d8]/20 pt-2 font-mono">
            <span>Global Multi-Tenant Hub</span>
            <span className="text-[#777587]">100% isol.</span>
          </div>
        </div>

        {/* Active Licenses Allocated */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#565e74]">Active Licenses Allocated</span>
            <span className="p-1.5 rounded-lg bg-[#eff4ff] text-[#3525cd]">
              <span className="material-symbols-outlined text-[18px]">badge</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#0b1c30]">{totalUsed.toLocaleString()}</span>
            <span className="text-sm font-sans text-[#777587]">/ {totalAlloc.toLocaleString()}</span>
          </div>
          <div className="mt-3">
            <div className="w-full bg-[#d3e4fe] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#4f46e5] h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, utilization)}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-1 text-[11px] font-mono text-[#777587]">
              <span>{utilization}% Utilization</span>
              <span>{(totalAlloc - totalUsed).toLocaleString()} Remaining</span>
            </div>
          </div>
        </div>

        {/* Active Coding Agents Executing */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#565e74]">Active Coding Agents</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#0b1c30]">{dynamicActiveAgents}</span>
            <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              running
            </span>
          </div>
          <div className="mt-3 text-xs text-[#565e74] flex items-center justify-between border-t border-[#c7c4d8]/20 pt-2 font-mono">
            <span>Streaming Git Diffs</span>
            <span className="text-[#777587]">~4.8 tokens/ms</span>
          </div>
        </div>

        {/* Suspended Tenants */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#565e74]">Suspended Tenants</span>
            <span className="p-1.5 rounded-lg bg-rose-50 text-[#ba1a1a]">
              <span className="material-symbols-outlined text-[18px]">warning</span>
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#ba1a1a]">{suspendedCount}</span>
            <span className="text-xs font-mono text-[#ba1a1a] bg-[#ffdad6]/60 px-1.5 py-0.5 rounded font-medium">
              flagged
            </span>
          </div>
          <div className="mt-3 text-xs text-[#565e74] flex items-center justify-between border-t border-[#c7c4d8]/20 pt-2">
            <span>Quota breaches or expired</span>
            <button
              onClick={() => setStatusFilter('Suspended')}
              className="text-[#3525cd] hover:underline text-xs font-mono cursor-pointer"
            >
              Review logs
            </button>
          </div>
        </div>
      </div>

      {/* Companies Data Table & Filtration Card */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
        {/* Table Control Toolbar */}
        <div className="p-4 border-b border-[#c7c4d8]/40 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#f8f9ff]">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative w-72">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#777587] text-[16px]">
                search
              </span>
              <input
                type="text"
                placeholder="Search by company name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#c7c4d8] rounded-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center p-0.5 bg-[#eff4ff] rounded-lg border border-[#c7c4d8]/50 text-xs font-mono">
              {(['All', 'Active', 'Suspended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    statusFilter === status
                      ? 'bg-white text-[#0b1c30] font-semibold shadow-xs'
                      : 'text-[#565e74] hover:text-[#0b1c30]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* License Plan Dropdown Filter */}
            <div className="relative">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="h-8 pl-2.5 pr-8 text-xs font-mono bg-white border border-[#c7c4d8] rounded-lg text-[#0b1c30] focus:outline-none focus:border-[#3525cd]"
              >
                <option value="">All License Tiers</option>
                <option value="20">20 Dev Plan</option>
                <option value="50">50 Dev Plan</option>
                <option value="100">Enterprise 100</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('All');
                setTierFilter('');
              }}
              className="h-8 px-2.5 text-xs font-mono text-[#565e74] hover:text-[#0b1c30] border border-[#c7c4d8] rounded-lg bg-white hover:bg-[#eff4ff] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">refresh</span>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto min-w-full">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c7c4d8]/40 text-[11px] font-mono text-[#565e74] tracking-wider uppercase">
                <th className="py-2.5 px-4 font-semibold">Company Name</th>
                <th className="py-2.5 px-4 font-semibold">Domain</th>
                <th className="py-2.5 px-4 font-semibold">License Plan Tier</th>
                <th className="py-2.5 px-4 font-semibold">Used / Total Licenses</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#dce9ff]/40 text-xs">
              {filteredCompanies.map((comp: any) => {
                const used = comp.usedLicenses || 0;
                const total = comp.totalLicenses || 20;
                const pct = Math.round((used / total) * 100);
                const isFull = used >= total;
                const isSuspended = comp.status.toUpperCase() === 'SUSPENDED';
                const slug = comp.slug || comp.domain.split('.')[0];
                const tier = comp.licensePlanTier || 'Enterprise';

                return (
                  <tr
                    key={comp.id}
                    className={`hover:bg-[#f8f9ff] transition-colors group ${
                      isSuspended ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-semibold text-xs ${
                            isSuspended
                              ? 'bg-rose-100 border-rose-300 text-rose-800'
                              : 'bg-[#4f46e5]/10 border-[#4f46e5]/30 text-[#3525cd]'
                          }`}
                        >
                          {comp.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors text-left">
                            {comp.name}
                          </span>
                          <span className="font-mono text-[#777587] text-[11px]">{slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[#464555]">{comp.domain}</td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-[#eff4ff] text-[#464555] border border-[#c7c4d8]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4f46e5]"></span>
                        {tier}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 w-36">
                        <div className="flex justify-between items-center text-xs font-mono">
                          <span className={`font-medium ${isFull ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'}`}>
                            {used} / {total} {isFull && 'full'}
                          </span>
                          <span className={`text-[11px] ${isFull ? 'text-[#ba1a1a] font-bold' : 'text-[#777587]'}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="w-full bg-[#dce9ff] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${isFull ? 'bg-[#ba1a1a]' : 'bg-[#4f46e5]'}`}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-rose-50 text-rose-900 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => setViewCompanyId(comp.id)}
                          className="p-1 rounded text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View Company"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button
                          onClick={() => setEditCompanyId(comp.id)}
                          className="p-1 rounded text-orange-600 hover:text-orange-700 hover:bg-orange-50 transition-colors cursor-pointer"
                          title="Edit Company"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        {isSuspended ? (
                          <button
                            onClick={() => {
                              toast.promise(
                                api.superAdmin.updateCompany({ id: comp.id, data: { status: 'ACTIVE' } }),
                                {
                                  loading: 'Reactivating...',
                                  success: () => {
                                    queryClient.invalidateQueries({ queryKey: ['superAdminCompanies'] });
                                    return 'Company reactivated successfully!';
                                  },
                                  error: (err: any) => `Error: ${err.message}`
                                }
                              );
                            }}
                            className="p-1 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Reactivate Organization"
                          >
                            <span className="material-symbols-outlined text-[18px]">play_circle</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              toast.promise(
                                api.superAdmin.updateCompany({ id: comp.id, data: { status: 'SUSPENDED' } }),
                                {
                                  loading: 'Suspending...',
                                  success: () => {
                                    queryClient.invalidateQueries({ queryKey: ['superAdminCompanies'] });
                                    return 'Company suspended successfully!';
                                  },
                                  error: (err: any) => `Error: ${err.message}`
                                }
                              );
                            }}
                            className="p-1 rounded text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Suspend Organization"
                          >
                            <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="p-3 bg-[#f8f9ff] border-t border-[#c7c4d8]/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#777587] font-mono">
            <span>Showing {filteredCompanies.length} of {companies.length} registered companies</span>
          </div>
          <div className="flex items-center gap-1 font-mono">
            <button className="h-7 px-2 text-xs rounded border border-[#c7c4d8] bg-white text-[#777587] disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="h-7 w-7 text-xs rounded border border-[#3525cd] bg-[#3525cd] text-white font-medium">
              1
            </button>
            <button className="h-7 px-2 text-xs rounded border border-[#c7c4d8] bg-white text-[#0b1c30] hover:bg-[#eff4ff]">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Tenant Provisioning Pipeline Footer (Section 8 Verification) */}
      <div className="bg-[#eff4ff]/60 border border-[#c7c4d8]/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#dce9ff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">account_tree</span>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-[#0b1c30]">Tenant Provisioning Pipeline</h4>
            <p className="text-xs text-[#565e74]">
              Isolated Kubernetes namespaces, dedicated Redis broker queue, and secret vault initialized per organization.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs bg-white px-2.5 py-1 rounded border border-[#c7c4d8]/60 text-[#565e74]">
            TLS Encrypted Multi-Tenant Shards
          </span>
        </div>
      </div>
      <EditCompanyModal companyId={editCompanyId} onClose={() => setEditCompanyId(null)} />
      <ViewCompanyModal companyId={viewCompanyId} onClose={() => setViewCompanyId(null)} />
    </div>
  );
};
