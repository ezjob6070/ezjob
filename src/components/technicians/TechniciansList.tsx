
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Star, Edit, Trash2, LayoutGrid, List, Clock, DollarSign, Calendar, User, Phone, Mail, MapPin, Briefcase, CheckCircle, XCircle } from "lucide-react";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { SalaryBasis, IncentiveType } from "@/types/employee";

interface Technician {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  status: string;
  totalRevenue?: number;
  rating?: number;
  imageUrl?: string;
  initials: string;
  hourlyRate?: number;
  salaryBasis?: SalaryBasis;
  incentiveType?: IncentiveType;
  incentiveAmount?: number;
  phone?: string;
  address?: string;
  completedJobs?: number;
  cancelledJobs?: number;
  contractType?: string;
  department?: string;
  position?: string;
  hireDate?: string;
}

interface TechniciansListProps {
  technicians: Technician[];
  displayMode?: "card" | "table";
  selectedTechnicians?: string[];
  onToggleSelect?: (technicianId: string) => void;
  onEditTechnician?: (technician: Technician) => void;
  showSalaryData?: boolean;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  displayMode: initialDisplayMode = "table",
  selectedTechnicians = [],
  onToggleSelect,
  onEditTechnician,
  showSalaryData = false
}) => {
  const navigate = useNavigate();
  const [displayMode, setDisplayMode] = useState<"card" | "table">(initialDisplayMode);
  
  // Helper function to determine badge variant
  const getBadgeVariantFromStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success" as const;
      case "inactive":
        return "secondary" as const;
      case "onleave":
        return "warning" as const;
      case "suspended":
        return "destructive" as const;
      case "terminated":
        return "outline" as const;
      default:
        return "default" as const;
    }
  };

  // Format hourly rate
  const formatHourlyRate = (amount?: number) => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get salary basis display text
  const getSalaryBasisText = (basis?: SalaryBasis) => {
    if (!basis) return "N/A";
    switch (basis) {
      case SalaryBasis.HOURLY:
        return "Hourly";
      case SalaryBasis.WEEKLY:
        return "Weekly";
      case SalaryBasis.MONTHLY:
        return "Monthly";
      case SalaryBasis.YEARLY:
        return "Yearly";
      default:
        return "N/A";
    }
  };
  
  // Get incentive type display text
  const getIncentiveTypeText = (type?: IncentiveType) => {
    if (!type) return "N/A";
    switch (type) {
      case IncentiveType.HOURLY:
        return "Per Hour";
      case IncentiveType.WEEKLY:
        return "Per Week";
      case IncentiveType.MONTHLY:
        return "Per Month";
      default:
        return "N/A";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <CompactTechnicianFilter 
          technicianNames={technicians.map(tech => tech.name)}
          selectedTechnicians={[]}
          toggleTechnician={() => {}}
          clearFilters={() => {}}
          applyFilters={() => {}}
        />
        
        <div className="flex items-center space-x-2">
          <Button 
            variant={displayMode === "table" ? "default" : "outline"} 
            size="sm"
            onClick={() => setDisplayMode("table")}
          >
            <List className="h-4 w-4 mr-2" />
            Table
          </Button>
          <Button 
            variant={displayMode === "card" ? "default" : "outline"} 
            size="sm"
            onClick={() => setDisplayMode("card")}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Cards
          </Button>
        </div>
      </div>

      {displayMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((technician) => (
            <Card 
              key={technician.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/technicians/${technician.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge
                    variant={getBadgeVariantFromStatus(technician.status)}
                    className="capitalize"
                  >
                    {technician.status}
                  </Badge>
                  {technician.department && (
                    <Badge variant="outline">{technician.department}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={technician.imageUrl || ""} alt={technician.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {technician.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{technician.name}</h3>
                    <p className="text-sm text-muted-foreground">{technician.specialty || "General"}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Star className="w-3 h-3 text-yellow-400 mr-1 fill-yellow-400" />
                      <span>{technician.rating || "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Mail className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                    <span className="truncate">{technician.email}</span>
                  </div>
                  {technician.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span>{technician.phone}</span>
                    </div>
                  )}
                  {technician.address && (
                    <div className="flex items-center text-sm">
                      <MapPin className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                      <span className="truncate">{technician.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Contract Type</p>
                    <p className="text-sm font-medium">{technician.contractType || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Position</p>
                    <p className="text-sm font-medium">{technician.position || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      Completed Jobs
                    </p>
                    <p className="text-sm font-medium">{technician.completedJobs || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center">
                      <XCircle className="h-3 w-3 mr-1 text-red-500" />
                      Cancelled Jobs
                    </p>
                    <p className="text-sm font-medium">{technician.cancelledJobs || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="text-sm font-medium">{formatCurrency(technician.totalRevenue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment</p>
                    <p className="text-sm font-medium">
                      {technician.paymentType === "percentage" 
                        ? `${technician.paymentRate}%` 
                        : formatHourlyRate(technician.paymentRate)}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 bg-muted/30 p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onEditTechnician) onEditTechnician(technician);
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TechniciansList;
