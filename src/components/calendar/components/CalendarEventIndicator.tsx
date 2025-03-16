
import React from 'react';

interface CalendarEventIndicatorProps {
  jobsCount: number;
  tasksCount: number;
}

const CalendarEventIndicator = ({ jobsCount, tasksCount }: CalendarEventIndicatorProps) => {
  if (jobsCount === 0 && tasksCount === 0) return null;
  
  return (
    <div className="absolute bottom-0.5 left-0 right-0 flex justify-center gap-0.5">
      {jobsCount > 0 && (
        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
      )}
      {tasksCount > 0 && (
        <div className="w-1 h-1 rounded-full bg-red-500"></div>
      )}
    </div>
  );
};

export default CalendarEventIndicator;
