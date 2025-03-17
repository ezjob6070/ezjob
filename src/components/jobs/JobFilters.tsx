
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { JobFilterProps } from "./JobFilterTypes";
import SearchInput from "./filters/SearchInput";
import TechnicianFilter from "./filters/TechnicianFilter";
import DateFilter from "./filters/DateFilter";
import FiltersButton from "./filters/FiltersButton";
import ResetFiltersButton from "./filters/ResetFiltersButton";

const JobFilters = ({ filters, setFilters, technicians, resetFilters }: JobFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDateFilterChange = (value: typeof filters.dateFilter) => {
    updateFilter("dateFilter", value);
    // Reset custom date range if not using custom filter
    if (value !== "custom") {
      updateFilter("customDateRange", { from: undefined, to: undefined });
    }
  };

  // Format the current date filter selection for display
  const getDateFilterLabel = () => {
    switch(filters.dateFilter) {
      case "today": return "Today";
      case "tomorrow": return "Tomorrow";
      case "yesterday": return "Yesterday";
      case "thisWeek": return "This Week";
      case "nextWeek": return "Next Week";
      case "lastWeek": return "Last Week";
      case "thisMonth": return "This Month";
      case "lastMonth": return "Last Month";
      case "custom": 
        if (filters.customDateRange.from && filters.customDateRange.to) {
          return `${format(filters.customDateRange.from, "MMM d")} - ${format(filters.customDateRange.to, "MMM d")}`;
        }
        return "Custom Range";
      default: return "Today";
    }
  };

  // Convert technician objects to string array of names for the filter component
  const technicianNames = technicians.map(tech => tech.name);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        <SearchInput 
          searchTerm={filters.searchTerm} 
          updateFilter={updateFilter} 
        />
        
        <TechnicianFilter 
          technicians={technicianNames}
          selectedNames={[filters.technicianFilter]} 
          onToggle={(name) => updateFilter("technicianFilter", name)}
          onSelectAll={() => {}}
          onDeselectAll={() => updateFilter("technicianFilter", "")}
        />
        
        <DateFilter 
          dateFilter={filters.dateFilter}
          customDateRange={filters.customDateRange}
          updateFilter={updateFilter}
          handleDateFilterChange={handleDateFilterChange}
          getDateFilterLabel={getDateFilterLabel}
        />
        
        <FiltersButton 
          showFilters={showFilters} 
          setShowFilters={setShowFilters} 
        />
        <Button variant="outline">Export</Button>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="flex justify-end">
            <ResetFiltersButton resetFilters={resetFilters} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
