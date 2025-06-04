
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "./auth/LoginForm";
import { SignUpForm } from "./auth/SignUpForm";
import { EmailConfirmation } from "./auth/EmailConfirmation";

export function LoginDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const { user } = useAuth();

  const resetForm = () => {
    setShowEmailConfirmation(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleLoginSuccess = () => {
    setIsOpen(false);
    resetForm();
  };

  const handleSignUpSuccess = () => {
    setShowEmailConfirmation(true);
  };

  const handleBackToLogin = () => {
    setShowEmailConfirmation(false);
  };

  const handleClose = () => {
    handleDialogClose(false);
  };

  // Close dialog when user logs in successfully
  if (user && !user.isAdminUser && isOpen) {
    setIsOpen(false);
    resetForm();
  }

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
          <EmailConfirmation 
            onBackToLogin={handleBackToLogin}
            onClose={handleClose}
          />
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSuccess={handleLoginSuccess} />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm onSuccess={handleSignUpSuccess} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
