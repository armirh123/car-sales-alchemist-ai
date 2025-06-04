
import type { Database } from '@/integrations/supabase/types';
import { User, Session } from '@supabase/supabase-js';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Company = Database['public']['Tables']['companies']['Row'];

export interface AuthUser {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'salesperson';
  name: string;
  company_id: string;
  company: Company;
  isAdminUser?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  profile: Profile | null;
  company: Company | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, userData: { 
    first_name: string; 
    last_name: string; 
    company_name?: string;
  }) => Promise<{ error: string | null }>;
}

export interface SignUpData {
  first_name: string;
  last_name: string;
  company_name?: string;
}
