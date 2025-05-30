
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Car, Target } from "lucide-react";

const DashboardMetrics = () => {
  const metrics = [
    {
      title: "Total Sales",
      value: "$2.4M",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      description: "This month"
    },
    {
      title: "Active Leads",
      value: "148",
      change: "+8.2%",
      trend: "up",
      icon: Users,
      description: "Qualified prospects"
    },
    {
      title: "Cars Sold",
      value: "67",
      change: "-2.1%",
      trend: "down",
      icon: Car,
      description: "This month"
    },
    {
      title: "Conversion Rate",
      value: "24.8%",
      change: "+5.3%",
      trend: "up",
      icon: Target,
      description: "Lead to sale"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Sales Dashboard</h2>
        <Badge variant="outline" className="text-blue-600 border-blue-200">
          Live Data
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`flex items-center space-x-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>{metric.change}</span>
                  </div>
                  <span className="text-slate-500 text-sm">{metric.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Latest recommendations from your AI agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-slate-900">High-Value Lead Alert</p>
              <p className="text-sm text-slate-600">
                Johnson Motors is showing strong interest in luxury sedans. Recommend scheduling a call this week.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="font-medium text-slate-900">Inventory Optimization</p>
              <p className="text-sm text-slate-600">
                SUV demand is 23% higher than current stock. Consider increasing inventory for Q4.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-slate-900">Success Pattern</p>
              <p className="text-sm text-slate-600">
                Dealerships contacted on Tuesdays show 18% higher conversion rates.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest sales activities and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sale completed: Premium Motors - $45,000</p>
                <p className="text-xs text-slate-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New lead: City Auto Group</p>
                <p className="text-xs text-slate-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Follow-up scheduled: Metro Dealership</p>
                <p className="text-xs text-slate-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">AI recommendation implemented</p>
                <p className="text-xs text-slate-500">1 day ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardMetrics;
