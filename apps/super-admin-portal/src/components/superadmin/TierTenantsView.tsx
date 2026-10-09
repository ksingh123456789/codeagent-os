import React, { useState } from 'react';
import { SubscriptionPlan, TenantCompany } from '../../types/platform';

interface TierTenantsViewProps {
  plan: SubscriptionPlan;
  tenants: TenantCompany[];
  onBackToPlans: () => void;
  onEditTierSpecs: (plan: SubscriptionPlan) => void;
  onImpersonateTenant: (tenant: TenantCompany) => void;
  onManageTenantQuotas: (tenant: TenantCompany) => void;
}

export const TierTenantsView: React.FC<TierTenantsViewProps> = ({
  plan,
  tenants,
  onBackToPlans,
  onEditTierSpecs,
  onImpersonateTenant,
  onManageTenantQuotas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExporting, setIsExporting] = useState(false);

  // Filter tenants
  const totalSeatsUsed = tenants.reduce((acc, t) => acc + (t.seatsAllocated || 0), 0);
  const totalSeatsAllocated = tenants.reduce((acc, t) => acc + (t.seatsMax || 0), 0);
  const totalActiveAgents = tenants.reduce((acc, t) => acc + (t.concurrencyLoad || 0), 0);

  const filteredTenants = tenants.filter((t) => {
    const matchesQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workspaceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.adminEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'healthy' && t.health === 'Healthy') ||
      (statusFilter === 'near_limit' && t.health === 'Upgrade Eligible') ||
      (statusFilter === 'throttled' && t.health === 'Over Quota');

    return matchesQuery && matchesStatus;
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        ['Company,WorkspaceID,AdminEmail,SeatsAllocated,Concurrency,Infrastructure,Health']
          .concat(
            tenants.map(
              (t) =>
                `"${t.name}","${t.workspaceId}","${t.adminEmail}","${t.seatsAllocated}/${t.seatsMax}","${t.concurrencyLoad}/${t.concurrencyMax}","${t.workerInfrastructure}","${t.health}"`
            )
          )
          .join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${plan.apiSlug}_tenants_export.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 600);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Sub-header Breadcrumb Bar */}
      <div className="bg-white border border-[#c7c4d8]/50 rounded-xl px-5 py-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBackToPlans}
            className="text-[#565e74] hover:text-[#3525cd] flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>License Plans</span>
          </button>
          <span className="text-[#c7c4d8]">/</span>
          <span className="font-semibold text-[#0b1c30] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3525cd] inline-block"></span>
            {plan.name}
          </span>
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-[#e2dfff] text-[#3525cd] ml-1">
            {plan.tier}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#eff4ff] border border-[#c7c4d8]/60 text-[11px]">
            <span className="text-[#565e74]">Stripe Plan ID:</span>
            <span className="font-mono text-[#0b1c30] font-semibold">{plan.apiSlug}</span>
          </div>
          <button
            onClick={() => onEditTierSpecs(plan)}
            className="h-8 px-3 rounded-lg border border-[#3525cd] text-[#3525cd] hover:bg-[#e2dfff]/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            <span>Edit Tier Specs</span>
          </button>
          <button
            onClick={() => alert(`Migrate Tenant In wizard initialized for ${plan.name}.`)}
            className="h-8 px-3 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>Migrate Tenant In</span>
          </button>
        </div>
      </div>

      {/* Hero Plan Banner with Quota Metrics */}
      <div className="bg-white border border-[#c7c4d8]/50 rounded-xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30]">
              {plan.name} — Subscribed Tenants
            </h1>
            <span className="text-xs font-mono text-[#565e74]">(${plan.monthlyPrice}/month)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#565e74] mt-1">
            Review quota utilization, seat allocations, and autonomous agent concurrency across all {plan.activeTenants} companies.
          </p>
        </div>

        {/* Quick KPI Chips */}
        <div className="flex flex-wrap items-center gap-6 lg:border-l lg:border-[#e5eeff] lg:pl-6">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#565e74] font-medium font-mono">
              Subscribed Tenants
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#0b1c30] font-mono mt-0.5">
              {plan.activeTenants} Companies
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#e5eeff]"></div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#565e74] font-medium font-mono">
              Total Seats Used
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#3525cd] font-mono mt-0.5">
              {totalSeatsUsed.toLocaleString()} / {totalSeatsAllocated.toLocaleString()}
            </div>
          </div>
          <div className="hidden sm:block h-10 w-px bg-[#e5eeff]"></div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#565e74] font-medium font-mono">
              Active Agent Runs
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#006e4b] font-mono mt-0.5">
              {totalActiveAgents.toLocaleString()} Concurrent
            </div>
          </div>
        </div>
      </div>

      {/* Filters, Search and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#c7c4d8]/50 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#565e74] text-base">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenant company name, workspace ID, or admin email..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-xs text-[#0b1c30] placeholder:text-[#565e74] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] focus:bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-xs text-[#0b1c30] focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
          >
            <option value="All">All Statuses</option>
            <option value="healthy">Healthy (Quota &lt; 85%)</option>
            <option value="near_limit">Near Quota Limit (&gt; 90%)</option>
            <option value="throttled">Over Quota / Throttled</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className="h-8 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] hover:bg-[#eff4ff] text-xs text-[#0b1c30] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {isExporting ? 'refresh' : 'download'}
            </span>
            <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
          </button>
          <button
            onClick={() => setSearchQuery('')}
            className="h-8 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] hover:bg-[#eff4ff] text-xs text-[#0b1c30] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">filter_list</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Tenants Listing Table with Live Quota gauges */}
      <div className="bg-white border border-[#c7c4d8]/50 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c7c4d8]/40 h-9">
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Tenant Company
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Subscribed Since
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Seats Allocated
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Agent Concurrency Load
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Worker Infrastructure
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase">
                  Health
                </th>
                <th className="px-5 text-[11px] font-mono font-semibold text-[#565e74] uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/30 text-xs text-[#0b1c30]">
              {filteredTenants.map((tenant) => {
                const isOver = tenant.seatsPercent >= 100;
                const isHigh = tenant.seatsPercent >= 90;

                return (
                  <tr key={tenant.id} className="hover:bg-[#f8f9ff] transition-colors h-14">
                    {/* Tenant Company */}
                    <td className="px-5">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center text-xs font-mono shadow-xs ${
                            tenant.avatarBgColor || 'bg-[#e2dfff]'
                          } ${tenant.avatarTextColor || 'text-[#3525cd]'}`}
                        >
                          {tenant.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0b1c30] flex items-center gap-2">
                            <span>{tenant.name}</span>
                            <span className="text-[11px] text-[#565e74] font-mono">
                              {tenant.workspaceId}
                            </span>
                          </div>
                          <div className="text-[11px] text-[#565e74] font-mono">{tenant.adminEmail}</div>
                        </div>
                      </div>
                    </td>

                    {/* Subscribed Since */}
                    <td className="px-5 text-[#565e74] text-xs font-mono">
                      {tenant.subscribedSince}
                    </td>

                    {/* Seats Allocated */}
                    <td className="px-5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-medium text-[#0b1c30]">
                            {tenant.seatsAllocated} / {tenant.seatsMax} seats
                          </span>
                          <span
                            className={`text-[11px] font-mono font-semibold ${
                              isOver ? 'text-[#ba1a1a]' : isHigh ? 'text-[#d97706]' : 'text-[#565e74]'
                            }`}
                          >
                            {tenant.seatsPercent}%
                          </span>
                        </div>
                        <div className="w-24 bg-[#e5eeff] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOver ? 'bg-[#ba1a1a]' : isHigh ? 'bg-[#3525cd]' : 'bg-[#3525cd]'
                            }`}
                            style={{ width: `${Math.min(100, tenant.seatsPercent)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Agent Concurrency Load */}
                    <td className="px-5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-medium text-[#0b1c30]">
                            {tenant.concurrencyLoad} / {tenant.concurrencyMax} concurrent
                          </span>
                          <span
                            className={`text-[10px] font-mono font-semibold ${
                              tenant.concurrencyStatus === 'Peaked'
                                ? 'text-amber-600'
                                : tenant.concurrencyStatus === 'Active'
                                ? 'text-[#006e4b]'
                                : 'text-[#565e74]'
                            }`}
                          >
                            {tenant.concurrencyStatus}
                          </span>
                        </div>
                        <div className="w-28 bg-[#e5eeff] rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              tenant.concurrencyStatus === 'Peaked'
                                ? 'bg-amber-500'
                                : 'bg-[#006e4b]'
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round((tenant.concurrencyLoad / tenant.concurrencyMax) * 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Worker Infrastructure */}
                    <td className="px-5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] bg-[#eff4ff] text-[#0b1c30] font-mono border border-[#c7c4d8]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#006e4b]"></span>
                        {tenant.workerInfrastructure}
                      </span>
                    </td>

                    {/* Health Status */}
                    <td className="px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                          tenant.health === 'Healthy'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tenant.health === 'Upgrade Eligible'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {tenant.health}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onManageTenantQuotas(tenant)}
                          className="p-1 hover:bg-[#eff4ff] rounded text-[#3525cd] hover:text-[#4f46e5] cursor-pointer transition-colors"
                          title="Manage Tenant Quotas"
                        >
                          <span className="material-symbols-outlined text-lg">tune</span>
                        </button>
                        <button
                          onClick={() => onImpersonateTenant(tenant)}
                          className="p-1 hover:bg-[#eff4ff] rounded text-[#565e74] hover:text-[#0b1c30] cursor-pointer transition-colors"
                          title="Impersonate Admin / Enter Workspace"
                        >
                          <span className="material-symbols-outlined text-lg">login</span>
                        </button>
                        <button
                          onClick={() => alert(`Tenant details for ${tenant.name} (${tenant.workspaceId})`)}
                          className="p-1 hover:bg-[#eff4ff] rounded text-[#565e74] hover:text-[#0b1c30] cursor-pointer transition-colors"
                          title="More Actions"
                        >
                          <span className="material-symbols-outlined text-lg">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-5 py-3 border-t border-[#c7c4d8]/50 bg-[#f8f9ff] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[#565e74]">
            Showing <span className="font-mono font-semibold text-[#0b1c30]">1-{filteredTenants.length}</span> of{' '}
            <span className="font-mono font-semibold text-[#0b1c30]">{plan.activeTenants}</span> companies on this tier
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-[#c7c4d8] bg-white text-xs text-[#565e74] hover:text-[#0b1c30] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium cursor-pointer ${
                  currentPage === page
                    ? 'bg-[#3525cd] text-white'
                    : 'border border-[#c7c4d8] bg-white text-[#565e74] hover:text-[#0b1c30]'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1 text-xs text-[#565e74]">...</span>
            <button
              onClick={() => setCurrentPage(12)}
              className="px-2.5 py-1 rounded border border-[#c7c4d8] bg-white text-xs font-mono text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
            >
              12
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(12, currentPage + 1))}
              className="px-2.5 py-1 rounded border border-[#c7c4d8] bg-white text-xs text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
