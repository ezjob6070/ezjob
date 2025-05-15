
import { DateRange } from "react-day-picker";

// Helper to ensure a DateRange has both from and to properties
export const ensureDateRange = (dateRange?: DateRange): { from: Date; to: Date } => {
  if (!dateRange || !dateRange.from) {
    const today = new Date();
    return { from: today, to: today };
  }
  
  return {
    from: dateRange.from,
    to: dateRange.to || dateRange.from
  };
};

// Helper to convert string dates to Date objects
export const parseDate = (date: string | Date): Date => {
  if (typeof date === 'string') {
    return new Date(date);
  }
  return date;
};

// Helper to get hours from a string or Date
export const getHoursFromDate = (date: string | Date): number => {
  if (typeof date === 'string') {
    return new Date(date).getHours();
  }
  return date.getHours();
};
