
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  Car, 
  MessageSquare, 
  Clock,
  Edit,
  PhoneCall,
  Send
} from "lucide-react";

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

interface CustomerDetailsDialogProps {
  customer: Customer;
  children: React.ReactNode;
}

const CustomerDetailsDialog = ({ customer, children }: CustomerDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  // Sample interaction history
  const interactionHistory = [
    {
      id: "1",
      type: "call",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      duration: "15 min",
      notes: "Discussed financing options for Toyota Camry. Customer interested in 0% APR deal.",
      representative: "Sarah Johnson"
    },
    {
      id: "2",
      type: "email",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: "Sent brochures for hybrid vehicles. Customer responded positively.",
      representative: "Sarah Johnson"
    },
    {
      id: "3",
      type: "visit",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      duration: "45 min",
      notes: "Initial consultation. Test drove 2024 Camry Hybrid. Very interested.",
      representative: "Sarah Johnson"
    }
  ];

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

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'call': return <PhoneCall className="h-4 w-4" />;
      case 'email': return <Mail className="h-4 w-4" />;
      case 'visit': return <User className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">
                {customer.firstName} {customer.lastName}
              </DialogTitle>
              <DialogDescription className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(customer.status)}>
                  {customer.status.toUpperCase()}
                </Badge>
                <span>Customer since {customer.createdAt.toLocaleDateString()}</span>
              </DialogDescription>
            </div>
            <Button size="sm" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <span>Prefers {customer.preferredContact}</span>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" className="flex-1">
                      <PhoneCall className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Send className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Sales Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Budget:</span>
                    <span className="font-medium">${customer.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Interest Level:</span>
                    <Badge variant="outline" className={
                      customer.interestLevel === 'high' ? 'bg-red-100 text-red-800' :
                      customer.interestLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {customer.interestLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Source:</span>
                    <span className="font-medium">{customer.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Assigned To:</span>
                    <span className="font-medium">{customer.assignedTo}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Follow-up Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Last Contact:</span>
                  <span className="font-medium">{customer.lastContact.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Next Follow-up:</span>
                  <span className={`font-medium ${customer.nextFollowUp < new Date() ? 'text-red-600' : 'text-green-600'}`}>
                    {customer.nextFollowUp.toLocaleDateString()}
                    {customer.nextFollowUp < new Date() && " (Overdue)"}
                  </span>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 mb-2">Notes:</h4>
                  <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded">
                    {customer.notes || "No notes available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Interaction History</CardTitle>
                <CardDescription>All customer interactions and communications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {interactionHistory.map((interaction) => (
                    <div key={interaction.id} className="flex items-start space-x-3 p-3 border border-slate-200 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-full">
                        {getInteractionIcon(interaction.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium capitalize">{interaction.type}</span>
                          <span className="text-sm text-slate-500">
                            {interaction.date.toLocaleDateString()}
                            {interaction.duration && ` • ${interaction.duration}`}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{interaction.notes}</p>
                        <p className="text-xs text-slate-500">by {interaction.representative}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vehicles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Car className="h-5 w-5 mr-2" />
                  Interested Vehicles
                </CardTitle>
                <CardDescription>Vehicles the customer has shown interest in</CardDescription>
              </CardHeader>
              <CardContent>
                {customer.interestedVehicles.length > 0 ? (
                  <div className="space-y-3">
                    {customer.interestedVehicles.map((vehicle, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Car className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{vehicle}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">View Details</Button>
                          <Button size="sm">Schedule Test Drive</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No vehicles selected</h3>
                    <p className="text-slate-600">
                      Customer hasn't shown interest in specific vehicles yet.
                    </p>
                    <Button className="mt-4" size="sm">
                      Add Vehicle Interest
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsDialog;
