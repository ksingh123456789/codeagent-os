import React, { useState, useEffect } from 'react';
import { SubscriptionPlan } from '../../types/platform';

interface EditTierDrawerProps {
  isOpen: boolean;
  plan: SubscriptionPlan | null;
  onClose: () => void;
  onSave: (updatedPlan: SubscriptionPlan) => void;
}

export const EditTierDrawer: React.FC<EditTierDrawerProps> = ({
  isOpen,
  plan,
  onClose,
  onSave,
}) => {
  const [displayName, setDisplayName] = useState('50 Dev Scale');
  const [badgeTag, setBadgeTag] = useState('Growth');
  const [monthlyPrice, setMonthlyPrice] = useState(399);
  const [annualPrice, setAnnualPrice] = useState(3990);
  const [visibility, setVisibility] = useState<any>('Public & Featured (Popular)');
  const [devSeats, setDevSeats] = useState(50);
  const [agentConcurrency, setAgentConcurrency] = useState(15);
  const [runtimeHours, setRuntimeHours] = useState('1,200 hrs / mo');
  const [storageVolume, setStorageVolume] = useState('250 GB SSD (NVMe)');
  const [infraStrategy, setInfraStrategy] = useState<'shared' | 'dedicated_rq' | 'isolated_k8s'>('dedicated_rq');
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (plan) {
      setDisplayName(plan.name);
      setBadgeTag(plan.tier);
      setMonthlyPrice(plan.monthlyPrice);
      setAnnualPrice(plan.annualPrice || plan.monthlyPrice * 10);
      setVisibility(plan.visibility || 'Public & Featured (Popular)');
      setDevSeats(plan.developerSeats);
      setAgentConcurrency(plan.agentConcurrency);
      setRuntimeHours(plan.runtimeHours || '1,200 hrs / mo');
      setStorageVolume(plan.storageVolume || '250 GB SSD (NVMe)');
      setInfraStrategy(plan.workerStrategy as any || 'dedicated_rq');
    }
  }, [plan]);

  if (!isOpen || !plan) return null;

  const handleApply = (asDraft = false) => {
    setIsApplying(true);
    setTimeout(() => {
      onSave({
        ...plan,
        name: displayName,
        tier: badgeTag as any,
        monthlyPrice,
        annualPrice,
        visibility,
        developerSeats: devSeats,
        agentConcurrency,
        runtimeHours: 'Unlimited',
        storageVolume: 'Unlimited',
        workerStrategy: infraStrategy,
      });
      setIsApplying(false);
      onClose();
    }, 600);
  };

  return (
    <>
      {/* Dark Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/50 backdrop-blur-[2px] z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-2xl w-full bg-white shadow-2xl z-50 flex flex-col border-l border-[#c7c4d8] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="px-6 py-5 border-b border-[#c7c4d8]/60 flex items-center justify-between bg-[#f8f9ff] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-2xl">tune</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-[#0b1c30]">
                  Edit Tier Configuration
                </h2>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase bg-[#e2dfff] text-[#3525cd]">
                  {badgeTag}
                </span>
              </div>
              <p className="text-xs text-[#565e74] mt-0.5">
                Modify tier pricing, concurrency limits, infrastructure provisioning &amp; Stripe sync.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#565e74] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Plan Identity Banner */}
          <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#c7c4d8]/70 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#3525cd] text-2xl">loyalty</span>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-[#0b1c30]">
                  Plan Target: <span className="font-mono text-[#3525cd] font-bold">{displayName}</span>
                </div>
                <div className="text-[11px] text-[#565e74] font-mono">
                  Plan ID: {plan.apiSlug} • Stripe Product: {plan.stripeProductId}
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#9cf5c8] text-[#002114] text-[11px] font-semibold font-mono">
              {plan.activeTenants} Active Tenants
            </span>
          </div>

          {/* Section 1: Basic Plan Information & Pricing */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-base">sell</span>
                Basic Plan &amp; Billing
              </h3>
              <span className="text-[11px] text-[#565e74] font-mono">Synced with Stripe Engine</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#565e74] mb-1">
                  Tier Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd] font-medium"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#565e74] mb-1">
                  Badge / Category Tag
                </label>
                <input
                  type="text"
                  value={badgeTag}
                  onChange={(e) => setBadgeTag(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[#565e74] mb-1">
                  Monthly Price (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#565e74] text-xs font-mono">$</span>
                  <input
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full h-9 pl-7 pr-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] text-xs font-mono font-medium focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#565e74] mb-1">
                  Annual Price (Discounted)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#565e74] text-xs font-mono">$</span>
                  <input
                    type="number"
                    value={annualPrice}
                    onChange={(e) => setAnnualPrice(Number(e.target.value))}
                    className="w-full h-9 pl-7 pr-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] text-xs font-mono font-medium focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#565e74] mb-1">
                  Status Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] text-xs focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                >
                  <option value="Public & Featured (Popular)">Public &amp; Featured (Popular)</option>
                  <option value="Public">Public</option>
                  <option value="Hidden / Grandfathered">Hidden / Grandfathered</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Quota Limits & Agent Execution Specs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-base">speed</span>
                Resource Quotas &amp; Hard Limits
              </h3>
              <span className="text-[11px] text-[#006e4b] font-medium">Applied per tenant workspace</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Developer Seats */}
              <div className="p-3.5 rounded-xl border border-[#c7c4d8] bg-[#f8f9ff] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#565e74] text-base">person</span>
                    Developer Seats
                  </span>
                  <span className="text-[11px] font-mono bg-[#e5eeff] px-2 py-0.5 rounded text-[#0b1c30] font-semibold">
                    {devSeats} Max
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={devSeats}
                  onChange={(e) => setDevSeats(Number(e.target.value))}
                  className="w-full accent-[#3525cd] h-1.5 bg-[#e5eeff] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-[#565e74]">
                  <span>Seat Cap per Company</span>
                  <span className="font-mono text-[#0b1c30] font-medium">{devSeats} developers</span>
                </div>
              </div>

              {/* Agent Concurrency */}
              <div className="p-3.5 rounded-xl border border-[#c7c4d8] bg-[#f8f9ff] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#0b1c30] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#565e74] text-base">bolt</span>
                    Agent Concurrency
                  </span>
                  <span className="text-[11px] font-mono bg-[#e2dfff] text-[#3525cd] px-2 py-0.5 rounded font-semibold">
                    {agentConcurrency} Parallel Runs
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={agentConcurrency}
                  onChange={(e) => setAgentConcurrency(Number(e.target.value))}
                  className="w-full accent-[#3525cd] h-1.5 bg-[#e5eeff] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[11px] text-[#565e74]">
                  <span>Simultaneous autonomous jobs</span>
                  <span className="font-mono text-[#0b1c30] font-medium">{agentConcurrency} agents</span>
                </div>
              </div>
            </div>


          </div>

          {/* Section 3: Backend Infrastructure Strategy */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5eeff] pb-2">
              <h3 className="text-xs sm:text-sm font-semibold text-[#0b1c30] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#3525cd] text-base">schema</span>
                Backend Infrastructure Strategy
              </h3>
            </div>

            <div className="space-y-2.5">
              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  infraStrategy === 'shared'
                    ? 'border-[#3525cd] bg-[#e2dfff]/20'
                    : 'border-[#c7c4d8] bg-[#f8f9ff] hover:border-[#777587]'
                }`}
              >
                <input
                  type="radio"
                  name="infra_strategy"
                  checked={infraStrategy === 'shared'}
                  onChange={() => setInfraStrategy('shared')}
                  className="mt-1 accent-[#3525cd]"
                />
                <div className="flex-1 text-xs">
                  <div className="font-medium text-[#0b1c30]">Shared Worker Pod (Multitenant)</div>
                  <div className="text-[#565e74] text-[11px] mt-0.5">
                    Standard shared redis queue with multi-tenant node affinity. Best for starter tiers.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border-2 flex items-start gap-3 cursor-pointer transition-colors ${
                  infraStrategy === 'dedicated_rq'
                    ? 'border-[#3525cd] bg-[#e2dfff]/30'
                    : 'border-[#c7c4d8] bg-[#f8f9ff] hover:border-[#777587]'
                }`}
              >
                <input
                  type="radio"
                  name="infra_strategy"
                  checked={infraStrategy === 'dedicated_rq'}
                  onChange={() => setInfraStrategy('dedicated_rq')}
                  className="mt-1 accent-[#3525cd]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#3525cd]">
                      Dedicated RQ Queue &amp; Node Group
                    </span>
                    <span className="text-[10px] font-mono text-[#006e4b] bg-white px-2 py-0.5 rounded border border-[#c7c4d8]">
                      Selected
                    </span>
                  </div>
                  <div className="text-[#464555] text-[11px] mt-0.5">
                    Isolated worker redis queue with dedicated CPU threads and zero noisy-neighbor throttle.
                  </div>
                </div>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  infraStrategy === 'isolated_k8s'
                    ? 'border-[#3525cd] bg-[#e2dfff]/20'
                    : 'border-[#c7c4d8] bg-[#f8f9ff] hover:border-[#777587]'
                }`}
              >
                <input
                  type="radio"
                  name="infra_strategy"
                  checked={infraStrategy === 'isolated_k8s'}
                  onChange={() => setInfraStrategy('isolated_k8s')}
                  className="mt-1 accent-[#3525cd]"
                />
                <div className="flex-1 text-xs">
                  <div className="font-medium text-[#0b1c30]">
                    Dedicated Isolated K8s Cluster (Enterprise)
                  </div>
                  <div className="text-[#565e74] text-[11px] mt-0.5">
                    VPC Peering, private container registry, compliance isolation &amp; HIPAA/SOC2 boundary.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Propagation Impact */}
          <div className="p-4 rounded-xl bg-[#e5eeff] border border-[#c7c4d8] flex items-start gap-3">
            <span className="material-symbols-outlined text-[#3525cd] text-xl mt-0.5">info</span>
            <div className="text-xs text-[#121c29]">
              <span className="font-semibold">Propagation Notice:</span> Saving changes will immediately update
              tier definitions in Stripe and apply quota updates to all{' '}
              <strong className="font-mono text-[#3525cd]">{plan.activeTenants} active tenant workspaces</strong>{' '}
              upon their next billing cycle renewal or quota refresh.
            </div>
          </div>
        </div>

        {/* Drawer Footer: Save Actions */}
        <div className="px-6 py-4 border-t border-[#c7c4d8] bg-[#f8f9ff] flex items-center justify-between sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-[#c7c4d8] text-[#565e74] hover:text-[#0b1c30] hover:bg-[#e5eeff] text-xs font-medium transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleApply(true)}
              className="h-9 px-4 rounded-lg border border-[#3525cd] text-[#3525cd] hover:bg-[#3525cd]/5 text-xs font-medium transition-colors cursor-pointer"
            >
              Save as Draft
            </button>
            <button
              onClick={() => handleApply(false)}
              disabled={isApplying}
              className="h-9 px-5 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-medium shadow-sm transition-all flex items-center gap-1.5 active:scale-[0.98] cursor-pointer"
            >
              {isApplying ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  <span>Applying Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">check</span>
                  <span>Apply &amp; Propagate Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
