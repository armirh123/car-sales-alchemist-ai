
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserProfileButton = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center space-x-2"
      onClick={() => navigate('/profile')}
    >
      <User className="h-4 w-4" />
      <span className="hidden sm:inline">Profile</span>
    </Button>
  );
};

export default UserProfileButton;
