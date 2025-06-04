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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
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

  const systemStats = {
    totalUsers: 12,
    activeUsers: 8,
    totalLeads: 287,
    totalSales: 42,
    systemUptime: "99.9%",
    lastBackup: "2 hours ago"
  };

  const recentActivities = [
    { type: "user_login", user: "John Smith", action: "Logged in", time: "5 minutes ago", icon: Users },
    { type: "lead_created", user: "Sarah Johnson", action: "Created new lead", time: "12 minutes ago", icon: UserPlus },
    { type: "sale_completed", user: "Mike Davis", action: "Completed sale", time: "1 hour ago", icon: CheckCircle },
    { type: "system_alert", user: "System", action: "Backup completed", time: "2 hours ago", icon: Database }
  ];

  const pendingTasks = [
    { id: 1, title: "Review monthly sales report", priority: "high", dueDate: "Today" },
    { id: 2, title: "Update user permissions", priority: "medium", dueDate: "Tomorrow" },
    { id: 3, title: "Configure automated backups", priority: "low", dueDate: "This week" }
  ];

  const handleQuickAction = (action: string) => {
    toast({
      title: "Action Initiated",
      description: `${action} has been started and will be completed shortly`
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
                    <div className="text-2xl font-bold mt-2">{systemStats.totalUsers}</div>
                    <div className="text-xs text-green-600">+2 this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Active Now</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{systemStats.activeUsers}</div>
                    <div className="text-xs text-slate-500">of {systemStats.totalUsers} users</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Uptime</span>
                    </div>
                    <div className="text-2xl font-bold mt-2">{systemStats.systemUptime}</div>
                    <div className="text-xs text-green-600">Excellent</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Last Backup</span>
                    </div>
                    <div className="text-sm font-bold mt-2">{systemStats.lastBackup}</div>
                    <div className="text-xs text-green-600">Automated</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent System Activity</CardTitle>
                  <CardDescription>Live activity feed from all users and system processes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const Icon = activity.icon;
                      return (
                        <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Icon className="h-5 w-5 text-slate-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.user} {activity.action}</p>
                            <p className="text-xs text-slate-500">{activity.time}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">{activity.type.replace('_', ' ')}</Badge>
                        </div>
                      );
                    })}
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Tasks</CardTitle>
                  <CardDescription>Administrative tasks requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">{task.title}</span>
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Due: {task.dueDate}</span>
                        <Button size="sm" variant="ghost">Complete</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <ReportingCenter />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                User management functionality will be implemented with database integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">Add New User</Button>
                <Button variant="outline">Bulk Import Users</Button>
                <Button variant="outline">Export User List</Button>
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
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backup Service</span>
                    <Badge className="bg-green-100 text-green-800">Running</Badge>
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
                      <span className="text-sm">All systems up to date</span>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Active Automations</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Daily Sales Report</p>
                        <p className="text-xs text-slate-500">Runs every day at 9 AM</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="text-sm font-medium">Lead Follow-up Reminders</p>
                        <p className="text-xs text-slate-500">Triggers after 24 hours</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Setup</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">Setup Email Automation</Button>
                    <Button variant="outline" size="sm">Configure Report Scheduling</Button>
                    <Button variant="outline" size="sm">Create Custom Workflow</Button>
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
