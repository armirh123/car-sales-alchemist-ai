
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, Search, ArrowLeft, Filter, SortAsc } from "lucide-react";
import { useState } from "react";

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
}

interface CarListingPageProps {
  category: string;
  cars: Car[];
  onBack: () => void;
}

const CarListingPage = ({ category, cars, onBack }: CarListingPageProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("price");

  // Filter cars by category and search term
  const filteredCars = cars.filter(car => 
    car.category === category &&
    (car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
     car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
     car.color.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "year":
        return b.year - a.year;
      case "mileage":
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'sold': return 'bg-red-100 text-red-800';
      case 'reserved': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inventory
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{category}</h2>
            <p className="text-slate-600">{sortedCars.length} vehicles available</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search by make, model, or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <SortAsc className="h-4 w-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-md text-sm"
          >
            <option value="price">Sort by Price</option>
            <option value="year">Sort by Year</option>
            <option value="mileage">Sort by Mileage</option>
          </select>
        </div>
      </div>

      {/* Car Grid */}
      {sortedCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCars.map((car) => (
            <Card key={car.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {car.year} {car.make} {car.model}
                  </CardTitle>
                  <Car className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex items-center justify-between">
                  <CardDescription className="text-lg font-semibold text-blue-600">
                    {formatPrice(car.price)}
                  </CardDescription>
                  <Badge className={getStatusColor(car.status)} variant="secondary">
                    {car.status.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-slate-500">Mileage:</span>
                    <p className="font-medium">{car.mileage.toLocaleString()} mi</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Color:</span>
                    <p className="font-medium">{car.color || 'Not specified'}</p>
                  </div>
                </div>
                {car.description && (
                  <div>
                    <span className="text-slate-500 text-sm">Description:</span>
                    <p className="text-sm text-slate-700 mt-1 line-clamp-2">
                      {car.description}
                    </p>
                  </div>
                )}
                <div className="flex space-x-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    Contact Dealer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Car className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No vehicles found</h3>
          <p className="text-slate-500">
            {searchTerm 
              ? `No vehicles match your search "${searchTerm}" in ${category}`
              : `No vehicles available in ${category} category`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CarListingPage;
