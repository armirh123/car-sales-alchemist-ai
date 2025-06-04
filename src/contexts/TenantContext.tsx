
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

interface TenantBranding {
  primaryColor: string;
  companyName: string;
  logo?: string;
}

interface TenantFeatures {
  aiAssistant: boolean;
  advancedReporting: boolean;
  multiUser: boolean;
  maxUsers: number;
}

interface CompanySettings {
  branding: TenantBranding;
  features: TenantFeatures;
}

interface TenantContextType {
  tenant: {
    branding: TenantBranding;
    features: TenantFeatures;
  };
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({} as TenantContextType);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { company, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [tenant, setTenant] = useState({
    branding: {
      primaryColor: '#2563eb',
      companyName: 'AutoSales AI'
    },
    features: {
      aiAssistant: true,
      advancedReporting: false,
      multiUser: true,
      maxUsers: 5
    }
  });

  useEffect(() => {
    if (!authLoading) {
      if (company?.settings) {
        // Safely parse the JSON settings with proper type casting
        const settings = company.settings as unknown as CompanySettings;
        setTenant({
          branding: settings.branding,
          features: settings.features
        });
      }
      setIsLoading(false);
    }
  }, [company, authLoading]);

  return (
    <TenantContext.Provider value={{ tenant, isLoading }}>
      {children}
    </TenantContext.Provider>
  );
};
