
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Calendar, 
  FileCheck, 
  Printer,
  BarChart3,
  DollarSign,
  PieChart
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import DateRangeSelector from "@/components/finance/DateRangeSelector";

type ReportType = "financial" | "technician" | "jobSource" | "transaction";

interface ReportGeneratorProps {
  dateRange: DateRange | undefined;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ dateRange: initialDateRange }) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("financial");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportFormat, setReportFormat] = useState("json");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(initialDateRange);
  
  // Report content selections
  const [includeRevenue, setIncludeRevenue] = useState(true);
  const [includeExpenses, setIncludeExpenses] = useState(true);
  const [includeProfit, setIncludeProfit] = useState(true);
  const [includeTransactions, setIncludeTransactions] = useState(true);
  
  // Format date range for display and filename
  const getDateRangeText = () => {
    if (!dateRange?.from) return "all-time";
    
    return dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}`
      : format(dateRange.from, "yyyy-MM-dd");
  };
  
  const getDateRangeDisplayText = () => {
    if (!dateRange?.from) return "All time data";
    
    return dateRange.to
      ? `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`
      : format(dateRange.from, "MMM d, yyyy");
  };
  
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      // In a real implementation, this would create an actual report file
      const dummyReportData = {
        type: selectedReportType,
        dateRange: getDateRangeText(),
        notes,
        generatedAt: new Date().toISOString(),
        includeRevenue,
        includeExpenses,
        includeProfit,
        includeTransactions,
      };
      
      // Create a downloadable blob from the data
      const jsonStr = JSON.stringify(dummyReportData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReportType}-report-${getDateRangeText()}.${reportFormat}`;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    }, 1500);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Financial Reports
        </CardTitle>
        <CardDescription>Create custom financial reports with detailed filters</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-2">Report Type</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <Button
                variant={selectedReportType === "financial" ? "default" : "outline"}
                onClick={() => setSelectedReportType("financial")}
                className="flex items-center justify-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Financial
              </Button>
              <Button
                variant={selectedReportType === "technician" ? "default" : "outline"}
                onClick={() => setSelectedReportType("technician")}
                className="flex items-center justify-center gap-2"
              >
                <FileCheck className="h-4 w-4" />
                Technician
              </Button>
              <Button
                variant={selectedReportType === "jobSource" ? "default" : "outline"}
                onClick={() => setSelectedReportType("jobSource")}
                className="flex items-center justify-center gap-2"
              >
                <PieChart className="h-4 w-4" />
                Job Source
              </Button>
              <Button
                variant={selectedReportType === "transaction" ? "default" : "outline"}
                onClick={() => setSelectedReportType("transaction")}
                className="flex items-center justify-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Transactions
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-3">Date Range</h3>
            <DateRangeSelector date={dateRange} setDate={setDateRange} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Report Content</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="revenue" 
                    checked={includeRevenue} 
                    onCheckedChange={(checked) => setIncludeRevenue(checked === true)}
                  />
                  <label
                    htmlFor="revenue"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Revenue Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="expenses" 
                    checked={includeExpenses} 
                    onCheckedChange={(checked) => setIncludeExpenses(checked === true)}
                  />
                  <label
                    htmlFor="expenses"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Expenses Data
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="profit" 
                    checked={includeProfit} 
                    onCheckedChange={(checked) => setIncludeProfit(checked === true)}
                  />
                  <label
                    htmlFor="profit"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Profit Analysis
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="transactions" 
                    checked={includeTransactions} 
                    onCheckedChange={(checked) => setIncludeTransactions(checked === true)}
                  />
                  <label
                    htmlFor="transactions"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Transaction Details
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <label className="text-sm font-medium mb-2 block">Report Format</label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Report Notes</h3>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or context for this report..."
                className="resize-none h-[120px]"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerateReport} 
            className="w-full flex items-center justify-center gap-2"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>Generating<span className="animate-pulse">...</span></>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Generate & Download Report
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
