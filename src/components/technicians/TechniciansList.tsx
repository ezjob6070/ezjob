import React from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Star, Edit, Trash2 } from "lucide-react";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";

interface Technician {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  status: string;
  totalRevenue?: number;
  rating?: number;
  image?: string;
  initials: string;
}

interface TechniciansListProps {
  technicians: Technician[];
  displayMode: "card" | "table";
  displayedTechnicians: Technician[];
  getBadgeVariantFromStatus: (status: string) => string;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  displayMode, 
  displayedTechnicians, 
  getBadgeVariantFromStatus 
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <CompactTechnicianFilter 
        technicianNames={technicians.map(tech => tech.name)}
        selectedTechnicians={[]}
        toggleTechnician={() => {}}
        clearFilters={() => {}}
        applyFilters={() => {}}
      />

      {displayMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedTechnicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onSelect={() => navigate(`/technicians/${technician.id}`)}
            />
          ))}
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTechnicians.map((technician) => (
                <TableRow
                  key={technician.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => navigate(`/technicians/${technician.id}`)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={technician.image || ""} alt={technician.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {technician.image ? "" : technician.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{technician.name}</div>
                        <div className="text-xs text-muted-foreground">{technician.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{technician.specialty || "General"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getBadgeVariantFromStatus(technician.status)}
                      className="capitalize"
                    >
                      {technician.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(technician.totalRevenue || 0)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                      <span>{technician.rating || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/technicians/${technician.id}/edit`);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
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
