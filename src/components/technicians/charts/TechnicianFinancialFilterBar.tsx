
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SortOption } from "@/hooks/useTechniciansData";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Filter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TechnicianFinancialFilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  localDateRange?: DateRange;
  setLocalDateRange?: (date: DateRange | undefined) => void;
  paymentTypeFilter?: string;
  setPaymentTypeFilter?: (filter: string) => void;
  clearFilters?: () => void;
  applyFilters?: () => void;
  selectedTechnicianNames?: string[];
  technicianNames?: string[];
  toggleTechnician?: (name: string) => void;
}

const TechnicianFinancialFilterBar: React.FC<TechnicianFinancialFilterBarProps> = ({
  sortOption,
  onSortChange,
  localDateRange,
  setLocalDateRange,
  paymentTypeFilter = "all",
  setPaymentTypeFilter,
  clearFilters,
  applyFilters,
  selectedTechnicianNames = [],
  technicianNames = [],
  toggleTechnician
}) => {
  const [showDateFilter, setShowDateFilter] = React.useState(false);
  const [showTechnicianFilter, setShowTechnicianFilter] = React.useState(false);
  const today = new Date();

  const formatDateRange = () => {
    if (localDateRange?.from) {
      if (localDateRange.to) {
        return `${format(localDateRange.from, "MMM d, yyyy")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
      }
      return format(localDateRange.from, "MMM d, yyyy");
    }
    return "Select date";
  };

  const handleDatePreset = (preset: string) => {
    if (!setLocalDateRange) return;
    
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "today":
        from = today;
        break;
      case "yesterday":
        from = new Date(today);
        from.setDate(today.getDate() - 1);
        to = new Date(from);
        break;
      case "thisWeek":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        from = startOfWeek;
        break;
      case "lastWeek":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
        from = lastWeekStart;
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        to = lastWeekEnd;
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      default:
        from = today;
    }
    
    setLocalDateRange({ from, to });
    setShowDateFilter(false);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* Date Range Filter */}
        {setLocalDateRange && (
          <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <Calendar className="h-4 w-4" />
                {formatDateRange()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <div className="p-3 border-b">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("today")}>Today</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("yesterday")}>Yesterday</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisWeek")}>This Week</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastWeek")}>Last Week</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("thisMonth")}>This Month</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDatePreset("lastMonth")}>Last Month</Button>
                </div>
                <div className="text-sm font-medium mb-2">Custom Range</div>
                <CalendarComponent
                  mode="range"
                  selected={localDateRange}
                  onSelect={setLocalDateRange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </div>
              <div className="p-3 flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setLocalDateRange(undefined);
                    setShowDateFilter(false);
                  }}
                >
                  Clear
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => {
                    setShowDateFilter(false);
                    if (applyFilters) applyFilters();
                  }}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Technician Filter */}
        {toggleTechnician && technicianNames.length > 0 && (
          <Popover open={showTechnicianFilter} onOpenChange={setShowTechnicianFilter}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-2">
                <Filter className="h-4 w-4" />
                Filter Technicians {selectedTechnicianNames.length > 0 && `(${selectedTechnicianNames.length})`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start" side="bottom">
              <div className="p-4">
                <div className="font-medium mb-2">Select Technicians</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {technicianNames.map(name => (
                    <div key={name} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`tech-${name}`}
                        className="mr-2"
                        checked={selectedTechnicianNames.includes(name)}
                        onChange={() => toggleTechnician(name)}
                      />
                      <label htmlFor={`tech-${name}`} className="text-sm">{name}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowTechnicianFilter(false);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => {
                    setShowTechnicianFilter(false);
                    if (applyFilters) applyFilters();
                  }}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* Payment Type Filter */}
        {setPaymentTypeFilter && (
          <Select value={paymentTypeFilter} onValueChange={value => {
            setPaymentTypeFilter(value);
            if (applyFilters) applyFilters();
          }}>
            <SelectTrigger className="w-[180px] h-10">
              <SelectValue placeholder="Payment Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payment Types</SelectItem>
              <SelectItem value="percentage">Percentage Based</SelectItem>
              <SelectItem value="flat">Flat Rate</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Sort Option */}
        <Select value={sortOption} onValueChange={value => onSortChange(value as SortOption)}>
          <SelectTrigger className="w-[180px] h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue-high">Revenue (High to Low)</SelectItem>
            <SelectItem value="revenue-low">Revenue (Low to High)</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="jobs-high">Jobs (High to Low)</SelectItem>
            <SelectItem value="jobs-low">Jobs (Low to High)</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="ml-auto flex items-center gap-2">
          {clearFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10"
              onClick={clearFilters}
            >
              Clear All Filters
            </Button>
          )}
          
          {applyFilters && (
            <Button 
              variant="default" 
              size="sm" 
              className="h-10" 
              onClick={applyFilters}
            >
              Apply Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianFinancialFilterBar;
