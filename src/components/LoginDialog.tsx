
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

export function LoginDialog() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { login, signUp, user } = useAuth();
  const { toast } = useToast();

  // Close dialog when user logs in successfully
  if (user && isOpen) {
    setIsOpen(false);
    resetForm();
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoggingIn(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Welcome Back!",
          description: "Successfully logged in to your account",
        });
        setIsOpen(false);
        resetForm();
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials or email not confirmed. Please check your email for a confirmation link if you haven't confirmed your account yet.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !firstName || !lastName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSigningUp(true);

    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName || `${firstName}'s Company`
      });
      
      if (!error) {
        setShowEmailConfirmation(true);
        toast({
          title: "Account Created Successfully!",
          description: "Please check your email to confirm your account before logging in.",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Signup Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setCompanyName("");
    setShowEmailConfirmation(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to AutoSales AI</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>
        
        {showEmailConfirmation ? (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Account created successfully!</strong><br />
                Please check your email and click the confirmation link before logging in. 
                Once confirmed, you can close this dialog and use the login tab.
              </AlertDescription>
            </Alert>
            <div className="flex space-x-2">
              <Button 
                onClick={() => setShowEmailConfirmation(false)} 
                className="flex-1"
                variant="outline"
              >
                Back to Login
              </Button>
              <Button 
                onClick={() => handleDialogClose(false)} 
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input 
                    id="login-email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isLoggingIn}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input 
                    id="login-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoggingIn}
                    required
                    autoComplete="current-password"
                  />
                </div>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    <strong>Note:</strong> You must confirm your email before logging in. 
                    Check your inbox for a confirmation link after signing up.
                  </AlertDescription>
                </Alert>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      type="text" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      disabled={isSigningUp}
                      required
                      autoComplete="given-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      type="text" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      disabled={isSigningUp}
                      required
                      autoComplete="family-name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input 
                    id="companyName" 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Company Name"
                    disabled={isSigningUp}
                    autoComplete="organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email *</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    disabled={isSigningUp}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <Input 
                    id="signup-password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    disabled={isSigningUp}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                </div>
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    After signing up, you'll receive an email confirmation link. 
                    You must click this link before you can log in.
                  </AlertDescription>
                </Alert>
                <Button type="submit" className="w-full" disabled={isSigningUp}>
                  {isSigningUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
