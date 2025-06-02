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
import { DollarSign, TrendingUp, Calendar, Building, Car, Users, User, Target, ChevronDown } from "lucide-react";

interface SalesDetailsDialogProps {
  children: React.ReactNode;
  type: "sales" | "leads" | "cars" | "conversion";
}

const SalesDetailsDialog = ({ children, type }: SalesDetailsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [visibleItems, setVisibleItems] = useState(5);

  const salesData = [
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
  ];

  const leadsData = [
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
  ];

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

  const config = getDialogConfig();
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Icon className="h-5 w-5" />
            <span>{config.title}</span>
          </DialogTitle>
          <DialogDescription>
            {config.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {type === "sales" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,400,000</div>
                    <div className="text-sm text-green-600">+12.5% this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Top Performer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">John Smith</div>
                    <div className="text-sm text-blue-600">$323,000 this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Average Deal Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$35,820</div>
                    <div className="text-sm text-orange-600">+8.2% vs last month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {salesData.slice(0, visibleItems).map((sale) => (
                  <Card key={sale.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{sale.client}</span>
                            <Badge className={getStatusColor(sale.status)}>
                              {sale.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>{sale.salesperson}</span>
                            </span>
                            <span>🚗 {sale.vehicles} vehicles</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{sale.date}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{sale.amount}</div>
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

          {type === "leads" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Total Pipeline Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$635,000</div>
                    <div className="text-sm text-green-600">148 active leads</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Top Lead Manager</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Mike Davis</div>
                    <div className="text-sm text-blue-600">42 active leads</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.8%</div>
                    <div className="text-sm text-green-600">+5.3% this month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {leadsData.slice(0, visibleItems).map((lead) => (
                  <Card key={lead.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Building className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{lead.company}</span>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-slate-600">
                            <div className="flex items-center space-x-4">
                              <span>👤 {lead.contact}</span>
                              <span>📧 {lead.email}</span>
                              <span>📞 {lead.phone}</span>
                            </div>
                            <div className="mt-1 flex items-center space-x-4">
                              <span>🎯 {lead.interest}</span>
                              <span className="flex items-center space-x-1">
                                <User className="h-3 w-3" />
                                <span>Assigned to: {lead.assignedTo}</span>
                              </span>
                              <span>⏰ {lead.lastContact}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{lead.value}</div>
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

          {type === "cars" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Total Cars Sold</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">67</div>
                    <div className="text-sm text-red-600">-2.1% this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Top Seller</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">John Smith</div>
                    <div className="text-sm text-blue-600">18 cars this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Total Commissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$70,075</div>
                    <div className="text-sm text-green-600">This month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {carsData.slice(0, visibleItems).map((car) => (
                  <Card key={car.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Car className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{car.vehicle}</span>
                            <Badge className="bg-blue-100 text-blue-800">sold</Badge>
                          </div>
                          <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                            <span className="flex items-center space-x-1">
                              <User className="h-3 w-3" />
                              <span>Sold by: {car.soldBy}</span>
                            </span>
                            <span>🏢 {car.client}</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{car.date}</span>
                            </span>
                            <span>💰 Commission: {car.commission}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{car.salePrice}</div>
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

          {type === "conversion" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Overall Conversion Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24.8%</div>
                    <div className="text-sm text-green-600">+5.3% this month</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Top Performer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">Emma Brown</div>
                    <div className="text-sm text-green-600">28.6% conversion rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-600">Team Average</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">23.9%</div>
                    <div className="text-sm text-blue-600">Above industry standard</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {conversionData.slice(0, visibleItems).map((conversion) => (
                  <Card key={conversion.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="font-medium">{conversion.employee}</span>
                            <Badge className={getPerformanceColor(conversion.performance)}>
                              {conversion.performance}
                            </Badge>
                          </div>
                          <div className="mt-2 text-sm text-slate-600 flex items-center space-x-4">
                            <span>📊 {conversion.leadsGenerated} leads generated</span>
                            <span>✅ {conversion.salesClosed} sales closed</span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{conversion.period}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{conversion.conversionRate}</div>
                          <div className="text-sm text-slate-500">conversion rate</div>
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
