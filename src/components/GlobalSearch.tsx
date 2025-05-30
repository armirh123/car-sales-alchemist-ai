
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Car, Users, Phone, Mail } from "lucide-react";

const GlobalSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock data for search
  const mockData = {
    cars: [
      { id: 1, type: "car", make: "Toyota", model: "Camry", year: 2023, price: "$28,500", status: "available" },
      { id: 2, type: "car", make: "Honda", model: "Accord", year: 2024, price: "$32,000", status: "sold" },
      { id: 3, type: "car", make: "Tesla", model: "Model 3", year: 2024, price: "$45,000", status: "available" },
      { id: 4, type: "car", make: "Ford", model: "F-150", year: 2023, price: "$38,000", status: "available" },
      { id: 5, type: "car", make: "BMW", model: "5 Series", year: 2024, price: "$55,000", status: "reserved" },
    ],
    customers: [
      { id: 1, type: "customer", name: "Johnson Motors", contact: "Sarah Johnson", email: "sarah@johnsonmotors.com", phone: "(555) 123-4567", status: "hot" },
      { id: 2, type: "customer", name: "Metro Auto Group", contact: "Mike Chen", email: "mike@metroauto.com", phone: "(555) 234-5678", status: "warm" },
      { id: 3, type: "customer", name: "City Dealership", contact: "Lisa Rodriguez", email: "lisa@citydealer.com", phone: "(555) 345-6789", status: "cold" },
      { id: 4, type: "customer", name: "Premium Motors", contact: "David Kim", email: "david@premiummotors.com", phone: "(555) 456-7890", status: "hot" },
    ]
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      const results = [];
      
      // Search cars
      const carResults = mockData.cars.filter(car =>
        car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year.toString().includes(searchTerm)
      );
      
      // Search customers
      const customerResults = mockData.customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      results.push(...carResults, ...customerResults);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': case 'available': return 'bg-green-100 text-green-800';
      case 'warm': case 'reserved': return 'bg-orange-100 text-orange-800';
      case 'cold': case 'sold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Search cars, customers, or leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg">
          <CardContent className="p-2">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer border-b border-slate-100 last:border-b-0"
              >
                {result.type === 'car' ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Car className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-slate-900">
                          {result.year} {result.make} {result.model}
                        </p>
                        <p className="text-sm text-slate-600">{result.price}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)} variant="secondary">
                      {result.status}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Users className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-slate-900">{result.name}</p>
                        <p className="text-sm text-slate-600">{result.contact}</p>
                        <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
                          <span className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{result.email}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(result.status)} variant="secondary">
                      {result.status}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showResults && searchResults.length === 0 && searchTerm && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-4 text-center">
            <p className="text-slate-500">No results found for "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GlobalSearch;
