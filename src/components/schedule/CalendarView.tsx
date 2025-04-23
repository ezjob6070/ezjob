
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";

interface CalendarViewProps {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
}

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

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
}: CalendarViewProps) => {
  // Process jobs and tasks to create upcoming events with validated dates
  const jobEvents = jobs
    .map(job => {
      const datetime = ensureValidDate(job.date);
      if (!datetime) return null;
      
      return {
        id: job.id,
        title: job.title || "Unnamed Job",
        datetime,
        type: "meeting" as const,
        clientName: job.clientName,
      };
    })
    .filter(event => event !== null);

  const taskEvents = tasks
    .map(task => {
      const datetime = ensureValidDate(task.dueDate);
      if (!datetime) return null;
      
      return {
        id: task.id,
        title: task.title,
        datetime,
        type: "deadline" as const,
        clientName: task.client.name,
      };
    })
    .filter(event => event !== null);

  // Combine events and ensure they all have valid datetime objects before sorting
  const upcomingEvents = [...jobEvents, ...taskEvents]
    .filter((event): event is {id: string; title: string; datetime: Date; type: "meeting" | "deadline"; clientName?: string} => 
      event !== null && event.datetime instanceof Date
    )
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .slice(0, 5);

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

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateSelectedDateItems(date);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="flex justify-center items-center w-full mb-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
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
            </div>
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
          </CardContent>
        </Card>
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Jobs ({jobsForSelectedDate.length})</h3>
                {jobsForSelectedDate.length === 0 ? (
                  <p className="text-muted-foreground">No jobs scheduled for this day</p>
                ) : (
                  <div className="space-y-3">
                    {jobsForSelectedDate.map(job => (
                      <Card key={job.id} className="p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.clientName}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p>${job.amount}</p>
                            <p className="text-muted-foreground capitalize">{job.status.replace('_', ' ')}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Tasks ({tasksForSelectedDate.length})</h3>
                {tasksForSelectedDate.length === 0 ? (
                  <p className="text-muted-foreground">No tasks due for this day</p>
                ) : (
                  <div className="space-y-3">
                    {tasksForSelectedDate.map(task => (
                      <Card key={task.id} className="p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">{task.client.name}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="capitalize">{task.status}</p>
                            <p className="text-muted-foreground capitalize">{task.priority} priority</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <UpcomingEvents events={upcomingEvents} />
    </div>
  );
};

export default CalendarView;
