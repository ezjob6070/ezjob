
import React, { useState } from "react";
import { DateRange } from "react-day-picker";
import TechnicianCheckboxList from "./TechnicianCheckboxList";
import DateRangeFilter from "./DateRangeFilter";

interface FilterContentProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
}

const FilterContent: React.FC<FilterContentProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  date,
  setDate,
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
    </div>
  );
};

export default FilterContent;
