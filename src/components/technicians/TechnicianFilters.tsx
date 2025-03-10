
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import { Technician } from "@/types/technician";
import TechnicianSelectDropdown from "./filters/TechnicianSelectDropdown";
import TechnicianSearchBar from "./filters/TechnicianSearchBar";

interface TechnicianFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  technicians?: Technician[];
  selectedTechnicians?: string[];
  onTechnicianToggle?: (technicianId: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

const TechnicianFilters: React.FC<TechnicianFiltersProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory,
  status,
  onStatusChange,
  technicians = [],
  selectedTechnicians = [],
  onTechnicianToggle,
  searchQuery = "",
  onSearchChange
}) => {
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = React.useState(false);

  return (
    <div className="space-y-4 w-full">
      {/* Top row with all filters aligned */}
      <div className="flex flex-wrap items-center gap-2">
        <CategoryFilter 
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          addCategory={addCategory}
        />
        
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Multi-select Technician dropdown */}
        {technicians.length > 0 && onTechnicianToggle && (
          <TechnicianSelectDropdown
            technicians={technicians}
            selectedTechnicians={selectedTechnicians}
            onTechnicianToggle={onTechnicianToggle}
            dropdownOpen={technicianDropdownOpen}
            setDropdownOpen={setTechnicianDropdownOpen}
          />
        )}
      </div>
      
      {/* Search bar in a second row */}
      {onSearchChange && (
        <TechnicianSearchBar
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      )}
    </div>
  );
};

export default TechnicianFilters;
