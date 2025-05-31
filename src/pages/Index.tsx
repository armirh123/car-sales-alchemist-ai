
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Car, TrendingUp, Users, MessageCircle, Target, BarChart3, PlusCircle, Search } from "lucide-react";
import DashboardMetrics from "@/components/DashboardMetrics";
import LeadManagement from "@/components/LeadManagement";
import AIAssistant from "@/components/AIAssistant";
import InventoryOverview from "@/components/InventoryOverview";
import GlobalSearch from "@/components/GlobalSearch";
import { LoginDialog } from "@/components/LoginDialog";
import { UserMenu } from "@/components/UserMenu";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-blue-600 p-4 rounded-lg inline-block mb-4">
            <Car className="h-8 w-8 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Loading AutoSales AI...</h2>
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
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">AutoSales AI</h1>
                  <p className="text-sm text-slate-600">Intelligent Sales Management</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <LoginDialog />
              </div>
            </div>
          </div>
        </header>

        {/* Welcome Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Welcome to AutoSales AI
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              Your intelligent automotive sales management platform
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <BarChart3 className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Sales Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Track your sales performance with real-time analytics and insights.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Lead Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Manage your customer leads efficiently with our smart CRM system.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Car className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Inventory Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Keep track of your vehicle inventory with automated alerts and management.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-12">
              <LoginDialog />
              <p className="text-sm text-slate-500 mt-4">
                Demo credentials: demo@autosales.com / password
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">AutoSales AI</h1>
                <p className="text-sm text-slate-600">Intelligent Sales Management</p>
              </div>
            </div>
            
            {/* Global Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <GlobalSearch />
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Account
              </Badge>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Leads</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Inventory</span>
            </TabsTrigger>
            <TabsTrigger value="ai-assistant" className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardMetrics />
          </TabsContent>

          <TabsContent value="leads">
            <LeadManagement />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryOverview />
          </TabsContent>

          <TabsContent value="ai-assistant">
            <AIAssistant />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
