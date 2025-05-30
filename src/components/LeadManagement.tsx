
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Phone, Mail, Calendar, Plus, Filter } from "lucide-react";

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const leads = [
    {
      id: 1,
      name: "Johnson Motors",
      contact: "Sarah Johnson",
      email: "sarah@johnsonmotors.com",
      phone: "(555) 123-4567",
      interest: "Luxury Sedans",
      status: "hot",
      lastContact: "2 days ago",
      value: "$125,000"
    },
    {
      id: 2,
      name: "Metro Auto Group",
      contact: "Mike Chen",
      email: "mike@metroauto.com",
      phone: "(555) 234-5678",
      interest: "Electric Vehicles",
      status: "warm",
      lastContact: "1 week ago",
      value: "$85,000"
    },
    {
      id: 3,
      name: "City Dealership",
      contact: "Lisa Rodriguez",
      email: "lisa@citydealer.com",
      phone: "(555) 345-6789",
      interest: "Family SUVs",
      status: "cold",
      lastContact: "2 weeks ago",
      value: "$95,000"
    },
    {
      id: 4,
      name: "Premium Motors",
      contact: "David Kim",
      email: "david@premiummotors.com",
      phone: "(555) 456-7890",
      interest: "Sports Cars",
      status: "hot",
      lastContact: "1 day ago",
      value: "$200,000"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-orange-100 text-orange-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.interest.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Lead Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{lead.name}</h3>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {lead.value}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700">Contact Person</p>
                      <p className="text-sm text-slate-600">{lead.contact}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Interest</p>
                      <p className="text-sm text-slate-600">{lead.interest}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Last Contact</p>
                      <p className="text-sm text-slate-600">{lead.lastContact}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mt-4 text-sm text-slate-600">
                    <span className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>{lead.email}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{lead.phone}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LeadManagement;
