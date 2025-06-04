
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  company_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'owner' | 'admin' | 'manager' | 'salesperson';
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string;
  name: string;
  subdomain: string;
  subscription_plan: 'basic' | 'premium' | 'enterprise';
  subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled' | 'past_due';
  settings: {
    branding: {
      primaryColor: string;
      companyName: string;
    };
    features: {
      aiAssistant: boolean;
      advancedReporting: boolean;
      multiUser: boolean;
      maxUsers: number;
    };
  };
}

interface AuthUser {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'salesperson';
  name: string;
  company_id: string;
  company: Company;
}

interface AuthContextType {
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

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
      }

      if (!profileData) return;

      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError) {
        console.error('Company fetch error:', companyError);
        return;
      }

      setProfile(profileData);
      setCompany(companyData);

      // Create user object for backward compatibility
      const authUser: AuthUser = {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || profileData.email,
        company_id: profileData.company_id,
        company: companyData
      };

      setUser(authUser);

      // Update last login
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          await fetchUserData(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setCompany(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    // For demo purposes - in production, this should use proper admin authentication
    if (username === 'admin' && password === 'admin') {
      // Create a mock admin user for demo
      const mockAdminUser: AuthUser = {
        id: 'admin-demo',
        email: 'admin@demo.com',
        role: 'owner',
        name: 'System Admin',
        company_id: 'demo-company',
        company: {
          id: 'demo-company',
          name: 'Demo Company',
          subdomain: 'demo',
          subscription_plan: 'enterprise',
          subscription_status: 'active',
          settings: {
            branding: {
              primaryColor: '#2563eb',
              companyName: 'Demo Company'
            },
            features: {
              aiAssistant: true,
              advancedReporting: true,
              multiUser: true,
              maxUsers: 100
            }
          }
        }
      };
      setUser(mockAdminUser);
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setCompany(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: { 
      first_name: string; 
      last_name: string; 
      company_name?: string;
    }
  ): Promise<{ error: string | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            company_name: userData.company_name || `${userData.first_name}'s Company`
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An error occurred during sign up' };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    company,
    isLoading,
    login,
    adminLogin,
    logout,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
