
// Helper types for events
export interface JobEvent {
  id: string;
  title: string;
  datetime: Date;
  type: "meeting";
  clientName: string;
}

export interface TaskEvent {
  id: string;
  title: string;
  datetime: Date;
  type: "deadline";
  clientName: string;
}

export type Event = JobEvent | TaskEvent;

// Helper function to ensure we have a valid Date object
export const ensureValidDate = (date: any): Date | null => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  if (typeof date === 'string' && !isNaN(new Date(date).getTime())) {
    return new Date(date);
  }
  return null;
};

// Helper function to safely check if a date is the same day
export function isSameDayHelper(dateA: Date | string | undefined, dateB: Date | string | undefined): boolean {
  if (!dateA || !dateB) return false;
  
  const dateObjA = typeof dateA === 'string' ? new Date(dateA) : dateA;
  const dateObjB = typeof dateB === 'string' ? new Date(dateB) : dateB;
  
  return dateObjA.getDate() === dateObjB.getDate() && 
         dateObjA.getMonth() === dateObjB.getMonth() && 
         dateObjA.getFullYear() === dateObjB.getFullYear();
}

// Helper function to safely get hours from date that could be string or Date
export function getHoursFromDate(date: Date | string): number {
  if (date instanceof Date) {
    return date.getHours();
  }
  if (typeof date === 'string') {
    return new Date(date).getHours();
  }
  return 0;
}
