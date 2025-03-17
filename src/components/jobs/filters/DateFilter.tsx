
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFilterType } from "../JobFilterTypes";
import DateFilterOptions from "./DateFilterOptions";
import { DATE_FILTERS } from "./filterConstants";

interface DateFilterProps {
  dateFilter: DateFilterType;
  customDateRange: { from: Date | undefined; to: Date | undefined };
  updateFilter: (key: string, value: any) => void;
  handleDateFilterChange: (value: DateFilterType) => void;
  getDateFilterLabel: () => string;
}

const DateFilter = ({ 
  dateFilter, 
  customDateRange,
  updateFilter,
  handleDateFilterChange,
  getDateFilterLabel 
}: DateFilterProps) => {
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {getDateFilterLabel()}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-popover" align="start" side="bottom" sideOffset={5}>
        <div className="space-y-2">
          <DateFilterOptions
            dateFilter={dateFilter}
            handleDateFilterChange={handleDateFilterChange}
            dateFilters={DATE_FILTERS}
          />
          <div className="pt-4 px-2 pb-2">
            <CalendarComponent
              mode="single"
              selected={customDateRange.from}
              onSelect={(date) => {
                if (date) {
                  updateFilter("customDateRange", { from: date, to: date });
                  handleDateFilterChange("custom");
                  setOpenCalendar(false);
                }
              }}
              className="rounded-md border"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilter;
