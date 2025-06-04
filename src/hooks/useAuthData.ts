
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

  const fetchUserData = async (userId: string): Promise<AuthUser | null> => {
    if (!userId || typeof userId !== 'string') {
      console.error('Invalid user ID provided');
      return null;
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
        return null;
      }

      if (!profileData) {
        console.warn('No profile data found for user');
        return null;
      }

      // Get company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profileData.company_id)
        .single();

      if (companyError || !companyData) {
        console.error('Company fetch error:', companyError);
        return null;
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

      return authUser;

    } catch (error) {
      console.error('Error fetching user data:', error);
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
