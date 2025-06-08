
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, TrendingUp, TrendingDown, AlertCircle, RefreshCw, Truck, Zap, Crown, CarFront, Gem } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CarListingPage from "./CarListingPage";
import CategoryActions from "./CategoryActions";
import AddCategoryDialog from "./AddCategoryDialog";
import { MarketDataService, type MarketData } from "../services/marketDataService";

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
  const { toast } = useToast();
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
  const [categories, setCategories] = useState<string[]>(["Sedans", "SUVs", "Electric", "Trucks", "Luxury", "Sports"]);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const marketService = MarketDataService.getInstance();

  useEffect(() => {
    // Load initial market data
    loadMarketData();
    
    // Set up real-time data refresh every 30 seconds
    const interval = setInterval(() => {
      loadMarketData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadMarketData = async () => {
    try {
      const data = await marketService.fetchMarketData();
      setMarketData(data);
      console.log('Market data updated:', data.lastUpdated);
    } catch (error) {
      console.error('Failed to load market data:', error);
      toast({
        title: "Error",
        description: "Failed to load real-time market data",
        variant: "destructive",
      });
    }
  };

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await loadMarketData();
      toast({
        title: "Data Refreshed",
        description: "Real-time market insights and stock alerts have been updated with the latest automotive industry data.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh real-time market data",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddCar = (newCar: Car) => {
    setCars(prev => [...prev, newCar]);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBackToInventory = () => {
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: string) => {
    toast({
      title: "Edit Category",
      description: `Edit functionality for ${category} category would be implemented here.`,
    });
  };

  const handleDeleteCategory = (category: string) => {
    const hasVehicles = cars.some(car => car.category === category);
    
    if (hasVehicles) {
      toast({
        title: "Cannot Delete Category",
        description: `Cannot delete ${category} category because it contains vehicles. Please move or remove all vehicles first.`,
        variant: "destructive",
      });
      return;
    }

    setCategories(prev => prev.filter(cat => cat !== category));
    toast({
      title: "Category Deleted",
      description: `${category} category has been successfully deleted.`,
    });
  };

  const handleAddCategory = (categoryName: string) => {
    if (categories.includes(categoryName)) {
      toast({
        title: "Category Already Exists",
        description: `A category named "${categoryName}" already exists.`,
        variant: "destructive",
      });
      return;
    }

    setCategories(prev => [...prev, categoryName]);
    toast({
      title: "Category Added",
      description: `${categoryName} category has been successfully added.`,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Sedans': return <CarFront className="h-5 w-5 text-slate-400" />;
      case 'SUVs': return <Car className="h-5 w-5 text-slate-400" />;
      case 'Electric': return <Zap className="h-5 w-5 text-slate-400" />;
      case 'Trucks': return <Truck className="h-5 w-5 text-slate-400" />;
      case 'Luxury': return <Crown className="h-5 w-5 text-slate-400" />;
      case 'Sports': return <Gem className="h-5 w-5 text-slate-400" />;
      default: return <Car className="h-5 w-5 text-slate-400" />;
    }
  };

  // Calculate inventory statistics
  const getInventoryStats = () => {
    return categories.map(category => {
      const categoryCars = cars.filter(car => car.category === category);
      const availableCount = categoryCars.filter(car => car.status === "available").length;
      
      // Mock trend data
      const trendData: Record<string, { trend: string; change: string }> = {
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
        trend: trendData[category]?.trend || "up",
        change: trendData[category]?.change || "0%",
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
        onAddCar={handleAddCar}
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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'border-red-500';
      case 'warning': return 'border-orange-500';
      case 'info': return 'border-blue-500';
      default: return 'border-gray-500';
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-blue-50';
      case 'growth': return 'bg-green-50';
      case 'optimization': return 'bg-orange-50';
      case 'warning': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Inventory Overview</h2>
        <AddCategoryDialog onAddCategory={handleAddCategory} />
      </div>

      {marketData?.lastUpdated && (
        <div className="text-sm text-slate-500 flex items-center space-x-2">
          <span>Real-time data last updated: {marketData.lastUpdated.toLocaleTimeString()}</span>
          {marketData.dataSource && (
            <Badge variant="outline" className="text-xs">
              {marketData.dataSource}
            </Badge>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryCategories.map((category, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group relative"
            onClick={() => handleCategoryClick(category.type)}
          >
            <CategoryActions
              categoryType={category.type}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
            />
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.type}</CardTitle>
                {getCategoryIcon(category.type)}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Live Stock Alerts</CardTitle>
                <CardDescription>Real-time inventory notifications from automotive market feeds</CardDescription>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketData?.alerts.map((alert) => (
              <div key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)} pl-4`}>
                <p className="font-medium text-slate-900">{alert.title}</p>
                <p className="text-sm text-slate-600">{alert.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {alert.count && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {alert.count} units
                    </span>
                  )}
                  {alert.percentage && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {alert.percentage}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-slate-500">Loading real-time alerts...</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Market Insights</CardTitle>
            <CardDescription>AI-powered real-time automotive market analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {marketData?.insights.map((insight) => (
              <div key={insight.id} className={`${getInsightColor(insight.type)} p-4 rounded-lg`}>
                <h4 className="font-medium text-slate-900 mb-2">{insight.title}</h4>
                <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {insight.impact.toUpperCase()} IMPACT
                  </span>
                  {insight.percentage && (
                    <span className="text-xs bg-white px-2 py-1 rounded border">
                      {insight.percentage}
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {insight.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            )) || (
              <p className="text-slate-500">Loading real-time insights...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryOverview;
