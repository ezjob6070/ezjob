
import React, { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import { Check, Download, FileText, Table } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "@/components/ui/use-toast";
import { useGlobalDateRange } from "@/components/GlobalDateRangeFilter";

interface InvoiceDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician | null;
  initialDateRange?: DateRange;
}

const InvoiceDownloadDialog: React.FC<InvoiceDownloadDialogProps> = ({
  open,
  onOpenChange,
  technician,
  initialDateRange,
}) => {
  // Get global date context
  const globalDateContext = useGlobalDateRange();

  // Initialize with passed date range, fall back to global range, or default to current month
  const [date, setDate] = useState<DateRange | undefined>(
    initialDateRange || globalDateContext?.dateRange || {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    }
  );

  const [options, setOptions] = useState({
    includeCompletedJobs: true,
    includeCancelledJobs: false,
    includeInProgressJobs: false,
    includeMaterials: true,
    includeTravelExpenses: true,
    showProfitBreakdown: true,
    showClientDetails: true,
    pdfFormat: true,
    excelFormat: false,
  });

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleDownload = (format: "pdf" | "excel") => {
    const formatName = format === "pdf" ? "PDF" : "Excel";
    
    // Get formatted date range for the toast message
    const dateRangeText = date?.from 
      ? date.to 
        ? `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`
        : format(date.from, "MMM d, yyyy")
      : "all time";
    
    toast({
      title: `Invoice ${formatName} Downloaded`,
      description: `${technician?.name}'s invoice for ${dateRangeText} has been downloaded.`,
      duration: 5000,
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Download {technician?.name}'s Invoice</DialogTitle>
          <DialogDescription>
            Select options to include in the {technician?.name}'s invoice.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <DatePickerWithRange date={date} setDate={setDate} className="w-full" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Job Status to Include</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed-jobs" 
                  checked={options.includeCompletedJobs}
                  onCheckedChange={() => handleOptionChange("includeCompletedJobs")}
                />
                <Label htmlFor="completed-jobs">Completed Jobs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cancelled-jobs" 
                  checked={options.includeCancelledJobs}
                  onCheckedChange={() => handleOptionChange("includeCancelledJobs")}
                />
                <Label htmlFor="cancelled-jobs">Cancelled Jobs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-progress-jobs" 
                  checked={options.includeInProgressJobs}
                  onCheckedChange={() => handleOptionChange("includeInProgressJobs")}
                />
                <Label htmlFor="in-progress-jobs">In Progress Jobs</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Expense Details</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="materials" 
                  checked={options.includeMaterials}
                  onCheckedChange={() => handleOptionChange("includeMaterials")}
                />
                <Label htmlFor="materials">Include Materials</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="travel" 
                  checked={options.includeTravelExpenses}
                  onCheckedChange={() => handleOptionChange("includeTravelExpenses")}
                />
                <Label htmlFor="travel">Include Travel Expenses</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Additional Options</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="profit">Show Profit Breakdown</Label>
              <Switch
                id="profit"
                checked={options.showProfitBreakdown}
                onCheckedChange={() => handleOptionChange("showProfitBreakdown")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="client-details">Show Client Details</Label>
              <Switch
                id="client-details"
                checked={options.showClientDetails}
                onCheckedChange={() => handleOptionChange("showClientDetails")}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">File Format</h3>
            <div className="flex gap-2">
              <Button
                variant={options.pdfFormat ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setOptions(prev => ({...prev, pdfFormat: true, excelFormat: false}))}
              >
                <FileText className="h-4 w-4 mr-2" />
                PDF
                {options.pdfFormat && <Check className="h-4 w-4 ml-2" />}
              </Button>
              <Button
                variant={options.excelFormat ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setOptions(prev => ({...prev, pdfFormat: false, excelFormat: true}))}
              >
                <Table className="h-4 w-4 mr-2" />
                Excel
                {options.excelFormat && <Check className="h-4 w-4 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDownload(options.pdfFormat ? "pdf" : "excel")}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download {options.pdfFormat ? "PDF" : "Excel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDownloadDialog;
