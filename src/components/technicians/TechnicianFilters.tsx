
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

import { Technician } from "@/types/technician";
import TechnicianSelectDropdown from "./filters/TechnicianSelectDropdown";
import DateSortFilter from "./filters/DateSortFilter";
import SubRoleFilter from "./filters/SubRoleFilter";

// Define extended sort options
type SortOption = "newest" | "oldest" | "name-asc" | "name-desc" | "revenue-high" | "revenue-low";

interface TechnicianFiltersProps {
  categories?: string[];
  selectedCategories?: string[];
  toggleCategory?: (category: string) => void;
  addCategory?: (category: string) => void;
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
  roleFilter?: string;
  onRoleChange?: (role: string) => void;
}

const TechnicianFilters: React.FC<TechnicianFiltersProps> = ({
  status,
  onStatusChange,
  technicians = [],
  selectedTechnicians = [],
  onTechnicianToggle,
  sortOption = "newest",
  onSortChange,
  date,
  setDate,
  roleFilter = "all",
  onRoleChange
}) => {
  const [technicianDropdownOpen, setTechnicianDropdownOpen] = React.useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedSubRole, setSelectedSubRole] = useState<string | null>(null);
  
  // Get available sub-roles based on selected role
  const getSubRolesForRole = (role: string) => {
    switch(role) {
      case "technician":
        return ["HVAC", "Plumbing", "Electrical", "General", "Carpentry"];
      case "salesman":
        return ["Inside Sales", "Outside Sales", "Account Manager", "Sales Support"];
      case "employed":
        return ["Secretary", "Management", "HR", "Finance", "Administration", "Operations"];
      case "contractor":
        return ["Independent", "Agency", "Specialized", "Consultant"];
      default:
        return [];
    }
  };
  
  const availableSubRoles = roleFilter !== "all" ? getSubRolesForRole(roleFilter) : [];
  
  return (
    <div className="space-y-4 w-full">
      {/* Top row with main filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Role filter */}
        {onRoleChange && (
          <Select value={roleFilter} onValueChange={(value) => {
            onRoleChange(value);
            setSelectedSubRole(null); // Reset sub-role when main role changes
          }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="technician">Technicians</SelectItem>
              <SelectItem value="salesman">Salesmen</SelectItem>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="contractor">Contractors</SelectItem>
            </SelectContent>
          </Select>
        )}
        
        {/* Sub-role filter - only visible when a role is selected */}
        {roleFilter !== "all" && availableSubRoles.length > 0 && (
          <SubRoleFilter 
            subRoles={availableSubRoles}
            selectedSubRole={selectedSubRole}
            onSubRoleChange={setSelectedSubRole}
          />
        )}
        
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
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
