
import React from "react";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import TechnicianFiltersPanel from "@/components/finance/TechnicianFiltersPanel";
import CompactDateRangeSelector from "@/components/finance/CompactDateRangeSelector";

interface TechnicianDashboardHeaderProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  selectAllTechnicians: () => void;
  deselectAllTechnicians: () => void;
  appliedFilters: boolean;
  filteredTechnicians: Technician[];
  activeTechnicians: Technician[];
}

const TechnicianDashboardHeader: React.FC<TechnicianDashboardHeaderProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  categories,
  selectedCategories,
  toggleCategory,
  addCategory,
  clearFilters,
  applyFilters,
  date,
  setDate,
  selectAllTechnicians,
  deselectAllTechnicians,
  appliedFilters,
  filteredTechnicians,
  activeTechnicians
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex flex-wrap items-center gap-2">
        <CategoryFilter 
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          categories={categories}
          addCategory={addCategory}
        />
        
        <TechnicianFiltersPanel 
          showFilters={true}
          technicianNames={technicianNames}
          selectedTechnicians={selectedTechnicians}
          toggleTechnician={toggleTechnician}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          date={date}
          setDate={setDate}
          selectAllTechnicians={selectAllTechnicians}
          deselectAllTechnicians={deselectAllTechnicians}
          compact={true}
        />
        
        <CompactDateRangeSelector date={date} setDate={setDate} />
      </div>
      
      {(selectedTechnicians.length > 0 || selectedCategories.length > 0) && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredTechnicians.length} of {activeTechnicians.length} technicians
        </div>
      )}
    </div>
  );
};

export default TechnicianDashboardHeader;
