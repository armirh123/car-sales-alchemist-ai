import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Search, Filter, Car, RefreshCw } from "lucide-react";
import ManageStockDialog from "./ManageStockDialog";

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

interface CarListingPageProps {
  category: string;
  cars: Car[];
  onBack: () => void;
  onAddCar: (car: Car) => void;
}

const CarListingPage = ({ category, cars, onBack, onAddCar }: CarListingPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price-low");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  const filteredCars = cars
    .filter(car => car.category === category)
    .filter(car => 
      car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.color.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(car => statusFilter === "all" || car.status === statusFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "year-new":
          return b.year - a.year;
        case "year-old":
          return a.year - b.year;
        case "mileage-low":
          return a.mileage - b.mileage;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'sold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDefaultImage = (make: string) => {
    return `https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400&h=300&fit=crop&crop=center`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{category} Inventory</h2>
            <p className="text-slate-600">{filteredCars.length} vehicles available</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshData}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <ManageStockDialog onAddCar={onAddCar} />
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative min-w-0 md:min-w-[350px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by make, model, or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="year-new">Year: Newest First</SelectItem>
            <SelectItem value="year-old">Year: Oldest First</SelectItem>
            <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Car Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCars.map((car) => (
          <Card key={car.id} className="hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={car.images && car.images.length > 0 ? car.images[0] : getDefaultImage(car.make)}
                alt={`${car.make} ${car.model}`}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Badge className={`absolute top-2 right-2 ${getStatusColor(car.status)}`}>
                {car.status.toUpperCase()}
              </Badge>
              {car.images && car.images.length > 1 && (
                <Badge variant="secondary" className="absolute bottom-2 right-2 bg-black/50 text-white">
                  +{car.images.length - 1} more
                </Badge>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{car.year} {car.make} {car.model}</CardTitle>
                <Car className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  ${car.price.toLocaleString()}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Color:</span>
                  <span className="font-medium">{car.color}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mileage:</span>
                  <span className="font-medium">{car.mileage.toLocaleString()} miles</span>
                </div>
                {car.description && (
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2">
                    {car.description}
                  </p>
                )}
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Reserve
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No vehicles found</h3>
          <p className="text-slate-600">
            No vehicles match your current search and filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default CarListingPage;
