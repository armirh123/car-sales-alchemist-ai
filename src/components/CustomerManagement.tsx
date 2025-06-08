
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, Plus, Phone, Mail, Calendar, Car, DollarSign, Filter } from "lucide-react";
import AddCustomerDialog from "./AddCustomerDialog";
import CustomerDetailsDialog from "./CustomerDetailsDialog";
import SalesPipelineView from "./SalesPipelineView";

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'prospect' | 'lead' | 'hot' | 'negotiating' | 'sold' | 'lost';
  source: string;
  assignedTo: string;
  interestLevel: 'low' | 'medium' | 'high';
  preferredContact: 'phone' | 'email' | 'text';
  budget: number;
  interestedVehicles: string[];
  lastContact: Date;
  nextFollowUp: Date;
  notes: string;
  createdAt: Date;
}

const CustomerManagement = () => {
  const [activeTab, setActiveTab] = useState("customers");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("lastContact");

  // Sample customer data
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "(555) 123-4567",
      status: "hot",
      source: "Website",
      assignedTo: "Sarah Johnson",
      interestLevel: "high",
      preferredContact: "phone",
      budget: 35000,
      interestedVehicles: ["2024 Toyota Camry", "2023 Honda Accord"],
      lastContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 24 * 60 * 60 * 1000),
      notes: "Very interested in hybrid vehicles. Prefers silver or white color.",
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: "2",
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.davis@email.com",
      phone: "(555) 987-6543",
      status: "negotiating",
      source: "Referral",
      assignedTo: "Mike Wilson",
      interestLevel: "high",
      preferredContact: "email",
      budget: 28000,
      interestedVehicles: ["2023 Ford Escape"],
      lastContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      notes: "Ready to buy, comparing financing options.",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.brown@email.com",
      phone: "(555) 456-7890",
      status: "lead",
      source: "Walk-in",
      assignedTo: "Lisa Chen",
      interestLevel: "medium",
      preferredContact: "phone",
      budget: 45000,
      interestedVehicles: ["2024 BMW X3", "2023 Audi Q5"],
      lastContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      nextFollowUp: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      notes: "Looking for luxury SUV. Test drive scheduled for next week.",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
    }
  ]);

  const handleAddCustomer = (customer: Customer) => {
    console.log("Adding customer:", customer);
  };

  const filteredCustomers = customers
    .filter(customer => 
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    )
    .filter(customer => statusFilter === "all" || customer.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "lastContact":
          return new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime();
        case "nextFollowUp":
          return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
        case "budget":
          return b.budget - a.budget;
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'prospect': return 'bg-gray-100 text-gray-800';
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'hot': return 'bg-red-100 text-red-800';
      case 'negotiating': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverdueCustomers = () => {
    return customers.filter(customer => 
      customer.nextFollowUp < new Date() && 
      customer.status !== 'sold' && 
      customer.status !== 'lost'
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Management</h2>
          <p className="text-slate-600">{filteredCustomers.length} customers in your database</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="destructive" className="text-sm">
            {getOverdueCustomers().length} overdue follow-ups
          </Badge>
          <AddCustomerDialog onAddCustomer={handleAddCustomer} />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customers" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Customer List</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Sales Pipeline</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="hot">Hot Lead</SelectItem>
                <SelectItem value="negotiating">Negotiating</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastContact">Last Contact</SelectItem>
                <SelectItem value="nextFollowUp">Next Follow-up</SelectItem>
                <SelectItem value="budget">Budget</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {customer.firstName} {customer.lastName}
                    </CardTitle>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getInterestLevelColor(customer.interestLevel)}>
                      {customer.interestLevel} interest
                    </Badge>
                    <span className="text-sm text-slate-500">
                      ${customer.budget.toLocaleString()} budget
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-600">
                        {customer.interestedVehicles.length} vehicles of interest
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className={`text-sm ${customer.nextFollowUp < new Date() ? 'text-red-600 font-medium' : 'text-slate-600'}`}>
                        Follow-up: {customer.nextFollowUp.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Assigned to: {customer.assignedTo}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <CustomerDetailsDialog customer={customer}>
                      <Button size="sm" className="flex-1">
                        View Details
                      </Button>
                    </CustomerDetailsDialog>
                    <Button size="sm" variant="outline" className="flex-1">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No customers found</h3>
              <p className="text-slate-600">
                No customers match your current search and filter criteria.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pipeline">
          <SalesPipelineView customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;
