
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useTenant } from "@/contexts/TenantContext";
import { 
  Settings, Palette, Users, Database, Shield, Mail, 
  Globe, Zap, BarChart3, Save, RefreshCw 
} from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const { tenant } = useTenant();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("company");

  const [companySettings, setCompanySettings] = useState({
    companyName: tenant.branding.companyName,
    primaryColor: tenant.branding.primaryColor,
    maxUsers: tenant.features.maxUsers,
    aiAssistant: tenant.features.aiAssistant,
    advancedReporting: tenant.features.advancedReporting,
    multiUser: tenant.features.multiUser
  });

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    emailNotifications: true,
    auditLogging: true,
    dataRetention: '90',
    sessionTimeout: '30'
  });

  const handleSave = async (settingsType: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement settings save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Settings Updated",
        description: `${settingsType} settings have been saved successfully.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Administrative Settings</h3>
          <p className="text-sm text-slate-600">Manage system-wide configuration and preferences</p>
        </div>
        <Badge variant="destructive">Admin Only</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Company Branding</span>
              </CardTitle>
              <CardDescription>Customize your company's appearance and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={companySettings.companyName}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={companySettings.primaryColor}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={companySettings.primaryColor}
                      onChange={(e) => setCompanySettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Feature Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="aiAssistant">AI Assistant</Label>
                    <Switch
                      id="aiAssistant"
                      checked={companySettings.aiAssistant}
                      onCheckedChange={(checked) => setCompanySettings(prev => ({ ...prev, aiAssistant: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="advancedReporting">Advanced Reporting</Label>
                    <Switch
                      id="advancedReporting"
                      checked={companySettings.advancedReporting}
                      onCheckedChange={(checked) => setCompanySettings(prev => ({ ...prev, advancedReporting: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="multiUser">Multi-User Support</Label>
                    <Switch
                      id="multiUser"
                      checked={companySettings.multiUser}
                      onCheckedChange={(checked) => setCompanySettings(prev => ({ ...prev, multiUser: checked }))}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Maximum Users</Label>
                  <Select 
                    value={companySettings.maxUsers.toString()} 
                    onValueChange={(value) => setCompanySettings(prev => ({ ...prev, maxUsers: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Users</SelectItem>
                      <SelectItem value="10">10 Users</SelectItem>
                      <SelectItem value="25">25 Users</SelectItem>
                      <SelectItem value="50">50 Users</SelectItem>
                      <SelectItem value="100">100 Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('Company')} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Company Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Invite Users
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Manage Roles
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  User Activity
                </Button>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Current Team</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Users</span>
                    <Badge variant="secondary">3 / {companySettings.maxUsers}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Active Users</span>
                    <Badge className="bg-green-100 text-green-800">3</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Invitations</span>
                    <Badge variant="outline">0</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
              <CardDescription>Manage system-wide settings and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">System Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <Switch
                      id="autoBackup"
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auditLogging">Audit Logging</Label>
                    <Switch
                      id="auditLogging"
                      checked={systemSettings.auditLogging}
                      onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, auditLogging: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (days)</Label>
                  <Select 
                    value={systemSettings.dataRetention} 
                    onValueChange={(value) => setSystemSettings(prev => ({ ...prev, dataRetention: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Select 
                    value={systemSettings.sessionTimeout} 
                    onValueChange={(value) => setSystemSettings(prev => ({ ...prev, sessionTimeout: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => handleSave('System')} disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save System Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>Manage third-party integrations and API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Email Service</h4>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">SMTP configuration for sending emails</p>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">CRM Integration</h4>
                    <Badge variant="secondary">Not Connected</Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">Connect to external CRM systems</p>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium">API Configuration</h4>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">API Rate Limiting</p>
                    <p className="text-xs text-slate-500">Current: 1000 requests/hour</p>
                  </div>
                  <Button variant="outline" size="sm">Adjust</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Webhook Endpoints</p>
                    <p className="text-xs text-slate-500">2 active webhooks</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
