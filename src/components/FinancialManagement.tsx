
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
  const [loanAmount, setLoanAmount] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");

  // Empty financial data - ready for real data
  const financialMetrics = {
    totalRevenue: 0,
    totalProfit: 0,
    avgProfitMargin: 0,
    pendingPayments: 0,
    monthlyTarget: 0,
    achievedTarget: 0
  };

  const recentSales: any[] = [];

  const calculateLoanPayment = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || "0");
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numPayments = parseInt(loanTerm);
    
    if (principal > 0 && monthlyRate > 0 && numPayments > 0) {
      const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      const totalInterest = (monthlyPayment * numPayments) - principal;
      
      return {
        monthlyPayment: monthlyPayment.toFixed(2),
        totalInterest: totalInterest.toFixed(2),
        totalAmount: (principal + totalInterest).toFixed(2),
        loanAmount: principal.toFixed(2)
      };
    }
    return null;
  };

  const loanCalculation = calculateLoanPayment();

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
                  No sales recorded yet
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
                  No outstanding invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0%</div>
                <p className="text-xs text-muted-foreground">
                  Set your monthly target
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
              <div className="text-center py-12">
                <PieChart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Sales Data Available</h3>
                <p className="text-slate-500 text-sm">
                  Profit margin analysis will appear here once you start recording sales.
                </p>
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
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Sales Recorded</h3>
                <p className="text-slate-500 text-sm">
                  Sales data will appear here once you start recording vehicle sales.
                </p>
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
                    <Input 
                      placeholder="35000" 
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Down Payment</label>
                    <Input 
                      placeholder="5000" 
                      value={downPayment}
                      onChange={(e) => setDownPayment(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Interest Rate (%)</label>
                    <Input 
                      placeholder="3.5" 
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Loan Term</label>
                    <Select value={loanTerm} onValueChange={setLoanTerm}>
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
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h3 className="font-medium mb-4">Loan Summary</h3>
                  {loanCalculation ? (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Loan Amount:</span>
                        <span className="font-medium">${loanCalculation.loanAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Payment:</span>
                        <span className="font-medium">${loanCalculation.monthlyPayment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-medium">${loanCalculation.totalInterest}</span>
                      </div>
                      <div className="flex justify-between border-t pt-3 mt-3">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">${loanCalculation.totalAmount}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calculator className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-sm text-slate-500">Enter loan details to calculate payments</p>
                    </div>
                  )}
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
              <div className="text-center py-12">
                <Banknote className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No Commission Data</h3>
                <p className="text-slate-500 text-sm">
                  Commission tracking will be available once sales are recorded and salespeople are assigned.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialManagement;
