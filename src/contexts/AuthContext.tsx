
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
  isAdminUser?: boolean;
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

// Input validation helpers
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

  const clearUserState = () => {
    setUser(null);
    setProfile(null);
    setCompany(null);
  };

  const fetchUserData = async (userId: string) => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Fetching user data for:', userId);

      // Get profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        if (profileError.code === 'PGRST116') {
          console.log('Profile not found, user may need to complete signup process');
        }
        setIsLoading(false);
        return;
      }

      if (!profileData) {
        console.warn('No profile data found for user');
        setIsLoading(false);
        return;
      }

      // Get company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError || !companyData) {
        console.error('Company fetch error:', companyError);
        setIsLoading(false);
        return;
      }

      setProfile(profileData);
      setCompany(companyData);

      // Create user object
      const authUser: AuthUser = {
        id: profileData.id,
        email: profileData.email,
        role: profileData.role as 'owner' | 'admin' | 'manager' | 'salesperson',
        name: sanitizeString(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || profileData.email),
        company_id: profileData.company_id,
        company: companyData
      };

      setUser(authUser);

    } catch (error) {
      console.error('Error fetching user data:', error);
      clearUserState();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          fetchUserData(session.user.id);
        } else {
          clearUserState();
          setIsLoading(false);
        }
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
    if (!validateEmail(email) || !validatePassword(password)) {
      console.error('Invalid email or password format');
      return false;
    }

    try {
      console.log('Attempting login for:', email);
      
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

      console.log('Login successful for:', email);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    if (!validateAdminCredentials(username, password)) {
      console.error('Invalid admin credentials format');
      return false;
    }

    try {
      const sanitizedUsername = sanitizeString(username);
      console.log('Attempting admin login for:', sanitizedUsername);
      
      // For demo purposes, hardcode admin credentials
      if (sanitizedUsername === 'admin' && password === 'admin') {
        // Get the default company for admin
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .limit(1)
          .single();

        if (companyError || !companyData) {
          console.error('Failed to fetch company data for admin:', companyError);
          return false;
        }

        // Create admin user object
        const adminUser: AuthUser = {
          id: 'admin-demo-user',
          email: 'admin@demo.com',
          role: 'admin',
          name: 'Admin User',
          company_id: companyData.id,
          company: companyData,
          isAdminUser: true
        };

        setUser(adminUser);
        setCompany(companyData);
        setIsLoading(false);

        console.log('Admin login successful');
        return true;
      }

      // Try database lookup for other admin users
      const { data: adminData, error } = await supabase.rpc('validate_admin_login', {
        p_username: sanitizedUsername,
        p_password: password
      });

      if (error) {
        console.error('Admin login database error:', error);
        return false;
      }

      if (!adminData || adminData.length === 0) {
        console.error('Invalid admin credentials - no matching admin found');
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
        isAdminUser: true
      };

      setUser(adminUser);
      setCompany(companyData);
      setIsLoading(false);

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
      clearUserState();
      setSession(null);
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
      console.log('Attempting signup for:', email);
      
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
        console.error('Signup error:', error);
        return { error: error.message };
      }

      console.log('Signup successful for:', email);
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
