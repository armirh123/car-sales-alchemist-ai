
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
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield } from "lucide-react";

export function AdminLoginDialog() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { adminLogin, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const success = await adminLogin(username, password);
    
    if (success) {
      toast({
        title: "Success",
        description: "Admin logged in successfully!",
      });
      setIsOpen(false);
      setUsername("");
      setPassword("");
    } else {
      toast({
        title: "Error",
        description: "Invalid admin credentials. Try admin / admin",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            Enter admin credentials to access management dashboard.
            <br />
            <span className="text-sm text-muted-foreground mt-2 block">
              Demo: admin / admin
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admin-username" className="text-right">
                Username
              </Label>
              <Input 
                id="admin-username" 
                type="text" 
                className="col-span-3"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="admin-password" className="text-right">
                Password
              </Label>
              <Input 
                id="admin-password" 
                type="password" 
                className="col-span-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                disabled={isLoading}
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Admin Login"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
