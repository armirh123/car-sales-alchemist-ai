
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

// Helper function to validate and sanitize company settings
const validateCompanySettings = (settings: any): CompanySettings | null => {
  try {
    if (!settings || typeof settings !== 'object') {
      return null;
    }

    // Validate branding
    if (!settings.branding || typeof settings.branding !== 'object') {
      return null;
    }

    const { primaryColor, companyName } = settings.branding;
    if (!primaryColor || !companyName || typeof primaryColor !== 'string' || typeof companyName !== 'string') {
      return null;
    }

    // Validate features
    if (!settings.features || typeof settings.features !== 'object') {
      return null;
    }

    const { aiAssistant, advancedReporting, multiUser, maxUsers } = settings.features;
    if (
      typeof aiAssistant !== 'boolean' ||
      typeof advancedReporting !== 'boolean' ||
      typeof multiUser !== 'boolean' ||
      typeof maxUsers !== 'number' ||
      maxUsers < 1
    ) {
      return null;
    }

    return {
      branding: {
        primaryColor: primaryColor.trim(),
        companyName: companyName.trim(),
        logo: settings.branding.logo
      },
      features: {
        aiAssistant,
        advancedReporting,
        multiUser,
        maxUsers
      }
    };
  } catch (error) {
    console.error('Error validating company settings:', error);
    return null;
  }
};

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { company, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  // Default fallback settings
  const defaultTenant = {
    branding: {
      primaryColor: '#6366f1',
      companyName: 'InventoryIQ'
    },
    features: {
      aiAssistant: true,
      advancedReporting: false,
      multiUser: true,
      maxUsers: 5
    }
  };

  const [tenant, setTenant] = useState(defaultTenant);

  useEffect(() => {
    if (!authLoading) {
      if (company?.settings) {
        // Safely validate and parse the JSON settings
        const validatedSettings = validateCompanySettings(company.settings);
        
        if (validatedSettings) {
          setTenant({
            branding: validatedSettings.branding,
            features: validatedSettings.features
          });
        } else {
          console.warn('Invalid company settings, using defaults');
          setTenant(defaultTenant);
        }
      } else {
        // Use default settings if no company settings found
        setTenant(defaultTenant);
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
