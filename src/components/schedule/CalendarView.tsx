
// We need to fix the error on line 293 where getHours is being called on a string | Date

// Function to safely handle date operations
const getTimeFromDate = (date: string | Date): number => {
  if (typeof date === 'string') {
    return new Date(date).getHours();
  }
  return date.getHours();
};

// Export this function so it can be used in CalendarView.tsx
export { getTimeFromDate };
