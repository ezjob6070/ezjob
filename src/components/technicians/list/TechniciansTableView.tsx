
import React from "react";
import { Technician } from "@/types/technician";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Wrench, Briefcase, UserCheck } from "lucide-react";

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

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case "technician":
        return <Wrench className="h-4 w-4 mr-1 text-blue-500" />;
      case "salesman":
        return <Briefcase className="h-4 w-4 mr-1 text-green-500" />;
      case "employed":
        return <UserCheck className="h-4 w-4 mr-1 text-purple-500" />;
      default:
        return <Wrench className="h-4 w-4 mr-1 text-blue-500" />;
    }
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case "technician":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "salesman":
        return "bg-green-100 text-green-700 border-green-300";
      case "employed":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
                <div className="flex items-center">
                  {technician.name}
                  {technician.role && (
                    <span className={`ml-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getRoleBadgeColor(technician.role)}`}>
                      {getRoleIcon(technician.role)}
                      {technician.role.charAt(0).toUpperCase() + technician.role.slice(1)}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>{technician.email}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(technician.status) as any} className="capitalize">
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
