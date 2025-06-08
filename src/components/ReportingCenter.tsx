
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, FileText, Download, Calendar, TrendingUp, 
  Users, Car, DollarSign, Target, Activity, Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const ReportingCenter = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration
  const reportData = {
    totalSales: 156,
    totalRevenue: 2847000,
    activeLeads: 89,
    conversionRate: 23.4,
    topPerformers: [
      { name: "John Smith", sales: 12, revenue: 540000 },
      { name: "Sarah Johnson", sales: 10, revenue: 450000 },
      { name: "Mike Davis", sales: 8, revenue: 360000 }
    ],
    monthlySales: [
      { month: "Jan", sales: 25, revenue: 1125000 },
      { month: "Feb", sales: 30, revenue: 1350000 },
      { month: "Mar", sales: 28, revenue: 1260000 },
      { month: "Apr", sales: 35, revenue: 1575000 },
      { month: "May", sales: 38, revenue: 1710000 }
    ]
  };

  const handleGenerateReport = (reportType: string) => {
    toast({
      title: "Report Generated",
      description: `${reportType} report has been generated and is ready for download.`
    });
  };

  const handleExportData = (format: string) => {
    toast({
      title: "Export Started",
      description: `Data export in ${format} format has been initiated.`
    });
  };

  if (!user || (user.role !== 'admin' && user.role !== 'owner' && !user.isAdminUser)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>
            Advanced reporting is only available to administrators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            You need administrator privileges to access detailed reports and analytics.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Advanced Reports</h1>
          <p className="text-slate-600">Comprehensive business analytics and reporting</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Admin Access
          </Badge>
          <Button variant="outline" onClick={() => handleExportData('PDF')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${reportData.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{reportData.totalSales}</p>
                <p className="text-sm text-slate-600">Total Sales</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{reportData.activeLeads}</p>
                <p className="text-sm text-slate-600">Active Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{reportData.conversionRate}%</p>
                <p className="text-sm text-slate-600">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Sales</span>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Custom</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales Trend</CardTitle>
                <CardDescription>Sales performance over the last 5 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.monthlySales.map((month, index) => (
                    <div key={month.month} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{month.month} 2024</p>
                        <p className="text-sm text-slate-600">{month.sales} sales</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${month.revenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Highest performing sales team members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.topPerformers.map((performer, index) => (
                    <div key={performer.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{performer.name}</p>
                          <p className="text-sm text-slate-600">{performer.sales} sales</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">${performer.revenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>Detailed sales analytics and reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Daily Sales')}
                >
                  <Calendar className="h-6 w-6 mb-2" />
                  Daily Sales Report
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Monthly Sales')}
                >
                  <BarChart3 className="h-6 w-6 mb-2" />
                  Monthly Sales Report
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Quarterly Sales')}
                >
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Quarterly Report
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Sales by Vehicle')}
                >
                  <Car className="h-6 w-6 mb-2" />
                  Sales by Vehicle
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Revenue Analysis')}
                >
                  <DollarSign className="h-6 w-6 mb-2" />
                  Revenue Analysis
                </Button>
                <Button 
                  variant="outline" 
                  className="h-20 flex-col"
                  onClick={() => handleGenerateReport('Custom Report')}
                >
                  <FileText className="h-6 w-6 mb-2" />
                  Custom Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Individual and team performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Average Deal Size</h4>
                    <p className="text-2xl font-bold text-green-600">$45,250</p>
                    <p className="text-sm text-slate-600">+12% from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Time to Close</h4>
                    <p className="text-2xl font-bold text-blue-600">18 days</p>
                    <p className="text-sm text-slate-600">-3 days from last month</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Customer Satisfaction</h4>
                    <p className="text-2xl font-bold text-purple-600">4.8/5</p>
                    <p className="text-sm text-slate-600">Based on 87 reviews</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Team Performance Breakdown</h4>
                  {reportData.topPerformers.map((performer) => (
                    <div key={performer.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{performer.name}</p>
                        <p className="text-sm text-slate-600">Sales Representative</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="text-sm font-medium">{performer.sales}</p>
                          <p className="text-xs text-slate-500">Sales</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">${(performer.revenue / performer.sales).toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Avg Deal</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-green-600">${performer.revenue.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">Total Revenue</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Custom Reports</CardTitle>
              <CardDescription>Create and manage custom reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Create New Report
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Clock className="mr-2 h-4 w-4" />
                      Schedule Report
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Export Options</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('CSV')}
                    >
                      Export as CSV
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('Excel')}
                    >
                      Export as Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => handleExportData('PDF')}
                    >
                      Export as PDF
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-2">Recent Reports</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">Monthly Sales Summary - May 2024</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">Team Performance Report - Q2 2024</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border">
                    <span className="text-sm">Lead Conversion Analysis - April 2024</span>
                    <Badge variant="secondary">Completed</Badge>
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

export default ReportingCenter;
