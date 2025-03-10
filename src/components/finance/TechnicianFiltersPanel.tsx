
import React from "react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import CompactTechnicianFilter from "./technician-filters/CompactTechnicianFilter";
import TechnicianCheckboxList from "./technician-filters/TechnicianCheckboxList";
import DateRangeFilter from "./technician-filters/DateRangeFilter";
import FilterPanelHeader from "./technician-filters/FilterPanelHeader";
import FilterActions from "./technician-filters/FilterActions";
import FilterContent from "./technician-filters/FilterContent";

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
        <FilterPanelHeader 
          title="Technician Filters" 
          clearFilters={clearFilters} 
          setShowFilters={setShowFilters} 
        />
        <FilterContent 
          technicianNames={technicianNames}
          selectedTechnicians={selectedTechnicians}
          toggleTechnician={toggleTechnician}
          date={date}
          setDate={setDate}
          selectAllTechnicians={selectAllTechnicians}
          deselectAllTechnicians={deselectAllTechnicians}
        />
        <FilterActions applyFilters={applyFilters} />
      </CardContent>
    </Card>
  );
};

export default TechnicianFiltersPanel;
