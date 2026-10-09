import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { usePlatform } from '../../context/PlatformContext';
import { CreatePlanModal } from './CreatePlanModal';
import { EditTierDrawer } from './EditTierDrawer';
import { TierTenantsView } from './TierTenantsView';
import { SubscriptionPlan, TenantCompany } from '../../types/platform';

export const LicensePlansView: React.FC = () => {
  const { licensePlans, companies, createLicense, updateLicense } = usePlatform();
  const [showNewPlanModal, setShowNewPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [viewingTenantsPlan, setViewingTenantsPlan] = useState<SubscriptionPlan | null>(null);

  const mapLicenseToSubPlan = (plan: any): SubscriptionPlan => ({
    id: plan.id,
    name: plan.name,
    tier: plan.badge || 'Starter',
    monthlyPrice: plan.price,
    annualPrice: plan.price * 10,
    developerSeats: plan.seatLimitNum || parseInt(plan.seatLimit) || 10,
    agentConcurrency: parseInt(plan.agentConcurrency) || 5,
    runtimeHours: '1,200 hrs / mo',
    storageVolume: '250 GB SSD (NVMe)',
    apiSlug: `tier_plan_${plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    stripeProductId: `prod_${Math.random().toString(36).substring(2, 10)}`,
    activeTenants: plan.subscribedTenants || 0,
    visibility: plan.badge === 'Popular' ? 'Public & Featured (Popular)' : 'Public',
    workerStrategy: plan.badge === 'Popular' ? 'dedicated_rq' : 'shared',
  });

  const handleEditPlan = (plan: any) => {
    setEditingPlan(mapLicenseToSubPlan(plan));
  };

  const handleViewTenants = (plan: any) => {
    setViewingTenantsPlan(mapLicenseToSubPlan(plan));
  };

  const totalCompaniesCount = companies.length;
  const totalAllocated = companies.reduce((acc, c) => acc + (c.totalLicenses || 20), 0);
  const totalActive = companies.reduce((acc, c) => acc + (c.usedLicenses || Math.floor((c.totalLicenses || 20) * 0.75)), 0);
  
  const getPlanSubscribedCount = (planName: string) => companies.filter(c => c.licensePlanTier === planName).length;

  const mappedTenants: TenantCompany[] = companies.map((c) => ({
    id: c.id,
    name: c.name,
    workspaceId: c.slug,
    adminEmail: c.adminEmail,
    health: (c.usedLicenses / c.totalLicenses) >= 1 ? 'Over Quota' : (c.usedLicenses / c.totalLicenses) >= 0.9 ? 'Upgrade Eligible' : 'Healthy',
    seatsAllocated: c.usedLicenses,
    seatsMax: c.totalLicenses,
    seatsPercent: Math.round((c.usedLicenses / c.totalLicenses) * 100) || 0,
    concurrencyLoad: c.activeAgents,
    concurrencyMax: c.activeAgents + 5,
    concurrencyStatus: c.activeAgents > 0 ? 'Active' : 'Idle',
    workerInfrastructure: c.dedicatedRedis ? 'Dedicated K8s' : 'Shared Pods',
    initials: c.name.substring(0, 2).toUpperCase(),
    subscribedSince: c.createdDate,
  }));

  if (viewingTenantsPlan) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 lg:gap-8">
        <TierTenantsView
          plan={viewingTenantsPlan}
          tenants={mappedTenants}
          onBackToPlans={() => setViewingTenantsPlan(null)}
          onEditTierSpecs={(p) => setEditingPlan(p)}
          onImpersonateTenant={(t) => toast(`Impersonating ${t.name}...`, { icon: '🎭' })}
          onManageTenantQuotas={(t) => toast.success(`Managing quotas for ${t.name}...`)}
        />
        <EditTierDrawer
          isOpen={editingPlan !== null}
          plan={editingPlan}
          onClose={() => setEditingPlan(null)}
          onSave={async (updatedPlan) => {
            try {
              await updateLicense(updatedPlan.id, {
                name: updatedPlan.name,
                badge: updatedPlan.tier,
                developer_limit: updatedPlan.developerSeats,
                agent_concurrency: updatedPlan.agentConcurrency,
                infrastructure_strategy: updatedPlan.workerStrategy,
                monthly_price: updatedPlan.monthlyPrice,
                annual_price: updatedPlan.annualPrice,
                price: updatedPlan.monthlyPrice
              });
              toast.success(`Saved changes for ${updatedPlan.name}!`);
              setEditingPlan(null);
              setViewingTenantsPlan(updatedPlan);
            } catch (err) {
              toast.error('Failed to update plan');
              console.error(err);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-6 lg:gap-8">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30] tracking-tight">License Plans & Quotas</h1>
          <p className="text-sm text-[#565e74] mt-1">
            Manage platform subscription tiers, seat limits, and agent quotas.
          </p>
        </div>
        <div>
          <button
            onClick={() => setShowNewPlanModal(true)}
            className="h-9 px-4 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Create New Plan</span>
          </button>
        </div>
      </section>

      {/* 3 Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Active Plans */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Active Plans</span>
            <span className="material-symbols-outlined text-[#777587] text-[20px]">category</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">{licensePlans.length} Plans</div>
            <div className="text-xs text-[#565e74] mt-1 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>20 Dev, 50 Dev, Enterprise 100+</span>
            </div>
          </div>
        </div>

        {/* Card 2: Total Subscribed */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Total Subscribed</span>
            <span className="material-symbols-outlined text-[#777587] text-[20px]">corporate_fare</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {totalCompaniesCount} Companies
            </div>
            <div className="text-xs text-[#565e74] mt-1 flex items-center gap-1 font-mono">
              <span className="text-emerald-700 font-semibold">+8%</span>
              <span>tenant growth this month</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Platform Seats */}
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider">Total Platform Seats</span>
            <span className="material-symbols-outlined text-[#777587] text-[20px]">badge</span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#0b1c30] tracking-tight">
              {totalAllocated.toLocaleString()} Allocated
            </div>
            <div className="text-xs text-[#565e74] mt-1 flex items-center gap-1.5 font-mono">
              <div className="w-16 bg-[#e5eeff] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#3525cd] h-full rounded-full" style={{ width: '69%' }}></div>
              </div>
              <span>{totalActive.toLocaleString()} active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Plan Cards Grid (3 Clean Cards Side-by-Side) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0b1c30]">Available Tiers</h2>
          <span className="text-xs font-mono text-[#565e74]">All plans billed monthly in USD</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {licensePlans.map((plan) => {
            const isPopular = plan.badge === 'Popular';
            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl p-6 flex flex-col justify-between relative shadow-sm transition-all ${
                  isPopular
                    ? 'border-2 border-[#3525cd] shadow-md'
                    : 'border border-[#c7c4d8]/80 hover:border-[#777587]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#3525cd] text-white text-[10px] font-mono uppercase tracking-wider font-bold shadow-xs">
                    Popular
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[#0b1c30]">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-bold text-[#0b1c30]">${plan.price}</span>
                        <span className="text-xs text-[#565e74]">/{plan.billingPeriod}</span>
                      </div>
                    </div>
                    {plan.badge && (
                      <span
                        className={`text-xs font-mono px-2 py-0.5 rounded-lg ${
                          isPopular
                            ? 'bg-[#e2dfff] text-[#3525cd] font-semibold'
                            : 'bg-[#eff4ff] text-[#565e74]'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="w-full h-px bg-[#e5eeff] my-1"></div>

                  {/* Specs */}
                  <div className="flex flex-col gap-2.5 text-xs text-[#0b1c30] font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#565e74] flex items-center gap-1.5 font-sans">
                        <span className="material-symbols-outlined text-[16px]">person</span>
                        Seat Limit
                      </span>
                      <span className="font-semibold">{plan.seatLimit}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#565e74] flex items-center gap-1.5 font-sans">
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        Agent Concurrency
                      </span>
                      <span className="font-semibold">{plan.agentConcurrency}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#565e74] flex items-center gap-1.5 font-sans">
                        <span className="material-symbols-outlined text-[16px]">domain</span>
                        Subscribed Tenants
                      </span>
                      <span className="font-semibold">{getPlanSubscribedCount(plan.name)} Tenants</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#565e74] flex items-center gap-1.5 font-sans">
                        <span className="material-symbols-outlined text-[16px]">dns</span>
                        Infrastructure
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          isPopular ? 'text-emerald-700 font-semibold' : 'text-[#565e74]'
                        }`}
                      >
                        {plan.infrastructure}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-4 border-t border-[#e5eeff]">
                  <button
                    onClick={() => handleEditPlan(plan)}
                    className={`w-full h-8 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                      isPopular
                        ? 'bg-[#3525cd] hover:bg-[#4f46e5] text-white shadow-xs'
                        : 'border border-[#c7c4d8] bg-[#f8f9ff] hover:bg-[#e5eeff] text-[#0b1c30]'
                    }`}
                  >
                    Edit Tier
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quotas Overview Table */}
      <section className="bg-white border border-[#c7c4d8]/60 rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-[#c7c4d8]/40 flex items-center justify-between bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#565e74]">table_chart</span>
            <h3 className="text-sm font-semibold text-[#0b1c30]">Quotas Overview</h3>
          </div>
          <span className="text-xs font-mono text-[#565e74]">Synchronized with Stripe Billing Engine</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c7c4d8]/40 text-xs font-mono text-[#565e74] uppercase">
                <th className="px-6 py-2.5 font-semibold">Plan Name</th>
                <th className="px-6 py-2.5 font-semibold">Developer Seats</th>
                <th className="px-6 py-2.5 font-semibold">Agent Concurrency</th>
                <th className="px-6 py-2.5 font-semibold">Active Tenants</th>
                <th className="px-6 py-2.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff] text-xs font-mono">
              {licensePlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-[#f8f9ff] transition-colors h-12">
                  <td className="px-6 font-medium text-[#0b1c30]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3525cd]"></span>
                      <span className="font-semibold">{plan.name}</span>
                      <span className="text-[#565e74] text-[11px]">(${plan.price}/{plan.billingPeriod})</span>
                      {plan.badge === 'Popular' && (
                        <span className="text-[10px] px-1.5 py-0.2 bg-[#e2dfff] text-[#3525cd] rounded font-semibold">
                          Popular
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 text-[#0b1c30]">{plan.seatLimit}</td>
                  <td className="px-6 text-[#0b1c30]">{plan.agentConcurrency}</td>
                  <td className="px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-[#eff4ff] text-[#0b1c30] border border-[#c7c4d8]/40">
                      {getPlanSubscribedCount(plan.name)} Companies
                    </span>
                  </td>
                  <td className="px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-[#3525cd] hover:underline font-semibold cursor-pointer"
                      >
                        Edit
                      </button>
                      <span className="text-[#c7c4d8]">|</span>
                      <button
                        onClick={() => handleViewTenants(plan)}
                        className="text-[#565e74] hover:text-[#0b1c30] cursor-pointer"
                      >
                        View Tenants
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Create New Plan */}
      <CreatePlanModal
        isOpen={showNewPlanModal}
        onClose={() => setShowNewPlanModal(false)}
        onPlanCreated={async (plan) => {
          try {
            await createLicense({
              name: plan.name,
              badge: plan.tier,
              developer_limit: plan.developerSeats,
              agent_concurrency: plan.agentConcurrency,
              infrastructure_strategy: plan.workerStrategy,
              monthly_price: plan.monthlyPrice,
              annual_price: plan.annualPrice,
              price: plan.monthlyPrice,
              stripe_product_id: plan.stripeProductId
            });
            toast.success(`Created new plan tier ${plan.name}!`);
            setShowNewPlanModal(false);
          } catch (err) {
            toast.error('Failed to create plan');
            console.error(err);
          }
        }}
      />

      {/* Drawer: Edit Plan */}
      <EditTierDrawer
        isOpen={editingPlan !== null}
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={async (updatedPlan) => {
          try {
            await updateLicense(updatedPlan.id, {
              name: updatedPlan.name,
              badge: updatedPlan.tier,
              developer_limit: updatedPlan.developerSeats,
              agent_concurrency: updatedPlan.agentConcurrency,
              infrastructure_strategy: updatedPlan.workerStrategy,
              monthly_price: updatedPlan.monthlyPrice,
              annual_price: updatedPlan.annualPrice,
              price: updatedPlan.monthlyPrice
            });
            toast.success(`Saved changes for ${updatedPlan.name}!`);
            setEditingPlan(null);
          } catch (err) {
            toast.error('Failed to update plan');
            console.error(err);
          }
        }}
      />
    </div>
  );
};
