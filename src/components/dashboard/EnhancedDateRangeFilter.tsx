import React, { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { 
  Calendar, 
  ChevronDown, 
  Calendar as CalendarIcon,
  CalendarRange,
  CalendarDays,
  CheckCircle,
  X
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
  compact?: boolean;
  onClose?: () => void;
}

const EnhancedDateRangeFilter: React.FC<EnhancedDateRangeFilterProps> = ({ 
  date, 
  setDate,
  compact = false,
  onClose
}) => {
  const [open, setOpen] = useState(false);

  const formatDateRange = () => {
    if (!date?.from) return "Select date range";
    
    if (date.to) {
      if (date.from.toDateString() === date.to.toDateString()) {
        return compact ? format(date.from, "MMM d, yyyy") : format(date.from, "MMMM d, yyyy");
      }
      return `${format(date.from, "MMM d")} - ${format(date.to, "MMM d, yyyy")}`;
    }
    
    return compact ? format(date.from, "MMM d, yyyy") : format(date.from, "MMMM d, yyyy");
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
    if (onClose) onClose();
  };

  if (compact) {
    return (
      <div className="p-1">
        <Tabs defaultValue="presets" className="w-full">
          <div className="flex items-center justify-between mb-1 px-1">
            <TabsList className="grid grid-cols-2 p-0.5 bg-blue-50 h-7">
              <TabsTrigger value="presets" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 h-6">Quick Select</TabsTrigger>
              <TabsTrigger value="calendar" className="text-xs data-[state=active]:bg-white data-[state=active]:text-blue-700 h-6">Calendar</TabsTrigger>
            </TabsList>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                onClick={onClose}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <TabsContent value="presets" className="p-2 space-y-3 bg-white">
            <div className="grid grid-cols-2 gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("today")}
              >
                <CalendarIcon className="mr-1 h-3 w-3 text-blue-600" />
                <span>Today</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("yesterday")}
              >
                <CalendarIcon className="mr-1 h-3 w-3 text-purple-600" />
                <span>Yesterday</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("this-week")}
              >
                <CalendarDays className="mr-1 h-3 w-3 text-blue-600" />
                <span>This Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("last-week")}
              >
                <CalendarDays className="mr-1 h-3 w-3 text-purple-600" />
                <span>Last Week</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("this-month")}
              >
                <CalendarRange className="mr-1 h-3 w-3 text-blue-600" />
                <span>This Month</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs justify-start hover:bg-blue-50"
                onClick={() => selectDatePreset("last-month")}
              >
                <CalendarRange className="mr-1 h-3 w-3 text-purple-600" />
                <span>Last Month</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="p-2 bg-white">
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
            <div className="mt-2 flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                className="h-7 text-xs"
                onClick={() => setDate(undefined)}
              >
                Clear
              </Button>
              <Button 
                variant="default"
                size="sm" 
                className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  if (onClose) onClose();
                }}
              >
                Apply
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <Card className="w-full shadow-md border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-3 relative">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-500 p-1.5 rounded-full text-white shadow-sm">
                <CalendarRange className="h-4 w-4" />
              </div>
              <span className="font-medium text-blue-800">Date Range:</span>
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "flex-1 flex justify-between items-center px-4 py-2 bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all duration-200 shadow-sm",
                    date?.from && "text-blue-700 border-blue-300 bg-blue-50"
                  )}
                >
                  <span className="truncate font-medium">{formatDateRange()}</span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 shadow-lg border border-blue-100" align="center">
                <Tabs defaultValue="presets" className="w-full">
                  <TabsList className="grid grid-cols-2 p-1 bg-blue-50">
                    <TabsTrigger value="presets" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Quick Select</TabsTrigger>
                    <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">Calendar</TabsTrigger>
                  </TabsList>

                  <TabsContent value="presets" className="p-4 space-y-4 bg-white">
                    <div className="grid grid-cols-1 gap-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Current</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("today")}
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-blue-600" />
                          <span>Today</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("this-week")}
                        >
                          <CalendarDays className="mr-2 h-3.5 w-3.5 text-blue-600" />
                          <span>This Week</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("this-month")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                          <span>This Month</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("this-year")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-blue-600" />
                          <span>This Year</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Past</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("yesterday")}
                        >
                          <CalendarIcon className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Yesterday</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("last-week")}
                        >
                          <CalendarDays className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Last Week</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("last-month")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Last Month</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("last-30-days")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Last 30 Days</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("last-90-days")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Last 90 Days</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("last-year")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-purple-600" />
                          <span>Last Year</span>
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Future</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("next-week")}
                        >
                          <CalendarDays className="mr-2 h-3.5 w-3.5 text-green-600" />
                          <span>Next Week</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="justify-start hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                          onClick={() => selectDatePreset("next-month")}
                        >
                          <CalendarRange className="mr-2 h-3.5 w-3.5 text-green-600" />
                          <span>Next Month</span>
                        </Button>
                      </div>
                    </div>
                    
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-2"
                      onClick={() => selectDatePreset("all-time")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      All Time
                    </Button>
                  </TabsContent>

                  <TabsContent value="calendar" className="p-4 bg-white">
                    <CalendarComponent
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                    <div className="mt-4 flex justify-between">
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
                className="shrink-0 text-blue-700 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200"
              >
                Clear
              </Button>
            )}
          </div>

          {date?.from && (
            <div className="mt-2 flex items-center text-xs text-blue-600 bg-blue-50 p-1.5 rounded-md border border-blue-100">
              <CheckCircle className="h-3 w-3 mr-1.5 text-green-500" />
              Selected: {formatDateRange()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedDateRangeFilter;
