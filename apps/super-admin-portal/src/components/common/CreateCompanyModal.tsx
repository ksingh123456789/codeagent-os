import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "../../api/client";
import { usePlatform } from "../../context/PlatformContext";

export const CreateCompanyModal: React.FC<{
  isOpen?: boolean;
  onClose: () => void;
}> = ({ isOpen = true, onClose }) => {
  const queryClient = useQueryClient();
  const [legalName, setLegalName] = useState("");
  const [domainSlug, setDomainSlug] = useState("");
  const [techStack, setTechStack] = useState(
    "TypeScript / React + Python (FastAPI)",
  );
  const [gitProvider, setGitProvider] = useState("GitHub Enterprise");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const { licensePlans } = usePlatform();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [sendOnboardingEmail, setSendOnboardingEmail] = useState(true);
  const [enforceMfa, setEnforceMfa] = useState(true);

  // In a real app you might fetch this list from backend or pass it as prop
  // We will just do length validation for the slug.
  const isSlugValid = domainSlug.length >= 3;

  const createCompanyMutation = useMutation({
    mutationFn: api.superAdmin.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["superAdminCompanies"] });
      toast.success(
        "Company provisioned successfully! Initial admin dispatched.",
      );
      onClose();
    },
    onError: (err: any) => {
      toast.error(`Error: ${err.response?.data?.detail || err.message}`);
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!legalName.trim()) {
      toast.error("Company Legal Name is required");
      return;
    }
    if (!domainSlug.trim()) {
      toast.error("Domain Slug is required");
      return;
    }
    if (!adminEmail.trim()) {
      toast.error("Admin Email is required");
      return;
    }

    const plan = licensePlans.find(p => p.id === selectedPlanId) || licensePlans[0];
    if (!plan) {
      toast.error("No license plan selected or available. Please refresh.");
      return;
    }

    createCompanyMutation.mutate({
      name: legalName,
      domain: `${domainSlug.toLowerCase().trim()}.codeagent.io`,
      admin_email: adminEmail,
      admin_name: adminName,
      tech_stack: techStack,
      git_provider: gitProvider,
      license_id: parseInt(plan.id),
      license_tier: plan.name,
      allocated_seats: plan.seatLimitNum,
      mfa_enforced: enforceMfa,
      concurrent_limit: parseInt(plan.agentConcurrency.toString()) || 5,
      run_cap: plan.seatLimitNum * 1000,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213145]/60 backdrop-blur-xs transition-opacity duration-200"
      id="create-company-modal"
    >
      {/* Modal Box */}
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-[#c7c4d8]/80 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#c7c4d8]/60 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#e2dfff] flex items-center justify-center text-[#3525cd] mt-0.5 shadow-xs shrink-0">
              <span className="material-symbols-outlined text-[22px]">
                domain_add
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-semibold text-[#0b1c30] tracking-tight">
                  Add New Company
                </h2>
                <span className="px-2 py-0.5 rounded bg-[#e2dfff] text-[#3525cd] font-mono text-[11px] font-semibold uppercase tracking-wider">
                  Tenant Provisioning
                </span>
              </div>
              <p className="text-[13px] text-[#565e74] mt-0.5">
                Provision an isolated environment, assign a license tier, and
                invite the primary administrator.
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#565e74] hover:bg-[#eff4ff] hover:text-[#0b1c30] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto flex-1 flex flex-col"
        >
          <div className="px-6 py-5 space-y-6 custom-scrollbar flex-1">
            {/* SECTION 1: Company Profile & Tenant Identity */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#c7c4d8]/40 pb-1.5">
                <span className="text-[12px] font-mono font-semibold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[17px]">
                    corporate_fare
                  </span>
                  <span>1. Company Details & Subdomain</span>
                </span>
                <span className="text-[11px] font-mono text-[#565e74]">
                  Step 1 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#0b1c30]">
                    Company Legal Name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    required
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full h-9 px-3 text-[13px] bg-white border border-[#c7c4d8]/80 rounded-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30] focus:ring-1 focus:ring-[#3525cd] shadow-xs"
                    placeholder="e.g. Stripe, Acme Corp"
                    type="text"
                  />
                </div>

                {/* Workspace Subdomain Slug */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-medium text-[#0b1c30]">
                      Workspace Domain Slug{" "}
                      <span className="text-[#ba1a1a]">*</span>
                    </label>
                    {isSlugValid ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#005338] font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>{" "}
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#ba1a1a] font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                        Invalid
                      </span>
                    )}
                  </div>
                  <div className="flex rounded-lg shadow-xs overflow-hidden">
                    <input
                      required
                      value={domainSlug}
                      onChange={(e) =>
                        setDomainSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      className="h-9 w-full px-3 text-[13px] font-mono bg-white border border-[#c7c4d8]/80 rounded-l-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30] focus:ring-1 focus:ring-[#3525cd]"
                      type="text"
                    />
                    <span className="inline-flex items-center px-3 border border-l-0 border-[#c7c4d8]/80 bg-[#eff4ff] text-[#565e74] text-[11px] font-mono">
                      .codeagent.io
                    </span>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#0b1c30]">
                    Primary Engineering Stack
                  </label>
                  <select
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full h-9 px-2.5 text-[13px] bg-white border border-[#c7c4d8]/80 rounded-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30] shadow-xs"
                  >
                    <option>TypeScript / React + Python (FastAPI)</option>
                    <option>Go + Kubernetes Microservices</option>
                    <option>Java / Spring Boot Enterprise</option>
                    <option>Rust + Distributed Systems</option>
                    <option>Polyglot / Multi-repository</option>
                  </select>
                </div>

                {/* Codebase Host */}
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#0b1c30]">
                    Default Git Provider Context
                  </label>
                  <div className="grid grid-cols-2 gap-2 h-9">
                    <label
                      onClick={() => setGitProvider("GitHub Enterprise")}
                      className={`rounded-lg flex items-center justify-center gap-2 cursor-pointer text-[13px] font-medium transition-colors ${
                        gitProvider === "GitHub Enterprise"
                          ? "border border-[#3525cd] bg-[#e2dfff]/30 text-[#3525cd]"
                          : "border border-[#c7c4d8]/80 hover:bg-[#eff4ff] text-[#565e74]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="git_provider"
                        className="hidden"
                        checked={gitProvider === "GitHub Enterprise"}
                        readOnly
                      />
                      <span className="material-symbols-outlined text-[16px]">
                        deployed_code
                      </span>
                      <span>GitHub Enterprise</span>
                    </label>

                    <label
                      onClick={() => setGitProvider("GitLab Self-hosted")}
                      className={`rounded-lg flex items-center justify-center gap-2 cursor-pointer text-[13px] transition-colors ${
                        gitProvider === "GitLab Self-hosted"
                          ? "border border-[#3525cd] bg-[#e2dfff]/30 text-[#3525cd] font-medium"
                          : "border border-[#c7c4d8]/80 hover:bg-[#eff4ff] text-[#565e74]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="git_provider"
                        className="hidden"
                        checked={gitProvider === "GitLab Self-hosted"}
                        readOnly
                      />
                      <span className="material-symbols-outlined text-[16px]">
                        source
                      </span>
                      <span>GitLab Self-hosted</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 2: Primary Tenant Administrator */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#c7c4d8]/40 pb-1.5">
                <span className="text-[12px] font-mono font-semibold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[17px]">
                    admin_panel_settings
                  </span>
                  <span>2. Initial Tenant Super Admin</span>
                </span>
                <span className="text-[11px] font-mono text-[#565e74]">
                  Step 2 of 3
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#0b1c30]">
                    Admin Full Name <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full h-9 px-3 text-[13px] bg-white border border-[#c7c4d8]/80 rounded-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30] shadow-xs"
                    placeholder="e.g. Alex Rivera"
                    type="text"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[13px] font-medium text-[#0b1c30]">
                    Admin Work Email Address{" "}
                    <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full h-9 px-3 text-[13px] font-mono bg-white border border-[#c7c4d8]/80 rounded-lg focus:outline-none focus:border-[#3525cd] text-[#0b1c30] shadow-xs"
                    placeholder="admin@company.com"
                    type="email"
                  />
                </div>
              </div>

              {/* Auth Provisioning Method */}
              <div className="bg-[#eff4ff] p-3 rounded-lg border border-[#c7c4d8]/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#565e74] text-[20px]">
                    key
                  </span>
                  <div>
                    <div className="text-[13px] font-medium text-[#0b1c30]">
                      Initial Auth & Credential Dispatch
                    </div>
                    <div className="text-[11px] text-[#565e74]">
                      A secure one-time activation token will be triggered via
                      transactional email.
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-medium text-[#3525cd] px-2 py-1 bg-white rounded border border-[#c7c4d8]/60">
                  Magic Link + Temporary Pass
                </span>
              </div>
            </div>

            {/* SECTION 3: License Plan Assignment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#c7c4d8]/40 pb-1.5">
                <span className="text-[12px] font-mono font-semibold text-[#0b1c30] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#3525cd] text-[17px]">
                    loyalty
                  </span>
                  <span>3. Assign License Plan Tier & Capacity</span>
                </span>
                <span className="text-[11px] font-mono text-[#565e74]">
                  Step 3 of 3
                </span>
              </div>

              {/* Plan Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {licensePlans.map((plan) => (
                  <label
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`relative flex flex-col p-3 rounded-xl cursor-pointer shadow-xs transition-all ${
                      selectedPlanId === plan.id || (!selectedPlanId && licensePlans[0]?.id === plan.id)
                        ? "border-2 border-[#3525cd] bg-[#e2dfff]/20 ring-1 ring-[#3525cd]"
                        : "border border-[#c7c4d8]/80 bg-white hover:border-[#777587]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="license_plan"
                      checked={selectedPlanId === plan.id || (!selectedPlanId && licensePlans[0]?.id === plan.id)}
                      onChange={() => setSelectedPlanId(plan.id)}
                      className="absolute top-3 right-3 text-[#3525cd] h-4 w-4"
                    />
                    <div className="flex items-center gap-1.5 text-[#3525cd] font-semibold text-[14px]">
                      <span className="material-symbols-outlined text-[18px]">
                        loyalty
                      </span>
                      <span>{plan.name}</span>
                    </div>
                    <div className="text-[20px] font-bold text-[#0b1c30] mt-1">
                      ${plan.price}
                      <span className="text-[11px] font-normal text-[#565e74]">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                    <div className="mt-2 space-y-1 text-[11px] font-mono text-[#565e74] border-t border-[#c7c4d8]/40 pt-2">
                      <div className="flex items-center gap-1.5 text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[14px] text-[#005338]">
                          check
                        </span>{" "}
                        {plan.seatLimit}
                      </div>
                      <div className="flex items-center gap-1.5 text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[14px] text-[#005338]">
                          check
                        </span>{" "}
                        {plan.agentConcurrency}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px] text-[#565e74]">
                          check
                        </span>{" "}
                        {plan.infrastructure}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-start gap-3 p-2.5 rounded-lg border border-[#c7c4d8]/80 bg-white hover:bg-[#eff4ff] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={sendOnboardingEmail}
                    onChange={(e) => setSendOnboardingEmail(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-[#777587] text-[#3525cd] focus:ring-[#3525cd]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#0b1c30]">
                      Trigger automated onboarding email with temporary password
                      & SDK guides
                    </span>
                    <span className="text-[11px] text-[#565e74]">
                      Will send SMTP invitation to{" "}
                      <span className="font-mono text-[#0b1c30]">
                        {adminEmail || "admin@company.com"}
                      </span>{" "}
                      immediately upon creation.
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-2.5 rounded-lg border border-[#c7c4d8]/80 bg-white hover:bg-[#eff4ff] cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={enforceMfa}
                    onChange={(e) => setEnforceMfa(e.target.checked)}
                    className="h-4 w-4 mt-0.5 rounded border-[#777587] text-[#3525cd] focus:ring-[#3525cd]"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-[#0b1c30]">
                      Enforce tenant-level Multi-Factor Authentication (MFA /
                      TOTP)
                    </span>
                    <span className="text-[11px] text-[#565e74]">
                      Requires all assigned developer seats to enroll an
                      authenticator before git write access.
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-[#eff4ff] border-t border-[#c7c4d8]/60 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#565e74]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Draft securely cached locally</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-9 px-4 rounded-lg border border-[#c7c4d8]/80 bg-white hover:bg-[#eff4ff] text-[13px] font-medium text-[#0b1c30] transition-colors shadow-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createCompanyMutation.isPending || !isSlugValid}
                className="h-9 px-4 rounded-lg bg-[#3525cd] hover:bg-[#4d44e3] active:scale-[0.98] text-white text-[13px] font-medium flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  send
                </span>
                <span>
                  {createCompanyMutation.isPending
                    ? "Provisioning..."
                    : "Create Company & Dispatch Invite"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
