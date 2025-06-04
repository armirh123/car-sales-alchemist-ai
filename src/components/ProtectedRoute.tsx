
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'owner' | 'admin' | 'manager' | 'salesperson';
}

// Role hierarchy for security checks
const ROLE_HIERARCHY = {
  'salesperson': 1,
  'manager': 2,
  'admin': 3,
  'owner': 4
} as const;

// Input validation for role
const isValidRole = (role: string): role is keyof typeof ROLE_HIERARCHY => {
  return role in ROLE_HIERARCHY;
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be logged in to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access with proper validation
  if (requiredRole) {
    // Validate user role
    if (!isValidRole(user.role)) {
      console.error('Invalid user role:', user.role);
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Invalid User Role</CardTitle>
              <CardDescription>
                Your account has an invalid role assignment. Please contact support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Validate required role
    if (!isValidRole(requiredRole)) {
      console.error('Invalid required role:', requiredRole);
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <CardTitle>Configuration Error</CardTitle>
              <CardDescription>
                This page has an invalid role requirement. Please contact support.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    const userLevel = ROLE_HIERARCHY[user.role];
    const requiredLevel = ROLE_HIERARCHY[requiredRole];

    if (userLevel < requiredLevel) {
      return (
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
              <CardTitle>Insufficient Permissions</CardTitle>
              <CardDescription>
                You don't have permission to access this page. Required role: {requiredRole}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
}
