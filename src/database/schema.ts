
// Database Schema Definitions - Placeholder for future database integration
// This file defines the structure for all tables when connecting to a real database

export interface Company {
  id: string;
  name: string;
  subdomain: string;
  created_at: string;
  updated_at: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'trial';
  settings: {
    branding: {
      primaryColor: string;
      logo?: string;
      companyName: string;
    };
    features: {
      aiAssistant: boolean;
      advancedReporting: boolean;
      multiUser: boolean;
    };
  };
}

export interface User {
  id: string;
  company_id: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'salesperson';
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
}

export interface Lead {
  id: string;
  company_id: string;
  assigned_to: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  interest: string;
  status: 'hot' | 'warm' | 'cold' | 'converted' | 'lost';
  estimated_value: number;
  source: 'website' | 'referral' | 'cold_call' | 'social_media' | 'advertising';
  created_at: string;
  updated_at: string;
  last_contact: string;
  notes?: string;
}

export interface Sale {
  id: string;
  company_id: string;
  lead_id?: string;
  salesperson_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  vehicle_details: {
    make: string;
    model: string;
    year: number;
    vin: string;
    price: number;
  };
  sale_amount: number;
  commission_amount: number;
  sale_date: string;
  created_at: string;
  updated_at: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface Vehicle {
  id: string;
  company_id: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  mileage: number;
  condition: 'new' | 'used' | 'certified';
  status: 'available' | 'sold' | 'reserved' | 'maintenance';
  images: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  company_id: string;
  user_id: string;
  type: 'lead_created' | 'lead_updated' | 'sale_completed' | 'vehicle_added' | 'user_login';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Report {
  id: string;
  company_id: string;
  generated_by: string;
  report_type: 'sales' | 'leads' | 'inventory' | 'performance' | 'custom';
  title: string;
  parameters: Record<string, any>;
  data: Record<string, any>;
  file_url?: string;
  created_at: string;
}

// Database query placeholder functions
export const DatabaseQueries = {
  // Companies
  getCompanyBySubdomain: (subdomain: string): Promise<Company | null> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  // Users
  getUserById: (id: string): Promise<User | null> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  getUsersByCompany: (companyId: string): Promise<User[]> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  // Leads
  getLeadsByCompany: (companyId: string): Promise<Lead[]> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  createLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  // Sales
  getSalesByCompany: (companyId: string): Promise<Sale[]> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  // Vehicles
  getVehiclesByCompany: (companyId: string): Promise<Vehicle[]> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  },
  
  // Reports
  generateReport: (reportData: Omit<Report, 'id' | 'created_at'>): Promise<Report> => {
    // TODO: Implement database query
    throw new Error('Database not connected');
  }
};
