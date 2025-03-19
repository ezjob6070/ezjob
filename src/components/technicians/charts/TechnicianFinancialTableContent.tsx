
import React, { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface TechnicianFinancialTableContentProps {
  displayedTechnicians: Technician[];
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
}

const TechnicianFinancialTableContent: React.FC<TechnicianFinancialTableContentProps> = ({
  displayedTechnicians,
  onTechnicianSelect,
  selectedTechnicianId
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [activeTechnician, setActiveTechnician] = useState<Technician | null>(null);

  const handleDownloadClick = (technician: Technician, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click from triggering
    setActiveTechnician(technician);
    setDownloadDialogOpen(true);
  };

  const handleDownloadInvoice = () => {
    toast({
      title: "Download Started",
      description: `Downloading invoice for ${activeTechnician?.name}...`,
    });
    setDownloadDialogOpen(false);
  };

  if (displayedTechnicians.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No technicians match your filter criteria.
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Payment Rate</TableHead>
              <TableHead className="text-right">Completed Jobs</TableHead>
              <TableHead className="text-right">Cancelled Jobs</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Company Profit</TableHead>
              <TableHead>Download</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedTechnicians.map((technician) => {
              const isSelected = technician.id === selectedTechnicianId;
              // Calculate earnings based on payment type
              const earnings = technician.totalRevenue ? (
                technician.paymentType === "percentage" 
                  ? technician.totalRevenue * (technician.paymentRate / 100)
                  : technician.completedJobs ? technician.completedJobs * technician.paymentRate : 0
              ) : 0;
              
              return (
                <TableRow 
                  key={technician.id}
                  className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted/50' : ''}`}
                  onClick={() => onTechnicianSelect(technician)}
                >
                  <TableCell className="font-medium">
                    {technician.name}
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{technician.paymentType}</span>
                    {technician.paymentType === "percentage" && 
                      <span className="ml-1 text-muted-foreground">({technician.paymentRate}%)</span>
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">{technician.completedJobs || 0}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-red-600">{technician.cancelledJobs || 0}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-blue-600">{formatCurrency(technician.totalRevenue || 0)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">{formatCurrency(earnings)}</span>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-1" 
                      onClick={(e) => handleDownloadClick(technician, e)}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Download Dialog */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Download Invoice for {activeTechnician?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <p>Select the invoice format you would like to download:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={handleDownloadInvoice} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                PDF Invoice
              </Button>
              <Button onClick={handleDownloadInvoice} variant="outline" className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Excel Format
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TechnicianFinancialTableContent;
