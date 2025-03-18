
import React from "react";
import { SlidersHorizontal, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface TabOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FinanceHeaderProps {
  tabOptions: TabOption[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
}

const FinanceHeader: React.FC<FinanceHeaderProps> = ({
  showFilters,
  setShowFilters,
  date,
  setDate
}) => {
  const formatDateRange = () => {
    if (!date?.from) return "Today";
    
    if (date.from && 
        date.to && 
        date.from.toDateString() === date.to.toDateString() && 
        date.from.toDateString() === new Date().toDateString()) {
      return "Today";
    }
    
    const from = date.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const to = date.to ? date.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "";
    
    return date.to ? `${from} - ${to}` : from;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-end items-center gap-3">
          <div className="flex items-center gap-3">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-9 px-3 flex items-center gap-2",
                    date?.from && "text-blue-600 border-blue-200 bg-blue-50/50"
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
                "h-9 w-9", 
                showFilters ? "bg-blue-50/50 text-blue-600 border-blue-200" : ""
              )}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceHeader;
