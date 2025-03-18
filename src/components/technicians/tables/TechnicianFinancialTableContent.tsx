
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Technician } from "@/types/technician";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";

interface TechnicianFinancialTableContentProps {
  technicians: Technician[];
  selectedTechnicianId?: string;
  onTechnicianSelect: (technician: Technician) => void;
  onCreateInvoice: (technician: Technician) => void;
}

const TechnicianFinancialTableContent: React.FC<TechnicianFinancialTableContentProps> = ({
  technicians,
  selectedTechnicianId,
  onTechnicianSelect,
  onCreateInvoice
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Technician</TableHead>
          <TableHead>Total Revenue</TableHead>
          <TableHead>Technician Earnings</TableHead>
          <TableHead>Company Earnings</TableHead>
          <TableHead>Profit Ratio</TableHead>
          <TableHead>Parts</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technicians.map((tech) => {
          const techEarnings = tech.totalRevenue * (tech.paymentType === "percentage" ? tech.paymentRate / 100 : 1);
          const companyEarnings = tech.totalRevenue - techEarnings - (tech.totalRevenue * 0.33);
          const profitRatio = ((companyEarnings / tech.totalRevenue) * 100).toFixed(1);
          const partsValue = tech.totalRevenue * 0.2; // Assuming parts are 20% of total revenue
          
          return (
            <TableRow 
              key={tech.id}
              className={`cursor-pointer hover:bg-slate-50 ${selectedTechnicianId === tech.id ? 'bg-indigo-50' : ''}`}
              onClick={() => onTechnicianSelect(tech)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 text-xs ${selectedTechnicianId === tech.id ? 'bg-indigo-600' : 'bg-indigo-400'}`}>
                    {tech.initials}
                  </div>
                  <span>{tech.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({tech.paymentType === "percentage" ? `${tech.paymentRate}%` : "Flat Rate"})
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sky-600">{formatCurrency(tech.totalRevenue)}</TableCell>
              <TableCell className="text-red-600">-{formatCurrency(techEarnings)}</TableCell>
              <TableCell className="text-violet-600">{formatCurrency(companyEarnings)}</TableCell>
              <TableCell>{profitRatio}%</TableCell>
              <TableCell className="text-red-600">-{formatCurrency(partsValue)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateInvoice(tech);
                  }}
                >
                  <FileText className="h-4 w-4" />
                  Invoice
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default TechnicianFinancialTableContent;
