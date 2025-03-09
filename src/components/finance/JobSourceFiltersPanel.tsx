
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import JobSourceCheckboxList from "./jobsource-filters/JobSourceCheckboxList";
import DateRangeFilter from "./technician-filters/DateRangeFilter";
import CompactJobSourceFilter from "./jobsource-filters/CompactJobSourceFilter";

interface JobSourceFiltersPanelProps {
  showFilters: boolean;
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  selectAllJobSources?: () => void;
  deselectAllJobSources?: () => void;
  setShowFilters?: (show: boolean) => void;
  compact?: boolean;
}

const JobSourceFiltersPanel: React.FC<JobSourceFiltersPanelProps> = ({
  showFilters,
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  clearFilters,
  applyFilters,
  date,
  setDate,
  selectAllJobSources,
  deselectAllJobSources,
  setShowFilters,
  compact = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const allSelected = jobSourceNames.length > 0 && selectedJobSources.length === jobSourceNames.length;
  const someSelected = selectedJobSources.length > 0 && selectedJobSources.length < jobSourceNames.length;
  
  const handleSelectAllChange = () => {
    if (allSelected) {
      deselectAllJobSources?.();
    } else {
      selectAllJobSources?.();
    }
  };
  
  if (compact) {
    return (
      <CompactJobSourceFilter 
        jobSourceNames={jobSourceNames}
        selectedJobSources={selectedJobSources}
        toggleJobSource={toggleJobSource}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
        selectAllJobSources={selectAllJobSources}
        deselectAllJobSources={deselectAllJobSources}
      />
    );
  }
  
  if (!showFilters) return null;
  
  return (
    <Card className="mb-4 shadow-md border border-gray-200 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Job Source Filters</h3>
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
              <h3 className="text-sm font-bold text-gray-700 border-b pb-2">Filter by Job Source</h3>
              <JobSourceCheckboxList 
                jobSourceNames={jobSourceNames}
                selectedJobSources={selectedJobSources}
                toggleJobSource={toggleJobSource}
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

export default JobSourceFiltersPanel;
