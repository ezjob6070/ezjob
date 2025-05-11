import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { Technician } from "@/types/technician";
import CategoryFilter from "./filters/CategoryFilter";
import DepartmentFilter from "./filters/DepartmentFilter";
import StatusFilter from "./filters/StatusFilter";
import DateRangeFilter from "./filters/DateRangeFilter";
import SortFilter from "./filters/SortFilter";
import { SortOption } from "@/types/sortOptions";
import RoleFilter from "./filters/RoleFilter";
import ContractorSubRoleFilter from "./filters/ContractorSubRoleFilter";
import SalesmanSubRoleFilter from "./filters/SalesmanSubRoleFilter";
import EmployedSubRoleFilter from "./filters/EmployedSubRoleFilter";
import TechnicianSubRoleFilter from "./filters/TechnicianSubRoleFilter";

interface TechnicianFiltersProps {
  categories: string[];
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  addCategory: (category: string) => void;
  status: string;
  onStatusChange: (status: string) => void;
  technicians: Technician[];
  selectedTechnicians: string[];
  onTechnicianToggle: (techId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  departments: string[];
  selectedDepartments: string[];
  toggleDepartment: (department: string) => void;
  roleFilter: string;
  onRoleChange: (role: string) => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
}

const TechnicianFilters: React.FC<TechnicianFiltersProps> = ({
  categories,
  selectedCategories,
  toggleCategory,
  addCategory,
  status,
  onStatusChange,
  sortOption,
  onSortChange,
  date,
  setDate,
  departments,
  selectedDepartments,
  toggleDepartment,
  roleFilter,
  onRoleChange,
  setSelectedCategories,
  setSelectedDepartments
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubRoles, setSelectedSubRoles] = useState<string[]>([]);

  const hasActiveFilters = 
    selectedCategories.length > 0 || 
    status !== "all" || 
    selectedDepartments.length > 0 ||
    date !== undefined ||
    roleFilter !== "all" ||
    selectedSubRoles.length > 0;

  const handleClearFilters = () => {
    onStatusChange("all");
    onRoleChange("all");
    setSelectedSubRoles([]);
    setSelectedCategories([]);
    setSelectedDepartments([]);
    setDate(undefined);
  };

  const toggleSubRole = (subRole: string) => {
    setSelectedSubRoles(prev => {
      if (prev.includes(subRole)) {
        return prev.filter(sr => sr !== subRole);
      } else {
        return [...prev, subRole];
      }
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategories.length > 0) count += 1;
    if (status !== "all") count += 1;
    if (selectedDepartments.length > 0) count += 1;
    if (date !== undefined) count += 1;
    if (roleFilter !== "all") count += 1;
    if (selectedSubRoles.length > 0) count += 1;
    return count;
  };

  // Determine which sub-role filter to show based on the selected role
  const renderSubRoleFilter = () => {
    switch (roleFilter) {
      case "contractor":
        return (
          <ContractorSubRoleFilter
            selectedSubRoles={selectedSubRoles}
            onToggleSubRole={toggleSubRole}
          />
        );
      case "salesman":
        return (
          <SalesmanSubRoleFilter
            selectedSubRoles={selectedSubRoles}
            onToggleSubRole={toggleSubRole}
          />
        );
      case "employed":
        return (
          <EmployedSubRoleFilter
            selectedSubRoles={selectedSubRoles}
            onToggleSubRole={toggleSubRole}
          />
        );
      case "technician":
        return (
          <TechnicianSubRoleFilter
            selectedSubRoles={selectedSubRoles}
            onToggleSubRole={toggleSubRole}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-10 border-dashed">
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge className="ml-2 rounded-full px-1 py-0.5 text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filters</h4>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={handleClearFilters} className="h-auto p-0">
                  <X className="h-3 w-3 mr-1" /> Clear
                </Button>
              )}
            </div>
            
            <RoleFilter
              selected={roleFilter}
              onSelect={onRoleChange}
            />

            {roleFilter !== "all" && renderSubRoleFilter()}
            
            <Separator />
            
            <StatusFilter 
              selected={status}
              onSelect={onStatusChange}
            />
            
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              toggleCategory={toggleCategory}
              addCategory={addCategory}
            />
            
            <DepartmentFilter
              departments={departments}
              selectedDepartments={selectedDepartments}
              toggleDepartment={toggleDepartment}
            />
            
            <DateRangeFilter
              date={date}
              setDate={setDate}
            />

            <SortFilter 
              selected={sortOption}
              onSelect={onSortChange}
            />
          </div>
        </PopoverContent>
      </Popover>

      {/* Display active filters */}
      <div className="flex flex-wrap gap-2">
        {roleFilter !== "all" && (
          <Badge variant="secondary" className="py-1 px-3">
            Role: {roleFilter}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => onRoleChange("all")}
            />
          </Badge>
        )}
        
        {selectedSubRoles.length > 0 && roleFilter !== "all" && (
          <Badge variant="secondary" className="py-1 px-3">
            {roleFilter === "technician" && "Specialties: "}
            {roleFilter === "salesman" && "Sales Positions: "}
            {roleFilter === "employed" && "Staff Positions: "}
            {roleFilter === "contractor" && "Contractor Types: "}
            {selectedSubRoles.length}
            <X 
              className="h-3 w-3 ml-1 cursor-pointer" 
              onClick={() => setSelectedSubRoles([])}
            />
          </Badge>
        )}
        
        {status !== "all" && (
          <Badge variant="secondary" className="py-1 px-3">
            Status: {status}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => onStatusChange("all")}
            />
          </Badge>
        )}
        {selectedCategories.length > 0 && (
          <Badge variant="secondary" className="py-1 px-3">
            Categories: {selectedCategories.length}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => setSelectedCategories([])}
            />
          </Badge>
        )}
        {selectedDepartments.length > 0 && (
          <Badge variant="secondary" className="py-1 px-3">
            Departments: {selectedDepartments.length}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => setSelectedDepartments([])}
            />
          </Badge>
        )}
        {date && date.from && date.to && (
          <Badge variant="secondary" className="py-1 px-3">
            Date: {date.from.toLocaleDateString()} - {date.to.toLocaleDateString()}
            <X
              className="h-3 w-3 ml-1 cursor-pointer"
              onClick={() => setDate(undefined)}
            />
          </Badge>
        )}
      </div>
    </div>
  );
};

export default TechnicianFilters;
