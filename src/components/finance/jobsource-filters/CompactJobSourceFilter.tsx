
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, ChevronDown } from "lucide-react";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import JobSourceCheckboxList from "./JobSourceCheckboxList";

interface CompactJobSourceFilterProps {
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  selectAllJobSources?: () => void;
  deselectAllJobSources?: () => void;
}

const CompactJobSourceFilter: React.FC<CompactJobSourceFilterProps> = ({
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  clearFilters,
  applyFilters,
  selectAllJobSources,
  deselectAllJobSources
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

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-auto justify-between px-3 py-5 text-base font-medium"
        >
          <Briefcase className="mr-2 h-4 w-4" />
          <span>
            {selectedJobSources.length === 0 ? "All Job Sources" : 
              selectedJobSources.length === 1 ? `${selectedJobSources[0]}` :
              `${selectedJobSources.length} Job Sources`}
          </span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="p-3 space-y-3">
          <JobSourceCheckboxList 
            jobSourceNames={jobSourceNames}
            selectedJobSources={selectedJobSources}
            toggleJobSource={toggleJobSource}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            allSelected={allSelected}
            someSelected={someSelected}
            handleSelectAllChange={handleSelectAllChange}
            compact={true}
          />
          
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
            <Button size="sm" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CompactJobSourceFilter;
