
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, Info, CheckCircle } from "lucide-react";

export function AdminLoginDialog() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { adminLogin, user } = useAuth();
  const { toast } = useToast();

  // Close dialog when admin logs in successfully
  if (user?.isAdminUser && isOpen) {
    setIsOpen(false);
    resetForm();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      console.log('Attempting admin login with:', username);
      const success = await adminLogin(username, password);
      
      if (success) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to the admin dashboard!",
        });
        setIsOpen(false);
        resetForm();
      } else {
        toast({
          title: "Admin Login Failed",
          description: "Invalid admin credentials. Please check your username and password. For demo, try: username 'admin' and password 'admin'",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during admin login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setPassword("");
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleDemoLogin = () => {
    setUsername("admin");
    setPassword("admin");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="flex items-center space-x-2">
          <Shield className="h-4 w-4" />
          <span>Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Admin Login</span>
          </DialogTitle>
          <DialogDescription>
            Enter admin credentials to access the management dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Demo Credentials:</strong><br />
              Username: admin<br />
              Password: admin
              <Button 
                type="button" 
                variant="link" 
                size="sm" 
                onClick={handleDemoLogin}
                className="h-auto p-0 ml-2 text-blue-600"
              >
                Fill Demo Credentials
              </Button>
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-username">Admin Username</Label>
              <Input 
                id="admin-username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                disabled={isLoggingIn}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin Password</Label>
              <Input 
                id="admin-password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={isLoggingIn}
                required
                autoComplete="current-password"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Login
                </>
              )}
            </Button>
          </form>

          {user?.isAdminUser && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Admin access active!</strong> You can close this dialog to access the admin dashboard.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
