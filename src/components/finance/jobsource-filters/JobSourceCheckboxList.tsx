
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface JobSourceCheckboxListProps {
  jobSourceNames: string[];
  selectedJobSources: string[];
  toggleJobSource: (sourceName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAllChange: () => void;
  compact?: boolean;
}

const JobSourceCheckboxList: React.FC<JobSourceCheckboxListProps> = ({
  jobSourceNames,
  selectedJobSources,
  toggleJobSource,
  searchQuery,
  setSearchQuery,
  allSelected,
  someSelected,
  handleSelectAllChange,
  compact = false
}) => {
  const filteredJobSources = jobSourceNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const idPrefix = compact ? "source-compact-" : "source-";
  const selectAllId = compact ? "select-all-sources-compact" : "select-all-sources";

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search job sources..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
        <Checkbox 
          id={selectAllId} 
          checked={allSelected}
          data-state={someSelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
          onCheckedChange={handleSelectAllChange}
        />
        <label 
          htmlFor={selectAllId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select All Job Sources
        </label>
      </div>
      
      <div className={`${compact ? "max-h-52" : "max-h-40"} overflow-y-auto pt-2 ${compact ? "space-y-1" : ""}`}>
        {filteredJobSources.map((sourceName) => (
          <div key={sourceName} className={`flex items-center space-x-2 ${compact ? "py-1" : "py-1.5"}`}>
            <Checkbox 
              id={`${idPrefix}${sourceName}`} 
              checked={selectedJobSources.includes(sourceName)}
              onCheckedChange={() => toggleJobSource(sourceName)}
            />
            <label 
              htmlFor={`${idPrefix}${sourceName}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {sourceName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobSourceCheckboxList;
