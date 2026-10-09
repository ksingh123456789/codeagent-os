import React, { useState } from 'react';
import { usePlatform } from '../../context/PlatformContext';
import toast from 'react-hot-toast';

export const UnifiedSignInView: React.FC = () => {
  const { setPortal, setTenantAdminPage, setSelectedTenantId } = usePlatform();
  const [email, setEmail] = useState('alex.turner@techcorp.com');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user_role', data.role);
        if (data.user) {
          localStorage.setItem('user_data', JSON.stringify(data.user));
          if (data.user.company_id) {
            setSelectedTenantId(String(data.user.company_id));
          }
        }
        if (data.role === 'SUPER_ADMIN') {
          window.location.href = 'http://localhost:3001';
        } else if (data.role === 'TENANT_ADMIN') {
          setPortal('tenant-admin');
          setTenantAdminPage('overview');
        } else {
          window.location.href = 'http://localhost:3002';
        }
      } else {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.detail}`);
      }
    } catch (e) {
      console.error(e);
      toast.error('Network error connecting to backend.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col justify-between selection:bg-blue-500 selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" />

      <header className="relative z-10 border-b border-slate-800/80 bg-[#0d121c]/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-blue-950/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">corporate_fare</span>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              CodeAgent OS
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/30">
                Tenant Admin Console
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Autonomous LangGraph Coding Infrastructure</div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-12">
        <div className="flex-1 space-y-6 max-w-xl">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-950/60 text-blue-400 border border-blue-500/30">
              <span className="material-symbols-outlined text-sm">groups</span>
              <span>Organization Management</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              One Unified Core.{' '}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Tenant Operations.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Manage your organization's developer seats, oversee project mappings, and control API quotas for autonomous agents across your tenant environment.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md bg-[#0f1420] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <h2 className="text-xl font-bold text-white mb-2">Tenant Admin Login</h2>
          <p className="text-xs text-slate-400 mb-6">Access your organization's control plane.</p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Work Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-sm">alternate_email</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#0a0e16] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">Password</label>
                <button 
                  type="button" 
                  onClick={async () => {
                    if (!email) {
                      toast.error("Please enter your email address first.");
                      return;
                    }
                    try {
                      const response = await fetch('http://localhost:8000/api/v1/auth/forgot-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email }),
                      });
                      if (response.ok) {
                        toast.success("If the email is registered, a reset link will be sent securely.");
                      } else {
                        toast.error("Failed to send reset link.");
                      }
                    } catch (e) {
                      toast.error("Network error.");
                    }
                  }} 
                  className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-sm">lock</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#0a0e16] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono" />
              </div>
            </div>
            <button onClick={handleSignIn} disabled={isLoggingIn} className="w-full mt-2 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-2">
              {isLoggingIn ? (
                <><span className="material-symbols-outlined text-sm animate-spin">sync</span><span>Authenticating...</span></>
              ) : (
                <><span className="material-symbols-outlined text-sm">login</span><span>Sign In to Tenant Console</span></>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0d121c]/70 backdrop-blur-md px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span>CodeAgent OS Enterprise Platform</span>
          <span>•</span>
          <span>Isolated Tenant Environment</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Tenant Admin Port 3001
          </span>
        </div>
      </footer>
    </div>
  );
};
