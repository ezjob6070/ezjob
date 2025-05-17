
import { format, isSameDay, setHours } from "date-fns";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";

interface CalendarDayViewProps {
  selectedDate: Date;
  jobs: Job[];
  tasks: Task[];
}

const CalendarDayView = ({ selectedDate, jobs, tasks }: CalendarDayViewProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 24 }).map((_, hour) => {
          const timeSlot = setHours(selectedDate, hour);
          const jobsAtHour = jobs.filter(job => {
            const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
            return jobDate && 
              jobDate instanceof Date &&
              jobDate.getHours() === hour && 
              isSameDay(jobDate, selectedDate);
          });
          
          const tasksAtHour = tasks.filter(task => {
            return task.dueDate instanceof Date &&
              task.dueDate.getHours() === hour && 
              isSameDay(task.dueDate, selectedDate);
          });
          
          const hasItems = jobsAtHour.length > 0 || tasksAtHour.length > 0;
          
          return (
            <div 
              key={hour} 
              className={cn(
                "p-2 border-l-2 rounded-md", 
                hasItems 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200"
              )}
            >
              <div className="flex items-center">
                <span className="text-sm font-medium w-16">
                  {format(timeSlot, 'h:mm a')}
                </span>
                
                <div className="flex-1 space-y-2">
                  {jobsAtHour.map(job => (
                    <div 
                      key={job.id} 
                      className="bg-blue-100 p-2 rounded border border-blue-200"
                    >
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-600">{job.clientName}</p>
                    </div>
                  ))}
                  
                  {tasksAtHour.map(task => (
                    <div 
                      key={task.id} 
                      className="bg-amber-100 p-2 rounded border border-amber-200"
                    >
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">{task.client?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;
