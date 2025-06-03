
export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  branding: {
    primaryColor: string;
    logo?: string;
    companyName: string;
  };
}

// Default tenant configuration for demo purposes
const defaultTenants: Record<string, TenantConfig> = {
  'demo': {
    id: 'demo',
    name: 'Demo Dealership',
    subdomain: 'demo',
    branding: {
      primaryColor: '#2563eb',
      companyName: 'Demo AutoSales',
    }
  },
  'ford-downtown': {
    id: 'ford-downtown',
    name: 'Ford Downtown',
    subdomain: 'ford-downtown',
    branding: {
      primaryColor: '#1d4ed8',
      companyName: 'Ford Downtown',
    }
  },
  'toyota-central': {
    id: 'toyota-central',
    name: 'Toyota Central',
    subdomain: 'toyota-central',
    branding: {
      primaryColor: '#dc2626',
      companyName: 'Toyota Central',
    }
  }
};

export const getTenantFromSubdomain = (): TenantConfig => {
  const hostname = window.location.hostname;
  
  // Handle localhost and development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    return defaultTenants['demo'];
  }
  
  // Extract subdomain from hostname
  const parts = hostname.split('.');
  const subdomain = parts[0];
  
  // Return tenant config if found, otherwise return demo
  return defaultTenants[subdomain] || defaultTenants['demo'];
};

export const getCurrentTenant = (): TenantConfig => {
  return getTenantFromSubdomain();
};

// Function to filter data by tenant (for future database integration)
export const filterByTenant = <T extends { tenantId?: string }>(
  data: T[], 
  tenantId: string
): T[] => {
  return data.filter(item => item.tenantId === tenantId || !item.tenantId);
};
