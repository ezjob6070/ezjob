
/**
 * Safely converts a string or Date to a JavaScript Date object
 * @param date String date or Date object
 * @returns Date object or undefined if invalid
 */
export const toDate = (date: string | Date | undefined): Date | undefined => {
  if (!date) return undefined;
  if (date instanceof Date) return date;
  
  const parsedDate = new Date(date);
  return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

/**
 * Safely gets the hours from a date string or Date object
 * @param date String date or Date object
 * @returns Hour as number or 0 if invalid
 */
export const getHoursFromDate = (date: string | Date | undefined): number => {
  const dateObj = toDate(date);
  return dateObj ? dateObj.getHours() : 0;
};

/**
 * Safely formats a date string or Date object to a string
 * @param date String date or Date object
 * @param format Format string (optional)
 * @returns Formatted date string or empty string if invalid
 */
export const formatDate = (date: string | Date | undefined, format = "yyyy-MM-dd"): string => {
  const dateObj = toDate(date);
  if (!dateObj) return '';
  
  // Simple formatter (replace with date-fns if available)
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  
  switch (format) {
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    case "MM/dd/yyyy":
      return `${month}/${day}/${year}`;
    default:
      return `${year}-${month}-${day}`;
  }
};

/**
 * Creates a helper function for DateRange to ensure both from and to are present
 * @param range DateRange object
 * @returns Object with from and to dates, or undefined
 */
export const completeDateRange = (range?: { from?: Date; to?: Date }): { from: Date; to: Date } | undefined => {
  if (!range?.from || !range?.to) return undefined;
  return { from: range.from, to: range.to };
};
