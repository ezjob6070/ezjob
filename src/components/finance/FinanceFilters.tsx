
import React from "react";
import { DateFilterType, FinanceFilters as FinanceFiltersType, FinanceFilterProps } from "./FinanceFilterTypes";
import SearchBar from "./filters/SearchBar";
import DateFilterTabs from "./filters/DateFilterTabs";
import JobSourceFilter from "./filters/JobSourceFilter";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

export const FinanceFilters: React.FC<FinanceFilterProps> = ({
  filters,
  setFilters,
  jobSources,
  resetFilters
}) => {
  // Handler for updating filter values
  const updateFilter = <K extends keyof FinanceFiltersType>(key: K, value: FinanceFiltersType[K]) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-0 md:flex-row items-start md:items-center justify-between">
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <SearchBar 
            searchTerm={filters.searchTerm} 
            onSearchChange={(value) => updateFilter('searchTerm', value)}
            hidden={false}
          />
        </div>
        <div className="flex-grow md:flex-grow-0 md:w-48">
          <JobSourceFilter 
            value={filters.jobSourceFilter} 
            onChange={(value) => updateFilter('jobSourceFilter', value)} 
            jobSources={jobSources} 
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <DateFilterTabs 
          selectedFilter={filters.dateFilter}
          onFilterChange={(filter: DateFilterType) => updateFilter('dateFilter', filter)}
          customDateRange={filters.customDateRange}
          onCustomDateChange={(range) => updateFilter('customDateRange', range)}
        />
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetFilters}
          className="flex gap-2 items-center mt-4 md:mt-0"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
};
