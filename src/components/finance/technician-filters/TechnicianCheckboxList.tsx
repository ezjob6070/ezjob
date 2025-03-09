
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface TechnicianCheckboxListProps {
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (techName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAllChange: () => void;
  compact?: boolean;
}

const TechnicianCheckboxList: React.FC<TechnicianCheckboxListProps> = ({
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  searchQuery,
  setSearchQuery,
  allSelected,
  someSelected,
  handleSelectAllChange,
  compact = false
}) => {
  const filteredTechnicians = technicianNames.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const idPrefix = compact ? "tech-compact-" : "tech-";
  const selectAllId = compact ? "select-all-technicians-compact" : "select-all-technicians";

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search technicians..."
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
          Select All Technicians
        </label>
      </div>
      
      <div className={`${compact ? "max-h-52" : "max-h-40"} overflow-y-auto pt-2 ${compact ? "space-y-1" : ""}`}>
        {filteredTechnicians.map((techName) => (
          <div key={techName} className={`flex items-center space-x-2 ${compact ? "py-1" : "py-1.5"}`}>
            <Checkbox 
              id={`${idPrefix}${techName}`} 
              checked={selectedTechnicians.includes(techName)}
              onCheckedChange={() => toggleTechnician(techName)}
            />
            <label 
              htmlFor={`${idPrefix}${techName}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {techName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechnicianCheckboxList;
