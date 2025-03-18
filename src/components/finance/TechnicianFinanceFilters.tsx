
import { useState } from "react";
import { Calendar, Filter, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface TechnicianFinanceFiltersProps {
  technicianNames: string[];
  selectedTechnician: string;
  onTechnicianChange: (technicianName: string) => void;
  paymentTypes: string[];
  selectedPaymentType: string;
  onPaymentTypeChange: (paymentType: string) => void;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onResetFilters: () => void;
}

const TechnicianFinanceFilters = ({
  technicianNames,
  selectedTechnician,
  onTechnicianChange,
  paymentTypes,
  selectedPaymentType,
  onPaymentTypeChange,
  dateRange,
  onDateRangeChange,
  onResetFilters
}: TechnicianFinanceFiltersProps) => {
  const [showTechnicianFilter, setShowTechnicianFilter] = useState(false);
  
  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    
    if (dateRange.to) {
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };
  
  const hasActiveFilters = selectedTechnician !== "all" || selectedPaymentType !== "all" || !!dateRange?.from;

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {/* Technician filter */}
      <Select value={selectedTechnician} onValueChange={onTechnicianChange}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select Technician" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Technicians</SelectItem>
          {technicianNames.map((name) => (
            <SelectItem key={name} value={name}>{name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Payment type filter */}
      <Select value={selectedPaymentType} onValueChange={onPaymentTypeChange}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Payment Type" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payment Types</SelectItem>
          {paymentTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type === "percentage" ? "Percentage-based" : "Flat Rate"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {/* Date range filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[220px]">
            <Calendar className="h-4 w-4 mr-2" />
            {formatDateRange()}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      
      {/* Reset filters button */}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onResetFilters}>
          Reset Filters
        </Button>
      )}
    </div>
  );
};

export default TechnicianFinanceFilters;
