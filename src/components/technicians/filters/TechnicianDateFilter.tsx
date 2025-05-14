
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface TechnicianDateFilterProps {
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

const TechnicianDateFilter: React.FC<TechnicianDateFilterProps> = ({
  localDateRange,
  setLocalDateRange,
  showDateFilter,
  setShowDateFilter,
  clearFilters,
  applyFilters
}) => {
  const formatDateRange = () => {
    if (!localDateRange?.from) return "Custom Range";
    
    if (localDateRange.to) {
      if (localDateRange.from.toDateString() === localDateRange.to.toDateString()) {
        return format(localDateRange.from, "MMM d, yyyy");
      }
      return `${format(localDateRange.from, "MMM d")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(localDateRange.from, "MMM d, yyyy");
  };

  return (
    <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[180px] bg-white hover:bg-gray-50 border-gray-200 text-gray-900 font-medium">
          <Calendar className="h-4 w-4 mr-2 text-gray-700" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              setLocalDateRange({ from: today, to: today });
            }}>Today</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(today.getDate() - 1);
              setLocalDateRange({ from: yesterday, to: yesterday });
            }}>Yesterday</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              const startOfWeek = new Date(today);
              startOfWeek.setDate(today.getDate() - today.getDay());
              setLocalDateRange({ from: startOfWeek, to: today });
            }}>This Week</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
              setLocalDateRange({ from: startOfMonth, to: today });
            }}>This Month</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              const startOfLastWeek = new Date(today);
              startOfLastWeek.setDate(today.getDate() - today.getDay() - 7);
              const endOfLastWeek = new Date(today);
              endOfLastWeek.setDate(today.getDate() - today.getDay() - 1);
              setLocalDateRange({ from: startOfLastWeek, to: endOfLastWeek });
            }}>Last Week</Button>
            <Button size="sm" variant="outline" onClick={() => {
              const today = new Date();
              const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
              const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
              setLocalDateRange({ from: startOfLastMonth, to: endOfLastMonth });
            }}>Last Month</Button>
          </div>
          <div className="text-sm font-medium mb-2 text-gray-900">Custom Range</div>
          <CalendarComponent
            mode="range"
            selected={localDateRange}
            onSelect={setLocalDateRange}
            numberOfMonths={2}
          />
        </div>
        <div className="p-3 flex justify-between">
          <Button variant="ghost" size="sm" onClick={() => {
            setLocalDateRange(undefined);
            clearFilters();
          }}>Clear</Button>
          <Button variant="default" size="sm" onClick={() => {
            applyFilters();
            setShowDateFilter(false);
          }}>Apply</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TechnicianDateFilter;
