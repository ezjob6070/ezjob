
import React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar, CalendarRange, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    if (!date?.from) return "Select date range";
    
    if (date.to) {
      if (date.from.toDateString() === date.to.toDateString()) {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "px-3 py-1.5 h-auto flex items-center gap-2 bg-white/80 text-gray-800 border-blue-100",
            date?.from && "text-blue-600 border-blue-200 bg-blue-50/80"
          )}
        >
          <CalendarRange className="h-4 w-4" />
          <span className="text-sm font-medium">{formatDateRange()}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Tabs defaultValue="custom">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="current">Current & Future</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="p-1">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
          </TabsContent>

          <TabsContent value="past" className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectPastPreset("yesterday")}
              >
                <span>Yesterday</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectPastPreset("last-week")}
              >
                <span>Last Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectPastPreset("last-month")}
              >
                <span>Last Month</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectPastPreset("last-quarter")}
              >
                <span>Last Quarter</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start col-span-2"
                onClick={() => selectPastPreset("last-year")}
              >
                <span>Last Year</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="current" className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline"
                size="sm" 
                className="justify-start"
                onClick={() => selectCurrentPreset("today")}
              >
                <span>Today</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectCurrentPreset("this-week")}
              >
                <span>This Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectCurrentPreset("next-week")}
              >
                <span>Next Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectCurrentPreset("this-month")}
              >
                <span>This Month</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start"
                onClick={() => selectCurrentPreset("next-month")}
              >
                <span>Next Month</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default JobsDateFilter;
