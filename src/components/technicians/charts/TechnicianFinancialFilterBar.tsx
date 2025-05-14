
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowDownUp, 
  Calendar, 
  Check, 
  Filter, 
  Users, 
  X 
} from "lucide-react";
import { SortOption } from "@/types/sortOptions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { formatDateRangeText } from "@/hooks/technicians/financialUtils";

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
  appliedFilters: boolean;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
}

const TechnicianFinancialFilterBar = ({
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
  appliedFilters,
  showDateFilter,
  setShowDateFilter
}: TechnicianFinancialFilterBarProps) => {
  const hasActiveFilters = selectedTechnicians.length > 0 || paymentTypeFilter !== "all" || localDateRange?.from !== undefined;
  
  return (
    <div className="px-6 py-3 flex flex-wrap gap-3 items-center justify-between border-b">
      <div className="flex gap-2 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <Filter className="h-4 w-4" />
              <span>Payment Type</span>
              {paymentTypeFilter !== "all" && (
                <Badge variant="secondary" className="ml-1">{paymentTypeFilter}</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setPaymentTypeFilter("all")}>
              All
              {paymentTypeFilter === "all" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPaymentTypeFilter("percentage")}>
              Percentage
              {paymentTypeFilter === "percentage" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPaymentTypeFilter("flat")}>
              Flat Rate
              {paymentTypeFilter === "flat" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPaymentTypeFilter("hourly")}>
              Hourly
              {paymentTypeFilter === "hourly" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="sm" className="flex gap-1 items-center">
          <Users className="h-4 w-4" />
          <span>Technicians</span>
          {selectedTechnicians.length > 0 && (
            <Badge variant="secondary" className="ml-1">{selectedTechnicians.length}</Badge>
          )}
        </Button>
        
        <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex gap-1 items-center",
                localDateRange?.from ? "text-primary" : ""
              )}
            >
              <Calendar className="h-4 w-4" />
              {localDateRange?.from ? (
                <span>{formatDateRangeText(localDateRange)}</span>
              ) : (
                <span>Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={localDateRange?.from}
              selected={localDateRange}
              onSelect={setLocalDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex gap-1 items-center">
              <ArrowDownUp className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSortChange("revenue-high")}>
              Revenue (High to Low)
              {sortOption === "revenue-high" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("revenue-low")}>
              Revenue (Low to High)
              {sortOption === "revenue-low" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("jobs-high")}>
              Jobs (High to Low)
              {sortOption === "jobs-high" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("jobs-low")}>
              Jobs (Low to High)
              {sortOption === "jobs-low" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name-asc")}>
              Name (A to Z)
              {sortOption === "name-asc" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange("name-desc")}>
              Name (Z to A)
              {sortOption === "name-desc" && <Check className="h-4 w-4 ml-2" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TechnicianFinancialFilterBar;
