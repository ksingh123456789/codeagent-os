import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { usePlatform } from "../../context/PlatformContext";

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectTypeKey: string;
}

interface JiraTicket {
  id: string;
  key: string;
  fields: {
    summary: string;
    description: any;
    status: {
      name: string;
    };
    issuetype: {
      name: string;
    };
  };
}

export const DeveloperProjects: React.FC = () => {
  const { setDeveloperPage, setSelectedProjectKey } = usePlatform();
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/developer/projects`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      },
    )
      .then((r) => r.json())
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoadingProjects(false));
  }, []);

  const handleViewTickets = (project: JiraProject) => {
    setSelectedProjectKey(project.key);
    setDeveloperPage("workbench");
  };



  if (projects.length === 0 && !loadingProjects) {
    return (
      <div className="flex-1 p-6 sm:p-8 flex items-center justify-center text-slate-600 bg-slate-50 overflow-y-auto">
        <div className="text-center max-w-md">
          <span className="material-symbols-outlined text-4xl mb-4 text-[#3525cd]">
            view_kanban
          </span>
          <h2 className="text-xl font-bold text-[#0b1c30] mb-2">
            No Projects Found
          </h2>
          <p className="text-sm font-sans mb-4">
            You have not connected Jira, or there are no projects available to
            your account.
          </p>
          <button
            onClick={() => setDeveloperPage("integrations")}
            className="px-4 py-2.5 sm:py-2 bg-[#4f46e5] text-white rounded-lg font-semibold text-sm hover:bg-[#3525cd] transition-colors shadow-sm"
          >
            Go to Integrations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 relative overflow-y-auto touch-scroll p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-5 sm:space-y-6">
      {loadingProjects && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2 text-[#3525cd] font-mono text-xs">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Syncing with Jira...
          </div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c7c4d8]/60 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0b1c30] tracking-tight">
            Active Projects
          </h1>
          <p className="text-xs text-[#565e74] mt-1 font-mono">
            Synced from your connected Jira instance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white border border-[#c7c4d8]/60 rounded-xl p-4 sm:p-5 shadow-sm flex flex-col justify-between hover:border-[#3525cd]/50 hover:shadow-md hover:-translate-y-0.5 transition-all min-w-0"
          >
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-[#c7c4d8]/40">
                <div className="w-10 h-10 shrink-0 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#3525cd] border border-[#c7c4d8]/60">
                  <span className="material-symbols-outlined">dataset</span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#0b1c30] truncate">
                    {proj.name}
                  </h3>
                  <span className="text-xs font-mono text-[#565e74] px-1.5 py-0.5 rounded bg-[#f8f9ff] border border-[#c7c4d8]/40">
                    KEY: {proj.key}
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#565e74] mt-3 font-sans">
                {proj.projectTypeKey === "software"
                  ? "Software Development Project"
                  : "Business Project"}
              </p>
            </div>
            <div className="pt-4 mt-4">
              <button
                onClick={() => handleViewTickets(proj)}
                className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-2 bg-[#f8f9ff] hover:bg-[#eff4ff] hover:border-[#3525cd]/40 border border-[#c7c4d8] text-[#3525cd] font-semibold text-sm rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  format_list_bulleted
                </span>
                View Assigned Tickets
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
