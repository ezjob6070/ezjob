
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus, Filter, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import DateRangeSelector from "@/components/finance/DateRangeSelector";

import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import { Technician } from "@/types/technician";
import TechnicianSelectDropdown from "./filters/TechnicianSelectDropdown";
import DateSortFilter from "./filters/DateSortFilter";

// Define extended sort options
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "revenue-high" | "revenue-low";

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
  sortOption?: SortOption;
  onSortChange?: (option: SortOption) => void;
  date?: DateRange | undefined;
  setDate?: (date: DateRange | undefined) => void;
  departments?: string[];
  selectedDepartments?: string[];
  toggleDepartment?: (department: string) => void;
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
  sortOption = "newest",
  onSortChange,
  date,
  setDate,
  departments = [],
  selectedDepartments = [],
  toggleDepartment
}) => {
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = React.useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Create safe copies of arrays to prevent "undefined is not iterable" errors
  const safeDepartments = departments || [];
  const safeSelectedDepartments = selectedDepartments || [];
  
  return (
    <div className="space-y-4 w-full">
      {/* Top row with main filters */}
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
            <SelectItem value="onLeave">On Leave</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Date filter - simplified */}
        {setDate && date && (
          <div className="w-[220px]">
            <DateRangeSelector date={date} setDate={setDate} />
          </div>
        )}

        {/* Department filter if available */}
        {safeDepartments.length > 0 && toggleDepartment && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Departments
                {safeSelectedDepartments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{safeSelectedDepartments.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="start" side="bottom" avoidCollisions={false}>
              <div className="space-y-2">
                <div className="font-medium">Filter by Department</div>
                <Separator />
                <div className="h-48 overflow-y-auto space-y-1">
                  {safeDepartments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`department-${department}`} 
                        checked={safeSelectedDepartments.includes(department)}
                        onCheckedChange={() => toggleDepartment(department)}
                      />
                      <Label htmlFor={`department-${department}`} className="cursor-pointer">{department}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Enhanced date/name/revenue sort filter */}
        {onSortChange && (
          <DateSortFilter
            sortOption={sortOption}
            onSortChange={onSortChange}
          />
        )}
        
        {/* Simplified Technician dropdown that only shows the list */}
        {technicians.length > 0 && onTechnicianToggle && (
          <TechnicianSelectDropdown
            technicians={technicians}
            selectedTechnicians={selectedTechnicians}
            onTechnicianToggle={onTechnicianToggle}
            dropdownOpen={technicianDropdownOpen}
            setDropdownOpen={setTechnicianDropdownOpen}
          />
        )}
        
        {/* Advanced filters toggle */}
        <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="ml-auto gap-2"
            >
              <Filter className="h-4 w-4" />
              Advanced Filters
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end" side="bottom" avoidCollisions={false}>
            <div className="space-y-4">
              <div className="font-medium">Advanced Filters</div>
              <Separator />
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Experience Level</h3>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="exp-all" />
                      <Label htmlFor="exp-all">All Levels</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="junior" id="exp-junior" />
                      <Label htmlFor="exp-junior">Junior (0-2 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mid" id="exp-mid" />
                      <Label htmlFor="exp-mid">Mid-Level (2-5 years)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="senior" id="exp-senior" />
                      <Label htmlFor="exp-senior">Senior (5+ years)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Payment Type</h3>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="payment-percentage" />
                      <Label htmlFor="payment-percentage">Percentage</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="payment-flat" />
                      <Label htmlFor="payment-flat">Flat Rate</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="payment-hourly" />
                      <Label htmlFor="payment-hourly">Hourly</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Rating</h3>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="rating-all" />
                      <Label htmlFor="rating-all">All Ratings</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="rating-5" />
                      <Label htmlFor="rating-5">5 Stars</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4+" id="rating-4" />
                      <Label htmlFor="rating-4">4+ Stars</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3+" id="rating-3" />
                      <Label htmlFor="rating-3">3+ Stars</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TechnicianFilters;
