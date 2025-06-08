
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Building, 
  Car, 
  Users, 
  User, 
  Target, 
  ChevronDown, 
  Plus, 
  Edit,
  Save,
  X,
  Phone,
  Mail,
  Clock,
  Award,
  Briefcase,
  FileText,
  Calculator,
  PiggyBank,
  CreditCard,
  Percent,
  Star,
  TrendingDown,
  Activity,
  BarChart3,
  LineChart,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
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
  const [visibleItems, setVisibleItems] = useState(10);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("performance");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const isAdmin = user?.role === 'admin';

  // Enhanced conversion data with more employee metrics
  const conversionData = employeeData.map(emp => {
    const conversionRate = emp.leadsGenerated > 0 ? (emp.salesClosed / emp.leadsGenerated) : 0;
    const avgDealSize = 45000 + (emp.id * 5000);
    const totalRevenue = emp.salesClosed * avgDealSize;
    const commission = totalRevenue * 0.05;
    
    return {
      id: emp.id,
      employee: emp.name,
      leadsGenerated: emp.leadsGenerated,
      salesClosed: emp.salesClosed,
      conversionRate: `${(conversionRate * 100).toFixed(1)}%`,
      avgDealSize: avgDealSize,
      totalRevenue: totalRevenue,
      commission: commission,
      quotaProgress: Math.min((emp.salesClosed / 15) * 100, 100), // 15 sales quota
      lastActivity: "2 hours ago",
      performance: conversionRate > 0.25 ? "excellent" : conversionRate > 0.20 ? "good" : conversionRate > 0.15 ? "average" : "needs_improvement",
      trend: emp.salesClosed > emp.leadsGenerated * 0.2 ? "up" : "down",
      monthlyGoal: 15,
      yearlyGoal: 180
    };
  });

  // Enhanced sales data with detailed transaction info
  const salesData = isAdmin ? employeeData.map(emp => ({
    id: emp.id,
    client: `${emp.name.split(' ')[0]} Customer ${emp.id}`,
    vehicleDetails: `2024 Honda Civic Sport`,
    amount: `$${(emp.salesClosed * 45000).toLocaleString()}`,
    saleDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    vehicles: emp.salesClosed,
    status: emp.salesClosed > 10 ? "completed" : emp.salesClosed > 5 ? "pending_delivery" : "pending_financing",
    salesperson: emp.name,
    financeType: emp.id % 3 === 0 ? "cash" : emp.id % 2 === 0 ? "finance" : "lease",
    tradeIn: emp.id % 4 === 0 ? `$${(15000 + emp.id * 1000).toLocaleString()}` : "No Trade",
    commission: `$${((emp.salesClosed * 45000) * 0.05).toLocaleString()}`,
    customerRating: Math.min(5, 3 + (emp.salesClosed / 10)),
    followUpRequired: emp.salesClosed < 8,
    warrantyPurchased: emp.id % 3 === 0
  })) : [];

  // Enhanced leads data with detailed prospect info
  const leadsData = isAdmin ? employeeData.map(emp => ({
    id: emp.id,
    company: `${emp.name.split(' ')[0]} Enterprises`,
    contact: `Contact Person ${emp.id}`,
    email: `contact${emp.id}@company.com`,
    phone: `(555) 123-456${emp.id}`,
    interest: emp.id % 4 === 0 ? "Electric Vehicles" : emp.id % 3 === 0 ? "Luxury Sedans" : emp.id % 2 === 0 ? "SUVs" : "Trucks",
    estimatedValue: `$${(emp.leadsGenerated * 15000).toLocaleString()}`,
    budget: `$${(25000 + emp.id * 5000).toLocaleString()}`,
    status: emp.leadsGenerated > 30 ? "hot" : emp.leadsGenerated > 20 ? "warm" : "cold",
    lastContact: emp.id % 3 === 0 ? "2 hours ago" : emp.id % 2 === 0 ? "1 day ago" : "3 days ago",
    assignedTo: emp.name,
    source: emp.id % 4 === 0 ? "Website" : emp.id % 3 === 0 ? "Referral" : emp.id % 2 === 0 ? "Walk-in" : "Phone Call",
    nextFollowUp: "Tomorrow 2:00 PM",
    priority: emp.leadsGenerated > 25 ? "high" : emp.leadsGenerated > 15 ? "medium" : "low",
    stages: ["contacted", "qualified", "demo_scheduled", "proposal_sent", "negotiating"],
    currentStage: emp.leadsGenerated > 20 ? "negotiating" : emp.leadsGenerated > 15 ? "proposal_sent" : "qualified",
    probability: Math.min(90, emp.leadsGenerated * 2)
  })) : [];

  // Enhanced cars data with detailed vehicle transaction info
  const carsData = employeeData.map(emp => ({
    id: emp.id,
    vehicle: `2024 ${emp.id % 4 === 0 ? 'Tesla Model 3' : emp.id % 3 === 0 ? 'BMW 3 Series' : emp.id % 2 === 0 ? 'Honda CR-V' : 'Ford F-150'}`,
    stockNumber: `ST${emp.id.toString().padStart(6, '0')}`,
    client: `Customer ${emp.id}`,
    salePrice: `$${(45000 + (emp.id * 5000)).toLocaleString()}`,
    costBasis: `$${(38000 + (emp.id * 4000)).toLocaleString()}`,
    profit: `$${(7000 + (emp.id * 1000)).toLocaleString()}`,
    saleDate: "2024-01-15",
    deliveryDate: "2024-01-20",
    soldBy: emp.name,
    financeManager: `Finance Manager ${emp.id % 3 + 1}`,
    commission: `$${((45000 + (emp.id * 5000)) * 0.05).toLocaleString()}`,
    warranties: emp.id % 3 === 0 ? "Extended + GAP" : emp.id % 2 === 0 ? "Extended Only" : "None",
    tradeInValue: emp.id % 4 === 0 ? `$${(12000 + emp.id * 800).toLocaleString()}` : "No Trade",
    financingRate: emp.id % 3 === 0 ? "0.9% APR" : emp.id % 2 === 0 ? "2.9% APR" : "Cash Sale",
    customerSatisfaction: Math.min(5, 3.5 + (emp.salesClosed / 20))
  }));

  const getCurrentData = () => {
    if (!isAdmin && type !== "conversion") return [];
    
    let data;
    switch (type) {
      case "sales": data = salesData; break;
      case "leads": data = leadsData; break;
      case "cars": data = carsData; break;
      case "conversion": data = conversionData; break;
      default: data = [];
    }

    // Apply search filter
    if (searchTerm) {
      data = data.filter((item: any) => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      data = data.filter((item: any) => 
        item.status === filterStatus || item.performance === filterStatus
      );
    }

    // Apply sorting
    data.sort((a: any, b: any) => {
      switch (sortBy) {
        case "performance":
          return (b.conversionRate || b.totalRevenue || b.amount || 0) - (a.conversionRate || a.totalRevenue || a.amount || 0);
        case "name":
          return (a.employee || a.salesperson || a.assignedTo || "").localeCompare(b.employee || b.salesperson || b.assignedTo || "");
        case "date":
          return new Date(b.saleDate || b.lastContact || "").getTime() - new Date(a.saleDate || a.lastContact || "").getTime();
        default:
          return 0;
      }
    });

    return data;
  };

  const currentData = getCurrentData();
  const hasMoreItems = visibleItems < currentData.length;

  const handleShowMore = () => {
    setVisibleItems(prev => Math.min(prev + 10, currentData.length));
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
    setIsAddingNew(true);
  };

  const handleEdit = (id: number) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can edit entries",
        variant: "destructive"
      });
      return;
    }
    setEditingId(id);
  };

  const handleSave = () => {
    setEditingId(null);
    setIsAddingNew(false);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'hot':
      case 'excellent':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'pending_delivery':
      case 'pending_financing':
      case 'warm':
      case 'good':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cold':
      case 'average':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'needs_improvement':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDialogConfig = () => {
    switch (type) {
      case "sales":
        return {
          icon: DollarSign,
          title: "Sales Performance & Transactions",
          description: "Detailed sales analytics and transaction management for your team"
        };
      case "leads":
        return {
          icon: Users,
          title: "Lead Pipeline & Management",
          description: "Comprehensive lead tracking and conversion pipeline"
        };
      case "cars":
        return {
          icon: Car,
          title: "Vehicle Sales & Inventory",
          description: "Detailed vehicle transaction history and profitability analysis"
        };
      case "conversion":
        return {
          icon: Target,
          title: "Conversion Analytics & Performance",
          description: "Real-time conversion metrics and sales performance tracking"
        };
      default:
        return {
          icon: BarChart3,
          title: "Analytics Dashboard",
          description: "Comprehensive business intelligence and reporting"
        };
    }
  };

  if (!isAdmin && type !== "conversion") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Access Restricted</DialogTitle>
            <DialogDescription>
              Detailed analytics are limited to administrators and managers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-slate-600">
                  You don't have permission to view detailed sales analytics. Contact your manager or administrator for access to comprehensive reports and performance data.
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{config.title}</span>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && (
                <>
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
                    className="text-blue-600 border-blue-200"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {/* Enhanced Filters and Search */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-6">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="average">Average</SelectItem>
              <SelectItem value="hot">Hot</SelectItem>
              <SelectItem value="warm">Warm</SelectItem>
              <SelectItem value="cold">Cold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {currentData.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-lg font-medium text-slate-900 mb-2">No Data Available</p>
                <p className="text-slate-600 mb-4">
                  {searchTerm ? "No results match your search criteria." : `Start by adding your first ${type} entry to see detailed analytics here.`}
                </p>
                {isAdmin && !searchTerm && (
                  <Button onClick={handleAddNew} className="text-green-600 border-green-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Entry
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="space-y-3">
                {currentData.slice(0, visibleItems).map((item: any) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="font-semibold text-lg">
                              {item.employee || item.salesperson || item.assignedTo || item.soldBy}
                            </span>
                            {item.status && (
                              <Badge className={getStatusColor(item.status)} variant="outline">
                                {item.status.replace('_', ' ')}
                              </Badge>
                            )}
                            {item.performance && (
                              <Badge className={getStatusColor(item.performance)} variant="outline">
                                {item.performance.replace('_', ' ')}
                              </Badge>
                            )}
                            {item.trend && (
                              <div className="flex items-center">
                                {item.trend === "up" ? (
                                  <TrendingUp className="h-4 w-4 text-green-500" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced content based on type */}
                          {type === "conversion" ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div className="bg-blue-50 p-3 rounded">
                                <div className="text-sm text-blue-600 font-medium">Leads Generated</div>
                                <div className="text-xl font-bold text-blue-700">{item.leadsGenerated}</div>
                              </div>
                              <div className="bg-green-50 p-3 rounded">
                                <div className="text-sm text-green-600 font-medium">Sales Closed</div>
                                <div className="text-xl font-bold text-green-700">{item.salesClosed}</div>
                              </div>
                              <div className="bg-purple-50 p-3 rounded">
                                <div className="text-sm text-purple-600 font-medium">Conversion Rate</div>
                                <div className="text-xl font-bold text-purple-700">{item.conversionRate}</div>
                              </div>
                              <div className="bg-orange-50 p-3 rounded">
                                <div className="text-sm text-orange-600 font-medium">Quota Progress</div>
                                <div className="text-xl font-bold text-orange-700">{item.quotaProgress?.toFixed(0)}%</div>
                              </div>
                            </div>
                          ) : type === "sales" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-sm font-medium text-slate-600">Client: </span>
                                <span>{item.client}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Vehicle: </span>
                                <span>{item.vehicleDetails}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Finance: </span>
                                <span className="capitalize">{item.financeType}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Trade: </span>
                                <span>{item.tradeIn}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Rating: </span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`h-3 w-3 ${i < item.customerRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Date: </span>
                                <span>{item.saleDate}</span>
                              </div>
                            </div>
                          ) : type === "leads" ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-sm font-medium text-slate-600">Company: </span>
                                <span>{item.company}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Interest: </span>
                                <span>{item.interest}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Budget: </span>
                                <span>{item.budget}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Source: </span>
                                <span>{item.source}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Stage: </span>
                                <span className="capitalize">{item.currentStage?.replace('_', ' ')}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Probability: </span>
                                <span>{item.probability}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-sm font-medium text-slate-600">Vehicle: </span>
                                <span>{item.vehicle}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Client: </span>
                                <span>{item.client}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Profit: </span>
                                <span className="text-green-600 font-medium">{item.profit}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Financing: </span>
                                <span>{item.financingRate}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Warranty: </span>
                                <span>{item.warranties}</span>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-slate-600">Stock #: </span>
                                <span>{item.stockNumber}</span>
                              </div>
                            </div>
                          )}

                          {/* Contact information for leads */}
                          {type === "leads" && (
                            <div className="flex items-center space-x-4 text-sm text-slate-600 bg-slate-50 p-2 rounded">
                              <span className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{item.email}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{item.phone}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>Last: {item.lastContact}</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end space-y-2 ml-4">
                          <div className="text-right">
                            <div className="text-xl font-bold text-green-600">
                              {item.amount || item.estimatedValue || item.salePrice || item.totalRevenue?.toLocaleString() || item.conversionRate}
                            </div>
                            {item.commission && (
                              <div className="text-sm text-slate-500">
                                Commission: {item.commission}
                              </div>
                            )}
                          </div>
                          
                          {isAdmin && (
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleEdit(item.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Phone className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Mail className="h-3 w-3" />
                              </Button>
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
                      <span>Show More ({currentData.length - visibleItems} remaining)</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Quick Actions Footer */}
        {isAdmin && (
          <div className="flex space-x-2 pt-4 border-t">
            <Button size="sm" variant="outline" className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <LineChart className="h-4 w-4 mr-2" />
              View Trends
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Projections
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SalesDetailsDialog;
