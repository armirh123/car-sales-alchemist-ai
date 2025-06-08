import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, TrendingUp, Users, MessageCircle, Target, BarChart3, PlusCircle, Search, Menu, Settings, Calendar, Bell, Shield, DollarSign } from "lucide-react";
import DashboardMetrics from "@/components/DashboardMetrics";
import LeadManagement from "@/components/LeadManagement";
import AIAssistant from "@/components/AIAssistant";
import InventoryOverview from "@/components/InventoryOverview";
import GlobalSearch from "@/components/GlobalSearch";
import { LoginDialog } from "@/components/LoginDialog";
import { AdminLoginDialog } from "@/components/AdminLoginDialog";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";
import { useTenant } from "@/contexts/TenantContext";
import AdminDashboard from "@/components/AdminDashboard";
import UserCalendar from "@/components/UserCalendar";
import UserNotifications from "@/components/UserNotifications";
import ReportingCenter from "@/components/ReportingCenter";
import InventoryIQLogo from "@/components/InventoryIQLogo";
import UpcomingAppointmentsPopup from "@/components/UpcomingAppointmentsPopup";
import CustomerManagement from "@/components/CustomerManagement";
import FinancialManagement from "@/components/FinancialManagement";

const Index = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const { user, isLoading } = useAuth();
  const { tenant } = useTenant();

  // Sample appointments data for the popup (in real app, this would come from a context or API)
  const sampleAppointments = [
    {
      id: "1",
      title: "Test Drive - Honda Civic",
      description: "Customer interested in 2024 Honda Civic Sport",
      date: new Date(),
      time: "10:00 AM",
      type: "test_drive" as const,
      client: "John Smith",
      phone: "(555) 123-4567",
      location: "Main Lot",
      status: "scheduled" as const,
      priority: "high" as const
    },
    {
      id: "2",
      title: "Follow-up Call - Sarah Johnson",
      description: "Discussing financing options",
      date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      time: "2:00 PM",
      type: "follow_up" as const,
      client: "Sarah Johnson",
      phone: "(555) 987-6543",
      status: "scheduled" as const,
      priority: "medium" as const
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
        <div className="text-center">
          <InventoryIQLogo size="lg" className="mb-4 justify-center" />
          <h2 className="text-xl font-semibold text-slate-900">Loading {tenant.branding.companyName}...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <InventoryIQLogo size="md" showText={false} />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-slate-900">{tenant.branding.companyName}</h1>
                  <p className="text-sm text-slate-600">Intelligent Sales Management</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold text-slate-900">{tenant.branding.companyName}</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <LoginDialog />
                <AdminLoginDialog />
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
          <div className="text-center">
            <InventoryIQLogo size="lg" className="mb-8 justify-center" />
            <h2 className="text-2xl sm:text-4xl font-bold text-slate-900 mb-4">
              Welcome to {tenant.branding.companyName}
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-8">
              Your intelligent automotive sales management platform
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12">
              <Card>
                <CardHeader className="text-center">
                  <BarChart3 className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
                  <CardTitle className="text-lg">Sales Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm sm:text-base">Track your sales performance with real-time analytics and insights.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-green-600 mb-2 mx-auto" />
                  <CardTitle className="text-lg">Lead Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm sm:text-base">Manage your customer leads efficiently with our smart CRM system.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="text-center">
                  <Car className="h-8 w-8 text-purple-600 mb-2 mx-auto" />
                  <CardTitle className="text-lg">Inventory Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 text-sm sm:text-base">Keep track of your vehicle inventory with automated alerts and management.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <LoginDialog />
              <AdminLoginDialog />
            </div>
            <p className="text-sm text-slate-500 mt-4">
              Demo credentials: demo@autosales.com / password<br />
              Admin credentials: admin / admin
            </p>
          </div>
        </main>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const isManager = user?.role === 'manager';
  const isSalesperson = user?.role === 'salesperson';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {user && <UpcomingAppointmentsPopup appointments={sampleAppointments} />}
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <InventoryIQLogo size="md" showText={false} />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900">{tenant.branding.companyName}</h1>
                <p className="text-sm text-slate-600">Intelligent Sales Management</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-900">{tenant.branding.companyName}</h1>
              </div>
            </div>
            
            {/* Global Search Bar - Hidden on mobile, shown on tablet+ */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <GlobalSearch />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Badge variant="secondary" className="hidden sm:inline-flex bg-green-100 text-green-800 text-xs">
                Active Account
              </Badge>
              {isAdmin && (
                <Badge variant="default" className="hidden sm:inline-flex text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              )}
              <UserMenu />
            </div>
          </div>
          
          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <GlobalSearch />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Role-based tab layouts */}
          <div className="overflow-x-auto">
            {isAdmin ? (
              <TabsList className="grid w-full min-w-max sm:w-auto grid-cols-8">
                <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Dashboard</span>
                  <span className="xs:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Customers</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Leads</span>
                </TabsTrigger>
                <TabsTrigger value="inventory" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Inventory</span>
                  <span className="xs:hidden">Cars</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Financial</span>
                  <span className="xs:hidden">$</span>
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">AI Assistant</span>
                  <span className="xs:hidden">AI</span>
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Admin</span>
                  <span className="xs:hidden">Admin</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Reports</span>
                  <span className="xs:hidden">Rep</span>
                </TabsTrigger>
              </TabsList>
            ) : isManager ? (
              <TabsList className="grid w-full min-w-max sm:w-auto grid-cols-7">
                <TabsTrigger value="inventory" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Inventory</span>
                  <span className="xs:hidden">Cars</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Customers</span>
                </TabsTrigger>
                <TabsTrigger value="leads" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Leads</span>
                </TabsTrigger>
                <TabsTrigger value="financial" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Financial</span>
                  <span className="xs:hidden">$</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Dashboard</span>
                  <span className="xs:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Calendar</span>
                  <span className="xs:hidden">Cal</span>
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">AI Assistant</span>
                  <span className="xs:hidden">AI</span>
                </TabsTrigger>
              </TabsList>
            ) : (
              <TabsList className="grid w-full min-w-max sm:w-auto grid-cols-5">
                <TabsTrigger value="inventory" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Car className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Inventory</span>
                  <span className="xs:hidden">Cars</span>
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Customers</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Calendar</span>
                  <span className="xs:hidden">Cal</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Notifications</span>
                  <span className="xs:hidden">Alerts</span>
                </TabsTrigger>
                <TabsTrigger value="ai-assistant" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm px-2 sm:px-4">
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">AI Assistant</span>
                  <span className="xs:hidden">AI</span>
                </TabsTrigger>
              </TabsList>
            )}
          </div>

          {/* Admin-only tabs */}
          {isAdmin && (
            <>
              <TabsContent value="dashboard">
                <DashboardMetrics />
              </TabsContent>
              <TabsContent value="admin">
                <AdminDashboard />
              </TabsContent>
              <TabsContent value="reports">
                <ReportingCenter />
              </TabsContent>
            </>
          )}

          {/* Manager-only tabs */}
          {isManager && (
            <TabsContent value="dashboard">
              <Card>
                <CardHeader>
                  <CardTitle>Manager Dashboard</CardTitle>
                  <CardDescription>Team performance and overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Manager-specific dashboard with team metrics.</p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Common tabs for admin and manager users */}
          {(isAdmin || isManager) && (
            <TabsContent value="leads">
              <LeadManagement />
            </TabsContent>
          )}

          {/* New Customer Management Tab */}
          <TabsContent value="customers">
            <CustomerManagement />
          </TabsContent>

          {/* New Financial Management Tab */}
          {(isAdmin || isManager) && (
            <TabsContent value="financial">
              <FinancialManagement />
            </TabsContent>
          )}

          <TabsContent value="inventory">
            <InventoryOverview />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant />
          </TabsContent>

          {/* Employee-specific tabs (for non-admin users) */}
          {!isAdmin && (
            <>
              <TabsContent value="calendar">
                <UserCalendar />
              </TabsContent>
              <TabsContent value="notifications">
                <UserNotifications />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
