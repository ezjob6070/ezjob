
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Wrench, Briefcase, UserCheck, Hammer } from "lucide-react";

interface TechniciansTableViewProps {
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
  showSalaryData = true
}) => {
  
  // Role styling with consistent color scheme
  const getRoleStyles = (role?: string) => {
    switch(role) {
      case "technician":
        return {
          color: "#0EA5E9", // Ocean Blue
          bgColor: "#E0F2FE",
          icon: <Wrench className="h-4 w-4 text-[#0EA5E9] mr-1" />,
          label: "Technician"
        };
      case "salesman":
        return {
          color: "#10B981", // Emerald Green
          bgColor: "#ECFDF5",
          icon: <Briefcase className="h-4 w-4 text-[#10B981] mr-1" />,
          label: "Salesman"
        };
      case "employed":
        return {
          color: "#8B5CF6", // Vivid Purple
          bgColor: "#F3E8FF",
          icon: <UserCheck className="h-4 w-4 text-[#8B5CF6] mr-1" />,
          label: "Employed"
        };
      case "contractor":
        return {
          color: "#F97316", // Bright Orange
          bgColor: "#FFEDD5",
          icon: <Hammer className="h-4 w-4 text-[#F97316] mr-1" />,
          label: "Contractor"
        };
      default:
        return {
          color: "#6E59A5", // Tertiary Purple
          bgColor: "#F1F0FB",
          icon: <Wrench className="h-4 w-4 text-[#6E59A5] mr-1" />,
          label: "Staff"
        };
    }
  };
  
  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {onToggleSelect && <TableHead className="w-12"></TableHead>}
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Contact</TableHead>
            {showSalaryData && (
              <>
                <TableHead className="text-right">Jobs</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicians.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showSalaryData ? 8 : 6}
                className="h-24 text-center text-muted-foreground"
              >
                No technicians found.
              </TableCell>
            </TableRow>
          ) : (
            technicians.map((technician) => {
              const isSelected = selectedTechnicians.includes(technician.id);
              const roleStyle = getRoleStyles(technician.role);
              
              return (
                <TableRow 
                  key={technician.id}
                  onClick={() => onEditTechnician && onEditTechnician(technician)}
                  className={`${onEditTechnician ? "cursor-pointer hover:bg-muted/50" : ""}`}
                >
                  {onToggleSelect && (
                    <TableCell className="w-12">
                      <Checkbox
                        checked={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSelect(technician.id);
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">
                    {technician.name}
                  </TableCell>
                  <TableCell>
                    <div 
                      className="flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: roleStyle.bgColor,
                        color: roleStyle.color
                      }}
                    >
                      {roleStyle.icon}
                      {roleStyle.label}
                    </div>
                  </TableCell>
                  <TableCell>{technician.specialty}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        technician.status === "active" ? "success" :
                        technician.status === "inactive" ? "destructive" : "warning"
                      }
                      className="capitalize"
                    >
                      {technician.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="text-sm">
                      <div>{technician.email}</div>
                      <div className="text-muted-foreground">{technician.phone}</div>
                    </div>
                  </TableCell>
                  {showSalaryData && (
                    <>
                      <TableCell className="text-right">
                        <span className="font-medium">{technician.completedJobs || 0}</span>
                        <span className="text-muted-foreground text-xs ml-1">completed</span>
                        {technician.cancelledJobs > 0 && (
                          <div className="text-xs text-destructive">
                            {technician.cancelledJobs} cancelled
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium" style={{ color: roleStyle.color }}>
                        {formatCurrency(technician.totalRevenue || 0)}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechniciansTableView;
