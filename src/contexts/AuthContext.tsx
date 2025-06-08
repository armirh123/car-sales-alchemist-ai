
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useAuthData } from '@/hooks/useAuthData';
import { useAuthActions } from '@/hooks/useAuthActions';
import type { AuthUser, AuthContextType } from '@/types/auth';

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
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const { profile, company, clearUserState, fetchUserData } = useAuthData();
  const { login, adminLogin: adminLoginAction, signUp, logout: authLogout } = useAuthActions();

  const handleUserData = async (userId: string) => {
    console.log('handleUserData called for:', userId);
    
    try {
      const userData = await fetchUserData(userId);
      if (userData) {
        console.log('Setting user data:', userData.email);
        setUser(userData);
      } else {
        console.warn('No user data returned');
      }
    } catch (error) {
      console.error('Error in handleUserData:', error);
    }
  };

  const handleAdminLogin = async (username: string, password: string): Promise<boolean> => {
    console.log('AuthContext: handleAdminLogin called with:', username);
    setIsLoading(true);
    
    try {
      const result = await adminLoginAction(username, password);
      console.log('AuthContext: adminLoginAction result:', result);
      
      if (result.success && result.user) {
        console.log('AuthContext: Setting admin user:', result.user);
        setUser(result.user);
        setIsLoading(false);
        return true;
      }
      console.log('AuthContext: Admin login failed');
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Error in handleAdminLogin:', error);
      setIsLoading(false);
      return false;
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      // Only sign out from Supabase if it's not an admin user
      if (!user?.isAdminUser) {
        await authLogout();
      }
      
      // Clear all state
      clearUserState();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting initial session:', error);
          setIsLoading(false);
          setIsInitialized(true);
          return;
        }

        console.log('Initial session check:', session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          await handleUserData(session.user.id);
        }
        
        setIsLoading(false);
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          // Only fetch user data for regular auth users, not admin users
          if (!user?.isAdminUser) {
            await handleUserData(session.user.id);
          }
        } else {
          // Only clear user state if it's not an admin user
          if (!user?.isAdminUser) {
            console.log('No session, clearing user state');
            clearUserState();
            setUser(null);
          }
          if (isInitialized) {
            setIsLoading(false);
          }
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Remove dependencies to avoid infinite loops

  const value: AuthContextType = {
    user,
    session,
    profile,
    company,
    isLoading,
    login,
    adminLogin: handleAdminLogin,
    logout: handleLogout,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
