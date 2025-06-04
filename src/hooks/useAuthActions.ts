
import { supabase } from '@/integrations/supabase/client';
import { validateEmail, validatePassword, validateAdminCredentials, sanitizeString } from '@/utils/authValidation';
import type { AuthUser, Company, SignUpData } from '@/types/auth';

export const useAuthActions = () => {
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

  const adminLogin = async (username: string, password: string): Promise<{ success: boolean; user?: AuthUser }> => {
    if (!validateAdminCredentials(username, password)) {
      console.error('Invalid admin credentials format');
      return { success: false };
    }

    try {
      const sanitizedUsername = sanitizeString(username);
      console.log('useAuthActions: Attempting admin login for:', sanitizedUsername);
      
      // For demo purposes, hardcode admin credentials
      if (sanitizedUsername === 'admin' && password === 'admin') {
        console.log('useAuthActions: Demo admin credentials matched');
        
        // Get the first company for admin (or create a default one)
        let { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (companyError || !companyData) {
          console.log('useAuthActions: No company found, using default company data');
          // Create a default company object for demo
          companyData = {
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
          };
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

        console.log('useAuthActions: Admin login successful, returning user:', adminUser);
        return { success: true, user: adminUser };
      }

      // Try database lookup for other admin users
      console.log('useAuthActions: Checking database for admin credentials');
      const { data: adminData, error } = await supabase.rpc('validate_admin_login', {
        p_username: sanitizedUsername,
        p_password: password
      });

      if (error) {
        console.error('useAuthActions: Admin login database error:', error);
        return { success: false };
      }

      if (!adminData || adminData.length === 0) {
        console.error('useAuthActions: Invalid admin credentials - no matching admin found');
        return { success: false };
      }

      const admin = adminData[0];

      // Fetch company data for the admin
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', admin.company_id)
        .single();

      if (companyError || !companyData) {
        console.error('useAuthActions: Failed to fetch company data for admin:', companyError);
        return { success: false };
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

      return { success: true, user: adminUser };
    } catch (error) {
      console.error('useAuthActions: Admin login error:', error);
      return { success: false };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: SignUpData
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

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    login,
    adminLogin,
    signUp,
    logout
  };
};
