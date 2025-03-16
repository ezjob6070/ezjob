
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Check } from "lucide-react";
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
  deselectAllTechnicians,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const allSelected = 
    technicianNames.length > 0 && 
    technicianNames.every(tech => selectedTechnicians.includes(tech));
    
  const someSelected = 
    selectedTechnicians.length > 0 && 
    !allSelected;

  const handleSelectAllChange = () => {
    if (allSelected) {
      if (deselectAllTechnicians) {
        deselectAllTechnicians();
      } else {
        clearFilters();
      }
    } else {
      if (selectAllTechnicians) {
        selectAllTechnicians();
      } else {
        // Fallback if selectAllTechnicians isn't provided
        const allTechNames = technicianNames;
        allTechNames.forEach(tech => {
          if (!selectedTechnicians.includes(tech)) {
            toggleTechnician(tech);
          }
        });
      }
    }
  };

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`h-9 ${someSelected ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}`}
        >
          <Filter className="h-4 w-4 mr-2" />
          Technicians
          {selectedTechnicians.length > 0 && (
            <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-600">
              {selectedTechnicians.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <h4 className="font-medium">Filter Technicians</h4>
          
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
          
          <div className="flex justify-between pt-2 border-t">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                clearFilters();
                setSearchQuery("");
              }}
              disabled={selectedTechnicians.length === 0}
            >
              Clear
            </Button>
            <Button size="sm" onClick={handleApply} className="gap-1">
              <Check className="h-3.5 w-3.5" />
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompactTechnicianFilter;
