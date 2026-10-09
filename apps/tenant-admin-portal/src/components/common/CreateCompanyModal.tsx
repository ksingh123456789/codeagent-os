import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCompanyModal: React.FC<CreateCompanyModalProps> = ({ isOpen, onClose }) => {
  const { addCompany } = usePlatform();

  const [companyName, setCompanyName] = useState('Acme AI Corp');
  const [slug, setSlug] = useState('acme');
  const [adminEmail, setAdminEmail] = useState('admin@acme.com');
  const [planTier, setPlanTier] = useState<'20 Dev Plan' | '50 Dev Plan' | 'Enterprise 100'>('20 Dev Plan');

  const [dedicatedRedis, setDedicatedRedis] = useState(true);
  const [autoProvisionPostgres, setAutoProvisionPostgres] = useState(true);
  const [langsmithTracing, setLangsmithTracing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addCompany({
        name: companyName,
        slug: `org_${slug}_prod`,
        domain: `${slug}.com`,
        licensePlanTier: planTier,
        status: 'Active',
        adminEmail: adminEmail,
        dedicatedRedis,
        autoProvisionPostgres,
        langsmithTracing
      });

      setIsSubmitting(false);
      setSuccessToast(true);

      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1200);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/70 backdrop-blur-[3px] animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-xl border border-[#c7c4d8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c7c4d8]/60 flex items-center justify-between bg-[#eff4ff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4f46e5] text-white flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
            </div>
            <div>
              <h2 className="text-[17px] font-semibold text-[#0b1c30]">Create Company & Assign License</h2>
              <p className="text-xs text-[#565e74]">
                Provision database tenant schema, Redis queues, and LangGraph agent limits
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#565e74] hover:text-[#0b1c30] hover:bg-[#dce9ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          {successToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span>Tenant sandbox successfully provisioned and onboarding credentials dispatched via secure email!</span>
            </div>
          )}

          {/* Step 1: Company Profile */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-[#3525cd] text-white text-[11px] font-mono flex items-center justify-center font-bold">
                1
              </span>
              <h3 className="text-sm font-semibold text-[#0b1c30] uppercase tracking-wide">Company Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#565e74] mb-1">Company Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''));
                    }}
                    className="w-full h-9 px-3 text-sm rounded-lg border border-[#777587]/60 text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] bg-white font-medium"
                    placeholder="e.g. Acme Corp Technologies"
                  />
                  <span className="material-symbols-outlined absolute right-2.5 top-2 text-[18px] text-[#005338]">
                    verified
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#565e74] mb-1">
                  Domain Slug (Postgres Tenant ID)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full h-9 pl-3 pr-28 text-sm font-mono rounded-lg border border-[#777587]/60 text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] bg-white"
                  />
                  <span className="absolute right-2.5 text-xs text-[#565e74] pointer-events-none font-mono">
                    .codeagent.io
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#565e74] mb-1">Initial Admin Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full h-9 pl-8 pr-3 text-sm rounded-lg border border-[#777587]/60 text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] bg-white"
                  />
                  <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[16px] text-[#565e74]">
                    mail
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: License Plan Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#3525cd] text-white text-[11px] font-mono flex items-center justify-center font-bold">
                  2
                </span>
                <h3 className="text-sm font-semibold text-[#0b1c30] uppercase tracking-wide">Assign License Plan</h3>
              </div>
              <span className="text-xs text-[#3525cd] font-mono font-medium">FastAPI License Matrix</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 20 Dev Plan */}
              <div
                onClick={() => setPlanTier('20 Dev Plan')}
                className={`relative border-2 p-3 rounded-lg cursor-pointer transition-all ${
                  planTier === '20 Dev Plan'
                    ? 'border-[#4f46e5] bg-[#eff4ff]'
                    : 'border-[#c7c4d8] bg-white hover:border-[#4f46e5]/50'
                }`}
              >
                {planTier === '20 Dev Plan' && (
                  <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-[#4f46e5] text-white rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                    Selected
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0b1c30]">20 Dev Plan</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      planTier === '20 Dev Plan' ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-gray-400'
                    }`}
                  >
                    {planTier === '20 Dev Plan' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="text-base font-bold text-[#0b1c30] mb-2">
                  $199 <span className="text-xs text-[#565e74] font-normal">/mo</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#565e74] font-mono border-t border-[#c7c4d8]/40 pt-2">
                  <li className="flex items-center gap-1.5 text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>20 Dev Seats</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>Redis Token Queue</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>Jira & GitHub Sync</span>
                  </li>
                </ul>
              </div>

              {/* 50 Dev Plan */}
              <div
                onClick={() => setPlanTier('50 Dev Plan')}
                className={`relative border-2 p-3 rounded-lg cursor-pointer transition-all ${
                  planTier === '50 Dev Plan'
                    ? 'border-[#4f46e5] bg-[#eff4ff]'
                    : 'border-[#c7c4d8] bg-white hover:border-[#4f46e5]/50'
                }`}
              >
                {planTier === '50 Dev Plan' && (
                  <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-[#4f46e5] text-white rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                    Selected
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0b1c30]">50 Dev Plan</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      planTier === '50 Dev Plan' ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-gray-400'
                    }`}
                  >
                    {planTier === '50 Dev Plan' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="text-base font-bold text-[#0b1c30] mb-2">
                  $399 <span className="text-xs text-[#565e74] font-normal">/mo</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#565e74] font-mono border-t border-[#c7c4d8]/40 pt-2">
                  <li className="flex items-center gap-1.5 text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>50 Dev Seats</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>Dedicated Celery RQ</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>LangSmith Tracing</span>
                  </li>
                </ul>
              </div>

              {/* Enterprise 100 */}
              <div
                onClick={() => setPlanTier('Enterprise 100')}
                className={`relative border-2 p-3 rounded-lg cursor-pointer transition-all ${
                  planTier === 'Enterprise 100'
                    ? 'border-[#4f46e5] bg-[#eff4ff]'
                    : 'border-[#c7c4d8] bg-white hover:border-[#4f46e5]/50'
                }`}
              >
                {planTier === 'Enterprise 100' && (
                  <div className="absolute -top-2.5 right-2 px-1.5 py-0.5 bg-[#4f46e5] text-white rounded text-[9px] font-mono uppercase font-bold tracking-wider">
                    Selected
                  </div>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#0b1c30]">Enterprise 100+</span>
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                      planTier === 'Enterprise 100' ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-gray-400'
                    }`}
                  >
                    {planTier === 'Enterprise 100' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <div className="text-base font-bold text-[#0b1c30] mb-2">
                  $699 <span className="text-xs text-[#565e74] font-normal">/mo</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#565e74] font-mono border-t border-[#c7c4d8]/40 pt-2">
                  <li className="flex items-center gap-1.5 text-[#0b1c30]">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>100+ Dev Seats</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>Dedicated S3 Bucket</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">check</span>
                    <span>99.99% SLA</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 3: Infrastructure Isolation & Agent Tracing */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-5 h-5 rounded-full bg-[#3525cd] text-white text-[11px] font-mono flex items-center justify-center font-bold">
                3
              </span>
              <h3 className="text-sm font-semibold text-[#0b1c30] uppercase tracking-wide">
                Infrastructure Isolation & Agent Tracing
              </h3>
            </div>
            <div className="bg-[#eff4ff] rounded-lg p-3.5 border border-[#c7c4d8] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-[#3525cd] mt-0.5">memory</span>
                  <div>
                    <div className="text-xs font-semibold text-[#0b1c30]">Dedicated Redis Session Cache</div>
                    <div className="text-[11px] text-[#565e74]">
                      Isolate LangChain token budgets and agent session memories from shared bus.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDedicatedRedis(!dedicatedRedis)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    dedicatedRedis ? 'bg-[#4f46e5]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      dedicatedRedis ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-[#c7c4d8]/40" />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-emerald-600 mt-0.5">schema</span>
                  <div>
                    <div className="text-xs font-semibold text-[#0b1c30]">Auto-Provision PostgreSQL Schema</div>
                    <div className="text-[11px] text-[#565e74]">
                      Generates tables for users, jira_tickets, executions, and developer_integrations.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoProvisionPostgres(!autoProvisionPostgres)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    autoProvisionPostgres ? 'bg-[#4f46e5]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      autoProvisionPostgres ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="border-t border-[#c7c4d8]/40" />

              <div className="flex items-center justify-between">
                <div className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-indigo-600 mt-0.5">hub</span>
                  <div>
                    <div className="text-xs font-semibold text-[#0b1c30]">LangSmith Agent Telemetry Link</div>
                    <div className="text-[11px] text-[#565e74]">
                      Enable live step-by-step tracing for LangGraph PR generation workers.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLangsmithTracing(!langsmithTracing)}
                  className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    langsmithTracing ? 'bg-[#4f46e5]' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      langsmithTracing ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#dae2fd]/40 rounded-lg border border-[#dae2fd] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#3525cd] text-xl">forward_to_inbox</span>
            <div className="text-xs text-[#0b1c30]">
              <span className="font-semibold">Automated SMTP Dispatch:</span> Upon creation, CodeAgent OS will transmit
              welcome credentials, tenant slug (<code className="font-mono text-[#3525cd] font-bold">{slug}</code>), and
              initial API keys to <code className="font-mono text-[#0b1c30]">{adminEmail}</code>.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-[#c7c4d8]/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-[#565e74] font-mono">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">lock</span>
              <span>Super Admin Authoritative Action</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-4 text-xs font-medium rounded-lg border border-[#c7c4d8] bg-white text-[#565e74] hover:bg-[#f8f9ff] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-8 px-5 bg-[#3525cd] hover:bg-[#4f46e5] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Provisioning Tenant...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Create & Send Credentials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
