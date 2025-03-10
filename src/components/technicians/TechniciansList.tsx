
import React, { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import { Technician } from "@/types/technician";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Grid2X2, List } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

interface TechniciansListProps {
  technicians: Technician[];
  onEditTechnician: (technician: Technician) => void;
  onAddTechnician?: () => void;
  selectedTechnicians?: string[];
  onToggleSelect?: (technicianId: string) => void;
}

const TechniciansList: React.FC<TechniciansListProps> = ({ 
  technicians, 
  onEditTechnician,
  onAddTechnician,
  selectedTechnicians = [],
  onToggleSelect
}) => {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Format number as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* View toggle buttons */}
      <div className="flex justify-end">
        <div className="flex gap-1">
          <Button 
            variant={viewMode === "cards" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("cards")}
          >
            <Grid2X2 className="h-4 w-4" />
            <span className="sr-only">Card view</span>
          </Button>
          <Button 
            variant={viewMode === "table" ? "default" : "outline"} 
            size="icon"
            onClick={() => setViewMode("table")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">Table view</span>
          </Button>
        </div>
      </div>
      
      {/* Selected technicians display */}
      {selectedTechnicians.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
          <div className="mr-2 font-medium text-sm flex items-center">Selected:</div>
          {selectedTechnicians.map(techId => {
            const tech = technicians.find(t => t.id === techId);
            return tech ? (
              <Badge 
                key={tech.id} 
                variant="secondary" 
                className="flex items-center gap-1 px-2 py-1"
              >
                {tech.name}
                {onToggleSelect && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-4 w-4 p-0 ml-1" 
                    onClick={() => onToggleSelect(tech.id)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
              </Badge>
            ) : null;
          })}
        </div>
      )}
      
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((technician) => (
            <TechnicianCard
              key={technician.id}
              technician={technician}
              onEdit={() => onEditTechnician(technician)}
              isSelected={selectedTechnicians.includes(technician.id)}
              onToggleSelect={onToggleSelect ? () => onToggleSelect(technician.id) : undefined}
            />
          ))}
          
          {technicians.length === 0 && (
            <div className="col-span-3 p-4 text-center text-muted-foreground">
              No technicians found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Technician</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.length > 0 ? (
                technicians.map((technician) => (
                  <TableRow key={technician.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          {technician.image && (
                            <AvatarImage src={technician.image} alt={technician.name} />
                          )}
                          <AvatarFallback className="bg-indigo-100 text-indigo-600">
                            {technician.name.split(' ').map(part => part[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{technician.name}</div>
                          <div className="text-sm text-muted-foreground">{technician.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{technician.specialty}</TableCell>
                    <TableCell>
                      <Badge variant={technician.status === "active" ? "default" : "secondary"}>
                        {technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {technician.startDate ? format(new Date(technician.startDate), "MMM d, yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>{formatCurrency(technician.totalRevenue || 0)}</TableCell>
                    <TableCell>{technician.rating ? `${technician.rating}/5` : "N/A"}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => onEditTechnician(technician)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No technicians found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default TechniciansList;
