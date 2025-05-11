
import { isSameDay, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DayProps } from "react-day-picker";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "../types";
import CalendarEventIndicator from "./CalendarEventIndicator";

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  jobs: Job[];
  tasks: Task[];
  currentMonth: Date;
}

const CalendarWidget = ({ selectedDate, setSelectedDate, jobs, tasks, currentMonth }: CalendarWidgetProps) => {
  const getDayColor = (day: Date) => {
    const dayJobs = jobs.filter(job => isSameDay(job.date, day));
    const dayTasks = tasks.filter(task => isSameDay(task.dueDate, day));
    
    if (!dayJobs.length && !dayTasks.length) return "";
    
    if (dayTasks.some(task => task.priority === "high") || 
        dayJobs.some(job => job.status === "in_progress")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (dayJobs.some(job => job.status === "scheduled")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayTasks.length > 0 || dayJobs.length > 0) {
      return "bg-green-100 text-green-800";
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
        month={currentMonth}
        modifiers={{
          hasEvents: (date) => 
            jobs.some(job => isSameDay(job.date, date)) || 
            tasks.some(task => isSameDay(task.dueDate, date)),
        }}
        modifiersClassNames={{
          hasEvents: "font-bold",
        }}
        components={{
          Day: ({ date, displayMonth, ...props }: DayProps) => {
            const isSelected = isSameDay(date, selectedDate);
            const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
            const dayColor = getDayColor(date);
            
            const jobsCount = jobs.filter(job => isSameDay(job.date, date)).length;
            const tasksCount = tasks.filter(task => isSameDay(task.dueDate, date)).length;
            
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
                <CalendarEventIndicator 
                  jobsCount={jobsCount} 
                  tasksCount={tasksCount} 
                />
              </button>
            );
          }
        }}
      />
    </div>
  );
};

export default CalendarWidget;
