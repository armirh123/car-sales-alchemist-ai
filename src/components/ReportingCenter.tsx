
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, FileText, BarChart3, TrendingUp, Users, Car, Target, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'leads' | 'inventory' | 'performance' | 'financial';
  icon: any;
  automated: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

const ReportingCenter = () => {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [exportFormat, setExportFormat] = useState<string>("csv");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const reportTemplates: ReportTemplate[] = [
    {
      id: "sales-summary",
      name: "Sales Summary Report",
      description: "Comprehensive sales performance with revenue, units sold, and trends",
      type: "sales",
      icon: BarChart3,
      automated: true,
      frequency: "monthly"
    },
    {
      id: "lead-conversion",
      name: "Lead Conversion Analysis",
      description: "Lead generation, conversion rates, and pipeline analysis",
      type: "leads",
      icon: Target,
      automated: true,
      frequency: "weekly"
    },
    {
      id: "inventory-report",
      name: "Inventory Status Report",
      description: "Current inventory levels, aging analysis, and turnover rates",
      type: "inventory",
      icon: Car,
      automated: false
    },
    {
      id: "salesperson-performance",
      name: "Salesperson Performance",
      description: "Individual and team performance metrics with rankings",
      type: "performance",
      icon: Users,
      automated: true,
      frequency: "monthly"
    },
    {
      id: "financial-overview",
      name: "Financial Overview",
      description: "Revenue, commissions, profit margins, and financial trends",
      type: "financial",
      icon: TrendingUp,
      automated: true,
      frequency: "monthly"
    },
    {
      id: "daily-activity",
      name: "Daily Activity Report",
      description: "Daily sales activities, lead interactions, and system usage",
      type: "performance",
      icon: Clock,
      automated: true,
      frequency: "daily"
    }
  ];

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast({
        title: "Select Report Type",
        description: "Please select a report template to generate",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportTemplate = reportTemplates.find(r => r.id === selectedReport);
      const fileName = `${reportTemplate?.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.${exportFormat}`;
      
      // In a real implementation, this would generate and download the actual file
      const mockData = generateMockReportData(selectedReport);
      downloadReport(mockData, fileName, exportFormat);
      
      toast({
        title: "Report Generated Successfully",
        description: `${reportTemplate?.name} has been downloaded to your computer`,
      });
    } catch (error) {
      toast({
        title: "Report Generation Failed",
        description: "There was an error generating the report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockReportData = (reportId: string) => {
    // Mock data generation based on report type
    const baseData = {
      reportName: reportTemplates.find(r => r.id === reportId)?.name,
      generatedAt: new Date().toISOString(),
      dateRange: dateRange,
      companyName: "Demo AutoSales"
    };

    switch (reportId) {
      case "sales-summary":
        return {
          ...baseData,
          totalSales: 1250000,
          unitsSold: 42,
          averageSaleValue: 29762,
          topSalesperson: "John Smith",
          monthlyTrend: "+12.5%"
        };
      case "lead-conversion":
        return {
          ...baseData,
          totalLeads: 287,
          convertedLeads: 42,
          conversionRate: "14.6%",
          hotLeads: 23,
          warmLeads: 67
        };
      default:
        return baseData;
    }
  };

  const downloadReport = (data: any, fileName: string, format: string) => {
    let content = "";
    let mimeType = "";

    switch (format) {
      case "csv":
        content = convertToCSV(data);
        mimeType = "text/csv";
        break;
      case "json":
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        break;
      default:
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: any): string => {
    const headers = Object.keys(data);
    const values = Object.values(data);
    return `${headers.join(',')}\n${values.join(',')}`;
  };

  if (user?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>Reporting center is only available to administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Contact your administrator to access advanced reporting features.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Reporting Center</h2>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Admin Access
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
              <CardDescription>Create and download detailed reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Report Template</label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a report template" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center space-x-2">
                            <Icon className="h-4 w-4" />
                            <span>{template.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Date Range</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Export Format</label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV Spreadsheet</SelectItem>
                      <SelectItem value="excel">Excel Workbook</SelectItem>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerateReport} 
                disabled={isGenerating || !selectedReport}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                {isGenerating ? 'Generating Report...' : 'Generate & Download Report'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Report Templates</CardTitle>
              <CardDescription>Pre-configured reports for different business needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {reportTemplates.map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="font-medium text-slate-900">{template.name}</p>
                          <p className="text-sm text-slate-600">{template.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {template.automated && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            Auto: {template.frequency}
                          </Badge>
                        )}
                        <Badge variant="secondary">{template.type}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Sales Summary - November", date: "2024-11-30", format: "CSV" },
                { name: "Lead Conversion Analysis", date: "2024-11-28", format: "PDF" },
                { name: "Inventory Status Report", date: "2024-11-25", format: "Excel" }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">{report.name}</p>
                    <p className="text-xs text-slate-500">{report.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">{report.format}</Badge>
                    <Button size="sm" variant="ghost">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Automated Reports</CardTitle>
              <CardDescription>Scheduled report delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Daily Activity Report</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Lead Summary</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monthly Sales Report</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportingCenter;
