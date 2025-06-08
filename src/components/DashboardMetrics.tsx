
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Users, Car, Target, RefreshCw, Plus, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import SalesDetailsDialog from "./SalesDetailsDialog";

const DashboardMetrics = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Empty employee data - ready for real data
  const [employeeData] = useState([]);

  // Calculate metrics based on employee data (all zeros for empty data)
  const calculatedMetrics = useMemo(() => {
    return {
      totalSales: {
        value: isAdmin ? "$0" : "$***",
        change: isAdmin ? "No data" : "***",
        trend: "up" as const
      },
      activeLeads: {
        value: isAdmin ? "0" : "***",
        change: isAdmin ? "No data" : "***", 
        trend: "up" as const
      },
      carsSold: {
        value: isAdmin ? "0" : "***",
        change: isAdmin ? "No data" : "***",
        trend: "up" as const
      },
      conversionRate: {
        value: isAdmin ? "0%" : "***",
        change: isAdmin ? "No data" : "***",
        trend: "up" as const
      }
    };
  }, [employeeData, isAdmin]);

  const [metrics, setMetrics] = useState([
    {
      title: "Total Sales",
      value: calculatedMetrics.totalSales.value,
      change: calculatedMetrics.totalSales.change,
      trend: calculatedMetrics.totalSales.trend,
      icon: DollarSign,
      description: "This month",
      clickable: isAdmin,
      type: "sales"
    },
    {
      title: "Active Leads",
      value: calculatedMetrics.activeLeads.value,
      change: calculatedMetrics.activeLeads.change,
      trend: calculatedMetrics.activeLeads.trend,
      icon: Users,
      description: "Qualified prospects",
      clickable: isAdmin,
      type: "leads"
    },
    {
      title: "Cars Sold",
      value: calculatedMetrics.carsSold.value,
      change: calculatedMetrics.carsSold.change,
      trend: calculatedMetrics.carsSold.trend,
      icon: Car,
      description: "This month",
      clickable: isAdmin,
      type: "cars"
    },
    {
      title: "Conversion Rate",
      value: calculatedMetrics.conversionRate.value,
      change: calculatedMetrics.conversionRate.change,
      trend: calculatedMetrics.conversionRate.trend,
      icon: Target,
      description: "Lead to sale",
      clickable: isAdmin,
      type: "conversion"
    }
  ]);

  // Update metrics when calculated values change
  React.useEffect(() => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: calculatedMetrics[metric.type as keyof typeof calculatedMetrics]?.value || metric.value,
      change: calculatedMetrics[metric.type as keyof typeof calculatedMetrics]?.change || metric.change,
      trend: calculatedMetrics[metric.type as keyof typeof calculatedMetrics]?.trend || metric.trend
    })));
  }, [calculatedMetrics]);

  const handleRefreshData = async () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can refresh data",
        variant: "destructive"
      });
      return;
    }

    setIsRefreshing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsRefreshing(false);
    
    toast({
      title: "Data refreshed",
      description: "Dashboard metrics have been updated with the latest data"
    });
  };

  const renderMetricCard = (metric: any, index: number) => {
    const Icon = metric.icon;
    const cardContent = (
      <Card className={`${metric.clickable ? 'hover:shadow-lg cursor-pointer' : 'hover:shadow-lg'} transition-shadow duration-200`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">
            {metric.title}
          </CardTitle>
          <Icon className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
          <div className="flex items-center space-x-2 mt-1">
            <div className="flex items-center space-x-1 text-sm text-slate-500">
              <span>{metric.change}</span>
            </div>
            <span className="text-slate-500 text-sm">{metric.description}</span>
          </div>
        </CardContent>
      </Card>
    );

    if (metric.clickable && isAdmin) {
      return (
        <SalesDetailsDialog key={index} type={metric.type as "sales" | "leads" | "cars" | "conversion"} employeeData={employeeData}>
          {cardContent}
        </SalesDetailsDialog>
      );
    }

    return <div key={index}>{cardContent}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {isAdmin ? "Admin Dashboard" : "Sales Overview"}
        </h2>
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <>
              <Button 
                variant="outline" 
                size="sm"
                className="text-green-600 border-green-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Data
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-purple-600 border-purple-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefreshData}
            disabled={isRefreshing}
            className="text-blue-600 border-blue-200"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
              <CardDescription>Administrative controls and data management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-slate-900">Data Management</p>
                <p className="text-sm text-slate-600">
                  Add, edit, and manage all sales data, leads, and inventory from this admin panel.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-medium text-slate-900">User Management</p>
                <p className="text-sm text-slate-600">
                  Manage employee access levels and monitor user activity across the platform.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <p className="font-medium text-slate-900">System Configuration</p>
                <p className="text-sm text-slate-600">
                  Configure system settings, notifications, and customize the platform for your dealership.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Actions</CardTitle>
              <CardDescription>Latest administrative activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No admin actions yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Administrative activities will appear here
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Limited Access</CardTitle>
              <CardDescription>Contact your administrator for detailed information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-medium text-slate-900">View Only Access</p>
                <p className="text-sm text-slate-600">
                  You have read-only access to basic sales overview. For detailed data and editing capabilities, contact your administrator.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-medium text-slate-900">Need More Access?</p>
                <p className="text-sm text-slate-600">
                  If you need to view detailed reports or make changes, please reach out to your system administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DashboardMetrics;
