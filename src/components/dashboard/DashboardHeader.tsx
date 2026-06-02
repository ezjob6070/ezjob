
import React, { useState, useEffect } from "react";
import { Bell, Calendar, BarChart3, Home, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWindowSize } from "@/hooks/use-window-size";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";

interface DashboardHeaderProps {
  onTabChange?: (tab: string) => void;
  activeTab?: string;
}

const DashboardHeader = ({ 
  onTabChange, 
  activeTab = "dashboard"
}: DashboardHeaderProps) => {
  const [localActiveTab, setLocalActiveTab] = useState(activeTab);
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const { dateFilter, setDateFilter } = useGlobalState();
  
  // Update local state when parent state changes
  useEffect(() => {
    setLocalActiveTab(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setLocalActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  const formatDateRange = () => {
    if (!dateFilter?.from) return "Today";
    
    if (dateFilter.to) {
      if (dateFilter.from.toDateString() === dateFilter.to.toDateString()) {
        return format(dateFilter.from, "MMM d");
      }
      return `${format(dateFilter.from, "MMM d")} - ${format(dateFilter.to, "MMM d")}`;
    }
    
    return format(dateFilter.from, "MMM d");
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-4 pt-4 pb-2 md:px-6 md:pt-5 md:pb-2 mb-5">
      <div className="flex flex-row items-center justify-between mb-1 gap-3">
        <div className="flex items-center min-w-0">
          <div className="mr-3 bg-indigo-50 p-2 rounded-lg text-indigo-600 shrink-0">
            <Home className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base md:text-lg font-semibold tracking-tight text-gray-900 truncate">Hello, Alex</h1>
            <p className="text-indigo-600 text-xs font-medium truncate">Welcome back to Ez Job</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="relative bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:text-indigo-700 rounded-full h-9 w-9 shrink-0"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
        <Tabs value={localActiveTab} onValueChange={handleTabChange} className="w-full">
          <div className="border-b border-gray-100">
            <TabsList className="bg-transparent p-0 w-full md:w-auto justify-start h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-3 transition-all duration-200"
              >
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="statistics" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-3 transition-all duration-200"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-700 bg-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-4 py-3 transition-all duration-200"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-1.5 border-blue-100 bg-blue-50/80 hover:bg-blue-100 text-blue-700",
                dateFilter && "bg-blue-100"
              )}
            >
              <CalendarRange className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{formatDateRange()}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <DashboardDateFilter />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

// Date filter functionality
const DashboardDateFilter = () => {
  const { dateFilter, setDateFilter } = useGlobalState();
  const [date, setDate] = useState<DateRange | undefined>(dateFilter);

  // Apply the date filter when it changes
  useEffect(() => {
    if (date) {
      setDateFilter(date);
    }
  }, [date, setDateFilter]);

  // Quick date selection options
  const selectToday = () => {
    const today = new Date();
    setDate({ from: today, to: today });
  };
  
  const selectYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setDate({ from: yesterday, to: yesterday });
  };
  
  const selectThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    setDate({ from: startOfWeek, to: endOfWeek });
  };
  
  const selectLastWeek = () => {
    const today = new Date();
    const startOfLastWeek = new Date(today);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7 - startOfLastWeek.getDay() + 1);
    
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(startOfLastWeek.getDate() + 6);
    
    setDate({ from: startOfLastWeek, to: endOfLastWeek });
  };
  
  const selectThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setDate({ from: startOfMonth, to: endOfMonth });
  };
  
  return (
    <div className="p-3">
      <div className="grid grid-cols-3 gap-2 mb-3">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={selectToday}
          className="text-xs h-8"
        >
          Today
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={selectYesterday}
          className="text-xs h-8"
        >
          Yesterday
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={selectThisWeek}
          className="text-xs h-8"
        >
          This Week
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={selectLastWeek}
          className="text-xs h-8"
        >
          Last Week
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={selectThisMonth}
          className="text-xs h-8"
        >
          This Month
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-8"
          onClick={() => setDate(undefined)}
        >
          Reset
        </Button>
      </div>
      
      <CalendarComponent
        initialFocus
        mode="range"
        defaultMonth={dateFilter?.from}
        selected={date}
        onSelect={setDate}
        numberOfMonths={1}
        className="pointer-events-auto rounded border"
      />
    </div>
  );
};

export default DashboardHeader;
