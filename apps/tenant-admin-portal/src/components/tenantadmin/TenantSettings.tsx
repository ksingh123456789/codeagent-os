import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import toast from 'react-hot-toast';

export const TenantSettings: React.FC = () => {
  const { 
    currentCompany, 
    updateSettings,
    enforceMfa: contextEnforceMfa,
    setEnforceMfa: setContextEnforceMfa,
    sessionTimeout: contextSessionTimeout,
    setSessionTimeout: setContextSessionTimeout
  } = usePlatform();
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // General state
  const [companyName, setCompanyName] = useState(currentCompany.name);
  const [workspaceSlug, setWorkspaceSlug] = useState(currentCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '-'));
  const [adminEmail, setAdminEmail] = useState(`admin@${currentCompany.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`);

  // Toast
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = async () => {
    try {
      if (activeTab === 'security') {
        if (!oldPassword || !newPassword || !confirmPassword) {
          toast.error("Please fill in all password fields");
          return;
        }
        if (newPassword !== confirmPassword) {
          toast.error("New passwords do not match");
          return;
        }
        const token = localStorage.getItem('access_token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/change-password`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
        });
        
        if (response.ok) {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          toast.success("Password changed successfully");
          setSavedToast(true);
          setTimeout(() => setSavedToast(false), 3000);
        } else {
          const data = await response.json();
          toast.error(`Failed to change password: ${data.detail || 'Unknown error'}`);
        }
        return;
      }

      await updateSettings({
        name: companyName,
      });
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving.");
    }
  };



  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-[#c7c4d8]/40">
        <div className="flex items-center gap-1.5 text-[#565e74] text-[12px] font-mono">
          <span>Settings</span>
          <span className="material-symbols-outlined text-[12px]">chevron_right</span>
          <span className="text-[#3525cd] font-medium">Tenant Configuration</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0b1c30]">
              Tenant Settings &amp; Configuration
            </h1>
            <p className="text-[14px] text-[#565e74] mt-0.5">
              Manage organization details, security policies, authentication, and access controls for your team.
            </p>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#eff4ff] border border-[#c7c4d8] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#006e4b]"></span>
            <span className="text-[11px] font-mono font-medium text-[#0b1c30]">Workspace Active</span>
            <span className="text-[#565e74] text-[11px] font-mono">region: us-east-1</span>
          </div>
          <button
            onClick={handleSave}
            className="h-8 px-4 bg-[#4f46e5] text-white text-[12px] font-medium rounded-lg hover:bg-[#3525cd] transition-colors shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-[#c7c4d8]/60 gap-8 text-[13px]">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'general'
              ? 'text-[#3525cd] border-b-2 border-[#3525cd] font-semibold'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">business</span>
          <span>1. General &amp; Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'security'
              ? 'text-[#3525cd] border-b-2 border-[#3525cd] font-semibold'
              : 'text-[#565e74] hover:text-[#0b1c30]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          <span>2. Security &amp; Password</span>
        </button>


      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* TAB 1: General & Profile */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <section className="bg-white border border-[#c7c4d8] rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff] mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#3525cd] text-[20px]">domain</span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#0b1c30]">Organization Details</h3>
                    <p className="text-[12px] text-[#565e74]">
                      Core company identifiers used across agent workspaces and pull requests.
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#eff4ff] text-[#565e74]">
                  Scope: Global
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[13px] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">Workspace Slug</label>
                  <input
                    type="text"
                    value={workspaceSlug}
                    onChange={(e) => setWorkspaceSlug(e.target.value)}
                    className="w-full h-9 px-3 font-mono text-[12px] rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">
                    Primary Admin Contact
                  </label>
                  <div className="relative max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-2 text-[#565e74] text-[18px]">
                      mail
                    </span>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[13px] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                    />
                  </div>
                  <p className="text-[11px] text-[#565e74] mt-1">
                    Billing invoices, root alerts, and rate-limit anomalies are sent to this mailbox.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
        {/* TAB 2: Security & Password */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <section className="bg-white border border-[#c7c4d8] rounded-xl p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff] mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[#3525cd] text-[20px]">lock_reset</span>
                  <div>
                    <h3 className="text-[16px] font-semibold text-[#0b1c30]">Change Password</h3>
                    <p className="text-[12px] text-[#565e74]">
                      Update your account password.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 max-w-md">
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[13px] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                <div className="md:col-span-2 max-w-md">
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[13px] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>

                <div className="md:col-span-2 max-w-md">
                  <label className="block text-[12px] font-mono text-[#0b1c30] mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-[#c7c4d8] bg-[#f8f9ff] text-[13px] text-[#0b1c30] focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      {/* Saved Toast */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#213145] text-white rounded-xl shadow-xl border border-[#3b516e] animate-in slide-in-from-bottom duration-200">
          <span className="material-symbols-outlined text-[#4edea3] text-[20px]">check_circle</span>
          <div>
            <div className="text-[13px] font-medium">Settings updated successfully</div>
            <div className="text-[11px] text-[#c7c4d8]">Tenant profile synchronized.</div>
          </div>
        </div>
      )}
    </div>
  );
};
