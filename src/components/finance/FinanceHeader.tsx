
import React from "react";
import { 
  ArrowLeft, 
  ArrowRight, 
  Search, 
  SlidersHorizontal,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TabOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FinanceHeaderProps {
  tabOptions: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  tabOptions,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  date,
  setDate
}) => {
  const navigateTab = (direction: 'prev' | 'next') => {
    const currentIndex = tabOptions.findIndex(tab => tab.id === activeTab);
    if (direction === 'prev' && currentIndex > 0) {
      setActiveTab(tabOptions[currentIndex - 1].id);
    } else if (direction === 'next' && currentIndex < tabOptions.length - 1) {
      setActiveTab(tabOptions[currentIndex + 1].id);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateTab('prev')}
            disabled={activeTab === tabOptions[0].id}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex rounded-md shadow-sm">
            {tabOptions.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                className={`flex gap-2 ${activeTab === tab.id ? "" : "hover:bg-gray-50"}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Button>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigateTab('next')}
            disabled={activeTab === tabOptions[tabOptions.length - 1].id}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 flex-col items-start justify-center p-2">
                <div className="flex w-full flex-col items-start">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground mb-0.5">CUSTOM RANGE</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {date?.from ? (
                      date.to ? (
                        <span className="text-sm">
                          {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                        </span>
                      ) : (
                        <span className="text-sm">{format(date.from, "LLL dd, y")}</span>
                      )
                    ) : (
                      <span className="text-sm">Date Range</span>
                    )}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn("h-9 w-9", showFilters ? "bg-blue-50 text-blue-600" : "")}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinanceHeader;
