
import { useState } from 'react';
import { format } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Download, Printer, X } from "lucide-react";

interface TechnicianInvoiceDialogProps {
  open: boolean;
  onClose: () => void;
  technician: Technician | null;
  dateRange?: { from: Date; to?: Date };
}

const TechnicianInvoiceDialog = ({
  open,
  onClose,
  technician,
  dateRange
}: TechnicianInvoiceDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Handle null technician
  if (!technician) {
    return null;
  }

  // Format the date range for display
  const getDateRangeText = () => {
    if (!dateRange?.from) {
      return "All time";
    }
    
    if (dateRange.to) {
      return `${format(dateRange.from, "MMMM dd, yyyy")} - ${format(dateRange.to, "MMMM dd, yyyy")}`;
    }
    
    return `From ${format(dateRange.from, "MMMM dd, yyyy")}`;
  };

  // Calculate technician's earnings based on their payment type
  const calculateEarnings = () => {
    if (!technician) return 0;
    
    const revenue = technician.totalRevenue || 0;
    
    if (technician.paymentType === "percentage") {
      return revenue * (technician.paymentRate / 100);
    } else if (technician.paymentType === "flat") {
      return technician.completedJobs ? technician.completedJobs * technician.paymentRate : 0;
    } else {
      // Hourly - this is a placeholder calculation
      return technician.hourlyRate * 160; // Assuming 160 hours in a month
    }
  };

  const earnings = calculateEarnings();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsLoading(true);
    // Simulated download delay
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, this would generate a PDF
      alert("Invoice downloaded successfully!");
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between print:hidden">
          <DialogTitle>Technician Invoice</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="space-y-8 p-6 bg-white rounded-md" id="printable-invoice">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">PAYMENT STATEMENT</h1>
              <p className="text-muted-foreground">#{technician.id}-{Date.now().toString().slice(-6)}</p>
              <p className="text-muted-foreground mt-2">Date Range: {getDateRangeText()}</p>
            </div>
            <div className="text-right">
              <h2 className="font-bold">YourCompany, Inc.</h2>
              <p>123 Business Street</p>
              <p>City, State ZIP</p>
              <p>accounting@yourcompany.com</p>
            </div>
          </div>
          
          {/* Technician Info */}
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">TECHNICIAN</h3>
                <p className="font-medium">{technician.name}</p>
                <p>{technician.email}</p>
                <p>{technician.phone}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-1">PAYMENT DETAILS</h3>
                <p>Payment Type: {technician.paymentType.charAt(0).toUpperCase() + technician.paymentType.slice(1)}</p>
                {technician.paymentType === "percentage" ? (
                  <p>Rate: {technician.paymentRate}% of revenue</p>
                ) : (
                  <p>Rate: {formatCurrency(technician.paymentRate)}</p>
                )}
                <p>Issue Date: {format(new Date(), "MMMM dd, yyyy")}</p>
              </div>
            </div>
          </div>
          
          {/* Summary */}
          <div>
            <h3 className="font-semibold mb-4">Job Summary</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Total Revenue Generated</TableCell>
                  <TableCell className="text-right">{formatCurrency(technician.totalRevenue || 0)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Completed Jobs</TableCell>
                  <TableCell className="text-right">{technician.completedJobs || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Cancelled Jobs</TableCell>
                  <TableCell className="text-right">{technician.cancelledJobs || 0}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Earnings</TableCell>
                  <TableCell className="text-right font-bold">{formatCurrency(earnings)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          
          {/* Payment Note */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Payment Note</h3>
            <p className="text-muted-foreground">
              Payment will be processed according to the company's standard payment schedule.
              Please review all details and contact accounting if you have any questions.
            </p>
          </div>
          
          {/* Thank You */}
          <div className="text-center border-t pt-6">
            <p className="font-medium">Thank you for your valued service!</p>
          </div>
        </div>
        
        <DialogFooter className="print:hidden">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleDownload} disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Downloading..." : "Download PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TechnicianInvoiceDialog;
