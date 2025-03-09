
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TechnicianCheckboxList from "./TechnicianCheckboxList";

interface CompactTechnicianFilterProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
}

const CompactTechnicianFilter: React.FC<CompactTechnicianFilterProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  selectAllTechnicians,
  deselectAllTechnicians
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const allSelected = technicianNames.length > 0 && selectedTechnicians.length === technicianNames.length;
  const someSelected = selectedTechnicians.length > 0 && selectedTechnicians.length < technicianNames.length;
  
  const handleSelectAllChange = () => {
    if (allSelected) {
      deselectAllTechnicians?.();
    } else {
      selectAllTechnicians?.();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 gap-2"
        >
          <Users className="h-4 w-4" />
          <span>Technicians</span>
          <span className="ml-1 rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-semibold text-blue-600">
            {selectedTechnicians.length || "All"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 space-y-3">
          <TechnicianCheckboxList 
            technicianNames={technicianNames}
            selectedTechnicians={selectedTechnicians}
            toggleTechnician={toggleTechnician}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allSelected={allSelected}
            someSelected={someSelected}
            handleSelectAllChange={handleSelectAllChange}
            compact={true}
          />
          
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompactTechnicianFilter;
