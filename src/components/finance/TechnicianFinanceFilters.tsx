
import React from "react";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TechnicianFiltersPanel from "./TechnicianFiltersPanel";

interface TechnicianFinanceFiltersProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectAllTechnicians?: () => void;
  deselectAllTechnicians?: () => void;
  jobStatus?: string;
  onJobStatusChange?: (status: string) => void;
}

const TechnicianFinanceFilters: React.FC<TechnicianFinanceFiltersProps> = ({
  showFilters,
  setShowFilters,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  date,
  setDate,
  selectAllTechnicians,
  deselectAllTechnicians,
  jobStatus = "all",
  onJobStatusChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TechnicianFiltersPanel
          showFilters={showFilters}
          technicianNames={technicianNames}
          selectedTechnicians={selectedTechnicians}
          toggleTechnician={toggleTechnician}
          clearFilters={clearFilters}
          applyFilters={applyFilters}
          date={date}
          setDate={setDate}
          selectAllTechnicians={selectAllTechnicians}
          deselectAllTechnicians={deselectAllTechnicians}
          setShowFilters={setShowFilters}
          compact={true}
        />
        
        {/* Job Status Filter */}
        {onJobStatusChange && (
          <Select value={jobStatus} onValueChange={onJobStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default TechnicianFinanceFilters;
