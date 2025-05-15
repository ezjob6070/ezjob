
/**
 * Ensures that a date value is a valid Date object
 * @param date Date value which could be a string or Date object
 * @returns Valid Date object or undefined if invalid
 */
export function ensureValidDate(date: string | Date | undefined): Date | undefined {
  if (!date) return undefined;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return isNaN(dateObj.getTime()) ? undefined : dateObj;
}

/**
 * Safely gets hours from a date value which could be a string or Date object
 * @param date Date value which could be a string or Date object
 * @returns Hour value or undefined if the date is invalid
 */
export function getHoursFromDate(date: string | Date | undefined): number | undefined {
  const validDate = ensureValidDate(date);
  return validDate ? validDate.getHours() : undefined;
}

/**
 * Safely gets minutes from a date value which could be a string or Date object
 * @param date Date value which could be a string or Date object
 * @returns Minutes value or undefined if the date is invalid
 */
export function getMinutesFromDate(date: string | Date | undefined): number | undefined {
  const validDate = ensureValidDate(date);
  return validDate ? validDate.getMinutes() : undefined;
}

/**
 * Handles date ranges that might have optional 'to' property
 * @param dateRange DateRange object which might have optional 'to' property
 * @returns Object with both 'from' and 'to' dates, setting 'to' to current date if undefined
 */
export function ensureDateRange(dateRange?: { from?: Date, to?: Date }): { from: Date, to: Date } | undefined {
  if (!dateRange?.from) return undefined;
  
  return {
    from: dateRange.from,
    to: dateRange.to || new Date()
  };
}
