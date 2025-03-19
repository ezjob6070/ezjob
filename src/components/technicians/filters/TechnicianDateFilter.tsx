
import React from "react";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Calendar, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface TechnicianDateFilterProps {
  localDateRange: DateRange | undefined;
  setLocalDateRange: (date: DateRange | undefined) => void;
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
  const today = new Date();
  
  const getDateDisplayText = () => {
    if (!localDateRange?.from) return "Choose custom range";
    
    if (localDateRange.to && 
        isSameDay(localDateRange.from, localDateRange.to) && 
        isSameDay(localDateRange.from, today)) {
      return "Choose custom range";
    }
    
    if (localDateRange.to && isSameDay(localDateRange.from, localDateRange.to)) {
      return format(localDateRange.from, "MMM d, yyyy");
    }
    
    if (localDateRange.to) {
      return `${format(localDateRange.from, "MMM d")} - ${format(localDateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(localDateRange.from, "MMM d, yyyy");
  };

  const getTodayFormattedDate = () => {
    return format(today, "MMM d, yyyy");
  };
  
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const handleDatePreset = (preset: string) => {
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
    <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex flex-col items-start px-4 py-2 h-auto min-h-[3rem] relative bg-white hover:bg-gray-50 border-gray-200 text-gray-700">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4 text-gray-500" />
            {getDateDisplayText()}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {isSameDay(localDateRange?.from || today, today) ? 
              getTodayFormattedDate() : 
              "Select custom date range"}
          </div>
          <ChevronDown className="h-4 w-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
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
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
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
