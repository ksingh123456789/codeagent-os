import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import { DeveloperModal } from './DeveloperModal';


export const TenantDevelopers: React.FC = () => {
  const {
    currentCompany,
    currentTenantDevelopers,
    addDeveloperSeat,
    updateDeveloperSeat,
    revokeDeveloperSeat
  } = usePlatform();

  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [role, setRole] = useState<'Developer' | 'Senior Dev' | 'Staff Dev' | 'Lead' | 'Team Lead'>('Developer');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [manageDrawerDev, setManageDrawerDev] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newlyAddedDev, setNewlyAddedDev] = useState<any | null>(null);
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);

  React.useEffect(() => {
    const handleOpen = () => setIsProvisionModalOpen(true);
    window.addEventListener('open-invite-developer-modal', handleOpen);
    return () => window.removeEventListener('open-invite-developer-modal', handleOpen);
  }, []);

  const totalSeats = currentCompany.totalLicenses;
  const activeCount = currentTenantDevelopers.length;
  const availableCount = Math.max(0, totalSeats - activeCount);

  const filtered = currentTenantDevelopers.filter((d) => {
    const matchesRole = roleFilter === 'All' || d.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'All' || d.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesRole && matchesStatus;
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !workEmail) return;
    const result = await addDeveloperSeat({
      name: fullName,
      email: workEmail,
      role
    });
    if (result) {
      setNewlyAddedDev(result);
    }
    setFullName('');
    setWorkEmail('');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-5 sm:space-y-6">
      {/* Page Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-1 border-b border-[#c7c4d8]/60">
        <div>
          <h2 className="text-2xl font-bold text-[#0b1c30] tracking-tight">Developers & Seat Provisioning</h2>
          <p className="text-sm text-[#565e74] mt-0.5">
            Manage your organization's engineering roster, seat allocation, and AI coding permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#565e74] bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#c7c4d8]/50">
            Organization ID: {currentCompany.slug}
          </span>
        </div>
      </section>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Quick Stats Row (3 Cards) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Seats Card */}
        <div className="p-5 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-[#565e74] uppercase tracking-wider font-semibold">Total Seats</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0b1c30] leading-none">{totalSeats}</span>
              <span className="text-xs text-[#565e74] font-medium font-sans">allocated in tier</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs font-mono text-[#565e74]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4f46e5]"></span> {activeCount} Active
              <span className="text-[#c7c4d8]">•</span>
              <span className="inline-block w-2 h-2 rounded-full bg-[#c7c4d8]"></span> {availableCount} Available
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#eff4ff] text-[#4f46e5] flex items-center justify-center border border-[#c7c4d8]/60">
            <span className="material-symbols-outlined text-[24px]">airline_seat_recline_normal</span>
          </div>
        </div>

        {/* Active Engineers Card */}
        <div className="p-5 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-[#565e74] uppercase tracking-wider font-semibold">Active Engineers</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-emerald-700 leading-none">{activeCount}</span>
              <span className="text-xs text-[#565e74] font-medium font-sans">agents enabled</span>
            </div>
            <p className="mt-2 text-xs font-mono text-[#565e74] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-emerald-600">check_circle</span>
              All with Git & Jira linked
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#eff4ff] text-emerald-700 flex items-center justify-center border border-[#c7c4d8]/60">
            <span className="material-symbols-outlined text-[24px]">developer_mode</span>
          </div>
        </div>

        {/* Pending Invites Card */}
        <div className="p-5 rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-mono text-[#565e74] uppercase tracking-wider font-semibold">Pending Invites</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold text-[#0b1c30] leading-none">
                {currentTenantDevelopers.filter(d => d.status === 'Invited').length}
              </span>
              <span className="text-xs text-[#565e74] font-medium font-sans">unclaimed seats</span>
            </div>
            <p className="mt-2 text-xs font-mono text-[#565e74] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-[#565e74]">mail</span>
              Awaiting email acceptance
            </p>
          </div>
          <div className="w-11 h-11 rounded-lg bg-[#eff4ff] text-[#565e74] flex items-center justify-center border border-[#c7c4d8]/60">
            <span className="material-symbols-outlined text-[24px]">forward_to_inbox</span>
          </div>
        </div>
      </section>

      {/* Quick Invite Engineer Bar */}
      <section className="rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm p-5">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-[#0b1c30]">Quick Invite Engineer</h3>
          <p className="text-xs text-[#565e74]">
            Invite a team member directly to {currentCompany.name} workspace. Each accepted invite claims 1 developer seat.
          </p>
        </div>

        <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-xs font-mono text-[#0b1c30] font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#c7c4d8] text-[#0b1c30] text-xs focus:border-[#4f46e5]"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-mono text-[#0b1c30] font-semibold mb-1">Work Email</label>
            <input
              type="email"
              required
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              placeholder="jane@techcorp.com"
              className="w-full h-9 px-3 rounded-lg bg-white border border-[#c7c4d8] text-[#0b1c30] text-xs font-mono focus:border-[#4f46e5]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono text-[#0b1c30] font-semibold mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full h-9 px-2 rounded-lg bg-white border border-[#c7c4d8] text-[#0b1c30] text-xs font-mono focus:border-[#4f46e5]"
            >
              <option value="Developer">Developer</option>
              <option value="Senior Dev">Senior Dev</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Lead">Lead</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full h-9 px-4 rounded-lg bg-[#4f46e5] text-white text-xs font-mono font-semibold hover:bg-[#3525cd] transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>Send Invite</span>
            </button>
          </div>
        </form>
      </section>

      {/* Engineering Roster Table */}
      <section className="rounded-xl bg-white border border-[#c7c4d8]/60 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 px-6 border-b border-[#c7c4d8]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#f8f9ff]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#0b1c30]">Engineering Roster</span>
            <span className="text-xs font-mono text-[#565e74] bg-[#eff4ff] px-2 py-0.5 rounded">
              {filtered.length} Developers
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-8 px-2.5 rounded bg-white border border-[#c7c4d8] text-xs font-mono text-[#565e74] focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Senior">Senior Dev</option>
              <option value="Developer">Developer</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2.5 rounded bg-white border border-[#c7c4d8] text-xs font-mono text-[#565e74] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Invited">Invited</option>
              <option value="Open">Open</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] text-[#565e74] border-b border-[#c7c4d8]/40 text-xs font-mono uppercase tracking-wider">
                <th className="py-2.5 px-4 font-semibold">Developer</th>
                <th className="py-2.5 px-4 font-semibold">Role</th>
                <th className="py-2.5 px-4 font-semibold">Integrations</th>
                <th className="py-2.5 px-4 font-semibold">Status</th>
                <th className="py-2.5 px-4 font-semibold">Added Date</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/30 text-xs">
              {filtered.map((dev) => (
                <tr key={dev.id} className="hover:bg-[#f8f9ff] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#dae2fd] text-[#131b2e] font-semibold text-xs font-mono flex items-center justify-center">
                        {dev.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0b1c30]">{dev.name}</p>
                        <p className="text-[11px] text-[#565e74] font-mono">{dev.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono">{dev.role}</td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {dev.integrations?.length ? (
                        dev.integrations.map((integration, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#eff4ff] border border-[#c7c4d8]/60 font-mono text-[10px] text-[#0b1c30]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {integration}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-[#565e74] italic">None Configured</span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    {dev.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {dev.status}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-[#565e74] font-mono">{dev.addedDate}</td>

                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => setManageDrawerDev(dev)}
                        className="px-2.5 py-1 text-xs font-mono text-[#3525cd] hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                      <button
                        onClick={() => revokeDeveloperSeat(dev.id)}
                        className="px-2.5 py-1 text-xs font-mono text-rose-700 hover:text-rose-900 cursor-pointer"
                      >
                        Revoke Seat
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <DeveloperModal isOpen={isProvisionModalOpen} onClose={() => setIsProvisionModalOpen(false)} onSave={(dev) => addDeveloperSeat(dev)} />
      <DeveloperModal isOpen={!!manageDrawerDev} developer={manageDrawerDev} onClose={() => setManageDrawerDev(null)} onSave={(dev) => updateDeveloperSeat(manageDrawerDev.id, dev)} />

      {/* CLI Setup Modal */}
      {newlyAddedDev && (
        <div className="fixed inset-0 bg-[#0b1c30]/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#eff4ff] flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-[#0b1c30]">Developer Provisioned: {newlyAddedDev.name}</h3>
                <p className="text-[13px] text-[#565e74] mt-1">
                  An email has been sent to <strong>{newlyAddedDev.email}</strong> with these instructions.
                </p>
              </div>
              <button 
                onClick={() => setNewlyAddedDev(null)}
                className="text-[#565e74] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-[#eff4ff] border border-[#c7c4d8] rounded-lg p-4">
                <h4 className="font-semibold text-[#0b1c30] text-sm mb-2">Temporary Credentials</h4>
                <p className="text-sm font-mono bg-white border border-[#c7c4d8] p-2 rounded">
                  Password: {newlyAddedDev.temporary_password}
                </p>
              </div>

              <h4 className="font-semibold text-[#0b1c30] text-[15px]">Initial Setup & Workflow Instructions</h4>
              
              <div className="space-y-4 text-sm text-[#0b1c30]">
                <div className="border border-[#c7c4d8] rounded-lg p-4 bg-[#f8f9ff]">
                  <p className="font-semibold mb-2">Prerequisites (one-time, before touching this tool):</p>
                  <ul className="list-disc pl-5 space-y-1 text-[#565e74]">
                    <li>Git installed</li>
                    <li>Python 3.10+ installed</li>
                    <li><a href="https://docs.astral.sh/uv/" target="_blank" rel="noreferrer" className="text-[#3525cd] hover:underline">uv</a> installed</li>
                  </ul>
                </div>

                <div>
                  <p className="font-semibold mb-2">Step 1 — Authenticate Device</p>
                  <code className="block w-full bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    agentdev auth login --email {newlyAddedDev.email} --tenant {currentCompany.slug}
                  </code>
                </div>

                <div>
                  <p className="font-semibold mb-2">Step 2 — Verify Setup</p>
                  <code className="block w-full bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    agentdev check
                  </code>
                </div>

                <div>
                  <p className="font-semibold mb-2">Step 3 — Run an AI Agent Task</p>
                  <p className="text-xs text-[#565e74] mb-2">From inside a configured project directory:</p>
                  <code className="block w-full bg-[#1e1e1e] text-[#d4d4d4] p-3 rounded-lg font-mono text-xs overflow-x-auto">
                    agentdev run --ticket-id PROJ-101 --requirement "Add input validation to the signup form." --repo-path .
                  </code>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#eff4ff] flex justify-end">
              <button
                onClick={() => setNewlyAddedDev(null)}
                className="h-9 px-5 rounded-lg bg-[#4f46e5] text-white text-[13px] font-medium"
              >
                Close & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
