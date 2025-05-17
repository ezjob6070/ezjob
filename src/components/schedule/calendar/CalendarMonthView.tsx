
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { Calendar } from "@/components/ui/calendar";

// Helper function to ensure we have a valid Date object
const ensureValidDate = (date: any): Date | null => {
  if (date instanceof Date && !isNaN(date.getTime())) {
    return date;
  }
  if (typeof date === 'string' && !isNaN(new Date(date).getTime())) {
    return new Date(date);
  }
  return null;
};

interface CalendarMonthViewProps {
  selectedDate: Date;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  handleDateSelect: (date: Date | undefined) => void;
  jobs: Job[];
  tasks: Task[];
}

const CalendarMonthView = ({
  selectedDate,
  currentMonth,
  setCurrentMonth,
  handleDateSelect,
  jobs,
  tasks
}: CalendarMonthViewProps) => {
  const getDayClassName = (date: Date) => {
    const hasJobs = jobs.some(job => {
      const jobDate = ensureValidDate(job.date);
      return jobDate && isSameDay(jobDate, date);
    });
    
    const hasTasks = tasks.some(task => {
      const taskDate = ensureValidDate(task.dueDate);
      return taskDate && isSameDay(taskDate, date);
    });
    
    const hasHighPriorityTasks = tasks.some(task => {
      const taskDate = ensureValidDate(task.dueDate);
      return taskDate && isSameDay(taskDate, date) && task.priority === 'high';
    });
    
    if (hasHighPriorityTasks) return "bg-red-100 text-red-900 font-medium";
    if (hasJobs && hasTasks) return "bg-purple-100 text-purple-900 font-medium";
    if (hasJobs) return "bg-blue-100 text-blue-900 font-medium";
    if (hasTasks) return "bg-amber-100 text-amber-900 font-medium";
    return "";
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        className="border rounded-md shadow-sm w-full max-w-4xl mx-auto"
        modifiers={{
          hasEvents: (date) => 
            jobs.some(job => {
              const jobDate = ensureValidDate(job.date);
              return jobDate && isSameDay(jobDate, date);
            }) || 
            tasks.some(task => {
              const taskDate = ensureValidDate(task.dueDate);
              return taskDate && isSameDay(taskDate, date);
            }),
        }}
        modifiersClassNames={{
          hasEvents: "font-bold",
        }}
        components={{
          Day: ({ date, displayMonth, ...props }) => {
            const isSelected = isSameDay(date, selectedDate);
            const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
            
            return (
              <button 
                type="button"
                className={cn(
                  "h-12 w-12 p-0 aria-selected:opacity-100 rounded-md relative pointer-events-auto flex flex-col items-center justify-center",
                  getDayClassName(date),
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  isOutsideMonth && "text-muted-foreground opacity-50"
                )}
                disabled={isOutsideMonth}
                onClick={() => handleDateSelect(date)}
                {...props}
              >
                <span className="text-base">{format(date, "d")}</span>
                {(jobs.some(job => {
                  const jobDate = ensureValidDate(job.date);
                  return jobDate && isSameDay(jobDate, date);
                }) || 
                  tasks.some(task => {
                    const taskDate = ensureValidDate(task.dueDate);
                    return taskDate && isSameDay(taskDate, date);
                  })) && 
                  !isSelected && (
                  <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                    {jobs.some(job => {
                      const jobDate = ensureValidDate(job.date);
                      return jobDate && isSameDay(jobDate, date);
                    }) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    )}
                    {tasks.some(task => {
                      const taskDate = ensureValidDate(task.dueDate);
                      return taskDate && isSameDay(taskDate, date);
                    }) && (
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    )}
                  </div>
                )}
              </button>
            );
          }
        }}
      />
      
      <div className="flex justify-center gap-6 mt-4 px-4 w-full flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
          <span className="text-sm">Jobs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div>
          <span className="text-sm">Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-500"></div>
          <span className="text-sm">Both</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div>
          <span className="text-sm">High Priority</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarMonthView;
