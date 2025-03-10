
import React from "react";
import { SlidersHorizontal, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

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
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  date,
  setDate
}) => {
  const formatDateRange = () => {
    if (!date?.from) return "Select date range";
    
    const from = date.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = date.to ? date.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "";
    
    return date.to ? `${from} - ${to}` : from;
  };

  return (
    <div className="flex items-center gap-3">
      {/* Search Box */}
      <div className="relative w-48">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-9 bg-white/80 backdrop-blur-sm focus-visible:ring-blue-500"
        />
      </div>
      
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={cn(
              "h-9 px-3 flex items-center gap-2 bg-white/80 backdrop-blur-sm",
              date?.from && "text-blue-600 border-blue-200 bg-blue-50"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-normal">{formatDateRange()}</span>
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
      
      {/* Filters Toggle */}
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => setShowFilters(!showFilters)}
        className={cn(
          "h-9 w-9 bg-white/80 backdrop-blur-sm", 
          showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default FinanceHeader;
