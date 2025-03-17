
import { Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import DateFilterOptions from "./DateFilterOptions";
import { DateFilter } from "./filterConstants";

interface DateFilterDropdownProps {
  selectedDateFilter: string;
  dateFilters: DateFilter[];
  onDateFilterChange: (value: string) => void;
}

const DateFilterDropdown = ({ 
  selectedDateFilter, 
  dateFilters, 
  onDateFilterChange 
}: DateFilterDropdownProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  
  // Find the selected filter label based on the current value
  const selectedLabel = dateFilters.find(filter => filter.value === selectedDateFilter)?.label || "Today";
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {selectedLabel}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-white" align="start" side="bottom" sideOffset={5}>
        <div className="space-y-2">
          <DateFilterOptions
            dateFilter={selectedDateFilter}
            handleDateFilterChange={onDateFilterChange}
            dateFilters={dateFilters}
          />
          <div className="pt-4 px-2 pb-2">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                if (newDate) {
                  setDate(newDate);
                  onDateFilterChange("custom");
                  setOpen(false);
                }
              }}
              className="rounded-md border pointer-events-auto"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateFilterDropdown;
