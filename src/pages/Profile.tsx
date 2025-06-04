
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { User, Settings, Bell, Shield, Key } from "lucide-react";
import UserProfileForm from "@/components/profile/UserProfileForm";
import NotificationSettings from "@/components/profile/NotificationSettings";
import SecuritySettings from "@/components/profile/SecuritySettings";
import AdminSettings from "@/components/profile/AdminSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Profile & Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account settings and preferences</p>
          <div className="flex items-center space-x-2 mt-4">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {user?.role}
            </Badge>
            {isAdmin && (
              <Badge variant="outline" className="text-blue-600">
                <Shield className="h-3 w-3 mr-1" />
                Admin Access
              </Badge>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Admin</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <UserProfileForm user={user!} />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <AdminSettings />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default Profile;
