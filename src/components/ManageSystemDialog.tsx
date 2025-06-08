
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Users, Database, Mail, Shield } from "lucide-react";

interface ManageSystemDialogProps {
  children: React.ReactNode;
}

const ManageSystemDialog = ({ children }: ManageSystemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();

  const [systemSettings, setSystemSettings] = useState({
    companyName: "Demo Company",
    maxUsers: 10,
    autoBackup: true,
    emailNotifications: true,
    smsNotifications: false,
    requireTwoFactor: false
  });

  const handleSaveSettings = () => {
    console.log("Saving system settings:", systemSettings);
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully."
    });
  };

  const handleCreateBackup = () => {
    console.log("Creating system backup...");
    toast({
      title: "Backup Started",
      description: "System backup is being created. You'll be notified when complete."
    });
  };

  const handleExportData = () => {
    console.log("Exporting system data...");
    toast({
      title: "Export Started",
      description: "Data export is being prepared. Download will start shortly."
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>System Management</span>
          </DialogTitle>
          <DialogDescription>
            Manage system settings, users, and configurations
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>General</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Data</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure basic system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={systemSettings.companyName}
                    onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Maximum Users</Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    value={systemSettings.maxUsers}
                    onChange={(e) => setSystemSettings({...systemSettings, maxUsers: parseInt(e.target.value)})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically backup data daily
                    </p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, autoBackup: checked})}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">Save Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">No Users Yet</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    User management functionality will be available once users are added to the system.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full">Add New User</Button>
                    <Button variant="outline" className="w-full">Bulk Import Users</Button>
                    <Button variant="outline" className="w-full">Export User List</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Backup, export, and manage system data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button onClick={handleCreateBackup} variant="outline" className="h-20 flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    <span>Create Backup</span>
                  </Button>
                  <Button onClick={handleExportData} variant="outline" className="h-20 flex-col">
                    <Database className="h-6 w-6 mb-2" />
                    <span>Export Data</span>
                  </Button>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Storage Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Records:</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Database Size:</span>
                      <span>Empty</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup:</span>
                      <span>Never</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send security alerts via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={systemSettings.emailNotifications}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="smsNotifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send security alerts via SMS
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={systemSettings.smsNotifications}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, smsNotifications: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="requireTwoFactor">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Require 2FA for all user accounts
                    </p>
                  </div>
                  <Switch
                    id="requireTwoFactor"
                    checked={systemSettings.requireTwoFactor}
                    onCheckedChange={(checked) => setSystemSettings({...systemSettings, requireTwoFactor: checked})}
                  />
                </div>
                <Button onClick={handleSaveSettings} className="w-full">Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ManageSystemDialog;
