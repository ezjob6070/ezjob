
import React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear 
} from "date-fns";

interface JobsDateFilterProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const JobsDateFilter = ({ date, setDate }: JobsDateFilterProps) => {
  const formatDateRange = () => {
    if (!date?.from) return "Today";
    
    if (date.to) {
      if (date.from.toDateString() === date.to.toDateString()) {
        if (date.from.toDateString() === new Date().toDateString()) {
          return "Today";
        }
        return format(date.from, "MMMM d, yyyy");
      }
      return `${format(date.from, "MMM d, yyyy")} - ${format(date.to, "MMM d, yyyy")}`;
    }
    
    return format(date.from, "MMMM d, yyyy");
  };

  // Handle past date presets
  const selectPastPreset = (preset: string) => {
    const today = new Date();
    
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
        setDate({ 
          from: startOfMonth(lastMonthDate), 
          to: endOfMonth(lastMonthDate) 
        });
        break;
      case "last-quarter":
        setDate({ from: subDays(today, 90), to: today });
        break;
      case "last-year":
        const lastYear = subDays(startOfYear(today), 1);
        setDate({ 
          from: startOfYear(lastYear), 
          to: endOfYear(lastYear) 
        });
        break;
    }
  };
  
  // Handle current/future date presets
  const selectCurrentPreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "this-week":
        setDate({ 
          from: startOfWeek(today, { weekStartsOn: 1 }), 
          to: endOfWeek(today, { weekStartsOn: 1 }) 
        });
        break;
      case "next-week":
        const nextWeek = addDays(today, 7);
        setDate({ 
          from: startOfWeek(nextWeek, { weekStartsOn: 1 }), 
          to: endOfWeek(nextWeek, { weekStartsOn: 1 }) 
        });
        break;
      case "this-month":
        setDate({ 
          from: startOfMonth(today), 
          to: endOfMonth(today) 
        });
        break;
      case "next-month":
        const nextMonth = addDays(endOfMonth(today), 1);
        setDate({ 
          from: startOfMonth(nextMonth), 
          to: endOfMonth(nextMonth) 
        });
        break;
    }
  };

  return (
    <div className="flex">
      {/* Calendar on left side */}
      <div className="border-r pr-4">
        <CalendarComponent
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          className="pointer-events-auto w-auto"
        />
      </div>
      
      {/* Date presets on right side */}
      <div className="pl-4 space-y-4 min-w-[200px]">
        <div>
          <h3 className="mb-2 text-sm font-medium">Present & Future</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline"
              size="sm" 
              className="justify-start"
              onClick={() => selectCurrentPreset("today")}
            >
              Today
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectCurrentPreset("this-week")}
            >
              This Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectCurrentPreset("next-week")}
            >
              Next Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectCurrentPreset("this-month")}
            >
              This Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectCurrentPreset("next-month")}
            >
              Next Month
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="mb-2 text-sm font-medium">Past</h3>
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectPastPreset("yesterday")}
            >
              Yesterday
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectPastPreset("last-week")}
            >
              Last Week
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectPastPreset("last-month")}
            >
              Last Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectPastPreset("last-quarter")}
            >
              Last Quarter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => selectPastPreset("last-year")}
            >
              Last Year
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsDateFilter;
