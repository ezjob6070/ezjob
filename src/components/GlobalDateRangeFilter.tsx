
import React, { useState, createContext, useContext } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar, CalendarRange, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

// Create a context to share date range globally
type GlobalDateContextType = {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
};

export const GlobalDateContext = createContext<GlobalDateContextType | undefined>(undefined);

export const useGlobalDateRange = () => {
  const context = useContext(GlobalDateContext);
  if (!context) {
    throw new Error("useGlobalDateRange must be used within a GlobalDateProvider");
  }
  return context;
};

export const GlobalDateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  return (
    <GlobalDateContext.Provider value={{ dateRange, setDateRange }}>
      {children}
    </GlobalDateContext.Provider>
  );
};

// The actual filter component
const GlobalDateRangeFilter = () => {
  // We'll use local state for now, but this could be connected to the context
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const formatDateRange = () => {
    if (!dateRange?.from) return "Select date range";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMMM d, yyyy");
  };

  // Handle past date presets
  const selectPastPreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "yesterday":
        const yesterday = subDays(today, 1);
        setDateRange({ from: yesterday, to: yesterday });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setDateRange({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setDateRange({ 
          from: startOfMonth(lastMonthDate), 
          to: endOfMonth(lastMonthDate) 
        });
        break;
      case "last-quarter":
        setDateRange({ from: subDays(today, 90), to: today });
        break;
      case "last-year":
        const lastYear = subDays(startOfYear(today), 1);
        setDateRange({ 
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
        setDateRange({ from: today, to: today });
        break;
      case "this-week":
        setDateRange({ 
          from: startOfWeek(today, { weekStartsOn: 1 }), 
          to: endOfWeek(today, { weekStartsOn: 1 }) 
        });
        break;
      case "next-week":
        const nextWeek = addDays(today, 7);
        setDateRange({ 
          from: startOfWeek(nextWeek, { weekStartsOn: 1 }), 
          to: endOfWeek(nextWeek, { weekStartsOn: 1 }) 
        });
        break;
      case "this-month":
        setDateRange({ 
          from: startOfMonth(today), 
          to: endOfMonth(today) 
        });
        break;
      case "next-month":
        const nextMonth = addDays(endOfMonth(today), 1);
        setDateRange({ 
          from: startOfMonth(nextMonth), 
          to: endOfMonth(nextMonth) 
        });
        break;
    }
  };

  return (
    <div className="flex items-center justify-center my-2">
      <div className="bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-1.5 flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className={cn(
                "px-3 py-1.5 h-auto flex items-center gap-2 bg-white/80 text-gray-800 border-blue-100",
                dateRange?.from && "text-blue-600 border-blue-200 bg-blue-50/80"
              )}
            >
              <CalendarRange className="h-4 w-4" />
              <span className="text-sm font-medium">{formatDateRange()}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
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
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
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
      </div>
    </div>
  );
};

export default GlobalDateRangeFilter;
