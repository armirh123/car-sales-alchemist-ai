
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Target,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  History
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomerCommunication from "./CustomerCommunication";
import { supabase } from "@/integrations/supabase/client";

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

interface CommunicationLog {
  id: string;
  communication_type: string;
  subject?: string;
  content: string;
  recipient_email?: string;
  recipient_phone?: string;
  status: string;
  created_at: string;
}

interface EnhancedSalesPipelineViewProps {
  customers: Customer[];
  onCustomerUpdate?: (customers: Customer[]) => void;
}

const EnhancedSalesPipelineView = ({ customers, onCustomerUpdate }: EnhancedSalesPipelineViewProps) => {
  const [pipelineData, setPipelineData] = useState(customers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    setPipelineData(customers);
  }, [customers]);

  const stages = [
    { id: 'prospect', title: 'Prospects', color: 'bg-gray-100' },
    { id: 'lead', title: 'Leads', color: 'bg-blue-100' },
    { id: 'hot', title: 'Hot Leads', color: 'bg-red-100' },
    { id: 'negotiating', title: 'Negotiating', color: 'bg-orange-100' },
    { id: 'sold', title: 'Sold', color: 'bg-green-100' },
    { id: 'lost', title: 'Lost', color: 'bg-slate-100' }
  ];

  const getCustomersByStage = (stage: string) => {
    return pipelineData.filter(customer => customer.status === stage);
  };

  const getTotalValueByStage = (stage: string) => {
    return getCustomersByStage(stage).reduce((total, customer) => total + customer.budget, 0);
  };

  const getInterestLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const updatedCustomers = pipelineData.map(customer => {
      if (customer.id === draggableId) {
        return { ...customer, status: destination.droppableId as any };
      }
      return customer;
    });

    setPipelineData(updatedCustomers);
    onCustomerUpdate?.(updatedCustomers);
  };

  const fetchCommunicationLogs = async (customerId: string) => {
    const { data, error } = await supabase
      .from('customer_communications')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching communication logs:', error);
      return;
    }

    setCommunicationLogs(data || []);
  };

  const openCustomerDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    fetchCommunicationLogs(customer.id);
    setDetailsOpen(true);
  };

  const handleCommunicationSent = () => {
    if (selectedCustomer) {
      fetchCommunicationLogs(selectedCustomer.id);
    }
  };

  // Calculate pipeline metrics
  const totalPipelineValue = pipelineData
    .filter(c => c.status !== 'sold' && c.status !== 'lost')
    .reduce((total, customer) => total + customer.budget, 0);
  
  const closedDeals = pipelineData.filter(c => c.status === 'sold');
  const totalClosedValue = closedDeals.reduce((total, customer) => total + customer.budget, 0);
  
  const conversionRate = pipelineData.length > 0 ? (closedDeals.length / pipelineData.length) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Active opportunities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed Deals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalClosedValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {closedDeals.length} deals closed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Lead to sale conversion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pipelineData.filter(c => c.status !== 'sold' && c.status !== 'lost').length}
            </div>
            <p className="text-xs text-muted-foreground">
              In pipeline
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="space-y-3">
              <div className={`p-3 rounded-lg ${stage.color}`}>
                <h3 className="font-medium text-sm">{stage.title}</h3>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-slate-600">
                    {getCustomersByStage(stage.id).length} customers
                  </span>
                  <span className="text-xs font-medium">
                    ${getTotalValueByStage(stage.id).toLocaleString()}
                  </span>
                </div>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[400px] space-y-2 p-2 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-slate-50'
                    }`}
                  >
                    {getCustomersByStage(stage.id).map((customer, index) => (
                      <Draggable key={customer.id} draggableId={customer.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-3 rounded-lg border shadow-sm cursor-grab ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                            onClick={() => openCustomerDetails(customer)}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-sm">
                                  {customer.firstName} {customer.lastName}
                                </h4>
                                <div className={`w-2 h-2 rounded-full ${getInterestLevelColor(customer.interestLevel)}`} />
                              </div>
                              
                              <div className="text-xs text-slate-600">
                                ${customer.budget.toLocaleString()} budget
                              </div>
                              
                              <div className="flex items-center space-x-1 text-xs text-slate-500">
                                <Calendar className="h-3 w-3" />
                                <span>{customer.nextFollowUp.toLocaleDateString()}</span>
                              </div>
                              
                              <div className="text-xs text-slate-500">
                                {customer.assignedTo}
                              </div>
                              
                              <div className="flex space-x-1 pt-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 px-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCustomerDetails(customer);
                                  }}
                                >
                                  <MessageSquare className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <Phone className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-6 px-2">
                                  <Mail className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Customer Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.firstName} {selectedCustomer?.lastName}
            </DialogTitle>
            <DialogDescription>
              Customer details and communication tools
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="text-sm">{selectedCustomer.email}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <div className="text-sm">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Budget</label>
                  <div className="text-sm">${selectedCustomer.budget.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="text-sm capitalize">{selectedCustomer.status}</div>
                </div>
              </div>

              {/* Communication Tools */}
              <CustomerCommunication 
                customer={selectedCustomer}
                communicationLogs={communicationLogs}
                onCommunicationSent={handleCommunicationSent}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedSalesPipelineView;
