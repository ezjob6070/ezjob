
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import { Button } from "@/components/ui/button";
import { UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Technician } from "@/types/technician";

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
  const [technicianFilterQuery, setTechnicianFilterQuery] = React.useState("");
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = React.useState(false);

  // Filter technicians for the dropdown based on filter query
  const filteredTechniciansForDropdown = technicians.filter(tech => 
    !technicianFilterQuery || 
    tech.name.toLowerCase().includes(technicianFilterQuery.toLowerCase()) ||
    (tech.email && tech.email.toLowerCase().includes(technicianFilterQuery.toLowerCase())) ||
    (tech.phone && tech.phone.toLowerCase().includes(technicianFilterQuery.toLowerCase()))
  );
  
  const clearSelectedTechnicians = () => {
    if (onTechnicianToggle) {
      selectedTechnicians.forEach(id => onTechnicianToggle(id));
    }
  };

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
        
        {/* Technician selection dropdown */}
        {technicians.length > 0 && onTechnicianToggle && (
          <DropdownMenu open={technicianDropdownOpen} onOpenChange={setTechnicianDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 h-10">
                <UserCheck className="h-4 w-4" />
                {selectedTechnicians.length === 0 
                  ? "Select Technicians" 
                  : `${selectedTechnicians.length} Selected`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2" align="start">
              <div className="mb-2">
                <Input
                  placeholder="Find technician..."
                  className="w-full"
                  value={technicianFilterQuery}
                  onChange={(e) => setTechnicianFilterQuery(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto">
                {filteredTechniciansForDropdown.map((tech) => (
                  <DropdownMenuCheckboxItem
                    key={tech.id}
                    checked={selectedTechnicians.includes(tech.id)}
                    onCheckedChange={() => onTechnicianToggle(tech.id)}
                  >
                    {tech.name}
                  </DropdownMenuCheckboxItem>
                ))}
                {filteredTechniciansForDropdown.length === 0 && (
                  <div className="py-2 px-2 text-sm text-gray-500">No technicians found</div>
                )}
              </div>
              {selectedTechnicians.length > 0 && (
                <div className="pt-2 mt-2 border-t border-gray-200">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-center text-xs"
                    onClick={clearSelectedTechnicians}
                  >
                    Clear selection
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      {/* Search bar in a second row */}
      {onSearchChange && (
        <div className="w-full">
          <Input
            placeholder="Search technicians by name, email, or phone..."
            className="w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default TechnicianFilters;
