
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

/**
 * Format date range for display
 */
export const formatDateRangeText = (dateRange: DateRange): string => {
  if (!dateRange.from) return "Select date range";
  
  if (!dateRange.to) {
    return format(dateRange.from, "MMM d, yyyy");
  }
  
  return `${format(dateRange.from, "MMM d, yyyy")} - ${format(dateRange.to, "MMM d, yyyy")}`;
};

/**
 * Filter data by date range
 */
export const filterByDateRange = <T extends {date?: string | Date}>(
  data: T[], 
  dateRange: DateRange | undefined
): T[] => {
  if (!dateRange || !dateRange.from) {
    return data;
  }
  
  return data.filter(item => {
    if (!item.date) return true;
    
    const itemDate = new Date(item.date);
    
    if (dateRange.to) {
      return itemDate >= dateRange.from && itemDate <= dateRange.to;
    }
    
    return itemDate.toDateString() === dateRange.from.toDateString();
  });
};
