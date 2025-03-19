
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, FileText, Download, X } from "lucide-react";
import { Technician } from "@/types/technician";
import { DateRange } from "react-day-picker";
import { toast } from "@/components/ui/use-toast";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  initialDateRange
}) => {
  // Set initial date range to the provided range or default to current month
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  const defaultDateRange: DateRange = initialDateRange || {
    from: firstDayOfMonth,
    to: lastDayOfMonth
  };

  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange);
  const [includeCompletedJobs, setIncludeCompletedJobs] = useState(true);
  const [includeCancelledJobs, setIncludeCancelledJobs] = useState(false);
  const [includeInProgressJobs, setIncludeInProgressJobs] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(true);
  const [showPaymentDetails, setShowPaymentDetails] = useState(true);
  const [showExpenseDetails, setShowExpenseDetails] = useState(false);
  const [fileFormat, setFileFormat] = useState<"pdf" | "excel">("pdf");
  
  const handleDownload = () => {
    // In a real app, this would call an API endpoint to generate and download the invoice
    
    // For now, we'll just show a success toast
    toast({
      title: `Invoice for ${technician?.name} downloaded`,
      description: `Downloaded as ${fileFormat.toUpperCase()} for period ${dateRange?.from ? dateRange.from.toLocaleDateString() : ''} to ${dateRange?.to ? dateRange.to.toLocaleDateString() : ''}`,
      variant: "success",
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Technician Invoice
          </DialogTitle>
          <DialogDescription>
            {technician ? `Generate an invoice report for ${technician.name}` : 'Generate an invoice report'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Date Range</h3>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Include Job Status</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="completed" 
                  checked={includeCompletedJobs} 
                  onCheckedChange={(checked) => setIncludeCompletedJobs(checked as boolean)} 
                />
                <label htmlFor="completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Completed Jobs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="cancelled" 
                  checked={includeCancelledJobs} 
                  onCheckedChange={(checked) => setIncludeCancelledJobs(checked as boolean)} 
                />
                <label htmlFor="cancelled" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Cancelled Jobs
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="inProgress" 
                  checked={includeInProgressJobs} 
                  onCheckedChange={(checked) => setIncludeInProgressJobs(checked as boolean)} 
                />
                <label htmlFor="inProgress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  In Progress Jobs
                </label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Display Options</h3>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="jobDetails" 
                  checked={showJobDetails} 
                  onCheckedChange={(checked) => setShowJobDetails(checked as boolean)} 
                />
                <label htmlFor="jobDetails" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show Job Details
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="paymentDetails" 
                  checked={showPaymentDetails} 
                  onCheckedChange={(checked) => setShowPaymentDetails(checked as boolean)} 
                />
                <label htmlFor="paymentDetails" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show Payment Details
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="expenseDetails" 
                  checked={showExpenseDetails} 
                  onCheckedChange={(checked) => setShowExpenseDetails(checked as boolean)} 
                />
                <label htmlFor="expenseDetails" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Show Expense Details
                </label>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">File Format</h3>
            <Select value={fileFormat} onValueChange={(value) => setFileFormat(value as "pdf" | "excel")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select file format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download {fileFormat.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDownloadDialog;
