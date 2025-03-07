
import React from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateFilterType } from "../FinanceFilterTypes";

interface CustomDateFilterProps {
  customDateRange: { from: Date | undefined; to: Date | undefined };
  updateFilter: (key: "customDateRange", value: { from: Date | undefined; to: Date | undefined }) => void;
  handleDateFilterChange: (value: DateFilterType) => void;
}

const CustomDateFilter: React.FC<CustomDateFilterProps> = ({
  customDateRange,
  updateFilter,
  handleDateFilterChange,
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left">
          <Calendar className="mr-2 h-4 w-4" />
          {customDateRange.from && customDateRange.to ? (
            `${format(customDateRange.from, "MMM d, yyyy")} - ${format(customDateRange.to, "MMM d, yyyy")}`
          ) : (
            "Select date range"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <CalendarComponent
          mode="range"
          selected={customDateRange as any}
          onSelect={(range) => {
            updateFilter("customDateRange", range as any);
            handleDateFilterChange("custom");
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};

export default CustomDateFilter;
