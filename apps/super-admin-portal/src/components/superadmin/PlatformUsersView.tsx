import React, { useState, useEffect } from 'react';
import { api } from '../../api/client';
import toast from 'react-hot-toast';
import { usePlatform } from '../../context/PlatformContext';

export const PlatformUsersView: React.FC = () => {
  const { companies } = usePlatform();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('Active');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'Super Admin' | 'Custom Admin'>('Super Admin');
  const [invitePermissions, setInvitePermissions] = useState<string[]>([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'Super Admin' | 'Custom Admin'>('Super Admin');
  const [editPermissions, setEditPermissions] = useState<string[]>([]);

  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [userToRevoke, setUserToRevoke] = useState<number | null>(null);

  const filteredUsers = users.filter((u) => {
    const roleDisplay = u.role === 'SUPER_ADMIN' ? 'Super Admin' : (u.role === 'CUSTOM_ADMIN' ? 'Custom Admin' : u.role);
    const matchesSearch =
      (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (roleDisplay || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || roleDisplay === roleFilter;
    const matchesStatus = statusFilter === 'All' || (u.status === 'ACTIVE' ? 'Active' : 'Suspended') === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await api.superAdmin.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: inviteName || 'New Administrator',
        email: inviteEmail || 'user@codeagent.io',
        role: inviteRole === 'Super Admin' ? 'SUPER_ADMIN' : 'CUSTOM_ADMIN',
        scope: inviteRole === 'Super Admin' ? 'Global Root' : `Custom: ${invitePermissions.length > 0 ? invitePermissions.join(', ') : 'None'}`
      };
      await api.superAdmin.createUser(payload);
      await fetchUsers();
      setShowInviteModal(false);
      setInviteName('');
      setInviteEmail('');
      setInvitePermissions([]);
      toast.success("User invited successfully!");
    } catch (error: any) {
      console.error("Failed to invite user", error);
      
      let errorMsg = "An unexpected error occurred.";
      if (error.response) {
        if (error.response.status === 500) {
          errorMsg = "Internal Server Error (500). Please check the backend logs.";
        } else if (error.response.data && error.response.data.detail) {
          errorMsg = error.response.data.detail;
        } else {
          errorMsg = `Error ${error.response.status}: Failed to invite user.`;
        }
      }
      
      toast.error(errorMsg);
    }
  };

  const handleRevokeClick = (id: number) => {
    setUserToRevoke(id);
    setShowRevokeModal(true);
  };

  const confirmRevoke = async () => {
    if (!userToRevoke) return;
    try {
      await api.superAdmin.deleteUser(userToRevoke);
      await fetchUsers();
      toast.success("User revoked successfully");
      setShowRevokeModal(false);
      setUserToRevoke(null);
    } catch (error: any) {
      console.error("Failed to revoke user", error);
      toast.error(error.response?.data?.detail || "Failed to revoke user");
    }
  };

  const handleEditClick = (u: any) => {
    setEditingUserId(u.id);
    setEditName(u.name);
    setEditRole(u.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Custom Admin');
    
    if (u.role === 'CUSTOM_ADMIN' && u.scope && u.scope.startsWith('Custom: ')) {
      const perms = u.scope.replace('Custom: ', '').split(', ');
      setEditPermissions(perms);
    } else {
      setEditPermissions([]);
    }
    
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUserId) return;
    try {
      const payload = {
        name: editName,
        role: editRole === 'Super Admin' ? 'SUPER_ADMIN' : 'CUSTOM_ADMIN',
        scope: editRole === 'Super Admin' ? 'Global Root' : `Custom: ${editPermissions.length > 0 ? editPermissions.join(', ') : 'None'}`
      };
      await api.superAdmin.updateUser({ id: editingUserId, data: payload });
      await fetchUsers();
      setShowEditModal(false);
      toast.success("User updated successfully!");
    } catch (error: any) {
      console.error("Failed to update user", error);
      toast.error(error.response?.data?.detail || "Failed to update user");
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto flex flex-col gap-5 sm:gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">Platform Users & Roles</h1>
          <p className="text-sm text-[#565e74] mt-1">
            Manage super administrators, platform operators, and view tenant admin contacts
          </p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 bg-[#3525cd] text-white px-4 py-2 rounded-lg text-xs font-mono font-semibold hover:bg-[#4f46e5] transition-colors shadow-sm active:scale-[0.99] cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Invite User</span>
        </button>
      </div>

      {/* Metric Pills Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono text-[#565e74] block uppercase tracking-wider">Total Admins</span>
            <div className="text-2xl font-bold text-[#0b1c30] mt-0.5">{(users.filter(u => u.status === 'ACTIVE').length + companies.length).toLocaleString()} Active</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono text-[#565e74] block uppercase tracking-wider">Super Admins</span>
            <div className="text-2xl font-bold text-[#0b1c30] mt-0.5">{users.filter(u => u.role === 'SUPER_ADMIN').length.toLocaleString()} Root</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">security</span>
          </div>
        </div>

        <div className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-mono text-[#565e74] block uppercase tracking-wider">Company Admins</span>
            <div className="text-2xl font-bold text-[#0b1c30] mt-0.5">{companies.length.toLocaleString()} Across Orgs</div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#e5eeff] flex items-center justify-center text-[#3525cd]">
            <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-4 rounded-xl border border-[#c7c4d8]/60 shadow-sm">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#777587] text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#c7c4d8] rounded-lg focus:border-[#3525cd] focus:outline-none text-[#0b1c30]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#c7c4d8] rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[#565e74] font-mono">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs text-[#0b1c30] focus:ring-0 cursor-pointer font-medium"
            >
              <option>All Roles</option>
              <option>Super Admin</option>
              <option>Custom Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#f8f9ff] border border-[#c7c4d8] rounded-lg px-2.5 py-1 text-xs">
            <span className="text-[#565e74] font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-0 p-0 text-xs text-[#0b1c30] focus:ring-0 cursor-pointer font-medium"
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setRoleFilter('All Roles');
              setStatusFilter('Active');
            }}
            className="px-2.5 py-1 text-[#565e74] hover:text-[#0b1c30] text-xs font-mono flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">filter_list_off</span>
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Clean Spacious User Directory Table */}
      <div className="bg-white border border-[#c7c4d8]/60 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] md:min-w-0 text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c7c4d8]/40 h-9 text-[11px] font-mono text-[#565e74] uppercase">
                <th className="px-4 py-2 font-semibold">User</th>
                <th className="px-4 py-2 font-semibold">Role</th>
                <th className="px-4 py-2 font-semibold">Assigned Scope</th>
                <th className="px-4 py-2 font-semibold">2FA/Security Status</th>
                <th className="px-4 py-2 font-semibold">Last Active</th>
                <th className="px-4 py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c7c4d8]/30 text-xs">
              {filteredUsers.map((u) => {
                const initials = u.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <tr key={u.id} className="hover:bg-[#f8f9ff] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#4f46e5] text-white flex items-center justify-center font-bold text-xs font-mono">
                          {initials}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0b1c30]">{u.name}</div>
                          <div className="font-mono text-[#565e74] text-[11px]">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-[#3525cd]/10 text-[#3525cd] border border-[#3525cd]/20">
                        {u.role === 'SUPER_ADMIN' ? 'Super Admin' : (u.role === 'CUSTOM_ADMIN' ? 'Custom Admin' : u.role)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-[#0b1c30] bg-[#e5eeff] px-2 py-0.5 rounded font-medium">
                        {u.scope || 'Global Root'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs text-[#0b1c30]">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">vpn_key</span>
                        <span>Authenticator App</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-[#565e74] font-mono text-[11px]">{u.last_login_at || 'Just invited'}</td>

                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-[#3525cd] hover:underline font-medium cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-[#c7c4d8]">|</span>
                        <button
                          onClick={() => handleRevokeClick(u.id)}
                          className="text-[#565e74] hover:text-[#ba1a1a] transition-colors cursor-pointer"
                        >
                          Revoke
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#c7c4d8]/40 bg-[#f8f9ff] text-xs font-mono text-[#565e74]">
          <span>Showing 1 to {filteredUsers.length} of {users.length} users</span>
          <div className="flex items-center gap-1">
            <button className="px-2.5 py-1 rounded border border-[#c7c4d8] bg-white disabled:opacity-40" disabled>
              Previous
            </button>
            <button className="px-2.5 py-1 text-white bg-[#3525cd] rounded font-medium">1</button>
            <button className="px-2.5 py-1 border border-[#c7c4d8] bg-white text-[#0b1c30]">Next</button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleInvite}
            className="bg-white rounded-xl border border-[#c7c4d8] max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]">
              <h3 className="text-base font-semibold text-[#0b1c30]">Invite Platform Administrator</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="text-[#777587] hover:text-black"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="rachel@codeagent.io"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">Administrative Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs font-mono"
                >
                  <option value="Super Admin">Super Admin (Global Root)</option>
                  <option value="Custom Admin">Custom Admin (Specific Access)</option>
                </select>
              </div>
              {inviteRole === 'Custom Admin' && (
                <div className="pt-2">
                  <label className="block text-[#565e74] font-semibold mb-2">Specific Permissions</label>
                  <div className="space-y-2">
                    {[
                      { id: 'Companies', label: 'Manage Companies' },
                      { id: 'License Plans', label: 'Manage License Plans' },
                      { id: 'Users', label: 'Manage Platform Users' },
                      { id: 'Settings', label: 'Manage Global Settings' }
                    ].map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={invitePermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInvitePermissions([...invitePermissions, perm.id]);
                            } else {
                              setInvitePermissions(invitePermissions.filter(p => p !== perm.id));
                            }
                          }}
                          className="w-4 h-4 text-[#3525cd] rounded border-[#c7c4d8] focus:ring-[#3525cd]"
                        />
                        <span className="text-[#0b1c30]">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#c7c4d8]">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-3 py-1.5 border border-[#c7c4d8] rounded text-xs text-[#565e74]"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#3525cd] text-white rounded text-xs font-semibold">
                Send Invitation
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-xl border border-[#c7c4d8] max-w-md w-full p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#c7c4d8]">
              <h3 className="text-base font-semibold text-[#0b1c30]">Edit Administrator</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-[#777587] hover:text-black"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[#565e74] font-semibold mb-1">Administrative Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full h-8 px-2.5 border border-[#c7c4d8] rounded text-xs font-mono"
                >
                  <option value="Super Admin">Super Admin (Global Root)</option>
                  <option value="Custom Admin">Custom Admin (Specific Access)</option>
                </select>
              </div>
              {editRole === 'Custom Admin' && (
                <div className="pt-2">
                  <label className="block text-[#565e74] font-semibold mb-2">Specific Permissions</label>
                  <div className="space-y-2">
                    {[
                      { id: 'Companies', label: 'Manage Companies' },
                      { id: 'License Plans', label: 'Manage License Plans' },
                      { id: 'Users', label: 'Manage Platform Users' },
                      { id: 'Settings', label: 'Manage Global Settings' }
                    ].map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editPermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setEditPermissions([...editPermissions, perm.id]);
                            } else {
                              setEditPermissions(editPermissions.filter(p => p !== perm.id));
                            }
                          }}
                          className="w-4 h-4 text-[#3525cd] rounded border-[#c7c4d8] focus:ring-[#3525cd]"
                        />
                        <span className="text-[#0b1c30]">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#c7c4d8]">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 border border-[#c7c4d8] rounded text-xs text-[#565e74]"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#3525cd] text-white rounded text-xs font-semibold">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Revoke Confirmation Modal */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#c7c4d8] max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-[#ba1a1a]">
              <div className="w-10 h-10 rounded-full bg-[#ba1a1a]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <h3 className="text-base font-semibold text-[#0b1c30]">Revoke Access?</h3>
            </div>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Are you sure you want to revoke this user's access? They will no longer be able to log into the platform. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[#c7c4d8]">
              <button
                type="button"
                onClick={() => {
                  setShowRevokeModal(false);
                  setUserToRevoke(null);
                }}
                className="px-3 py-1.5 border border-[#c7c4d8] rounded text-xs text-[#565e74] font-medium hover:bg-[#f8f9ff] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRevoke}
                className="px-4 py-1.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded text-xs font-semibold transition-colors cursor-pointer"
              >
                Revoke User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
