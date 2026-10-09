import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { CreateCompanyModal } from './components/common/CreateCompanyModal';

// Super Admin Components
import { SuperAdminSidebar } from './components/superadmin/SuperAdminSidebar';
import { SuperAdminHeader } from './components/superadmin/SuperAdminHeader';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { CompaniesManagement } from './components/superadmin/CompaniesManagement';
import { LicensePlansView } from './components/superadmin/LicensePlansView';
import { PlatformUsersView } from './components/superadmin/PlatformUsersView';
import { FleetAnalyticsView } from './components/superadmin/FleetAnalyticsView';
import { SystemSettingsView } from './components/superadmin/SystemSettingsView';
import { ProjectsSprintBacklogView } from './components/superadmin/ProjectsSprintBacklogView';

// Auth Gateway
import { UnifiedSignInView } from './components/auth/UnifiedSignInView';

const PortalContainer: React.FC = () => {
  const {
    portal,
    superAdminPage,
  } = usePlatform();

  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  // Off-canvas sidebar state for phones / tablets (sidebar is always visible on lg+)
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [superAdminPage]);

  // If not logged in, show login
  if (portal === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <UnifiedSignInView />
      </div>
    );
  }

  // Only allow super-admin rendering in this app
  if (portal !== 'super-admin') {
    return <div className="p-10 text-sm font-medium text-[#0b1c30]">Access Denied. Invalid Portal State.</div>;
  }

  return (
    <div className="flex flex-col h-screen h-dvh w-full overflow-hidden bg-[#f8f9ff]">
      <div className="flex-1 flex overflow-hidden min-h-0">
        <div className="flex-1 flex overflow-hidden w-full">
          <SuperAdminSidebar
            onOpenNewCompany={() => { setMobileNavOpen(false); setIsCreateCompanyOpen(true); }}
            mobileOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8f9ff]">
            <SuperAdminHeader
              title={
                superAdminPage === 'dashboard'
                  ? 'Super Admin Overview'
                  : superAdminPage === 'companies'
                  ? 'Companies & Tenants'
                  : superAdminPage === 'license-plans'
                  ? 'Global License Plans'
                  : superAdminPage === 'users'
                  ? 'Platform Administrators'
                  : superAdminPage === 'analytics'
                  ? 'Fleet Telemetry & Analytics'
                  : superAdminPage === 'settings'
                  ? 'Platform Security & Rules'
                  : 'Projects & Sprint Backlog'
              }
              onOpenNewCompany={() => setIsCreateCompanyOpen(true)}
              onOpenMobileNav={() => setMobileNavOpen(true)}
            />

            <main className="flex-1 overflow-y-auto overflow-x-hidden touch-scroll min-h-0">
              {superAdminPage === 'dashboard' && (
                <SuperAdminDashboard onOpenNewCompany={() => setIsCreateCompanyOpen(true)} />
              )}
              {superAdminPage === 'companies' && (
                <CompaniesManagement onOpenNewCompany={() => setIsCreateCompanyOpen(true)} />
              )}
              {superAdminPage === 'license-plans' && <LicensePlansView />}
              {superAdminPage === 'users' && <PlatformUsersView />}
              {superAdminPage === 'analytics' && <FleetAnalyticsView />}
              {superAdminPage === 'settings' && <SystemSettingsView />}
              {superAdminPage === 'projects' && <ProjectsSprintBacklogView />}
            </main>
          </div>
        </div>
      </div>

      <CreateCompanyModal
        isOpen={isCreateCompanyOpen}
        onClose={() => setIsCreateCompanyOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <PlatformProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          style: { 
            background: '#1e293b', 
            color: '#fff',
            border: '1px solid #334155'
          } 
        }} 
      />
      <PortalContainer />
    </PlatformProvider>
  );
}
