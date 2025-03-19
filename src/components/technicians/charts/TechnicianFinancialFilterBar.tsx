
import React from "react";
import { SortOption } from "@/hooks/useTechniciansData";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Filter, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";
import TechnicianDateFilter from "@/components/technicians/filters/TechnicianDateFilter";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  technicianNames: string[];
  selectedTechnicians: string[];
  toggleTechnician: (name: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  paymentTypeFilter: string;
  setPaymentTypeFilter: (filter: string) => void;
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange,
  technicianNames,
  selectedTechnicians,
  toggleTechnician,
  clearFilters,
  applyFilters,
  paymentTypeFilter,
  setPaymentTypeFilter,
  localDateRange,
  setLocalDateRange,
  showDateFilter,
  setShowDateFilter
}) => {
  const [showTechnicianFilter, setShowTechnicianFilter] = React.useState(false);
  const [techSearchQuery, setTechSearchQuery] = React.useState("");

  const filteredTechnicianNames = technicianNames.filter(name =>
    name.toLowerCase().includes(techSearchQuery.toLowerCase())
  );
  
  const toggleAllTechnicians = (checked: boolean) => {
    if (checked) {
      technicianNames.forEach(tech => {
        if (!selectedTechnicians.includes(tech)) {
          toggleTechnician(tech);
        }
      });
    } else {
      selectedTechnicians.forEach(tech => {
        toggleTechnician(tech);
      });
    }
  };

  const allTechniciansSelected = technicianNames.length > 0 && 
    technicianNames.every(tech => selectedTechnicians.includes(tech));
  
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-b">
      {/* Date Range Filter */}
      <TechnicianDateFilter 
        localDateRange={localDateRange}
        setLocalDateRange={setLocalDateRange}
        showDateFilter={showDateFilter}
        setShowDateFilter={setShowDateFilter}
        clearFilters={clearFilters}
        applyFilters={applyFilters}
      />
      
      {/* Technician Filter */}
      <Popover open={showTechnicianFilter} onOpenChange={setShowTechnicianFilter}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
            <UserPlus className="h-4 w-4 mr-2 text-gray-500" />
            {selectedTechnicians.length > 0 
              ? `${selectedTechnicians.length} technicians` 
              : "Filter Technicians"}
            {selectedTechnicians.length > 0 && (
              <Badge variant="secondary" className="ml-1">{selectedTechnicians.length}</Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-3">
            <div className="pb-2 mb-2 border-b">
              <Input
                placeholder="Search technicians..."
                value={techSearchQuery}
                onChange={(e) => setTechSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="flex items-center space-x-2 py-1">
                <Checkbox 
                  id="select-all-techs"
                  checked={allTechniciansSelected}
                  onCheckedChange={toggleAllTechnicians}
                />
                <label 
                  htmlFor="select-all-techs"
                  className="text-sm font-medium cursor-pointer"
                >
                  Select All Technicians
                </label>
              </div>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {filteredTechnicianNames.map(tech => (
                <div key={tech} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`tech-${tech}`} 
                    checked={selectedTechnicians.includes(tech)}
                    onCheckedChange={() => toggleTechnician(tech)}
                  />
                  <label 
                    htmlFor={`tech-${tech}`}
                    className="text-sm cursor-pointer"
                  >
                    {tech}
                  </label>
                </div>
              ))}
              {filteredTechnicianNames.length === 0 && (
                <div className="text-sm text-muted-foreground py-2">No technicians found</div>
              )}
            </div>
          </div>
          <div className="border-t p-3 flex justify-between">
            <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
            <Button variant="default" size="sm" onClick={() => {
              applyFilters();
              setShowTechnicianFilter(false);
            }}>Apply</Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Payment Type Filter */}
      <Select value={paymentTypeFilter} onValueChange={setPaymentTypeFilter}>
        <SelectTrigger className="w-[180px] bg-white border-gray-200 text-gray-700">
          <SelectValue placeholder="Payment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payment Types</SelectItem>
          <SelectItem value="percentage">Percentage Based</SelectItem>
          <SelectItem value="flat">Flat Rate</SelectItem>
          <SelectItem value="hourly">Hourly</SelectItem>
        </SelectContent>
      </Select>
      
      {/* Sort Order Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto gap-2 bg-white border-gray-200 text-gray-700">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            {sortOption === "revenue-high" && "Revenue: High to Low"}
            {sortOption === "revenue-low" && "Revenue: Low to High"}
            {sortOption === "name-asc" && "Name: A to Z"}
            {sortOption === "name-desc" && "Name: Z to A"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => onSortChange("revenue-high")} className={sortOption === "revenue-high" ? "bg-secondary" : ""}>
            Revenue: High to Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("revenue-low")} className={sortOption === "revenue-low" ? "bg-secondary" : ""}>
            Revenue: Low to High
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("name-asc")} className={sortOption === "name-asc" ? "bg-secondary" : ""}>
            Name: A to Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSortChange("name-desc")} className={sortOption === "name-desc" ? "bg-secondary" : ""}>
            Name: Z to A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Applied Filters Indicator */}
      {(selectedTechnicians.length > 0 || paymentTypeFilter !== "all") && (
        <div className="text-sm text-muted-foreground ml-2">
          Showing {selectedTechnicians.length > 0 ? selectedTechnicians.length : "all"} technician(s)
        </div>
      )}
    </div>
  );
};

export default TechnicianFinancialFilterBar;
