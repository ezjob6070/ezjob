
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Calendar, 
  FileCheck, 
  Printer 
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

type ReportType = "financial" | "technician" | "jobSource" | "transaction";

interface ReportGeneratorProps {
  dateRange: DateRange | undefined;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ dateRange }) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType>("financial");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Format date range for display and filename
  const getDateRangeText = () => {
    if (!dateRange?.from) return "all-time";
    
    return dateRange.to
      ? `${format(dateRange.from, "yyyy-MM-dd")}_to_${format(dateRange.to, "yyyy-MM-dd")}`
      : format(dateRange.from, "yyyy-MM-dd");
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
        generatedAt: new Date().toISOString()
      };
      
      // Create a downloadable blob from the data
      const jsonStr = JSON.stringify(dummyReportData, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `${selectedReportType}-report-${getDateRangeText()}.json`;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
    }, 1500);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Reports
        </CardTitle>
        <CardDescription>Create and download financial reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant={selectedReportType === "financial" ? "default" : "outline"}
              onClick={() => setSelectedReportType("financial")}
              className="flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
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
              <Calendar className="h-4 w-4" />
              Job Source
            </Button>
            <Button
              variant={selectedReportType === "transaction" ? "default" : "outline"}
              onClick={() => setSelectedReportType("transaction")}
              className="flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Transactions
            </Button>
          </div>
          
          <div>
            <p className="text-sm font-medium mb-2">Report Notes (Optional)</p>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes or context for this report..."
              className="resize-none"
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="text-sm text-muted-foreground">
              {dateRange?.from ? (
                <span>
                  Date range: {format(dateRange.from, "MMM d, yyyy")}
                  {dateRange.to && ` - ${format(dateRange.to, "MMM d, yyyy")}`}
                </span>
              ) : (
                <span>All-time data</span>
              )}
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
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
