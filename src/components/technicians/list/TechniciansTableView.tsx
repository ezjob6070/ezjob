
import React from "react";
import { Technician } from "@/types/technician";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";

export interface TechniciansTableViewProps {
  technicians: Technician[];
  onEditTechnician?: (technician: Technician) => void;
  selectedTechnicians?: string[];
  onToggleSelect?: (technicianId: string) => void;
  showSalaryData?: boolean;
}

const TechniciansTableView: React.FC<TechniciansTableViewProps> = ({
  technicians,
  onEditTechnician,
  selectedTechnicians = [],
  onToggleSelect,
  showSalaryData = false
}) => {
  const handleRowClick = (technician: Technician) => {
    if (onEditTechnician) {
      onEditTechnician(technician);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "destructive";
      case "onLeave":
        return "warning";
      default:
        return "secondary";
    }
  };

  return (
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            {onToggleSelect && <TableHead className="w-12"></TableHead>}
            <TableHead className="w-1/4">Technician</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Hire Date</TableHead>
            {showSalaryData && <TableHead>Payment</TableHead>}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicians.map((technician) => (
            <TableRow 
              key={technician.id} 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleRowClick(technician)}
            >
              {onToggleSelect && (
                <TableCell className="p-2" onClick={e => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedTechnicians.includes(technician.id)}
                    onCheckedChange={() => onToggleSelect(technician.id)}
                  />
                </TableCell>
              )}
              <TableCell className="font-medium">
                {technician.name}
                {technician.role && (
                  <Badge variant="outline" className="ml-2 capitalize">
                    {technician.role}
                  </Badge>
                )}
              </TableCell>
              <TableCell>{technician.email}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(technician.status)} className="capitalize">
                  {technician.status}
                </Badge>
              </TableCell>
              <TableCell>{technician.specialty}</TableCell>
              <TableCell>
                {technician.hireDate ? format(new Date(technician.hireDate), 'MMM d, yyyy') : 'Not set'}
              </TableCell>
              {showSalaryData && (
                <TableCell>
                  {technician.paymentType === 'hourly' ? 
                    `$${technician.hourlyRate}/hr` : 
                    technician.paymentType === 'percentage' ? 
                      `${technician.paymentRate}% commission` : 
                      `$${technician.paymentRate} flat`}
                </TableCell>
              )}
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {/* Actions could go here */}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {technicians.length === 0 && (
            <TableRow>
              <TableCell colSpan={onToggleSelect ? 8 : 7} className="h-24 text-center">
                No technicians found matching your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechniciansTableView;
