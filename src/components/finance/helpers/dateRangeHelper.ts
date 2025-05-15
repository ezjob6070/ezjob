
import { DateRange } from "react-day-picker";

export const ensureCompleteDateRange = (dateRange?: DateRange): { from: Date; to: Date } => {
  if (!dateRange || !dateRange.from) {
    const today = new Date();
    return {
      from: today,
      to: today
    };
  }
  
  return {
    from: dateRange.from,
    to: dateRange.to || dateRange.from
  };
};

export const formatDateRange = (dateRange?: DateRange): string => {
  if (!dateRange || !dateRange.from) return "All time";
  
  if (dateRange.to) {
    if (dateRange.from.toDateString() === dateRange.to.toDateString()) {
      // Same day
      return dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `${dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${dateRange.to.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  }
  
  return dateRange.from.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
