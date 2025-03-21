
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
import { toast } from "@/components/ui/use-toast";
import InvoiceDownloadDialog from "@/components/finance/invoice-section/InvoiceDownloadDialog";
import { DateRange } from "react-day-picker";

interface TechnicianFinancialTableContentProps {
  displayedTechnicians: Technician[];
  onTechnicianSelect: (technician: Technician) => void;
  selectedTechnicianId?: string;
  localDateRange?: DateRange;
}

const TechnicianFinancialTableContent: React.FC<TechnicianFinancialTableContentProps> = ({
  displayedTechnicians,
  onTechnicianSelect,
  selectedTechnicianId,
  localDateRange
}) => {
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [activeTechnician, setActiveTechnician] = useState<Technician | null>(null);

  const handleDownloadClick = (technician: Technician, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the row click from triggering
    setActiveTechnician(technician);
    setDownloadDialogOpen(true);
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
              <TableHead className="text-right">Parts</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Company Profit</TableHead>
              <TableHead>Download Invoice</TableHead>
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
              
              // Calculate parts value (estimating as 20% of total revenue)
              const partsValue = technician.totalRevenue ? technician.totalRevenue * 0.2 : 0;
              
              // Calculate company profit (revenue - earnings - parts)
              const companyProfit = technician.totalRevenue ? technician.totalRevenue - earnings - partsValue : 0;
              
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
                    <span className="font-semibold text-amber-500">{formatCurrency(partsValue)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-blue-600">{formatCurrency(technician.totalRevenue || 0)}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">{formatCurrency(companyProfit)}</span>
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

      {/* Invoice Download Dialog with filters */}
      <InvoiceDownloadDialog 
        open={downloadDialogOpen} 
        onOpenChange={setDownloadDialogOpen} 
        technician={activeTechnician} 
        initialDateRange={localDateRange}
      />
    </>
  );
};

export default TechnicianFinancialTableContent;
