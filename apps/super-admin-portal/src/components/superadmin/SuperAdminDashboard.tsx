import React from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { EditCompanyModal } from '../common/EditCompanyModal';
import { ViewCompanyModal } from '../common/ViewCompanyModal';

interface SuperAdminDashboardProps {
  onOpenNewCompany: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onOpenNewCompany }) => {
  const {
    setSuperAdminPage,
    setPortal,
    setSelectedTenantId,
    activeAgentsCount,
    licensePlans
  } = usePlatform();
  const queryClient = useQueryClient();
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null);
  const [viewCompanyId, setViewCompanyId] = useState<number | null>(null);

  const { data: dashboardData } = useQuery({
    queryKey: ['superAdminDashboard'],
    queryFn: api.superAdmin.getDashboard,
  });

  const { data: companies = [] } = useQuery({
    queryKey: ['superAdminCompanies'],
    queryFn: api.superAdmin.getCompanies,
  });

  const metrics = dashboardData?.metrics || {
    total_companies: 0,
    active_companies: 0,
    suspended_companies: 0,
    total_developers: 0,
    active_licenses: 0,
    licenses_used: 0
  };

  const totalSeatsAllocated = companies.reduce((acc: number, c: any) => acc + (c.usedLicenses || 0), 0);
  const totalCapacity = companies.reduce((acc: number, c: any) => acc + (c.totalLicenses || 20), 0);
  const capacityPercent = Math.round((totalSeatsAllocated / Math.max(1, totalCapacity)) * 100);

  const monthlyMRR = companies.reduce((acc: number, comp: any) => {
    const plan = licensePlans?.find((p: any) => p.name === comp.licensePlanTier);
    return acc + (plan?.price || 0);
  }, 0);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 space-y-5 sm:space-y-6 max-w-7xl w-full mx-auto">
      {/* Overview Stats (4 Metric Cards) */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Companies */}
          <div className="bg-white rounded-xl border border-[#c7c4d8]/60 p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-[#565e74]">
              <span className="text-xs font-mono font-medium">Total Companies</span>
              <span className="material-symbols-outlined text-[18px] text-[#777587]">domain</span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">{companies.length}</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+12% MoM</span>
              <span className="text-[#565e74] font-sans ml-1">vs last month</span>
            </div>
          </div>

          {/* Card 2: Active Developer Seats */}
          <div className="bg-white rounded-xl border border-[#c7c4d8]/60 p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-[#565e74]">
              <span className="text-xs font-mono font-medium">Active Developer Seats</span>
              <span className="material-symbols-outlined text-[18px] text-[#777587]">group</span>
            </div>
            <div className="my-2">
              <div className="text-2xl font-bold text-[#0b1c30]">
                {totalSeatsAllocated.toLocaleString()} <span className="text-sm font-normal text-[#565e74]">/ {totalCapacity.toLocaleString()}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-1 text-[#565e74]">
                <span>Capacity</span>
                <span className="font-semibold text-[#0b1c30]">{capacityPercent}%</span>
              </div>
              <div className="w-full bg-[#e5eeff] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#4f46e5] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, capacityPercent)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Card 3: Active Agent Runs */}
          <div className="bg-white rounded-xl border border-[#c7c4d8]/60 p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-[#565e74]">
              <span className="text-xs font-mono font-medium">Active Agent Runs</span>
              <span className="material-symbols-outlined text-[18px] text-[#777587]">play_circle</span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">{activeAgentsCount}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Healthy running
              </span>
            </div>
          </div>

          {/* Card 4: Monthly Platform MRR */}
          <div className="bg-white rounded-xl border border-[#c7c4d8]/60 p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between text-[#565e74]">
              <span className="text-xs font-mono font-medium">Monthly Platform MRR</span>
              <span className="material-symbols-outlined text-[18px] text-[#777587]">payments</span>
            </div>
            <div className="my-2">
              <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">${monthlyMRR.toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span>+14.2% MoM</span>
              <span className="text-[#565e74] font-sans ml-1">recurring</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Row */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onOpenNewCompany}
            className="bg-white border border-[#c7c4d8]/60 hover:border-[#3525cd]/50 hover:bg-[#eff4ff]/60 transition-all p-4 rounded-xl text-left flex items-start gap-3 group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd] group-hover:bg-[#3525cd] group-hover:text-white transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">add_business</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                + Add New Company
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                Provision an isolated tenant environment & allocate initial quotas
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#777587] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>

          <button
            onClick={() => setSuperAdminPage('license-plans')}
            className="bg-white border border-[#c7c4d8]/60 hover:border-[#3525cd]/50 hover:bg-[#eff4ff]/60 transition-all p-4 rounded-xl text-left flex items-start gap-3 group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd] group-hover:bg-[#3525cd] group-hover:text-white transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">loyalty</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                Create License Plan
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                Configure seat tiers, agent runtime caps & enterprise SLA bundles
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#777587] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>

          <button
            onClick={() => setSuperAdminPage('settings')}
            className="bg-white border border-[#c7c4d8]/60 hover:border-[#3525cd]/50 hover:bg-[#eff4ff]/60 transition-all p-4 rounded-xl text-left flex items-start gap-3 group shadow-sm cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd] group-hover:bg-[#3525cd] group-hover:text-white transition-colors shrink-0">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-[#0b1c30] group-hover:text-[#3525cd] transition-colors">
                Configure Global Security
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                Manage SSO federations, global IP whitelists & mTLS certificates
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#777587] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Recent Tenant Activity */}
      <section className="gap-6 items-start">
        <div className="bg-white rounded-xl border border-[#c7c4d8]/60 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[#c7c4d8]/40 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#0b1c30]">Recent Tenant Activity</h2>
              <p className="text-xs text-[#565e74]">Real-time audit log of company-level provisioning and changes</p>
            </div>
            <button
              onClick={() => setSuperAdminPage('companies')}
              className="text-xs font-mono text-[#3525cd] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Companies
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
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
                {companies.slice(0, 10).map((comp: any) => {
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
        </div>


      </section>
      <EditCompanyModal companyId={editCompanyId} onClose={() => setEditCompanyId(null)} />
      <ViewCompanyModal companyId={viewCompanyId} onClose={() => setViewCompanyId(null)} />
    </div>
  );
};
