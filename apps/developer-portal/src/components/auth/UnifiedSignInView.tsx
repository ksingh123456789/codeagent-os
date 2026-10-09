import React, { useState } from "react";
import toast from "react-hot-toast";
import { usePlatform } from "../../context/PlatformContext";

export const UnifiedSignInView: React.FC = () => {
  const { setPortal, setDeveloperPage } = usePlatform();
  const [email, setEmail] = useState("john.doe@techcorp.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("access_token", data.access_token);
        if (data.refresh_token)
          localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("user_role", data.role);
        if (data.user) {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
        setPortal("developer");
        setDeveloperPage("workbench");
      } else {
        const errorData = await response.json();
        toast.error(`Login failed: ${errorData.detail}`);
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error connecting to backend.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 flex flex-col justify-between selection:bg-emerald-500 selection:text-black">
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(16,185,129,0.15),rgba(255,255,255,0))]" />

      <header className="relative z-10 border-b border-slate-800/80 bg-[#0d121c]/70 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between" style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 p-0.5 shadow-lg shadow-emerald-950/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-xl">
              code
            </span>
          </div>
          <div>
            <div className="text-base font-bold text-white tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1">
              CodeAgent OS
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Developer Workbench
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Autonomous LangGraph Coding Infrastructure
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        <div className="flex-1 space-y-6 max-w-xl text-center lg:text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
              <span className="material-symbols-outlined text-sm">
                integration_instructions
              </span>
              <span>Developer Execution Environment</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              One Unified Core.{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Developer Workbench.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
              Sign in to access your assigned Jira tickets, view rich AST diffs,
              and dispatch autonomous LangGraph coding agents to execute tasks
              on your sandbox branches.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md bg-[#0f1420] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80">
          <h2 className="text-xl font-bold text-white mb-2">Developer Login</h2>
          <p className="text-xs text-slate-400 mb-6">
            Access your sandbox environments.
          </p>

          <div className="bg-[#0a0e16] border border-slate-800 rounded-lg p-4 mb-6 text-center">
            <span className="material-symbols-outlined text-emerald-500 text-3xl mb-2">
              lock_person
            </span>
            <p className="text-xs text-slate-400 font-medium">
              Developer authentication is securely managed via GitHub OAuth.
            </p>
          </div>

          <button
            onClick={() => {
              setIsLoggingIn(true);
              setTimeout(() => {
                const params = new URLSearchParams(window.location.search);
                const inviteToken = params.get("invite_token");
                let loginUrl = `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/auth/github/login?redirect_uri=${encodeURIComponent(window.location.origin + "/callback")}`;
                if (inviteToken) {
                  loginUrl += `&invite_token=${encodeURIComponent(inviteToken)}`;
                }
                window.location.href = loginUrl;
              }, 800);
            }}
            disabled={isLoggingIn}
            className="w-full py-3 bg-[#24292e] hover:bg-[#2f363d] border border-[#1b1f23]/20 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-black/40 cursor-pointer active:scale-[0.98]"
          >
            {isLoggingIn ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  sync
                </span>
                <span>Redirecting to GitHub...</span>
              </>
            ) : (
              <>
                <svg
                  height="20"
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  version="1.1"
                  width="20"
                  data-view-component="true"
                  className="fill-current"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
                <span>Continue with GitHub</span>
              </>
            )}
          </button>
        </div>
      </main>

      <footer className="relative z-10 border-t border-slate-800/80 bg-[#0d121c]/70 backdrop-blur-md px-4 sm:px-6 py-4 text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-between gap-x-4 gap-y-2" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>CodeAgent OS Enterprise Platform</span>
          <span>•</span>
          <span>Zero-Trust Gateway</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Developer Sandbox Port 3002
          </span>
        </div>
      </footer>
    </div>
  );
};
