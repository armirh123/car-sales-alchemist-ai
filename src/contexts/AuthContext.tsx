
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Company = Database['public']['Tables']['companies']['Row'];

interface AuthUser {
  id: string;
  email: string;
  role: 'owner' | 'admin' | 'manager' | 'salesperson';
  name: string;
  company_id: string;
  company: Company;
  isAdminUser?: boolean; // Flag to identify admin table users
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

// Input validation helper
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Helper function to validate admin credentials
const validateAdminCredentials = (username: string, password: string): boolean => {
  return typeof username === 'string' && 
         typeof password === 'string' && 
         username.trim().length > 0 && 
         password.length > 0;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId: string) => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided');
      return;
    }

    try {
      // Fetch user profile with error handling
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
      }

      if (!profileData) {
        console.warn('No profile data found for user');
        return;
      }

      // Validate profile data
      if (!profileData.company_id) {
        console.error('Profile missing company_id');
        return;
      }

      // Fetch company data with error handling
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError) {
        console.error('Company fetch error:', companyError);
        return;
      }

      if (!companyData) {
        console.warn('No company data found');
        return;
      }

      setProfile(profileData);
      setCompany(companyData);

      // Create sanitized user object
      const authUser: AuthUser = {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role as 'owner' | 'admin' | 'manager' | 'salesperson',
        name: sanitizeString(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || profileData.email),
        company_id: profileData.company_id,
        company: companyData
      };

      setUser(authUser);

      // Update last login timestamp
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Clear user state on error
      setUser(null);
      setProfile(null);
      setCompany(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
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
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }

      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Input validation
    if (!validateEmail(email) || !validatePassword(password)) {
      console.error('Invalid email or password format');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeString(email),
        password: password
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (!data.user) {
        console.error('No user data returned from login');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    // Input validation
    if (!validateAdminCredentials(username, password)) {
      console.error('Invalid admin credentials format');
      return false;
    }

    try {
      const sanitizedUsername = sanitizeString(username);
      
      // Call the database function to validate admin login
      const { data: adminData, error } = await supabase.rpc('validate_admin_login', {
        p_username: sanitizedUsername,
        p_password: password
      });

      if (error) {
        console.error('Admin login database error:', error);
        return false;
      }

      if (!adminData || adminData.length === 0) {
        console.error('Invalid admin credentials');
        return false;
      }

      const admin = adminData[0];

      // Fetch company data for the admin
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', admin.company_id)
        .single();

      if (companyError || !companyData) {
        console.error('Failed to fetch company data for admin:', companyError);
        return false;
      }

      // Create admin user object
      const adminUser: AuthUser = {
        id: admin.admin_id,
        email: admin.email || 'admin@demo.com',
        role: admin.role as 'owner' | 'admin',
        name: sanitizeString(`${admin.first_name || ''} ${admin.last_name || ''}`.trim() || 'Admin'),
        company_id: admin.company_id,
        company: companyData,
        isAdminUser: true // Flag to identify admin table users
      };

      setUser(adminUser);
      setCompany(companyData);

      // Update last login timestamp
      try {
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', admin.admin_id);
      } catch (updateError) {
        console.warn('Failed to update admin last login:', updateError);
        // Don't fail the login for this
      }

      return true;
    } catch (error) {
      console.error('Admin login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Only sign out from Supabase if it's not an admin user
      if (!user?.isAdminUser) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error('Logout error:', error);
        }
      }
      
      // Clear all state
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
    // Input validation
    if (!validateEmail(email)) {
      return { error: 'Invalid email format' };
    }

    if (!validatePassword(password)) {
      return { error: 'Password must be between 6 and 128 characters' };
    }

    if (!userData.first_name || !userData.last_name) {
      return { error: 'First name and last name are required' };
    }

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: sanitizeString(email),
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: sanitizeString(userData.first_name),
            last_name: sanitizeString(userData.last_name),
            company_name: userData.company_name ? sanitizeString(userData.company_name) : `${sanitizeString(userData.first_name)}'s Company`
          }
        }
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      console.error('SignUp error:', error);
      return { error: error?.message || 'An error occurred during sign up' };
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
