
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

  const { profile, company, clearUserState, fetchUserData } = useAuthData();
  const { login, adminLogin: adminLoginAction, signUp, logout: authLogout } = useAuthActions();

  const handleUserData = async (userId: string) => {
    const userData = await fetchUserData(userId);
    if (userData) {
      setUser(userData);
    }
    setIsLoading(false);
  };

  const handleAdminLogin = async (username: string, password: string): Promise<boolean> => {
    console.log('AuthContext: handleAdminLogin called with:', username);
    const result = await adminLoginAction(username, password);
    console.log('AuthContext: adminLoginAction result:', result);
    
    if (result.success && result.user) {
      console.log('AuthContext: Setting admin user:', result.user);
      setUser(result.user);
      setIsLoading(false);
      return true;
    }
    console.log('AuthContext: Admin login failed');
    return false;
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

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        
        if (session?.user) {
          handleUserData(session.user.id);
        } else {
          // Only clear user state if it's not an admin user
          if (!user?.isAdminUser) {
            clearUserState();
            setUser(null);
          }
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
        handleUserData(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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
