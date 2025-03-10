
import React from "react";
import TechnicianCard from "./TechnicianCard";
import { Technician } from "@/types/technician";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default TechniciansList;
