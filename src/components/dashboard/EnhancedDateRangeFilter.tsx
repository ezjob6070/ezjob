
import React, { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  Calendar, 
  ChevronDown, 
  Calendar as CalendarIcon,
  CalendarRange,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
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

interface EnhancedDateRangeFilterProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const EnhancedDateRangeFilter: React.FC<EnhancedDateRangeFilterProps> = ({ 
  date, 
  setDate 
}) => {
  const [open, setOpen] = useState(false);

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

  // Quick date selections
  const selectDatePreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setDate({ from: today, to: today });
        break;
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDate({ from: yesterday, to: yesterday });
        break;
      case "this-week":
        setDate({ 
          from: startOfWeek(today, { weekStartsOn: 1 }), 
          to: today 
        });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDate({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "this-month":
        setDate({ from: startOfMonth(today), to: today });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDate({ 
          from: startOfMonth(lastMonthDate), 
          to: endOfMonth(lastMonthDate) 
        });
        break;
      case "last-30-days":
        setDate({ from: subDays(today, 30), to: today });
        break;
      case "last-90-days":
        setDate({ from: subDays(today, 90), to: today });
        break;
      case "this-year":
        setDate({ from: startOfYear(today), to: today });
        break;
      case "last-year":
        const lastYear = subDays(startOfYear(today), 1);
        setDate({ 
          from: startOfYear(lastYear), 
          to: endOfYear(lastYear) 
        });
        break;
      case "next-week":
        setDate({ 
          from: addDays(today, 1), 
          to: addDays(today, 7) 
        });
        break;
      case "next-month":
        setDate({ 
          from: addDays(today, 1), 
          to: addDays(today, 30) 
        });
        break;
      case "all-time":
        setDate(undefined);
        break;
    }

    setOpen(false);
  };

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full shadow-md border-blue-100 bg-gradient-to-r from-white to-blue-50">
        <CardContent className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <CalendarRange className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Date Range:</span>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "flex-1 flex justify-between items-center px-4 py-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800",
                    date?.from && "text-blue-700 border-blue-300 bg-blue-50"
                  )}
                >
                  <span className="truncate font-medium">{formatDateRange()}</span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Tabs defaultValue="presets" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="presets">Quick Select</TabsTrigger>
                    <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="presets" className="p-3 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("today")}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Today</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("yesterday")}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Yesterday</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("this-week")}
                      >
                        <CalendarDays className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>This Week</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("last-week")}
                      >
                        <CalendarDays className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Last Week</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("this-month")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>This Month</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("last-month")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Last Month</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("next-week")}
                      >
                        <CalendarDays className="mr-2 h-3.5 w-3.5 text-green-600" />
                        <span>Next Week</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("next-month")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-green-600" />
                        <span>Next Month</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("last-30-days")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Last 30 Days</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("last-90-days")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Last 90 Days</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("this-year")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>This Year</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => selectDatePreset("last-year")}
                      >
                        <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                        <span>Last Year</span>
                      </Button>
                    </div>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => selectDatePreset("all-time")}
                    >
                      All Time
                    </Button>
                  </TabsContent>

                  <TabsContent value="calendar" className="p-3">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    <div className="mt-3 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setDate(undefined)}
                      >
                        Clear
                      </Button>
                      <Button 
                        variant="default"
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => setOpen(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </PopoverContent>
            </Popover>
            
            {date?.from && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setDate(undefined)}
                className="shrink-0 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDateRangeFilter;
