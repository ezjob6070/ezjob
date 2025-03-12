
import React, { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Search, UserPlus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import CategoryFilter from "@/components/finance/technician-filters/CategoryFilter";
import { Technician } from "@/types/technician";
import TechnicianSelectDropdown from "./filters/TechnicianSelectDropdown";
import TechnicianSearchBar from "./filters/TechnicianSearchBar";
import DateSortFilter from "./filters/DateSortFilter";

// Extended sort options
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
  searchQuery = "",
  onSearchChange,
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
        
        {/* Date range filter */}
        {setDate && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Department filter if available */}
        {departments.length > 0 && toggleDepartment && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="h-4 w-4" />
                Departments
                {selectedDepartments.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{selectedDepartments.length}</Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <div className="space-y-2">
                <div className="font-medium">Filter by Department</div>
                <Separator />
                <div className="h-48 overflow-y-auto space-y-1">
                  {departments.map((department) => (
                    <div key={department} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`department-${department}`} 
                        checked={selectedDepartments.includes(department)}
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
        
        {/* Advanced filters toggle */}
        <Button 
          variant="outline" 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="ml-auto"
        >
          {showAdvancedFilters ? "Hide Advanced Filters" : "Advanced Filters"}
        </Button>
      </div>
      
      {/* Advanced filters section */}
      {showAdvancedFilters && (
        <div className="bg-muted/30 p-4 rounded-md space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      )}
      
      {/* Search bar */}
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
