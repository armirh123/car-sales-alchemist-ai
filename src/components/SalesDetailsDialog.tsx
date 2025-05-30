
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
import { DollarSign, TrendingUp, Calendar, Building } from "lucide-react";

interface SalesDetailsDialogProps {
  children: React.ReactNode;
  type: "sales" | "leads";
}

const SalesDetailsDialog = ({ children, type }: SalesDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

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
      lastContact: "2 hours ago"
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
      lastContact: "1 day ago"
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
      lastContact: "3 hours ago"
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
      lastContact: "4 hours ago"
    }
  ];

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {type === "sales" ? (
              <>
                <DollarSign className="h-5 w-5" />
                <span>Sales Details</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5" />
                <span>Active Leads Details</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {type === "sales" 
              ? "Detailed breakdown of recent sales transactions"
              : "Detailed breakdown of active leads in your pipeline"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {type === "sales" ? (
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
                    <CardTitle className="text-sm text-slate-600">Completed Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">67</div>
                    <div className="text-sm text-blue-600">This month</div>
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
                {salesData.map((sale) => (
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
                            <span>👤 {sale.salesperson}</span>
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
              </div>
            </>
          ) : (
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
                    <CardTitle className="text-sm text-slate-600">Hot Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">32</div>
                    <div className="text-sm text-red-600">Needs immediate attention</div>
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
                {leadsData.map((lead) => (
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
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SalesDetailsDialog;
