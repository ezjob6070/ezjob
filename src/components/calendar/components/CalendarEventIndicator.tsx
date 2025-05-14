
import React from "react";

interface CalendarEventIndicatorProps {
  jobsCount: number;
  tasksCount: number;
  remindersCount?: number;
}

const CalendarEventIndicator = ({ 
  jobsCount, 
  tasksCount, 
  remindersCount = 0 
}: CalendarEventIndicatorProps) => {
  if (jobsCount === 0 && tasksCount === 0 && remindersCount === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-0.5 pb-0.5">
      {jobsCount > 0 && (
        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
      )}
      {tasksCount > 0 && (
        <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
      )}
      {remindersCount > 0 && (
        <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
      )}
    </div>
  );
};

export default CalendarEventIndicator;
