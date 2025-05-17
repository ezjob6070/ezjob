
import { format, isSameDay, startOfWeek, endOfWeek, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";

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

interface CalendarWeekViewProps {
  selectedDate: Date;
  jobs: Job[];
  tasks: Task[];
  updateSelectedDateItems: (date: Date) => void;
}

const CalendarWeekView = ({ 
  selectedDate, 
  jobs, 
  tasks, 
  updateSelectedDateItems
}: CalendarWeekViewProps) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => (
          <div 
            key={day.toString()}
            className={cn(
              "p-2 rounded-md border text-center cursor-pointer transition-colors",
              isSameDay(day, selectedDate) 
                ? "bg-primary text-primary-foreground font-medium" 
                : "hover:bg-gray-100"
            )}
            onClick={() => updateSelectedDateItems(day)}
          >
            <div className="font-medium">{format(day, 'E')}</div>
            <div className="text-lg">{format(day, 'd')}</div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2 h-[500px] overflow-y-auto">
        {weekDays.map(day => {
          const dayJobs = jobs.filter(job => {
            const jobDate = ensureValidDate(job.date);
            return jobDate && isSameDay(jobDate, day);
          });
          
          const dayTasks = tasks.filter(task => 
            isSameDay(task.dueDate, day)
          );
          
          const isSelected = isSameDay(day, selectedDate);
          
          return (
            <div 
              key={day.toString()} 
              className={cn(
                "p-2 rounded-md border max-h-full overflow-y-auto",
                isSelected ? "border-primary" : "border-gray-200"
              )}
            >
              <div className="space-y-2">
                {dayJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="bg-blue-100 p-2 rounded border border-blue-200 text-sm"
                  >
                    <p className="font-medium truncate">{job.title}</p>
                    <p className="truncate text-xs text-gray-600">{job.clientName}</p>
                    {job.date && 
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          job.date instanceof Date ? job.date : new Date(job.date), 
                          "h:mm a"
                        )}
                      </p>
                    }
                  </div>
                ))}
                
                {dayTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="bg-amber-100 p-2 rounded border border-amber-200 text-sm"
                  >
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="truncate text-xs text-gray-600">{task.client?.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {format(task.dueDate, "h:mm a")}
                    </p>
                  </div>
                ))}
                
                {dayJobs.length === 0 && dayTasks.length === 0 && (
                  <p className="text-xs text-gray-400 py-2 text-center">No events</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarWeekView;
