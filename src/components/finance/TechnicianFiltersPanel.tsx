
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import CompactTechnicianFilter from "./technician-filters/CompactTechnicianFilter";
import TechnicianCheckboxList from "./technician-filters/TechnicianCheckboxList";
import DateRangeFilter from "./technician-filters/DateRangeFilter";

interface TechnicianFiltersPanelProps {
  showFilters: boolean;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
  setShowFilters?: (show: boolean) => void;
  compact?: boolean;
}

const TechnicianFiltersPanel: React.FC<TechnicianFiltersPanelProps> = ({
  showFilters,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  date,
  setDate,
  selectAllTechnicians,
  deselectAllTechnicians,
  setShowFilters,
  compact = false
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
  
  if (compact) {
    return (
      <CompactTechnicianFilter 
        technicianNames={technicianNames}
        selectedTechnicians={selectedTechnicians}
        toggleTechnician={toggleTechnician}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        selectAllTechnicians={selectAllTechnicians}
        deselectAllTechnicians={deselectAllTechnicians}
      />
    );
  }
  
  if (!showFilters) return null;
  
  return (
    <Card className="mb-4 shadow-md border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Technician Filters</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
              Clear all
            </Button>
            {setShowFilters && (
              <Button variant="outline" size="icon" onClick={() => setShowFilters(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Filter by Technician</h3>
              <TechnicianCheckboxList 
                technicianNames={technicianNames}
                selectedTechnicians={selectedTechnicians}
                toggleTechnician={toggleTechnician}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                allSelected={allSelected}
                someSelected={someSelected}
                handleSelectAllChange={handleSelectAllChange}
              />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Filter by Date Range</h3>
              <DateRangeFilter date={date} setDate={setDate} />
            </div>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button size="sm" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TechnicianFiltersPanel;
