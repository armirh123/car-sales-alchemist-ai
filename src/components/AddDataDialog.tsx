
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Car, Users, DollarSign } from "lucide-react";

interface AddDataDialogProps {
  children: React.ReactNode;
}

const AddDataDialog = ({ children }: AddDataDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("vehicle");
  const { toast } = useToast();

  const [vehicleData, setVehicleData] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    condition: "",
    description: ""
  });

  const [customerData, setCustomerData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });

  const [saleData, setSaleData] = useState({
    vehicleId: "",
    customerId: "",
    salePrice: "",
    saleDate: "",
    commission: "",
    notes: ""
  });

  const handleAddVehicle = () => {
    console.log("Adding vehicle:", vehicleData);
    toast({
      title: "Vehicle Added",
      description: "New vehicle has been added to inventory successfully."
    });
    setVehicleData({
      make: "",
      model: "",
      year: "",
      price: "",
      mileage: "",
      condition: "",
      description: ""
    });
    setOpen(false);
  };

  const handleAddCustomer = () => {
    console.log("Adding customer:", customerData);
    toast({
      title: "Customer Added",
      description: "New customer has been added to the system successfully."
    });
    setCustomerData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      notes: ""
    });
    setOpen(false);
  };

  const handleAddSale = () => {
    console.log("Adding sale:", saleData);
    toast({
      title: "Sale Recorded",
      description: "New sale has been recorded successfully."
    });
    setSaleData({
      vehicleId: "",
      customerId: "",
      salePrice: "",
      saleDate: "",
      commission: "",
      notes: ""
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Data</span>
          </DialogTitle>
          <DialogDescription>
            Add new vehicles, customers, or sales data to the system
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vehicle" className="flex items-center space-x-2">
              <Car className="h-4 w-4" />
              <span>Vehicle</span>
            </TabsTrigger>
            <TabsTrigger value="customer" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Customer</span>
            </TabsTrigger>
            <TabsTrigger value="sale" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Sale</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle">
            <Card>
              <CardHeader>
                <CardTitle>Add New Vehicle</CardTitle>
                <CardDescription>Enter vehicle details to add to inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="make">Make</Label>
                    <Input
                      id="make"
                      value={vehicleData.make}
                      onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})}
                      placeholder="Toyota, Honda, Ford..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input
                      id="model"
                      value={vehicleData.model}
                      onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})}
                      placeholder="Camry, Accord, F-150..."
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={vehicleData.year}
                      onChange={(e) => setVehicleData({...vehicleData, year: e.target.value})}
                      placeholder="2023"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={vehicleData.price}
                      onChange={(e) => setVehicleData({...vehicleData, price: e.target.value})}
                      placeholder="25000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={vehicleData.mileage}
                      onChange={(e) => setVehicleData({...vehicleData, mileage: e.target.value})}
                      placeholder="50000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={vehicleData.condition} onValueChange={(value) => setVehicleData({...vehicleData, condition: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={vehicleData.description}
                    onChange={(e) => setVehicleData({...vehicleData, description: e.target.value})}
                    placeholder="Additional details about the vehicle..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddVehicle} className="w-full">Add Vehicle</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customer">
            <Card>
              <CardHeader>
                <CardTitle>Add New Customer</CardTitle>
                <CardDescription>Enter customer information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={customerData.firstName}
                      onChange={(e) => setCustomerData({...customerData, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={customerData.lastName}
                      onChange={(e) => setCustomerData({...customerData, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerData.email}
                      onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={customerData.phone}
                      onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={customerData.address}
                    onChange={(e) => setCustomerData({...customerData, address: e.target.value})}
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={customerData.notes}
                    onChange={(e) => setCustomerData({...customerData, notes: e.target.value})}
                    placeholder="Additional notes about the customer..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddCustomer} className="w-full">Add Customer</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sale">
            <Card>
              <CardHeader>
                <CardTitle>Record New Sale</CardTitle>
                <CardDescription>Record a completed sale transaction</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleId">Vehicle</Label>
                    <Select value={saleData.vehicleId} onValueChange={(value) => setSaleData({...saleData, vehicleId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">No vehicles available - Add vehicles first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerId">Customer</Label>
                    <Select value={saleData.customerId} onValueChange={(value) => setSaleData({...saleData, customerId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="placeholder">No customers available - Add customers first</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={saleData.salePrice}
                      onChange={(e) => setSaleData({...saleData, salePrice: e.target.value})}
                      placeholder="25000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Sale Date</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={saleData.saleDate}
                      onChange={(e) => setSaleData({...saleData, saleDate: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commission">Commission</Label>
                    <Input
                      id="commission"
                      type="number"
                      value={saleData.commission}
                      onChange={(e) => setSaleData({...saleData, commission: e.target.value})}
                      placeholder="1250"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleNotes">Notes</Label>
                  <Textarea
                    id="saleNotes"
                    value={saleData.notes}
                    onChange={(e) => setSaleData({...saleData, notes: e.target.value})}
                    placeholder="Sale details, financing information, etc..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddSale} className="w-full">Record Sale</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddDataDialog;
