
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

  // Empty customer data - ready for real data
  const [customers] = useState<Customer[]>([]);

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
          <Badge variant="outline" className="text-sm">
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

          {/* Customer Grid - Empty State */}
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No Customers Yet</h3>
            <p className="text-slate-600 mb-4">
              Start building your customer database by adding your first customer.
            </p>
            <AddCustomerDialog onAddCustomer={handleAddCustomer} />
          </div>
        </TabsContent>

        <TabsContent value="pipeline">
          <SalesPipelineView customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerManagement;
