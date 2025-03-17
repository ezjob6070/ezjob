
import React, { useState } from "react";
import { FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import JobSourceCheckboxList from "@/components/finance/jobsource-filters/JobSourceCheckboxList";

interface JobSourceFilterProps {
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  selectAllJobSources?: () => void;
  deselectAllJobSources?: () => void;
}

const JobSourceFilter: React.FC<JobSourceFilterProps> = ({
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
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
        <Button variant="outline" className="gap-2">
          <FilterIcon className="h-4 w-4" />
          Job Sources {selectedJobSources.length > 0 && `(${selectedJobSources.length})`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-700">Filter by Job Source</h3>
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
      </PopoverContent>
    </Popover>
  );
};

export default JobSourceFilter;
