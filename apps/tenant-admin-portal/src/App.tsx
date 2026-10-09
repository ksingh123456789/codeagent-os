import React from 'react';
import { PlatformProvider, usePlatform } from './context/PlatformContext';
import { Toaster } from 'react-hot-toast';

// Tenant Admin Components
import { TenantAdminSidebar } from './components/tenantadmin/TenantAdminSidebar';
import { TenantAdminHeader } from './components/tenantadmin/TenantAdminHeader';
import { TenantOverview } from './components/tenantadmin/TenantOverview';
import { TenantDevelopers } from './components/tenantadmin/TenantDevelopers';

import { TenantLicenseUsage } from './components/tenantadmin/TenantLicenseUsage';
import { TenantSettings } from './components/tenantadmin/TenantSettings';

// Auth Gateway
import { UnifiedSignInView } from './components/auth/UnifiedSignInView';

const PortalContainer: React.FC = () => {
  const {
    portal,
    tenantAdminPage,
  } = usePlatform();

  // Off-canvas sidebar state for phones / tablets (sidebar is always visible on lg+)
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  React.useEffect(() => {
    setMobileNavOpen(false);
  }, [tenantAdminPage]);

  // If not logged in, show login
  if (portal === 'login') {
    return (
      <div className="flex flex-col min-h-screen">
        <UnifiedSignInView />
      </div>
    );
  }

  // Only allow tenant-admin rendering in this app
  if (portal !== 'tenant-admin') {
    return <div className="p-10 text-sm font-medium text-[#0b1c30]">Access Denied. Invalid Portal State.</div>;
  }

  return (
    <div className="flex flex-col h-screen h-dvh w-full overflow-hidden bg-[#f8f9ff]">
      <div className="flex-1 flex overflow-hidden w-full min-h-0">
        <TenantAdminSidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          <TenantAdminHeader onOpenInviteModal={() => {}} onOpenMobileNav={() => setMobileNavOpen(true)} />

          <main className="flex-1 overflow-y-auto overflow-x-hidden touch-scroll min-h-0">
            {tenantAdminPage === 'overview' && <TenantOverview />}
            {tenantAdminPage === 'developers' && <TenantDevelopers />}

            {tenantAdminPage === 'license-usage' && <TenantLicenseUsage />}
            {tenantAdminPage === 'settings' && <TenantSettings />}
          </main>
        </div>
      </div>
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
