
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TenantConfig, getCurrentTenant } from '@/utils/tenantUtils';

interface TenantContextType {
  tenant: TenantConfig;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTenant = () => {
      try {
        const currentTenant = getCurrentTenant();
        setTenant(currentTenant);
        
        // Apply tenant branding to CSS variables
        document.documentElement.style.setProperty('--tenant-primary', currentTenant.branding.primaryColor);
        document.title = `${currentTenant.branding.companyName} - AutoSales AI`;
        
      } catch (error) {
        console.error('Error loading tenant:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTenant();
  }, []);

  if (isLoading || !tenant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-blue-600 p-4 rounded-lg inline-block mb-4">
            <div className="h-8 w-8 text-white animate-pulse">🚗</div>
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <TenantContext.Provider value={{ tenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
};
