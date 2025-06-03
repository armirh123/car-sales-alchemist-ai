import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Calendar, Building, Car, Users, User, Target, ChevronDown, Plus, Edit } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  id: number;
  name: string;
  leadsGenerated: number;
  salesClosed: number;
}

interface SalesDetailsDialogProps {
  children: React.ReactNode;
  type: "sales" | "leads" | "cars" | "conversion";
  employeeData?: Employee[];
}

const SalesDetailsDialog = ({ children, type, employeeData = [] }: SalesDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  // Calculate conversion data from employee data
  const conversionData = employeeData.map(emp => ({
    id: emp.id,
    employee: emp.name,
    leadsGenerated: emp.leadsGenerated,
    salesClosed: emp.salesClosed,
    conversionRate: emp.leadsGenerated > 0 ? `${(emp.salesClosed / emp.leadsGenerated * 100).toFixed(1)}%` : "0.0%",
    period: "This month",
    performance: emp.leadsGenerated > 0 ? 
      (emp.salesClosed / emp.leadsGenerated) > 0.25 ? "excellent" :
      (emp.salesClosed / emp.leadsGenerated) > 0.20 ? "good" : "average"
      : "average"
  }));

  // Mock data for other types - in real app this would come from database
  const salesData = isAdmin ? employeeData.map(emp => ({
    id: emp.id,
    client: `Client ${emp.id}`,
    amount: `$${(emp.salesClosed * 45000).toLocaleString()}`,
    date: "2024-01-15",
    vehicles: emp.salesClosed,
    status: "completed",
    salesperson: emp.name
  })) : [];

  const leadsData = isAdmin ? employeeData.map(emp => ({
    id: emp.id,
    company: `Company ${emp.id}`,
    contact: `Contact ${emp.id}`,
    email: `contact${emp.id}@company.com`,
    phone: `(555) 123-456${emp.id}`,
    interest: "Various Vehicles",
    value: `$${(emp.leadsGenerated * 15000).toLocaleString()}`,
    status: emp.leadsGenerated > 30 ? "hot" : "warm",
    lastContact: "2 hours ago",
    assignedTo: emp.name
  })) : [];

  const carsData = employeeData.map(emp => ({
    id: emp.id,
    vehicle: `Vehicle ${emp.id}`,
    client: `Client ${emp.id}`,
    salePrice: `$${(45000 + (emp.id * 5000)).toLocaleString()}`,
    date: "2024-01-15",
    soldBy: emp.name,
    commission: `$${((45000 + (emp.id * 5000)) * 0.05).toLocaleString()}`
  }));

  const getCurrentData = () => {
    if (!isAdmin) return [];
    
    switch (type) {
      case "sales":
        return salesData;
      case "leads":
        return leadsData;
      case "cars":
        return carsData;
      case "conversion":
        return conversionData;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const hasMoreItems = visibleItems < currentData.length;

  const handleShowMore = () => {
    setVisibleItems(prev => Math.min(prev + 5, currentData.length));
  };

  const handleAddNew = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can add new entries",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Add New",
      description: "Add functionality will be implemented by admin"
    });
  };

  const handleEdit = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit entries",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Edit",
      description: "Edit functionality will be implemented by admin"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'hot':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'warm':
        return 'bg-orange-100 text-orange-800';
      case 'cold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'average':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDialogConfig = () => {
    switch (type) {
      case "sales":
        return {
          icon: DollarSign,
          title: "Sales Details by Employee",
          description: "Detailed breakdown of sales transactions by team members"
        };
      case "leads":
        return {
          icon: Users,
          title: "Active Leads by Employee",
          description: "Detailed breakdown of leads assigned to team members"
        };
      case "cars":
        return {
          icon: Car,
          title: "Cars Sold by Employee",
          description: "Detailed breakdown of vehicles sold by team members"
        };
      case "conversion":
        return {
          icon: Target,
          title: "Conversion Rates by Employee",
          description: "Real-time conversion performance calculated from leads and sales data"
        };
      default:
        return {
          icon: DollarSign,
          title: "Details",
          description: "Detailed breakdown"
        };
    }
  };

  if (!isAdmin) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
            <DialogDescription>
              Detailed data access is limited to administrators only.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">
                  You don't have permission to view detailed sales data. Please contact your administrator for access to comprehensive reports and analytics.
                </p>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{config.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddNew}
                className="text-green-600 border-green-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleEdit}
                className="text-blue-600 border-blue-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            {config.description} - Administrator access required
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentData.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-slate-900 mb-2">No Data Available</p>
                <p className="text-slate-600 mb-4">
                  Start by adding your first {type} entry to see detailed analytics here.
                </p>
                <Button onClick={handleAddNew} className="text-green-600 border-green-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {currentData.slice(0, visibleItems).map((item: any) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">
                              {item.employee || item.salesperson || item.assignedTo || item.soldBy}
                            </span>
                            {item.status && (
                              <Badge className={getStatusColor(item.status)}>
                                {item.status}
                              </Badge>
                            )}
                            {item.performance && (
                              <Badge className={getPerformanceColor(item.performance)}>
                                {item.performance}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-slate-600">
                            {type === "conversion" ? (
                              <div className="grid grid-cols-3 gap-4">
                                <div>
                                  <span className="font-medium">Leads: </span>
                                  <span>{item.leadsGenerated}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Sales: </span>
                                  <span>{item.salesClosed}</span>
                                </div>
                                <div>
                                  <span className="font-medium">Period: </span>
                                  <span>{item.period}</span>
                                </div>
                              </div>
                            ) : (
                              <p>
                                {item.client && `Client: ${item.client} • `}
                                {item.company && `Company: ${item.company} • `}
                                {item.vehicle && `Vehicle: ${item.vehicle} • `}
                                {item.date && `Date: ${item.date}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {item.amount || item.value || item.salePrice || item.conversionRate}
                          </div>
                          {item.commission && (
                            <div className="text-sm text-slate-500">
                              Commission: {item.commission}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {hasMoreItems && (
                  <div className="flex justify-center pt-4">
                    <Button 
                      variant="outline" 
                      onClick={handleShowMore}
                      className="flex items-center space-x-2"
                    >
                      <span>Show More</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesDetailsDialog;
