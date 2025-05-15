
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { 
  FinanceFilterProps, 
  DateFilterType, 
  DateFilterCategory 
} from "./FinanceFilterTypes";
import SearchBar from "./filters/SearchBar";
import JobSourceFilter from "./filters/JobSourceFilter";
import DateFilterTabs from "./filters/DateFilterTabs";

const FinanceFilters = ({ filters, setFilters, jobSources, resetFilters }: FinanceFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateCategory, setDateCategory] = useState<DateFilterCategory>("current");

  const updateFilter = <K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleDateFilterChange = (value: DateFilterType) => {
    updateFilter("dateFilter", value);
    // Reset custom date range if not using custom filter
    if (value !== "custom") {
      updateFilter("customDateRange", { from: undefined, to: undefined });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap md:flex-nowrap">
        {/* Search bar hidden */}
        <SearchBar 
          searchTerm={filters.searchTerm}
          updateFilter={updateFilter}
          hidden={true}
        />
        
        <JobSourceFilter 
          jobSourceFilter={filters.jobSourceFilter}
          jobSources={jobSources}
          updateFilter={updateFilter}
        />
        
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
        <Button variant="outline">Export</Button>
      </div>
      
      {showFilters && (
        <div className="p-4 border rounded-md space-y-4">
          <div className="space-y-4">
            <DateFilterTabs 
              dateCategory={dateCategory}
              setDateCategory={setDateCategory}
              dateFilter={filters.dateFilter}
              customDateRange={filters.customDateRange}
              handleDateFilterChange={handleDateFilterChange}
              updateFilter={updateFilter}
            />
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters} className="gap-2">
              <X className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceFilters;
