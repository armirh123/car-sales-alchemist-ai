
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Car,
  Calendar,
  Gauge,
  Palette,
  DollarSign,
  Shield,
  Fuel,
  Settings,
  Users,
  MapPin,
  Phone,
  Mail,
  Heart,
  Share2,
  FileText,
  Zap,
  Snowflake,
  Radio,
  Navigation,
  Camera,
  Lock,
  Wrench,
  Edit,
  Save,
  X,
  Plus,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calculator,
  Target,
  UserCheck,
  Clipboard,
  Star,
  MessageSquare,
  History,
  Tag,
  Percent,
  Banknote,
  CreditCard,
  PiggyBank,
  FileBarChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  category: string;
  status: string;
  description: string;
  mileage: number;
  color: string;
  images?: string[];
}

interface CarDetailsDialogProps {
  car: Car;
  children: React.ReactNode;
}

const CarDetailsDialog = ({ car, children }: CarDetailsDialogProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [editedPrice, setEditedPrice] = useState(car.price);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [internalNotes, setInternalNotes] = useState("Customer showed high interest. Mentioned trade-in possibility. Follow up on financing options.");
  const [salesNotes, setSalesNotes] = useState("");
  const [leadStatus, setLeadStatus] = useState("interested");
  const [appointmentType, setAppointmentType] = useState("test_drive");
  const { toast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const getDefaultImage = (make: string) => {
    return `https://images.unsplash.com/photo-1494905998402-395d579af36f?w=600&h=400&fit=crop&crop=center`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'on_hold': return 'bg-blue-100 text-blue-800';
      case 'service': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Enhanced car details with employee-focused information
  const carDetails = {
    vin: `${car.make.substring(0, 3).toUpperCase()}${car.year}${car.id.substring(0, 8)}`,
    stockNumber: `ST${car.id.substring(0, 6)}`,
    engine: car.category === 'Electric' ? 'Electric Motor - 300HP' : car.category === 'Trucks' ? '5.0L V8 - 400HP' : '2.4L Turbo 4-Cylinder - 250HP',
    transmission: car.category === 'Electric' ? 'Single-Speed Direct Drive' : car.category === 'Luxury' ? '8-Speed Automatic with Paddle Shifters' : '6-Speed Automatic',
    drivetrain: car.category === 'Trucks' ? '4WD with Low Range' : car.category === 'SUVs' ? 'AWD with Terrain Management' : 'FWD',
    fuelType: car.category === 'Electric' ? 'Electric (120 kW Battery)' : 'Premium Gasoline',
    mpg: car.category === 'Electric' ? '120 MPGe Combined' : car.category === 'Trucks' ? '18/24 City/Hwy' : '28/35 City/Hwy',
    doors: car.category === 'Trucks' ? 4 : car.category === 'Sports' ? 2 : 4,
    seats: car.category === 'SUVs' ? 8 : car.category === 'Trucks' ? 5 : car.category === 'Sports' ? 2 : 5,
    warranty: '3 Year/36,000 Mile Basic, 5 Year/60,000 Mile Powertrain, 10 Year/100,000 Mile Hybrid/Electric',
    location: 'Main Lot - Section A',
    dateReceived: '2024-01-15',
    daysOnLot: 45,
    costBasis: car.price * 0.85, // Dealer cost
    msrp: car.price * 1.15, // MSRP
    invoice: car.price * 0.87, // Invoice price
    margin: car.price * 0.13, // Profit margin
    keyFeatures: [
      'Advanced Safety Suite',
      'Bluetooth & Apple CarPlay',
      'Backup Camera with Guidelines',
      'Cruise Control with Speed Limiter',
      'Power Windows & Locks',
      'Dual-Zone Climate Control',
      car.category === 'Electric' ? 'DC Fast Charging Capability' : 'Remote Keyless Entry',
      car.category === 'Luxury' ? 'Premium Leather Heated Seats' : 'Cloth Upholstery',
      car.category === 'Sports' ? 'Sport-Tuned Suspension' : 'Electronic Stability Control',
      'LED Headlights & Taillights',
      'Alloy Wheels',
      '12V Power Outlets'
    ],
    safetyFeatures: [
      'Dual-Stage Frontal Airbags',
      'Side-Impact Airbags',
      'Curtain Airbags',
      '4-Wheel Anti-lock Brakes (ABS)',
      'Electronic Brake Distribution',
      'Electronic Stability Control',
      'Traction Control System',
      car.category === 'Luxury' ? 'Blind Spot Monitoring with Cross-Traffic Alert' : 'Tire Pressure Monitoring System',
      car.year >= 2023 ? 'Forward Collision Warning with Auto Emergency Braking' : 'Daytime Running Lights',
      car.year >= 2023 ? 'Lane Departure Warning' : 'Hill Start Assist',
      'LATCH Child Safety Seat Anchors'
    ],
    techFeatures: [
      '8-inch Touchscreen Display',
      'Apple CarPlay & Android Auto',
      'Multiple USB Charging Ports',
      'AM/FM/HD Radio with 6 Speakers',
      'Bluetooth Hands-Free Phone',
      car.category === 'Luxury' ? 'Built-in Navigation System' : 'Smartphone Integration',
      car.category === 'Electric' ? 'Mobile App Vehicle Control' : 'SiriusXM Satellite Radio Ready',
      'Voice Recognition',
      'Steering Wheel Audio Controls',
      'Rearview Camera Display'
    ],
    maintenanceHistory: [
      { date: '2024-01-10', service: 'Pre-delivery Inspection', cost: 150 },
      { date: '2024-01-08', service: 'Detail & Reconditioning', cost: 300 },
      { date: '2024-01-05', service: 'Safety Inspection', cost: 75 }
    ],
    financingOptions: [
      { term: '36 months', rate: '3.9%', payment: Math.round((car.price * 1.039) / 36) },
      { term: '48 months', rate: '4.2%', payment: Math.round((car.price * 1.042) / 48) },
      { term: '60 months', rate: '4.5%', payment: Math.round((car.price * 1.045) / 60) },
      { term: '72 months', rate: '4.9%', payment: Math.round((car.price * 1.049) / 72) }
    ]
  };

  const images = car.images && car.images.length > 0 ? car.images : [
    getDefaultImage(car.make),
    `https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&h=400&fit=crop&crop=center`,
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center`,
    `https://images.unsplash.com/photo-1520031441872-265e4ff4b6ae?w=600&h=400&fit=crop&crop=center`,
    `https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=400&fit=crop&crop=center`
  ];

  const handlePriceSave = () => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can modify pricing",
        variant: "destructive"
      });
      return;
    }
    setIsEditingPrice(false);
    toast({
      title: "Price Updated",
      description: `New price: $${editedPrice.toLocaleString()}`
    });
  };

  const handleStatusChange = (newStatus: string) => {
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can change vehicle status",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Status Updated",
      description: `Vehicle status changed to ${newStatus}`
    });
  };

  const handleScheduleAppointment = () => {
    toast({
      title: "Appointment Scheduled",
      description: `${appointmentType.replace('_', ' ')} scheduled successfully`
    });
  };

  const handleCreateLead = () => {
    toast({
      title: "Lead Created",
      description: "New customer lead has been added to the system"
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {car.year} {car.make} {car.model}
            </span>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(car.status)}>
                {car.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Stock: {carDetails.stockNumber}
              </Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                {carDetails.daysOnLot} days on lot
              </Badge>
            </div>
          </DialogTitle>
          <DialogDescription>
            VIN: {carDetails.vin} • {car.category} • {carDetails.location} • Received: {carDetails.dateReceived}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image Gallery - Left Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative">
              <img
                src={images[selectedImageIndex]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} of {images.length}
              </div>
              <div className="absolute top-2 left-2 bg-green-600/90 text-white px-2 py-1 rounded text-sm">
                Ready for Sale
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${car.make} ${car.model} ${index + 1}`}
                  className={`w-full h-16 object-cover rounded cursor-pointer transition-opacity ${
                    selectedImageIndex === index ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Employee Tools & Pricing - Right Column */}
          <div className="space-y-4">
            {/* Pricing & Profit Info */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-700">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing & Profitability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {isEditingPrice ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={editedPrice}
                          onChange={(e) => setEditedPrice(Number(e.target.value))}
                          className="w-32"
                        />
                        <Button size="sm" onClick={handlePriceSave}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditingPrice(false)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>${car.price.toLocaleString()}</span>
                        {isAdmin && (
                          <Button size="sm" variant="ghost" onClick={() => setIsEditingPrice(true)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-slate-50 p-2 rounded">
                    <span className="text-slate-600">MSRP:</span>
                    <div className="font-semibold">${carDetails.msrp.toLocaleString()}</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-blue-600">Invoice:</span>
                    <div className="font-semibold text-blue-700">${carDetails.invoice.toLocaleString()}</div>
                  </div>
                  <div className="bg-orange-50 p-2 rounded">
                    <span className="text-orange-600">Cost:</span>
                    <div className="font-semibold text-orange-700">${carDetails.costBasis.toLocaleString()}</div>
                  </div>
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-green-600">Margin:</span>
                    <div className="font-semibold text-green-700">${carDetails.margin.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Sales Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Select value={appointmentType} onValueChange={setAppointmentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test_drive">Schedule Test Drive</SelectItem>
                    <SelectItem value="appraisal">Schedule Appraisal</SelectItem>
                    <SelectItem value="financing">Financing Meeting</SelectItem>
                    <SelectItem value="delivery">Delivery Appointment</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleScheduleAppointment} className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                <Button onClick={handleCreateLead} variant="outline" className="w-full">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Create Customer Lead
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Management */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5" />
                    <span>Status Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select defaultValue={car.status} onValueChange={handleStatusChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                      <SelectItem value="service">In Service</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Financing Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Financing Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {carDetails.financingOptions.map((option, index) => (
                <div key={index} className="bg-slate-50 p-4 rounded-lg text-center">
                  <div className="font-semibold text-lg">{option.term}</div>
                  <div className="text-sm text-slate-600">@ {option.rate} APR</div>
                  <div className="text-xl font-bold text-blue-600">${option.payment}/mo</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Engine & Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Engine & Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Engine</div>
                  <div className="text-sm text-slate-600">{carDetails.engine}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Transmission</div>
                  <div className="text-sm text-slate-600">{carDetails.transmission}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Navigation className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Drivetrain</div>
                  <div className="text-sm text-slate-600">{carDetails.drivetrain}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Fuel className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Fuel Economy</div>
                  <div className="text-sm text-slate-600">{carDetails.mpg}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Car className="h-5 w-5" />
                <span>Vehicle Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Model Year</div>
                  <div className="text-sm text-slate-600">{car.year}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Gauge className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Mileage</div>
                  <div className="text-sm text-slate-600">{car.mileage.toLocaleString()} miles</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Exterior Color</div>
                  <div className="text-sm text-slate-600">{car.color}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Seating</div>
                  <div className="text-sm text-slate-600">{carDetails.seats} Passengers</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clipboard className="h-5 w-5" />
                <span>Inventory Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Stock Number</div>
                  <div className="text-sm text-slate-600">{carDetails.stockNumber}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Days on Lot</div>
                  <div className="text-sm text-slate-600">{carDetails.daysOnLot} days</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Location</div>
                  <div className="text-sm text-slate-600">{carDetails.location}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">VIN</div>
                  <div className="text-sm text-slate-600">{carDetails.vin}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Key Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {carDetails.keyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Safety Features</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {carDetails.safetyFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Radio className="h-5 w-5" />
                <span>Technology</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {carDetails.techFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Employee Notes & Sales Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Internal Notes</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(!isEditingNotes)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingNotes ? (
                <Textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Add internal notes about this vehicle..."
                  rows={4}
                />
              ) : (
                <p className="text-sm text-slate-700">{internalNotes}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>Maintenance History</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {carDetails.maintenanceHistory.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm border-l-2 border-blue-200 pl-3">
                    <div>
                      <div className="font-medium">{item.service}</div>
                      <div className="text-slate-500">{item.date}</div>
                    </div>
                    <div className="text-green-600 font-medium">${item.cost}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        {car.description && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Vehicle Description</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700">{car.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Sales Tools Footer */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
          <Button size="lg" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Test Drive
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Calculator className="h-4 w-4 mr-2" />
            Payment Calculator
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <FileBarChart className="h-4 w-4 mr-2" />
            Print Spec Sheet
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Share2 className="h-4 w-4 mr-2" />
            Share with Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailsDialog;
