
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { DayProps } from "react-day-picker";

interface CalendarMonthViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  currentMonth: Date;
  onMonthChange: (month: Date) => void;
  jobs: Job[];
  getDayColor: (day: Date) => string;
}

const CalendarMonthView = ({ 
  selectedDate, 
  onDateSelect, 
  currentMonth, 
  onMonthChange, 
  jobs,
  getDayColor 
}: CalendarMonthViewProps) => {
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && onDateSelect(date)}
      className="p-0 pointer-events-auto w-full max-w-none"
      month={currentMonth}
      onMonthChange={onMonthChange}
      modifiers={{
        hasJobs: (date) => jobs.some(job => isSameDay(job.date, date)),
      }}
      modifiersClassNames={{
        hasJobs: "font-bold",
      }}
      components={{
        Day: ({ date, displayMonth, ...props }: DayProps) => {
          const isSelected = isSameDay(date, selectedDate);
          const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
          const dayColor = getDayColor(date);
          
          return (
            <button 
              type="button"
              className={cn(
                "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100",
                dayColor,
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                "relative"
              )}
              disabled={isOutsideMonth}
              {...props}
            >
              {format(date, "d")}
              {jobs.some(job => isSameDay(job.date, date)) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              )}
            </button>
          );
        }
      }}
    />
  );
};

export default CalendarMonthView;
