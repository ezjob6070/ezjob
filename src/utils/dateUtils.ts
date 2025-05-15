
import { DateRange } from "react-day-picker";

// Helper function to ensure a DateRange always has both from and to dates
export const ensureCompleteDateRange = (range: DateRange | undefined): { from: Date; to: Date } => {
  if (!range) {
    const today = new Date();
    return { from: today, to: today };
  }
  
  // If there's only a 'from' date, use it as both from and to
  if (range.from && !range.to) {
    return { from: range.from, to: range.from };
  }
  
  // If there's only a 'to' date, use it as both from and to
  if (!range.from && range.to) {
    return { from: range.to, to: range.to };
  }
  
  // If both dates are present, return the range
  if (range.from && range.to) {
    return { from: range.from, to: range.to };
  }
  
  // Default case - should never reach here due to the first condition
  const today = new Date();
  return { from: today, to: today };
};

// Format a date range as a string
export const formatDateRangeForDisplay = (range: DateRange | undefined): string => {
  if (!range || !range.from) return "No date selected";
  
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  if (range.to) {
    if (range.from.toDateString() === range.to.toDateString()) {
      return range.from.toLocaleDateString('en-US', options);
    }
    return `${range.from.toLocaleDateString('en-US', options)} - ${range.to.toLocaleDateString('en-US', options)}`;
  }
  
  return range.from.toLocaleDateString('en-US', options);
};
