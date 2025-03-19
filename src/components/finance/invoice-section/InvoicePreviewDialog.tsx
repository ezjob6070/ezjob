
import React from "react";
import { Technician } from "@/types/technician";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface DisplayOptions {
  showJobAddress: boolean;
  showJobDate: boolean;
  showTechnicianEarnings: boolean;
  showCompanyProfit: boolean;
  showPartsValue: boolean;
  showDetails: boolean;
  showTechnicianRate: boolean;
  showJobBreakdown: boolean;
  showTotalSummary: boolean;
}

interface InvoicePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  technician: Technician | null;
  date?: DateRange;
  displayOptions: DisplayOptions;
}

const InvoicePreviewDialog: React.FC<InvoicePreviewDialogProps> = ({
  open,
  onOpenChange,
  technician,
  date,
  displayOptions
}) => {
  if (!technician) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-xl font-bold mb-2">Invoice for {technician.name}</h2>
            <p className="text-sm mb-2">Period: {date?.from && date?.to ? `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}` : "All time"}</p>
            <p className="text-sm">Filter Options:</p>
            <ul className="text-sm ml-4 mt-1">
              <li>Show Job Address: {displayOptions.showJobAddress ? "Yes" : "No"}</li>
              <li>Show Job Date: {displayOptions.showJobDate ? "Yes" : "No"}</li>
              <li>Show Technician Earnings: {displayOptions.showTechnicianEarnings ? "Yes" : "No"}</li>
              <li>Show Company Profit: {displayOptions.showCompanyProfit ? "Yes" : "No"}</li>
              <li>Show Parts Value: {displayOptions.showPartsValue ? "Yes" : "No"}</li>
              <li>Show Job Details: {displayOptions.showDetails ? "Yes" : "No"}</li>
              <li>Show Technician Rate: {displayOptions.showTechnicianRate ? "Yes" : "No"}</li>
              <li>Show Job Breakdown: {displayOptions.showJobBreakdown ? "Yes" : "No"}</li>
              <li>Show Total Summary: {displayOptions.showTotalSummary ? "Yes" : "No"}</li>
            </ul>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={() => {
              toast({
                title: "Success",
                description: "Invoice downloaded successfully!"
              });
              onOpenChange(false);
            }}>
              Download Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoicePreviewDialog;
