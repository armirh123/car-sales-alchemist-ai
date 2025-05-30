import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import ManageStockDialog from "./ManageStockDialog";
import CarListingPage from "./CarListingPage";

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

const InventoryOverview = () => {
  const [cars, setCars] = useState<Car[]>([
    // Sample cars for demonstration
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2023,
      price: 28500,
      category: "Sedans",
      status: "available",
      description: "Reliable family sedan with excellent fuel economy",
      mileage: 15000,
      color: "Silver"
    },
    {
      id: "2",
      make: "Honda",
      model: "Accord",
      year: 2024,
      price: 32000,
      category: "Sedans",
      status: "available",
      description: "Premium sedan with advanced safety features",
      mileage: 8000,
      color: "Black"
    },
    {
      id: "3",
      make: "Ford",
      model: "Explorer",
      year: 2023,
      price: 38000,
      category: "SUVs",
      status: "available",
      description: "Spacious SUV perfect for families",
      mileage: 22000,
      color: "Blue"
    },
    {
      id: "4",
      make: "Tesla",
      model: "Model 3",
      year: 2024,
      price: 45000,
      category: "Electric",
      status: "available",
      description: "All-electric sedan with autopilot capabilities",
      mileage: 5000,
      color: "White"
    },
    {
      id: "5",
      make: "Ford",
      model: "F-150",
      year: 2023,
      price: 42000,
      category: "Trucks",
      status: "reserved",
      description: "America's best-selling truck",
      mileage: 18000,
      color: "Red"
    },
    {
      id: "6",
      make: "BMW",
      model: "5 Series",
      year: 2024,
      price: 55000,
      category: "Luxury",
      status: "available",
      description: "Luxury sedan with premium interior",
      mileage: 3000,
      color: "Grey"
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleAddCar = (newCar: Car) => {
    setCars(prev => [...prev, newCar]);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToInventory = () => {
    setSelectedCategory(null);
  };

  // Calculate inventory statistics
  const getInventoryStats = () => {
    const categories = ["Sedans", "SUVs", "Electric", "Trucks", "Luxury", "Sports"];
    return categories.map(category => {
      const categoryCars = cars.filter(car => car.category === category);
      const availableCount = categoryCars.filter(car => car.status === "available").length;
      
      // Mock trend data
      const trendData = {
        "Sedans": { trend: "up", change: "+12%" },
        "SUVs": { trend: "down", change: "-23%" },
        "Electric": { trend: "up", change: "+45%" },
        "Trucks": { trend: "up", change: "+8%" },
        "Luxury": { trend: "down", change: "-5%" },
        "Sports": { trend: "up", change: "+20%" }
      };

      const getStatus = (count: number) => {
        if (count === 0) return "critical";
        if (count < 5) return "low";
        return "optimal";
      };

      const getPopularModels = () => {
        const models = categoryCars.slice(0, 2).map(car => `${car.make} ${car.model}`);
        return models.length > 0 ? models.join(", ") : "No vehicles";
      };

      return {
        type: category,
        count: availableCount,
        trend: trendData[category as keyof typeof trendData]?.trend || "up",
        change: trendData[category as keyof typeof trendData]?.change || "0%",
        popular: getPopularModels(),
        status: getStatus(availableCount)
      };
    });
  };

  const inventoryCategories = getInventoryStats();

  if (selectedCategory) {
    return (
      <CarListingPage
        category={selectedCategory}
        cars={cars}
        onBack={handleBackToInventory}
      />
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-100 text-green-800';
      case 'low': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Inventory Overview</h2>
        <div className="flex space-x-2">
          <ManageStockDialog onAddCar={handleAddCar} />
          <Button className="bg-blue-600 hover:bg-blue-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            Stock Alerts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryCategories.map((category, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleCategoryClick(category.type)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.type}</CardTitle>
                <Car className="h-5 w-5 text-slate-400" />
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(category.status)}>
                  {category.status.toUpperCase()}
                </Badge>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(category.trend)}
                  <span className={`text-sm ${
                    category.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {category.change}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900 mb-2">
                {category.count}
              </div>
              <div className="text-sm text-slate-600">
                <p className="font-medium mb-1">Popular Models:</p>
                <p>{category.popular}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-medium text-slate-900">Critical Stock: Luxury Vehicles</p>
              <p className="text-sm text-slate-600">
                Only 12 units remaining. High demand from premium dealerships expected.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-medium text-slate-900">Low Stock: SUVs</p>
              <p className="text-sm text-slate-600">
                SUV inventory down 23%. Consider restocking for seasonal demand.
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-slate-900">High Demand: Electric Vehicles</p>
              <p className="text-sm text-slate-600">
                Electric vehicle interest up 45%. Opportunity to expand inventory.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Insights</CardTitle>
            <CardDescription>AI-powered inventory recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Seasonal Opportunity</h4>
              <p className="text-sm text-slate-600">
                Winter is approaching. Recommend increasing SUV and truck inventory by 20% for Q4 demand.
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">EV Market Growth</h4>
              <p className="text-sm text-slate-600">
                Electric vehicle market growing 45% year-over-year. Consider strategic partnerships with EV manufacturers.
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h4 className="font-medium text-slate-900 mb-2">Price Optimization</h4>
              <p className="text-sm text-slate-600">
                Luxury vehicle prices can be optimized 8-12% higher based on current market conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryOverview;
