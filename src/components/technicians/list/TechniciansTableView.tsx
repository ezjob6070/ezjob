
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { 
  Star, Edit, Calendar, Mail, Phone, 
  CheckCircle, XCircle 
} from "lucide-react";
import { Technician } from "@/types/technician";
import { getBadgeVariantFromStatus } from "./technicianListUtils";

interface TechniciansTableViewProps {
  technicians: Technician[];
  onEditTechnician?: (technician: Technician) => void;
}

const TechniciansTableView: React.FC<TechniciansTableViewProps> = ({ 
  technicians,
  onEditTechnician
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Technician</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Jobs</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Contract</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicians.map((technician) => (
            <TableRow
              key={technician.id}
              className="cursor-pointer hover:bg-slate-50"
              onClick={() => navigate(`/technicians/${technician.id}`)}
            >
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={technician.imageUrl || ""} alt={technician.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {technician.imageUrl ? "" : technician.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{technician.name}</div>
                    <div className="text-xs text-muted-foreground">{technician.specialty}</div>
                    <div className="flex items-center mt-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                      <span className="text-xs">{technician.rating || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs flex items-center">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" /> 
                    <span className="truncate max-w-[150px]">{technician.email}</span>
                  </div>
                  {technician.phone && (
                    <div className="text-xs flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-muted-foreground" /> 
                      <span>{technician.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div>
                  <div className="text-sm">{technician.department || "General"}</div>
                  {technician.position && (
                    <div className="text-xs text-muted-foreground">{technician.position}</div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <Badge
                  variant={getBadgeVariantFromStatus(technician.status)}
                  className="capitalize"
                >
                  {technician.status}
                </Badge>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  <div className="text-xs flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1 text-green-500" /> 
                    <span>{technician.completedJobs || 0} completed</span>
                  </div>
                  <div className="text-xs flex items-center">
                    <XCircle className="h-3 w-3 mr-1 text-red-500" /> 
                    <span>{technician.cancelledJobs || 0} cancelled</span>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>{formatCurrency(technician.totalRevenue || 0)}</TableCell>
              
              <TableCell>
                <div>
                  <div className="text-sm">{technician.contractType || "Standard"}</div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Calendar className="h-3 w-3 mr-1" /> 
                    {technician.hireDate ? new Date(technician.hireDate).toLocaleDateString() : "N/A"}
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEditTechnician) onEditTechnician(technician);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TechniciansTableView;
