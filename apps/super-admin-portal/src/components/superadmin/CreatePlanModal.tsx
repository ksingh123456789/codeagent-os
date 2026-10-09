import React, { useState } from 'react';
import { SubscriptionPlan } from '../../types/platform';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: SubscriptionPlan) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [planName, setPlanName] = useState('Team Growth');
  const [category, setCategory] = useState<'Starter' | 'Growth' | 'Enterprise'>('Growth');
  const [monthlyPrice, setMonthlyPrice] = useState(499);
  const [annualPrice, setAnnualPrice] = useState(4990);
  const [seats, setSeats] = useState(50);
  const [concurrency, setConcurrency] = useState(15);
  const [infrastructure, setInfrastructure] = useState('shared');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [workerStrategy, setWorkerStrategy] = useState<'shared' | 'dedicated_rq' | 'isolated_k8s'>('dedicated_rq');
  const [runtimeHours, setRuntimeHours] = useState('1,200 hrs / mo');
  const [storageVolume, setStorageVolume] = useState('250 GB SSD (NVMe)');
  const [autoStripe, setAutoStripe] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState(false);

  if (!isOpen) return null;

  const generatedSlug = `tier_plan_${planName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;

  const handleCopySlug = () => {
    navigator.clipboard.writeText(generatedSlug);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: SubscriptionPlan = {
      id: `plan_${Date.now()}`,
      name: planName,
      tier: category,
      monthlyPrice: monthlyPrice,
      annualPrice: annualPrice,
      developerSeats: seats,
      agentConcurrency: concurrency,
      runtimeHours: 'Unlimited',
      storageVolume: 'Unlimited',
      apiSlug: generatedSlug,
      stripeProductId: `prod_${Math.random().toString(36).substring(2, 10)}`,
      activeTenants: 0,
      visibility: 'Public',
      workerStrategy,
    };
    onPlanCreated(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0b1c30]/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col my-auto border border-[#c7c4d8]/60 z-50 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#c7c4d8]/60 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd]">
              <span className="material-symbols-outlined text-2xl">loyalty</span>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0b1c30] tracking-tight leading-tight">
                Create Subscription Plan
              </h2>
              <p className="text-xs text-[#565e74] mt-0.5">
                Set up tier pricing, seat capacity, and autonomous agent limits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#565e74] hover:text-[#0b1c30] hover:bg-[#e5eeff] p-1.5 rounded-lg transition-colors cursor-pointer"
            title="Close modal"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-6 space-y-4 text-[#0b1c30] overflow-y-auto max-h-[72vh]">
            {/* Plan Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#0b1c30]">
                Plan Name <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-xs text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                placeholder="e.g., Team Growth"
                type="text"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                required
              />
            </div>

            {/* Tier Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0b1c30]">Category / Tier</label>
                <select
                  className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-xs text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                >
                  <option value="Starter">Starter</option>
                  <option value="Growth">Growth</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0b1c30]">
                  Monthly Price (USD) <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#565e74] text-xs font-mono">$</span>
                  <input
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#eff4ff] text-xs font-mono text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                    placeholder="499"
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0b1c30]">
                  Annual Price (USD) <span className="text-[#ba1a1a]">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[#565e74] text-xs font-mono">$</span>
                  <input
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#eff4ff] text-xs font-mono text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                    placeholder="4990"
                    type="number"
                    value={annualPrice}
                    onChange={(e) => setAnnualPrice(Number(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Resource Limits: Seats & Agent Concurrency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0b1c30]">Developer Seats</label>
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-xs font-mono text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                    placeholder="50"
                    type="number"
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-2 text-[#565e74] text-xs">seats</span>
                </div>
                <p className="text-[11px] text-[#565e74]">User licenses included in base fee.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#0b1c30]">Agent Concurrency</label>
                <div className="relative">
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-[#eff4ff] text-xs font-mono text-[#0b1c30] border border-[#c7c4d8] focus:outline-none focus:border-[#3525cd] focus:ring-1 focus:ring-[#3525cd]"
                    placeholder="15"
                    type="number"
                    value={concurrency}
                    onChange={(e) => setConcurrency(Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-2 text-[#565e74] text-xs">agents</span>
                </div>
                <p className="text-[11px] text-[#565e74]">Parallel active agent workflows.</p>
              </div>
            </div>

            {/* Expanded Advanced Settings Accordion */}
            <div className="bg-[#eff4ff] rounded-xl border border-[#c7c4d8] p-4 space-y-4">
              {/* Header */}
              <div
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="cursor-pointer text-xs font-semibold text-[#0b1c30] flex items-center justify-between select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm text-[#3525cd]">tune</span>
                  <span className="font-semibold">Advanced Settings</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#565e74]">
                  {isAdvancedOpen ? 'expand_less' : 'expand_more'}
                </span>
              </div>

              {/* Accordion Content */}
              {isAdvancedOpen && (
                <div className="pt-3 border-t border-[#c7c4d8] space-y-4">
                  {/* Group 1: API & Stripe Sync */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-semibold text-[#0b1c30]">
                          Internal Plan Key / API Slug
                        </label>
                        <span className="text-[10px] text-[#565e74] font-mono flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">lock</span> Auto-generated
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          className="w-full px-2.5 py-1.5 pr-8 rounded-lg bg-white text-xs font-mono text-[#565e74] border border-[#c7c4d8]"
                          readOnly
                          type="text"
                          value={generatedSlug}
                        />
                        <button
                          type="button"
                          onClick={handleCopySlug}
                          className="absolute right-2 text-[#565e74] hover:text-[#0b1c30] p-1 cursor-pointer"
                          title="Copy slug"
                        >
                          <span className="material-symbols-outlined text-sm">
                            {copiedSlug ? 'check' : 'content_copy'}
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#c7c4d8]">
                      <div>
                        <p className="text-xs font-medium text-[#0b1c30]">
                          Auto-create Stripe Product &amp; Price ID
                        </p>
                        <p className="text-[11px] text-[#565e74]">
                          Syncs pricing tiers with the active Stripe webhook engine.
                        </p>
                      </div>
                      <input
                        checked={autoStripe}
                        onChange={(e) => setAutoStripe(e.target.checked)}
                        className="accent-[#3525cd] cursor-pointer w-4 h-4"
                        type="checkbox"
                      />
                    </div>
                  </div>



                  {/* Group 3: Infrastructure Worker Strategy */}
                  <div className="space-y-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#0b1c30]">
                        Backend Worker Pod Strategy
                      </label>
                      <p className="text-[10px] text-[#565e74]">
                        Determines tenant job isolation and queue priority.
                      </p>
                    </div>
                    <div className="space-y-2">
                      {/* Option 1 */}
                      <label
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          workerStrategy === 'shared'
                            ? 'bg-[#e2dfff]/40 border-[#3525cd]'
                            : 'bg-white border-[#c7c4d8] hover:bg-[#e5eeff]/40'
                        }`}
                      >
                        <input
                          className="mt-0.5 accent-[#3525cd]"
                          name="worker_strategy"
                          type="radio"
                          value="shared"
                          checked={workerStrategy === 'shared'}
                          onChange={() => setWorkerStrategy('shared')}
                        />
                        <div className="flex-1 text-xs">
                          <div className="font-medium text-[#0b1c30]">
                            Shared Worker Pod (Multitenant)
                          </div>
                          <div className="text-[11px] text-[#565e74]">
                            Default for Starter. Shared Redis queue with multitenant affinity.
                          </div>
                        </div>
                      </label>

                      {/* Option 2 (Selected) */}
                      <label
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          workerStrategy === 'dedicated_rq'
                            ? 'bg-[#e2dfff]/40 border-[#3525cd]'
                            : 'bg-white border-[#c7c4d8] hover:bg-[#e5eeff]/40'
                        }`}
                      >
                        <input
                          className="mt-0.5 accent-[#3525cd]"
                          name="worker_strategy"
                          type="radio"
                          value="dedicated_rq"
                          checked={workerStrategy === 'dedicated_rq'}
                          onChange={() => setWorkerStrategy('dedicated_rq')}
                        />
                        <div className="flex-1 text-xs">
                          <div className="font-medium text-[#0b1c30] flex items-center gap-1.5">
                            <span>Dedicated RQ Queue</span>
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#3525cd] text-white">
                              Growth
                            </span>
                          </div>
                          <div className="text-[11px] text-[#565e74]">
                            Dedicated task queue for fast agent dispatch. Recommended for Growth.
                          </div>
                        </div>
                      </label>

                      {/* Option 3 */}
                      <label
                        className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                          workerStrategy === 'isolated_k8s'
                            ? 'bg-[#e2dfff]/40 border-[#3525cd]'
                            : 'bg-white border-[#c7c4d8] hover:bg-[#e5eeff]/40'
                        }`}
                      >
                        <input
                          className="mt-0.5 accent-[#3525cd]"
                          name="worker_strategy"
                          type="radio"
                          value="isolated_k8s"
                          checked={workerStrategy === 'isolated_k8s'}
                          onChange={() => setWorkerStrategy('isolated_k8s')}
                        />
                        <div className="flex-1 text-xs">
                          <div className="font-medium text-[#0b1c30]">
                            Isolated Dedicated K8s Cluster
                          </div>
                          <div className="text-[11px] text-[#565e74]">
                            Fully sandboxed VPC Kubernetes cluster with custom SLA.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clean Modal Footer */}
          <div className="px-6 py-4 bg-[#eff4ff] border-t border-[#c7c4d8]/60 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[#565e74] hover:text-[#0b1c30] text-xs font-medium transition-colors cursor-pointer"
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              type="submit"
            >
              <span>Create Plan</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
