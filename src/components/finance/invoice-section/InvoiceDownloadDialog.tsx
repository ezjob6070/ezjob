
import React, { useState } from "react";
import { Technician } from "@/types/technician";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Filter, Calendar, X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { toast } from "@/components/ui/use-toast";

interface InvoiceDownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician | null;
}

const InvoiceDownloadDialog: React.FC<InvoiceDownloadDialogProps> = ({
  open,
  onOpenChange,
  technician
}) => {
  const [activeTab, setActiveTab] = useState<"filters" | "preview">("filters");
  const [fileType, setFileType] = useState<"pdf" | "excel">("pdf");
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    showCompletedJobs: true,
    showCancelledJobs: false,
    showInProgressJobs: false,
    showJobDate: true,
    showJobAddress: true,
    showCompanyProfit: false,
    showTechnicianEarnings: true,
    showJobDetails: true,
    showPaymentMethods: true,
  });

  const handleCheckboxChange = (field: string) => {
    setFilterOptions(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof filterOptions]
    }));
  };

  const handleDownload = () => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileType.toUpperCase()} invoice for ${technician?.name} with your selected filters.`,
    });
    onOpenChange(false);
  };

  if (!technician) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download Invoice for {technician.name}</DialogTitle>
        </DialogHeader>
        
        <div className="flex border rounded-md mb-4">
          <button
            className={cn(
              "flex-1 py-2 text-center text-sm font-medium",
              activeTab === "filters" 
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700" 
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab("filters")}
          >
            <Filter className="h-4 w-4 inline-block mr-2" />
            Filter Options
          </button>
          <button
            className={cn(
              "flex-1 py-2 text-center text-sm font-medium",
              activeTab === "preview" 
                ? "bg-blue-50 text-blue-700 border-b-2 border-blue-700" 
                : "text-gray-600 hover:bg-gray-50"
            )}
            onClick={() => setActiveTab("preview")}
          >
            <Download className="h-4 w-4 inline-block mr-2" />
            Download Options
          </button>
        </div>
        
        {activeTab === "filters" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <DatePickerWithRange date={date} setDate={setDate} />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Job Status</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showCompletedJobs"
                    checked={filterOptions.showCompletedJobs}
                    onCheckedChange={() => handleCheckboxChange("showCompletedJobs")}
                  />
                  <label
                    htmlFor="showCompletedJobs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Completed
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showCancelledJobs"
                    checked={filterOptions.showCancelledJobs}
                    onCheckedChange={() => handleCheckboxChange("showCancelledJobs")}
                  />
                  <label
                    htmlFor="showCancelledJobs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Cancelled
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showInProgressJobs"
                    checked={filterOptions.showInProgressJobs}
                    onCheckedChange={() => handleCheckboxChange("showInProgressJobs")}
                  />
                  <label
                    htmlFor="showInProgressJobs"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Progress
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Display Options</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showJobDate"
                    checked={filterOptions.showJobDate}
                    onCheckedChange={() => handleCheckboxChange("showJobDate")}
                  />
                  <label
                    htmlFor="showJobDate"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Job Date
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showJobAddress"
                    checked={filterOptions.showJobAddress}
                    onCheckedChange={() => handleCheckboxChange("showJobAddress")}
                  />
                  <label
                    htmlFor="showJobAddress"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Job Address
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showTechnicianEarnings"
                    checked={filterOptions.showTechnicianEarnings}
                    onCheckedChange={() => handleCheckboxChange("showTechnicianEarnings")}
                  />
                  <label
                    htmlFor="showTechnicianEarnings"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Technician Earnings
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showCompanyProfit"
                    checked={filterOptions.showCompanyProfit}
                    onCheckedChange={() => handleCheckboxChange("showCompanyProfit")}
                  />
                  <label
                    htmlFor="showCompanyProfit"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Company Profit
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showJobDetails"
                    checked={filterOptions.showJobDetails}
                    onCheckedChange={() => handleCheckboxChange("showJobDetails")}
                  />
                  <label
                    htmlFor="showJobDetails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Job Details
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showPaymentMethods"
                    checked={filterOptions.showPaymentMethods}
                    onCheckedChange={() => handleCheckboxChange("showPaymentMethods")}
                  />
                  <label
                    htmlFor="showPaymentMethods"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Payment Methods
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "preview" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">File Format</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={fileType === "pdf" ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setFileType("pdf")}
                >
                  <Download className="h-4 w-4" />
                  PDF Format
                </Button>
                <Button 
                  variant={fileType === "excel" ? "default" : "outline"} 
                  className="flex items-center gap-2"
                  onClick={() => setFileType("excel")}
                >
                  <Download className="h-4 w-4" />
                  Excel Format
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Invoice Period</Label>
              <Select defaultValue="custom">
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-month">Current Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium text-blue-700 mb-2">Download Summary</h3>
              <ul className="text-sm space-y-1 text-blue-600">
                <li>Technician: {technician.name}</li>
                <li>Date Range: {date?.from && date?.to ? `${date.from.toLocaleDateString()} to ${date.to.toLocaleDateString()}` : 'All time'}</li>
                <li>Format: {fileType.toUpperCase()}</li>
                <li>
                  Job Status: {[
                    filterOptions.showCompletedJobs ? 'Completed' : '',
                    filterOptions.showCancelledJobs ? 'Cancelled' : '',
                    filterOptions.showInProgressJobs ? 'In Progress' : ''
                  ].filter(Boolean).join(', ')}
                </li>
                <li>
                  Data Included: {[
                    filterOptions.showJobDate ? 'Job Date' : '',
                    filterOptions.showJobAddress ? 'Job Address' : '',
                    filterOptions.showTechnicianEarnings ? 'Earnings' : '',
                    filterOptions.showCompanyProfit ? 'Company Profit' : '',
                    filterOptions.showJobDetails ? 'Job Details' : '',
                    filterOptions.showPaymentMethods ? 'Payment Methods' : ''
                  ].filter(Boolean).join(', ')}
                </li>
              </ul>
            </div>
          </div>
        )}
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceDownloadDialog;
