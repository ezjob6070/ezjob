
import { format, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { DayProps } from "react-day-picker";

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  jobs: Job[];
}

const RightCalendarWidget = ({ selectedDate, setSelectedDate, jobs }: CalendarWidgetProps) => {
  const getDayColor = (day: Date) => {
    const dayJobs = jobs.filter(job => isSameDay(job.date, day));
    
    if (!dayJobs.length) return "";
    
    if (dayJobs.some(job => job.status === "scheduled")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayJobs.some(job => job.status === "in-progress")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (dayJobs.some(job => job.status === "completed")) {
      return "bg-green-100 text-green-800";
    } else if (dayJobs.some(job => job.status === "cancelled" || job.status === "canceled")) {
      return "bg-red-100 text-red-800";
    }
    
    return "";
  };

  return (
    <div className="mb-6">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && setSelectedDate(date)}
        className={cn("p-3 pointer-events-auto border rounded-md")}
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
                  "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
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
    </div>
  );
};

export default RightCalendarWidget;
