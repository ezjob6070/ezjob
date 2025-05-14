
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Users, Filter } from "lucide-react";
import TechnicianFilter from "@/components/jobs/filters/TechnicianFilter";

interface CompactTechnicianFilterProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  appliedFilters?: boolean;
}

const CompactTechnicianFilter: React.FC<CompactTechnicianFilterProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  appliedFilters = false
}) => {
  const [open, setOpen] = useState(false);
  
  const handleSelectAll = () => {
    // Implementation would set all technicians as selected
    technicianNames.forEach(name => {
      if (!selectedTechnicians.includes(name)) {
        toggleTechnician(name);
      }
    });
  };
  
  const handleDeselectAll = () => {
    clearFilters();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant={selectedTechnicians.length > 0 ? "default" : "outline"} 
          size="sm"
          className="min-w-[160px] justify-start"
        >
          <Users className="h-4 w-4 mr-2" />
          {selectedTechnicians.length > 0 
            ? `${selectedTechnicians.length} Technicians` 
            : "All Technicians"}
          {selectedTechnicians.length > 0 && (
            <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-xs font-medium">
              {selectedTechnicians.length}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-0">
        <TechnicianFilter
          technicians={technicianNames}
          selectedNames={selectedTechnicians}
          onToggle={toggleTechnician}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          appliedFilters={appliedFilters}
        />
      </PopoverContent>
    </Popover>
  );
};

export default CompactTechnicianFilter;
