
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart3, Download, FileText, TrendingUp, Users, Car, DollarSign, Calendar as CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ReportingCenter = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  const [reportType, setReportType] = useState("sales");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    console.log(`Generating ${reportType} report for period:`, dateRange);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsGenerating(false);
    toast({
      title: "Report Generated",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated successfully.`,
    });
  };

  const handleExportReport = async (format: string) => {
    setIsExporting(true);
    console.log(`Exporting report as ${format}`);
    
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock file download
    const reportData = generateMockReportData();
    downloadReport(reportData, format);
    
    setIsExporting(false);
    toast({
      title: "Export Complete",
      description: `Report has been exported as ${format.toUpperCase()}.`,
    });
  };

  const generateMockReportData = () => {
    const reportData = {
      reportType,
      dateRange: {
        from: format(dateRange.from, "yyyy-MM-dd"),
        to: format(dateRange.to, "yyyy-MM-dd")
      },
      generatedAt: new Date().toISOString(),
      data: {
        summary: {
          totalRecords: 0,
          totalValue: 0,
          averageValue: 0
        },
        details: "No data available - System ready for real data input"
      }
    };
    return reportData;
  };

  const downloadReport = (data: any, format: string) => {
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'pdf') {
      // For PDF, we'll create a simple text representation
      content = `Report: ${data.reportType}\nDate Range: ${data.dateRange.from} to ${data.dateRange.to}\nGenerated: ${data.generatedAt}\n\nSummary:\nTotal Records: ${data.data.summary.totalRecords}\nTotal Value: $${data.data.summary.totalValue}\nAverage Value: $${data.data.summary.averageValue}\n\nDetails:\n${data.data.details}`;
      mimeType = 'text/plain';
      extension = 'txt'; // Using txt instead of pdf for simplicity
    } else if (format === 'excel') {
      // Create CSV format for Excel compatibility
      content = `Report Type,${data.reportType}\nDate From,${data.dateRange.from}\nDate To,${data.dateRange.to}\nGenerated At,${data.generatedAt}\n\nSummary\nTotal Records,${data.data.summary.totalRecords}\nTotal Value,${data.data.summary.totalValue}\nAverage Value,${data.data.summary.averageValue}\n\nDetails\n${data.data.details}`;
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      // JSON format
      content = JSON.stringify(data, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.reportType}_report_${format}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleQuickReport = async (type: string) => {
    setIsGenerating(true);
    console.log(`Generating quick ${type} report`);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    toast({
      title: "Quick Report Generated",
      description: `${type} report has been generated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reporting Center</h2>
          <p className="text-slate-600">Generate detailed reports and analytics</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Enterprise Feature
        </Badge>
      </div>

      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Report Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure your report settings and date range
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales Performance</SelectItem>
                  <SelectItem value="inventory">Inventory Analysis</SelectItem>
                  <SelectItem value="customers">Customer Analytics</SelectItem>
                  <SelectItem value="financial">Financial Summary</SelectItem>
                  <SelectItem value="team">Team Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from && dateRange.to
                      ? `${format(dateRange.from, "MMM dd")} - ${format(dateRange.to, "MMM dd, yyyy")}`
                      : "Select date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={{ from: dateRange.from, to: dateRange.to }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                        setShowDatePicker(false);
                      }
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Actions</label>
              <div className="flex space-x-2">
                <Button 
                  onClick={handleGenerateReport} 
                  className="flex-1"
                  disabled={isGenerating}
                >
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      disabled={isExporting}
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>{isExporting ? "Exporting..." : "Export"}</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48">
                    <div className="space-y-2">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleExportReport('pdf')}
                        disabled={isExporting}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Export as PDF
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleExportReport('excel')}
                        disabled={isExporting}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Export as Excel
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={() => handleExportReport('json')}
                        disabled={isExporting}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Export as JSON
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0</div>
            <p className="text-xs text-muted-foreground">Ready for real data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready for real data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vehicles Sold</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ready for real data</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Ready for real data</p>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Pre-configured reports ready to generate with your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Sales Performance</span>
                </CardTitle>
                <CardDescription>
                  Monthly sales trends and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleQuickReport('Sales Performance')}
                  disabled={isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Car className="h-4 w-4" />
                  <span>Inventory Analysis</span>
                </CardTitle>
                <CardDescription>
                  Stock levels, turnover rates, and vehicle analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleQuickReport('Inventory Analysis')}
                  disabled={isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="text-base flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Customer Insights</span>
                </CardTitle>
                <CardDescription>
                  Customer behavior, preferences, and satisfaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleQuickReport('Customer Insights')}
                  disabled={isGenerating}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? "Generating..." : "Generate Report"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingCenter;
