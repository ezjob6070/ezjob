
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

interface DateRangeFilterProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  compact?: boolean;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ date, setDate, compact = false }) => {
  const today = new Date();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  
  // Initialize with "Today" preset
  useEffect(() => {
    if (date?.from && date?.to && 
        date.from.getDate() === today.getDate() && 
        date.from.getMonth() === today.getMonth() && 
        date.from.getFullYear() === today.getFullYear() &&
        date.to.getDate() === today.getDate() && 
        date.to.getMonth() === today.getMonth() && 
        date.to.getFullYear() === today.getFullYear()) {
      setSelectedPreset("today");
    }
  }, []);
  
  // Past presets
  const handlePastDatePreset = (preset: string) => {
    setSelectedPreset(preset);
    switch (preset) {
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDate({ from: startOfMonth(lastMonthDate), to: endOfMonth(lastMonthDate) });
        break;
      case "last-60-days":
        setDate({ from: subDays(today, 60), to: today });
        break;
      case "last-year":
        setDate({ from: startOfYear(subDays(startOfYear(today), 1)), to: endOfYear(subDays(startOfYear(today), 1)) });
        break;
    }
  };
  
  // Future and current presets
  const handleFutureDatePreset = (preset: string) => {
    setSelectedPreset(preset);
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "tomorrow":
        const tomorrow = addDays(today, 1);
        setDate({ from: tomorrow, to: tomorrow });
        break;
      case "this-week":
        const thisWeekStart = startOfWeek(today, { weekStartsOn: 1 });
        const thisWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
        setDate({ from: thisWeekStart, to: thisWeekEnd });
        break;
      case "next-week":
        const nextWeekStart = addDays(startOfWeek(today, { weekStartsOn: 1 }), 7);
        const nextWeekEnd = addDays(endOfWeek(today, { weekStartsOn: 1 }), 7);
        setDate({ from: nextWeekStart, to: nextWeekEnd });
        break;
      case "this-month":
        setDate({ from: startOfMonth(today), to: endOfMonth(today) });
        break;
      case "next-month":
        const nextMonthStart = addDays(endOfMonth(today), 1);
        const nextMonthEnd = endOfMonth(addDays(endOfMonth(today), 1));
        setDate({ from: nextMonthStart, to: nextMonthEnd });
        break;
    }
  };

  // Get the appropriate label for the button
  const getButtonLabel = () => {
    if (!date?.from) {
      return <span>Date Range</span>;
    }

    switch (selectedPreset) {
      case "today":
        return <span>Today</span>;
      case "tomorrow":
        return <span>Tomorrow</span>;
      case "this-week":
        return <span>This Week</span>;
      case "next-week":
        return <span>Next Week</span>;
      case "this-month":
        return <span>This Month</span>;
      case "next-month":
        return <span>Next Month</span>;
      case "yesterday":
        return <span>Yesterday</span>;
      case "last-week":
        return <span>Last Week</span>;
      case "last-month":
        return <span>Last Month</span>;
      case "last-60-days":
        return <span>Last 60 Days</span>;
      case "last-year":
        return <span>Last Year</span>;
      default:
        // When a custom date is selected (not a preset)
        return date.to ? (
          <>
            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
          </>
        ) : (
          format(date.from, "LLL dd, y")
        );
    }
  };

  // Clear the preset when user selects a custom date
  const handleCustomDateSelection = (newDate: DateRange | undefined) => {
    setSelectedPreset(null);
    setDate(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-auto justify-between px-3 py-2 text-base font-medium"
        >
          <Calendar className="mr-2 h-4 w-4" />
          {getButtonLabel()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Left side - Calendar */}
          <div className="p-3">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleCustomDateSelection}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
          </div>
          
          {/* Right side - Date presets */}
          <div className="p-3 border-l min-w-[200px]">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold mb-2">Present & Future</h4>
                <div className="grid grid-cols-1 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("today")}>
                    Today
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("tomorrow")}>
                    Tomorrow
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("this-week")}>
                    This Week
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("next-week")}>
                    Next Week
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("this-month")}>
                    This Month
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleFutureDatePreset("next-month")}>
                    Next Month
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2">Past</h4>
                <div className="grid grid-cols-1 gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handlePastDatePreset("yesterday")}>
                    Yesterday
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handlePastDatePreset("last-week")}>
                    Last Week
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handlePastDatePreset("last-month")}>
                    Last Month
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handlePastDatePreset("last-60-days")}>
                    Last 60 Days
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handlePastDatePreset("last-year")}>
                    Last Year
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeFilter;
