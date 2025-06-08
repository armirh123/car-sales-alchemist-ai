
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  TrendingUp, 
  Calculator, 
  CreditCard,
  PieChart,
  Receipt,
  Banknote,
  Target
} from "lucide-react";

const FinancialManagement = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Sample financial data
  const financialMetrics = {
    totalRevenue: 847500,
    totalProfit: 152350,
    avgProfitMargin: 18.5,
    pendingPayments: 45000,
    monthlyTarget: 100000,
    achievedTarget: 84750
  };

  const recentSales = [
    {
      id: "1",
      vehicle: "2024 Toyota Camry",
      customer: "John Smith",
      salePrice: 28500,
      cost: 24000,
      profit: 4500,
      profitMargin: 15.8,
      paymentStatus: "paid",
      saleDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      salesperson: "Sarah Johnson"
    },
    {
      id: "2",
      vehicle: "2023 Ford Escape",
      customer: "Emily Davis",
      salePrice: 32000,
      cost: 27500,
      profit: 4500,
      profitMargin: 14.1,
      paymentStatus: "pending",
      saleDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      salesperson: "Mike Wilson"
    },
    {
      id: "3",
      vehicle: "2024 BMW X3",
      customer: "Robert Brown",
      salePrice: 45000,
      cost: 38000,
      profit: 7000,
      profitMargin: 15.6,
      paymentStatus: "paid",
      saleDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      salesperson: "Lisa Chen"
    }
  ];

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Financial Management</h2>
          <p className="text-slate-600">Track sales performance, profit margins, and financial metrics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Deal
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <PieChart className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Sales</span>
          </TabsTrigger>
          <TabsTrigger value="financing" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Financing</span>
          </TabsTrigger>
          <TabsTrigger value="commissions" className="flex items-center space-x-2">
            <Banknote className="h-4 w-4" />
            <span>Commissions</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialMetrics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialMetrics.totalProfit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {financialMetrics.avgProfitMargin}% avg margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${financialMetrics.pendingPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  3 outstanding invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((financialMetrics.achievedTarget / financialMetrics.monthlyTarget) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  ${financialMetrics.achievedTarget.toLocaleString()} of ${financialMetrics.monthlyTarget.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profit Margin Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Margin Analysis</CardTitle>
              <CardDescription>Vehicle category performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Luxury", margin: 22.5, sales: 15, revenue: 675000 },
                  { category: "SUVs", margin: 18.2, sales: 28, revenue: 420000 },
                  { category: "Sedans", margin: 15.8, sales: 35, revenue: 350000 },
                  { category: "Electric", margin: 20.1, sales: 12, revenue: 480000 },
                  { category: "Trucks", margin: 16.5, sales: 22, revenue: 550000 }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full" />
                      <span className="font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-right">
                        <div className="font-medium">{item.margin}%</div>
                        <div className="text-slate-500">Margin</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{item.sales}</div>
                        <div className="text-slate-500">Sales</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${item.revenue.toLocaleString()}</div>
                        <div className="text-slate-500">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Latest vehicle sales with profit analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{sale.vehicle}</h4>
                        <Badge className={getPaymentStatusColor(sale.paymentStatus)}>
                          {sale.paymentStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                        <div>
                          <span className="font-medium">Customer:</span> {sale.customer}
                        </div>
                        <div>
                          <span className="font-medium">Salesperson:</span> {sale.salesperson}
                        </div>
                        <div>
                          <span className="font-medium">Sale Date:</span> {sale.saleDate.toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Profit Margin:</span> {sale.profitMargin}%
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${sale.salePrice.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">
                        Profit: ${sale.profit.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financing Calculator</CardTitle>
              <CardDescription>Calculate loan terms and monthly payments for customers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Vehicle Price</label>
                    <Input placeholder="35000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Down Payment</label>
                    <Input placeholder="5000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Interest Rate (%)</label>
                    <Input placeholder="3.5" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Loan Term</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select term" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="36">36 months</SelectItem>
                        <SelectItem value="48">48 months</SelectItem>
                        <SelectItem value="60">60 months</SelectItem>
                        <SelectItem value="72">72 months</SelectItem>
                        <SelectItem value="84">84 months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full">
                    Calculate Payment
                  </Button>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium mb-4">Loan Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Loan Amount:</span>
                      <span className="font-medium">$30,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Payment:</span>
                      <span className="font-medium">$545.91</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Interest:</span>
                      <span className="font-medium">$2,757.02</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 mt-3">
                      <span className="font-medium">Total Amount:</span>
                      <span className="font-bold">$32,757.02</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Commission Tracking</CardTitle>
              <CardDescription>Track commission earnings by salesperson</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Sarah Johnson", sales: 8, revenue: 280000, commission: 8400 },
                  { name: "Mike Wilson", sales: 6, revenue: 195000, commission: 5850 },
                  { name: "Lisa Chen", sales: 7, revenue: 245000, commission: 7350 },
                  { name: "David Rodriguez", sales: 5, revenue: 167000, commission: 5010 }
                ].map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-medium">{person.name}</h4>
                        <p className="text-sm text-slate-600">{person.sales} sales this month</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        ${person.commission.toLocaleString()}
                      </div>
                      <div className="text-sm text-slate-600">
                        ${person.revenue.toLocaleString()} revenue
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
