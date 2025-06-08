
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
} from "lucide-react";

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

  const getDefaultImage = (make: string) => {
    return `https://images.unsplash.com/photo-1494905998402-395d579af36f?w=600&h=400&fit=crop&crop=center`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock additional car details that would typically come from a database
  const carDetails = {
    vin: `${car.make.substring(0, 3).toUpperCase()}${car.year}${car.id.substring(0, 8)}`,
    engine: car.category === 'Electric' ? 'Electric Motor' : car.category === 'Trucks' ? '5.0L V8' : '2.4L 4-Cylinder',
    transmission: car.category === 'Electric' ? 'Single-Speed' : car.category === 'Luxury' ? '8-Speed Automatic' : '6-Speed Automatic',
    drivetrain: car.category === 'Trucks' ? '4WD' : car.category === 'SUVs' ? 'AWD' : 'FWD',
    fuelType: car.category === 'Electric' ? 'Electric' : 'Gasoline',
    mpg: car.category === 'Electric' ? '120 MPGe' : car.category === 'Trucks' ? '18/24 City/Hwy' : '28/35 City/Hwy',
    doors: car.category === 'Trucks' ? 4 : car.category === 'Sports' ? 2 : 4,
    seats: car.category === 'SUVs' ? 8 : car.category === 'Trucks' ? 5 : car.category === 'Sports' ? 2 : 5,
    warranty: '3 Year/36,000 Mile Basic, 5 Year/60,000 Mile Powertrain',
    location: 'Main Lot - Section A',
    keyFeatures: [
      'Bluetooth Connectivity',
      'Backup Camera',
      'Cruise Control',
      'Power Windows',
      'Air Conditioning',
      car.category === 'Electric' ? 'Fast Charging' : 'Keyless Entry',
      car.category === 'Luxury' ? 'Leather Seats' : 'Cloth Seats',
      car.category === 'Sports' ? 'Sport Suspension' : 'Stability Control',
    ],
    safetyFeatures: [
      'Airbags (Front & Side)',
      'Anti-lock Brakes (ABS)',
      'Electronic Stability Control',
      'Traction Control',
      car.category === 'Luxury' ? 'Blind Spot Monitoring' : 'Tire Pressure Monitor',
      car.year >= 2023 ? 'Forward Collision Warning' : 'Daytime Running Lights',
    ],
    techFeatures: [
      'Touchscreen Display',
      'Apple CarPlay/Android Auto',
      'USB Ports',
      'AM/FM Radio',
      car.category === 'Luxury' ? 'Navigation System' : 'Bluetooth Audio',
      car.category === 'Electric' ? 'Mobile App Control' : 'Satellite Radio Ready',
    ]
  };

  const images = car.images && car.images.length > 0 ? car.images : [
    getDefaultImage(car.make),
    `https://images.unsplash.com/photo-1493238792000-8113da705763?w=600&h=400&fit=crop&crop=center`,
    `https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop&crop=center`,
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">
              {car.year} {car.make} {car.model}
            </span>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(car.status)}>
                {car.status.toUpperCase()}
              </Badge>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Vehicle ID: {carDetails.vin} • {car.category} • {carDetails.location}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={images[selectedImageIndex]}
                alt={`${car.make} ${car.model}`}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                {selectedImageIndex + 1} of {images.length}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${car.make} ${car.model} ${index + 1}`}
                  className={`w-full h-20 object-cover rounded cursor-pointer transition-opacity ${
                    selectedImageIndex === index ? 'opacity-100 ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-6">
            {/* Price and Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5" />
                  <span>Pricing & Availability</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold text-green-600">
                  ${car.price.toLocaleString()}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Mileage:</span>
                    <span className="font-medium">{car.mileage.toLocaleString()} miles</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Color:</span>
                    <span className="font-medium">{car.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Year:</span>
                    <span className="font-medium">{car.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium capitalize">{car.status}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Test Drive
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Get Quote
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Description</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700">{car.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* Engine & Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Engine & Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-slate-400" />
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

          {/* Warranty & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Warranty & Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-slate-400" />
                <div className="flex-1">
                  <div className="font-medium">Warranty</div>
                  <div className="text-sm text-slate-600">{carDetails.warranty}</div>
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {/* Key Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
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

          {/* Safety Features */}
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

          {/* Technology Features */}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t">
          <Button size="lg" className="flex-1">
            <Phone className="h-4 w-4 mr-2" />
            Schedule Test Drive
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Mail className="h-4 w-4 mr-2" />
            Request Information
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <DollarSign className="h-4 w-4 mr-2" />
            Get Financing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarDetailsDialog;
