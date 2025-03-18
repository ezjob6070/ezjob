
import React from "react";
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
  if (displayedTechnicians.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No technicians match your filter criteria.
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Technician</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead className="text-right">Hourly Rate</TableHead>
            <TableHead className="text-right">Completed Jobs</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Earnings</TableHead>
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
                  {formatCurrency(technician.hourlyRate)}
                </TableCell>
                <TableCell className="text-right">
                  {technician.completedJobs || 0}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(technician.totalRevenue || 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(earnings)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechnicianFinancialTableContent;
