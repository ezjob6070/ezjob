
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { DateRange } from "react-day-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface TechnicianDateFilterProps {
  localDateRange: DateRange | undefined;
  setLocalDateRange: (range: DateRange | undefined) => void;
  showDateFilter: boolean;
  setShowDateFilter: (show: boolean) => void;
  clearFilters: () => void; 
  applyFilters: () => void;
}

const TechnicianDateFilter: React.FC<TechnicianDateFilterProps> = ({
  localDateRange,
  setLocalDateRange,
  showDateFilter,
  setShowDateFilter,
  clearFilters,
  applyFilters
}) => {
  return (
    <div className="flex items-center gap-2">
      <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
        <PopoverTrigger asChild>
          <Button 
            variant={localDateRange ? "default" : "outline"} 
            size="sm" 
            className="min-w-[150px]"
          >
            <Calendar className="h-4 w-4 mr-2" />
            {localDateRange?.from ? (
              localDateRange.to ? (
                <>
                  {format(localDateRange.from, "MMM d")} -{" "}
                  {format(localDateRange.to, "MMM d")}
                </>
              ) : (
                format(localDateRange.from, "MMM d, yyyy")
              )
            ) : (
              "Date Range"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={localDateRange?.from}
            selected={localDateRange}
            onSelect={setLocalDateRange}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setLocalDateRange(undefined);
                applyFilters();
                setShowDateFilter(false);
              }}
            >
              Clear
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                applyFilters();
                setShowDateFilter(false);
              }}
            >
              Apply Range
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TechnicianDateFilter;
