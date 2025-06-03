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

interface SalesDetailsDialogProps {
  children: React.ReactNode;
  type: "sales" | "leads" | "cars" | "conversion";
}

const SalesDetailsDialog = ({ children, type }: SalesDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  // Only show data if user is admin
  const salesData = isAdmin ? [
    {
      id: 1,
      client: "Premium Motors LLC",
      amount: "$125,000",
      date: "2024-01-15",
      vehicles: 3,
      status: "completed",
      salesperson: "John Smith"
    },
    {
      id: 2,
      client: "City Auto Group",
      amount: "$89,500",
      date: "2024-01-14",
      vehicles: 2,
      status: "completed",
      salesperson: "Sarah Johnson"
    },
    {
      id: 3,
      client: "Metro Dealership",
      amount: "$156,800",
      date: "2024-01-13",
      vehicles: 4,
      status: "completed",
      salesperson: "Mike Davis"
    },
    {
      id: 4,
      client: "Highway Motors",
      amount: "$67,200",
      date: "2024-01-12",
      vehicles: 1,
      status: "pending",
      salesperson: "Lisa Chen"
    },
    {
      id: 5,
      client: "Downtown Auto",
      amount: "$198,000",
      date: "2024-01-11",
      vehicles: 5,
      status: "completed",
      salesperson: "John Smith"
    }
  ] : [];

  const leadsData = isAdmin ? [
    {
      id: 1,
      company: "Elite Motors",
      contact: "Robert Wilson",
      email: "rwilson@elitemotors.com",
      phone: "(555) 123-4567",
      interest: "Luxury Sedans",
      value: "$180,000",
      status: "hot",
      lastContact: "2 hours ago",
      assignedTo: "John Smith"
    },
    {
      id: 2,
      company: "Valley Auto Sales",
      contact: "Jennifer Brown",
      email: "jbrown@valleyauto.com",
      phone: "(555) 234-5678",
      interest: "SUVs",
      value: "$95,000",
      status: "warm",
      lastContact: "1 day ago",
      assignedTo: "Sarah Johnson"
    },
    {
      id: 3,
      company: "Sunset Motors",
      contact: "David Martinez",
      email: "dmartinez@sunsetmotors.com",
      phone: "(555) 345-6789",
      interest: "Electric Vehicles",
      value: "$220,000",
      status: "hot",
      lastContact: "3 hours ago",
      assignedTo: "Mike Davis"
    },
    {
      id: 4,
      company: "Riverside Dealership",
      contact: "Amanda Taylor",
      email: "ataylor@riverside.com",
      phone: "(555) 456-7890",
      interest: "Trucks",
      value: "$140,000",
      status: "warm",
      lastContact: "4 hours ago",
      assignedTo: "Lisa Chen"
    }
  ] : [];

  const carsData = [
    {
      id: 1,
      vehicle: "2024 BMW X5",
      client: "Premium Motors LLC",
      salePrice: "$65,000",
      date: "2024-01-15",
      soldBy: "John Smith",
      commission: "$3,250"
    },
    {
      id: 2,
      vehicle: "2023 Audi A6",
      client: "City Auto Group",
      salePrice: "$48,500",
      date: "2024-01-14",
      soldBy: "Sarah Johnson",
      commission: "$2,425"
    },
    {
      id: 3,
      vehicle: "2024 Mercedes GLC",
      client: "Metro Dealership",
      salePrice: "$58,000",
      date: "2024-01-13",
      soldBy: "Mike Davis",
      commission: "$2,900"
    },
    {
      id: 4,
      vehicle: "2023 Tesla Model Y",
      client: "Elite Motors",
      salePrice: "$52,000",
      date: "2024-01-12",
      soldBy: "Lisa Chen",
      commission: "$2,600"
    },
    {
      id: 5,
      vehicle: "2024 Porsche Cayenne",
      client: "Downtown Auto",
      salePrice: "$78,000",
      date: "2024-01-11",
      soldBy: "John Smith",
      commission: "$3,900"
    }
  ];

  const conversionData = [
    {
      id: 1,
      employee: "John Smith",
      leadsGenerated: 45,
      salesClosed: 12,
      conversionRate: "26.7%",
      period: "This month",
      performance: "excellent"
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      leadsGenerated: 38,
      salesClosed: 9,
      conversionRate: "23.7%",
      period: "This month",
      performance: "good"
    },
    {
      id: 3,
      employee: "Mike Davis",
      leadsGenerated: 42,
      salesClosed: 10,
      conversionRate: "23.8%",
      period: "This month",
      performance: "good"
    },
    {
      id: 4,
      employee: "Lisa Chen",
      leadsGenerated: 23,
      salesClosed: 5,
      conversionRate: "21.7%",
      period: "This month",
      performance: "average"
    },
    {
      id: 5,
      employee: "Tom Wilson",
      leadsGenerated: 31,
      salesClosed: 6,
      conversionRate: "19.4%",
      period: "This month",
      performance: "average"
    },
    {
      id: 6,
      employee: "Emma Brown",
      leadsGenerated: 28,
      salesClosed: 8,
      conversionRate: "28.6%",
      period: "This month",
      performance: "excellent"
    }
  ];

  const getCurrentData = () => {
    if (!isAdmin) return [];
    
    switch (type) {
      case "sales":
        return salesData;
      case "leads":
        return leadsData;
      case "cars":
        return [];
      case "conversion":
        return [];
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
          description: "Lead to sale conversion performance by team members"
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
              {/* Summary cards would go here - removed generated content */}
              <div className="space-y-3">
                {currentData.slice(0, visibleItems).map((item: any) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">
                              {item.client || item.company || item.vehicle || item.employee}
                            </span>
                            {item.status && (
                              <Badge className="bg-blue-100 text-blue-800">
                                {item.status}
                              </Badge>
                            )}
                          </div>
                          <div className="mt-2 text-sm text-slate-600">
                            <p>Additional details will be populated by admin</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {item.amount || item.value || item.salePrice || item.conversionRate}
                          </div>
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
