import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { DeveloperMember } from '../../types/platform';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (dev: { name: string; email: string; role: DeveloperMember['role'] }) => Promise<any> | void;
  developer?: DeveloperMember | null;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose, onSave, developer }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<DeveloperMember['role']>('Developer');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (developer) {
      setName(developer.name);
      setEmail(developer.email);
      setRole(developer.role);
    } else {
      setName('');
      setEmail('');
      setRole('Developer');
    }
  }, [developer, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0b1c30]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-[480px] rounded-2xl shadow-2xl border border-[#c7c4d8]/60 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header styling */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-indigo-600 text-[22px]">
                {developer ? 'person_edit' : 'person_add'}
              </span>
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#0b1c30] tracking-tight">
                {developer ? 'Edit Developer' : 'Provision New Seat'}
              </h2>
              <p className="text-[12px] text-[#565e74] mt-0.5">
                {developer ? 'Update role and access settings.' : 'Invite a new developer to your organization.'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#777587] hover:bg-[#f8f9ff] hover:text-[#0b1c30] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="px-6 py-2 space-y-5 overflow-y-auto max-h-[60vh]">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1.5 flex items-center gap-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#777587]">
                  badge
                </span>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Jane Doe"
                  className="w-full h-10 pl-10 pr-3 text-[14px] text-[#0b1c30] rounded-lg border border-[#c7c4d8] bg-white focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10 outline-none transition-all placeholder:text-[#a1a1aa]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-1.5 flex items-center gap-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-[#777587]">
                  mail
                </span>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="jane@company.com"
                  disabled={!!developer}
                  className={`w-full h-10 pl-10 pr-3 text-[14px] rounded-lg border border-[#c7c4d8] outline-none transition-all placeholder:text-[#a1a1aa] ${
                    developer 
                      ? 'bg-[#f4f4f5] text-[#71717a] cursor-not-allowed border-[#e4e4e7]' 
                      : 'bg-white text-[#0b1c30] focus:border-[#4f46e5] focus:ring-4 focus:ring-[#4f46e5]/10'
                  }`}
                />
              </div>
              {developer && (
                <p className="text-[11px] text-[#71717a] mt-1.5 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Email addresses cannot be modified after creation.
                </p>
              )}
            </div>
            
            {/* Custom Role Selector */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0b1c30] mb-2">Access Role</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Developer', label: 'Developer', icon: 'code', desc: 'Standard access' },
                  { id: 'Senior Dev', label: 'Senior Dev', icon: 'terminal', desc: 'Advanced features' },
                  { id: 'Staff Dev', label: 'Staff Dev', icon: 'account_tree', desc: 'Architecture scope' },
                  { id: 'Lead', label: 'Lead', icon: 'group', desc: 'Team management' },
                ].map(r => (
                  <div 
                    key={r.id}
                    onClick={() => setRole(r.id as any)}
                    className={`relative flex flex-col p-3 rounded-xl border transition-all cursor-pointer select-none ${
                      role === r.id 
                        ? 'border-[#4f46e5] bg-indigo-50/50 shadow-sm ring-1 ring-[#4f46e5]' 
                        : 'border-[#e4e4e7] bg-white hover:border-[#c7c4d8] hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`material-symbols-outlined text-[18px] ${role === r.id ? 'text-[#4f46e5]' : 'text-[#71717a]'}`}>
                        {r.icon}
                      </span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${role === r.id ? 'border-[#4f46e5] bg-[#4f46e5]' : 'border-[#d4d4d8]'}`}>
                        {role === r.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div className={`text-[13px] font-semibold ${role === r.id ? 'text-[#312e81]' : 'text-[#3f3f46]'}`}>
                      {r.label}
                    </div>
                    <div className="text-[11px] text-[#71717a] mt-0.5">{r.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 mt-2 border-t border-[#e5eeff] bg-slate-50/80 flex items-center justify-between rounded-b-2xl">
          <div className="text-[11px] text-[#71717a] font-medium max-w-[200px]">
            {developer ? 'Updating will sync instantly.' : 'Invitation link will be sent via email.'}
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-4 h-10 rounded-lg text-[13px] font-medium text-[#3f3f46] bg-white border border-[#d4d4d8] hover:bg-slate-100 hover:text-[#09090b] transition-all shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await onSave({ name, email, role });
                  if (res !== false && res !== null) {
                    toast.success(developer ? "Developer updated successfully" : "Developer added successfully");
                    onClose();
                  }
                } catch (err) {
                  // error handled by the caller via toast
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!name || !email || loading}
              className="px-5 h-10 rounded-lg bg-[#4f46e5] text-white text-[13px] font-medium hover:bg-[#4338ca] hover:shadow-md transition-all shadow-sm shadow-indigo-200 disabled:opacity-60 disabled:hover:shadow-none active:scale-[0.98] flex items-center gap-2"
            >
              {loading ? (
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
              ) : (
                <span className="material-symbols-outlined text-[18px]">
                  {developer ? 'save' : 'send'}
                </span>
              )}
              {developer ? (loading ? 'Saving...' : 'Save Changes') : (loading ? 'Provisioning...' : 'Provision Seat')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
