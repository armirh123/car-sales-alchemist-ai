
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Shield } from "lucide-react";

// Helper function to sanitize display name
const sanitizeDisplayName = (name: string): string => {
  if (!name || typeof name !== 'string') return 'User';
  return name.trim().substring(0, 50); // Limit length for UI
};

export function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const isAdmin = user.role === 'admin' || user.role === 'owner';
  const displayName = sanitizeDisplayName(user.name);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
          {isAdmin ? <Shield className="h-4 w-4 text-blue-600" /> : <User className="h-4 w-4" />}
          <span className="hidden sm:inline truncate max-w-20" title={displayName}>
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 sm:w-56">
        <DropdownMenuLabel className="truncate" title={displayName}>
          {isAdmin ? 'Admin Account' : 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
