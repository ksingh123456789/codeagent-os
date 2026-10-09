import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PlatformProvider, usePlatform } from './context/PlatformContext';

// Developer Workbench Components
import { DeveloperSidebar } from './components/developer/DeveloperSidebar';
import { DeveloperHeader } from './components/developer/DeveloperHeader';
import { DeveloperWorkbench } from './components/developer/DeveloperWorkbench';
import { DeveloperDiffViewer } from './components/developer/DeveloperDiffViewer';
import { DeveloperTraceLogs } from './components/developer/DeveloperTraceLogs';
import { DeveloperIntegrations } from './components/developer/DeveloperIntegrations';
import { DeveloperProjects } from './components/developer/DeveloperProjects';
import { DeveloperSettings } from './components/developer/DeveloperSettings';

// Auth Gateway
import { UnifiedSignInView } from './components/auth/UnifiedSignInView';

const PortalContainer: React.FC = () => {
  const {
    portal,
    developerPage,
    setPortal,
    setDeveloperPage,
    fetchExecutionHistory,
    fetchExecutionMetrics
  } = usePlatform();

  // Off-canvas sidebar state for phones / tablets (sidebar is always visible on lg+)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [developerPage]);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const role = urlParams.get('role') || 'DEVELOPER';
    
    if (window.location.pathname === '/callback' && token) {
      localStorage.setItem('access_token', token);
      localStorage.setItem('user_role', role);
      
      // Fetch user data for GitHub login
      fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1"}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.id) localStorage.setItem('user_data', JSON.stringify(data));
        setPortal('developer');
        setDeveloperPage('workbench');
        fetchExecutionHistory(1);
        fetchExecutionMetrics();
        window.history.replaceState({}, document.title, '/');
      });
    } else {
      const existingToken = localStorage.getItem('access_token');
      if (existingToken) {
        setPortal('developer');
        fetchExecutionHistory(1);
        fetchExecutionMetrics();
      }
    }
  }, [setPortal, setDeveloperPage]);

  // If not logged in, show login
  if (portal === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <UnifiedSignInView />
      </div>
    );
  }

  // Only allow developer rendering in this app
  if (portal !== 'developer') {
    return <div className="p-10 text-sm font-medium text-[#0b1c30]">Access Denied. Invalid Portal State.</div>;
  }

  return (
    <div className="flex flex-col h-screen h-dvh w-full overflow-hidden bg-[#f8f9ff]">
      <div className="flex-1 flex overflow-hidden w-full min-h-0">
        <DeveloperSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          <DeveloperHeader onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {developerPage === 'workbench' && <DeveloperWorkbench />}
            {developerPage === 'diff-review' && <DeveloperDiffViewer />}
            {(developerPage === 'trace-logs' || developerPage === 'history') && <DeveloperTraceLogs />}
            {developerPage === 'integrations' && <DeveloperIntegrations />}
            {developerPage === 'projects' && <DeveloperProjects />}
            {developerPage === 'settings' && <DeveloperSettings />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <Toaster position="top-right" />
      <PortalContainer />
    </PlatformProvider>
  );
}
