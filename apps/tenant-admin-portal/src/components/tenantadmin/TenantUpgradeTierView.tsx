import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

interface TenantUpgradeTierViewProps {
  onBack: () => void;
  onUpgradeSuccess?: (newTierName: string, newTotalSeats: number, newCost: number) => void;
}

export const TenantUpgradeTierView: React.FC<TenantUpgradeTierViewProps> = ({
  onBack,
  onUpgradeSuccess,
}) => {
  const { currentCompany, currentTenantDevelopers } = usePlatform();
  const [selectedTier, setSelectedTier] = useState<'20' | '50' | '100'>('50');

  const licensePlans = [
    {
      id: '20',
      name: '20 Dev Starter',
      price: 199,
      billingPeriod: 'month',
      seatLimit: 20,
      agentConcurrency: 5,
      infrastructure: 'Shared Pods',
      badge: 'Starter',
    },
    {
      id: '50',
      name: '50 Dev Growth',
      price: 399,
      billingPeriod: 'month',
      seatLimit: 50,
      agentConcurrency: 15,
      infrastructure: 'Dedicated K8s',
      badge: 'Popular',
    },
    {
      id: '100',
      name: '100 Dev Enterprise',
      price: 799,
      billingPeriod: 'month',
      seatLimit: 100,
      agentConcurrency: 50,
      infrastructure: 'Dedicated K8s',
      badge: 'Enterprise',
    },
  ];

  const currentSelection = licensePlans.find((p) => p.id === selectedTier) || licensePlans[1];

  const handleConfirmUpgrade = () => {
    if (onUpgradeSuccess) {
      onUpgradeSuccess(currentSelection.name, currentSelection.seatLimit, currentSelection.price);
    }
    alert(`Successfully upgraded to ${currentSelection.name}! Your tenant quota expanded to ${currentSelection.seatLimit} developer seats immediately.`);
    onBack();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
      {/* 1. Header with back button */}
      <div className="flex flex-col gap-4 border-b border-[#c7c4d8]/40 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#eff4ff] text-[#565e74] hover:text-[#3525cd] transition-colors border border-transparent hover:border-[#c7c4d8]/50"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
              Upgrade Subscription Tier
            </h1>
            <p className="text-[14px] text-[#565e74] mt-0.5">
              Expand your seat quota, unlock higher concurrency, and upgrade your agent infrastructure.
            </p>
          </div>
        </div>
      </div>

      {/* Plan Cards Grid (Exactly like Super Admin) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-[#0b1c30]">Available Tiers</h2>
          <span className="text-xs font-mono text-[#565e74]">All plans billed monthly in USD</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {licensePlans.map((plan) => {
            const isPopular = plan.badge === 'Popular';
            const isActive = selectedTier === plan.id;
            
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedTier(plan.id as any)}
                className={`bg-white rounded-xl p-6 flex flex-col justify-between relative shadow-sm transition-all cursor-pointer ${
                  isActive
                    ? 'border-2 border-[#3525cd] shadow-md ring-2 ring-[#3525cd]/10'
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
                          isActive
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
                  <div className="flex items-center justify-between text-[#565e74] text-[11px] font-mono mb-3">
                    <span>{isActive ? 'Selected' : 'Click to Select'}</span>
                    <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#3525cd]' : ''}`}>
                      {isActive ? 'radio_button_checked' : 'radio_button_unchecked'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Checkout Sticky Footer */}
      <section className="sticky bottom-0 bg-white/90 backdrop-blur-md p-5 rounded-xl border border-[#c7c4d8]/60 shadow-[0_-10px_40px_rgba(11,28,48,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[14px] text-[#0b1c30] font-medium">Upgrade to {currentSelection.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[12px] text-[#565e74]">Immediate prorated charge:</span>
            <span className="text-[13px] font-mono font-bold text-[#005338]">
              +$0.00
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="h-9 px-4 rounded-lg bg-white border border-[#c7c4d8] text-[#0b1c30] text-[13px] font-medium hover:bg-[#f8f9ff] transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmUpgrade}
            className="h-9 px-5 rounded-lg bg-[#4f46e5] text-white text-[13px] font-medium flex items-center gap-2 hover:bg-[#3525cd] transition-all shadow-sm shadow-[#4f46e5]/20"
          >
            <span className="material-symbols-outlined text-[18px]">credit_card</span>
            Confirm Payment
          </button>
        </div>
      </section>
    </div>
  );
};
