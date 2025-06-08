import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, Settings, BarChart3, FileText, Shield, Database, 
  Bell, Mail, Calendar, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Activity, UserPlus, MessageSquare
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReportingCenter from "./ReportingCenter";
import AuditLog from "./AuditLog";
import LoadingSpinner from "./LoadingSpinner";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if user has admin access (either admin/owner role or isAdminUser flag)
  const hasAdminAccess = user && (
    user.role === 'admin' || 
    user.role === 'owner' || 
    user.isAdminUser === true
  );

  if (!hasAdminAccess) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-red-500" />
            <span>Access Denied</span>
          </CardTitle>
          <CardDescription>
            This section is only available to administrators and company owners.
            {user && (
              <span className="block mt-2 text-sm">
                Current role: <Badge variant="outline">{user.role}</Badge>
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const handleQuickAction = async (action: string) => {
    setIsLoading(true);
    
    // Simulate action processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    toast({
      title: "Action Completed",
      description: `${action} has been completed successfully`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            {user.isAdminUser ? 'Company Admin' : 'Super Admin Access'}
          </Badge>
          {user.company && (
            <Badge variant="outline" className="text-blue-600">
              {user.company.name}
            </Badge>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Reports</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Automation</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Total Users</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">0</div>
                    <div className="text-xs text-slate-500">No users yet</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active Now</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">0</div>
                    <div className="text-xs text-slate-500">No active users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Uptime</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">100%</div>
                    <div className="text-xs text-green-600">System Ready</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Last Backup</span>
                    </div>
                    <div className="text-sm font-bold mt-2">Not configured</div>
                    <div className="text-xs text-slate-500">Setup required</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Live activity feed from all users and system processes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No Activity Yet</h3>
                    <p className="text-slate-500 text-sm">
                      System activity will appear here as users interact with the platform.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isLoading ? (
                    <LoadingSpinner text="Processing action..." />
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleQuickAction('User export')}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Export User Data
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleQuickAction('System backup')}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Create System Backup
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleQuickAction('Performance report')}
                      >
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Generate Performance Report
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => handleQuickAction('System notification')}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Send System Notification
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Administrative tasks requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">No pending tasks</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Administrative tasks will appear here when they require attention
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <div className="space-y-6">
            <ReportingCenter />
            <AuditLog />
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Users Yet</h3>
                <p className="text-slate-500 text-sm mb-4">
                  User management functionality will be available once users are added to the system.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline">Add New User</Button>
                  <Button variant="outline">Bulk Import Users</Button>
                  <Button variant="outline">Export User List</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  General Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Configuration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Database className="mr-2 h-4 w-4" />
                  Database Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Monitor system performance and health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Server Status</span>
                    <Badge className="bg-green-100 text-green-800">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Not Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Service</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Not Configured</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security & Compliance</CardTitle>
              <CardDescription>Monitor security events and compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Security Alerts</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">No security threats detected</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 border rounded">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">System ready for deployment</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Access Control</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Review User Permissions</Button>
                    <Button variant="outline" size="sm">Audit Login History</Button>
                    <Button variant="outline" size="sm">Generate Security Report</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation & Workflows</CardTitle>
              <CardDescription>Configure automated processes and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Automations Configured</h3>
                <p className="text-slate-500 text-sm mb-4">
                  Set up automated workflows to streamline your business processes.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Quick Setup</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">Setup Email Automation</Button>
                      <Button variant="outline" size="sm">Configure Report Scheduling</Button>
                      <Button variant="outline" size="sm">Create Custom Workflow</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
