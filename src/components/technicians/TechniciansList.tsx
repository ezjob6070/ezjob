
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/components/dashboard/DashboardUtils";
import { Star, Edit, Trash2, LayoutGrid, List } from "lucide-react";
import CompactTechnicianFilter from "@/components/finance/technician-filters/CompactTechnicianFilter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
}

interface TechniciansListProps {
  technicians: Technician[];
  displayMode?: "card" | "table";
  selectedTechnicians?: string[];
  onToggleSelect?: (technicianId: string) => void;
  onEditTechnician?: (technician: Technician) => void;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  displayMode: initialDisplayMode = "table",
  selectedTechnicians = [],
  onToggleSelect,
  onEditTechnician
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
      default:
        return "default" as const;
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
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={technician.imageUrl || ""} alt={technician.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {technician.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{technician.name}</h3>
                    <p className="text-sm text-muted-foreground">{technician.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Specialty</p>
                    <p>{technician.specialty || "General"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={getBadgeVariantFromStatus(technician.status)}
                      className="capitalize"
                    >
                      {technician.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p>{formatCurrency(technician.totalRevenue || 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                      <span>{technician.rating || "N/A"}</span>
                    </div>
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
                          if (onEditTechnician) onEditTechnician(technician);
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
