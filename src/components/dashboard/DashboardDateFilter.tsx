
import React, { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar, CalendarRange, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

const DashboardDateFilter = () => {
  const { globalDateRange, setGlobalDateRange } = useGlobalState();

  const formatDateRange = () => {
    if (!globalDateRange?.from) return "Filter by date";
    
    if (globalDateRange.to) {
      if (globalDateRange.from.toDateString() === globalDateRange.to.toDateString()) {
        return format(globalDateRange.from, "MMM d");
      }
      return `${format(globalDateRange.from, "MMM d")} - ${format(globalDateRange.to, "MMM d")}`;
    }
    
    return format(globalDateRange.from, "MMM d");
  };

  // Handle past date presets
  const selectPastPreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "yesterday":
        const yesterday = subDays(today, 1);
        setGlobalDateRange({ from: yesterday, to: yesterday });
        break;
      case "last-week":
        const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subDays(today, 7), { weekStartsOn: 1 });
        setGlobalDateRange({ from: lastWeekStart, to: lastWeekEnd });
        break;
      case "last-month":
        const lastMonthDate = subDays(startOfMonth(today), 1);
        setGlobalDateRange({ 
          from: startOfMonth(lastMonthDate), 
          to: endOfMonth(lastMonthDate) 
        });
        break;
    }
  };
  
  // Handle current/future date presets
  const selectCurrentPreset = (preset: string) => {
    const today = new Date();
    
    switch (preset) {
      case "today":
        setGlobalDateRange({ from: today, to: today });
        break;
      case "tomorrow":
        const tomorrow = addDays(today, 1);
        setGlobalDateRange({ from: tomorrow, to: tomorrow });
        break;
      case "this-week":
        setGlobalDateRange({ 
          from: startOfWeek(today, { weekStartsOn: 1 }), 
          to: endOfWeek(today, { weekStartsOn: 1 }) 
        });
        break;
      case "next-week":
        const nextWeek = addDays(today, 7);
        setGlobalDateRange({ 
          from: startOfWeek(nextWeek, { weekStartsOn: 1 }), 
          to: endOfWeek(nextWeek, { weekStartsOn: 1 }) 
        });
        break;
      case "this-month":
        setGlobalDateRange({ 
          from: startOfMonth(today), 
          to: endOfMonth(today) 
        });
        break;
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn(
            "h-8 gap-1 px-3 text-xs bg-white/80 border-blue-100",
            globalDateRange?.from && "text-blue-600 border-blue-200 bg-blue-50/80"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDateRange()}</span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Tabs defaultValue="custom" className="w-[300px]">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
            <TabsTrigger value="current" className="text-xs">Current</TabsTrigger>
            <TabsTrigger value="past" className="text-xs">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="p-2">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={globalDateRange?.from}
              selected={globalDateRange}
              onSelect={setGlobalDateRange}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
          </TabsContent>

          <TabsContent value="current" className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectCurrentPreset("today")}
              >
                <span>Today</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectCurrentPreset("tomorrow")}
              >
                <span>Tomorrow</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectCurrentPreset("this-week")}
              >
                <span>This Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectCurrentPreset("next-week")}
              >
                <span>Next Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8 col-span-2"
                onClick={() => selectCurrentPreset("this-month")}
              >
                <span>This Month</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="past" className="p-3">
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectPastPreset("yesterday")}
              >
                <span>Yesterday</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8"
                onClick={() => selectPastPreset("last-week")}
              >
                <span>Last Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="justify-start text-xs h-8 col-span-2"
                onClick={() => selectPastPreset("last-month")}
              >
                <span>Last Month</span>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default DashboardDateFilter;
