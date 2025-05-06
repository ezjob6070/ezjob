
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

export const useDashboardDate = () => {
  // Set default date range to current day
  const today = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: today,
    to: today
  });
  
  const [openDateFilter, setOpenDateFilter] = useState(false);
  
  const formatDateRange = () => {
    if (!dateRange?.from) return "Custom Range";
    
    if (dateRange.to) {
      if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
        return format(dateRange.from, "MMM d, yyyy");
      }
      return `${format(dateRange.from, "MMM d")} - ${format(dateRange.to, "MMM d, yyyy")}`;
    }
    
    return format(dateRange.from, "MMM d, yyyy");
  };

  return {
    dateRange,
    setDateRange,
    openDateFilter,
    setOpenDateFilter,
    formatDateRange
  };
};
