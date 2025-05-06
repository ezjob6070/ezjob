
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { CalendarRange } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import JobsDateFilter from "@/components/jobs/filters/JobsDateFilter";

interface DashboardDateFilterProps {
  openDateFilter: boolean;
  setOpenDateFilter: (open: boolean) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  formatDateRange: () => string;
}

const DashboardDateFilter: React.FC<DashboardDateFilterProps> = ({
  openDateFilter,
  setOpenDateFilter,
  dateRange,
  setDateRange,
  formatDateRange
}) => {
  return (
    <Popover open={openDateFilter} onOpenChange={setOpenDateFilter}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 px-3 text-sm flex items-center gap-1 bg-white border-blue-100 shadow-sm"
        >
          <CalendarRange className="h-3.5 w-3.5 text-blue-500" />
          <span className="font-medium text-xs">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <JobsDateFilter date={dateRange} setDate={setDateRange} />
      </PopoverContent>
    </Popover>
  );
};

export default DashboardDateFilter;
