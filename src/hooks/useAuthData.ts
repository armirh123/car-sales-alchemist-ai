
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeString } from '@/utils/authValidation';
import type { AuthUser, Profile, Company } from '@/types/auth';

export const useAuthData = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);

  const clearUserState = () => {
    setProfile(null);
    setCompany(null);
  };

  const createFallbackCompany = (): Company => ({
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Demo Company',
    subdomain: 'demo',
    subscription_plan: 'enterprise',
    subscription_status: 'active',
    settings: {
      branding: {
        companyName: 'Demo Company',
        primaryColor: '#2563eb'
      },
      features: {
        maxUsers: 100,
        multiUser: true,
        aiAssistant: true,
        advancedReporting: true
      }
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  const fetchUserData = async (userId: string): Promise<AuthUser | null> => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided');
      return null;
    }

    try {
      console.log('Fetching user data for:', userId);

      // Get the current user from Supabase auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        return null;
      }

      // Try to get profile data, but handle RLS policy errors gracefully
      let profileData = null;
      let companyData = null;

      try {
        const { data: fetchedProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Don't return null here, continue with fallback data
        } else {
          profileData = fetchedProfile;
        }
      } catch (error) {
        console.error('Database error when fetching profile:', error);
        // Continue with fallback data
      }

      // If we have profile data, try to get company data
      if (profileData?.company_id) {
        try {
          const { data: fetchedCompany, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', profileData.company_id)
            .single();

          if (!companyError && fetchedCompany) {
            companyData = fetchedCompany;
          }
        } catch (error) {
          console.error('Database error when fetching company:', error);
        }
      }

      // Create fallback company if none found
      if (!companyData) {
        companyData = createFallbackCompany();
      }

      // Set the fetched or fallback data
      setProfile(profileData);
      setCompany(companyData);

      // Create user object with fallback data if profile is missing
      const authUser: AuthUser = {
        id: userId,
        email: user.email || 'user@demo.com',
        role: profileData?.role as 'owner' | 'admin' | 'manager' | 'salesperson' || 'salesperson',
        name: profileData 
          ? sanitizeString(`${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || profileData.email || user.email || 'User')
          : sanitizeString(user.email?.split('@')[0] || 'User'),
        company_id: profileData?.company_id || companyData.id,
        company: companyData
      };

      console.log('Successfully created user object:', authUser.email);
      return authUser;

    } catch (error) {
      console.error('Error fetching user data:', error);
      
      // Even if there's an error, try to create a basic user object from auth data
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (!userError && user) {
          const fallbackCompany = createFallbackCompany();
          setCompany(fallbackCompany);
          
          const fallbackUser: AuthUser = {
            id: userId,
            email: user.email || 'user@demo.com',
            role: 'salesperson',
            name: sanitizeString(user.email?.split('@')[0] || 'User'),
            company_id: fallbackCompany.id,
            company: fallbackCompany
          };
          
          console.log('Created fallback user object:', fallbackUser.email);
          return fallbackUser;
        }
      } catch (fallbackError) {
        console.error('Failed to create fallback user:', fallbackError);
      }
      
      clearUserState();
      return null;
    }
  };

  return {
    profile,
    company,
    clearUserState,
    fetchUserData
  };
};
