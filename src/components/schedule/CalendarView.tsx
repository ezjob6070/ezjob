
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addDays, startOfMonth, endOfMonth } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";
import { CalendarViewMode } from "./CalendarViewOptions";

interface CalendarViewProps {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
  viewMode: CalendarViewMode;
}

// Define the event types more specifically
interface JobEvent {
  id: string;
  title: string;
  datetime: Date;
  type: "meeting";
  clientName: string;
}

interface TaskEvent {
  id: string;
  title: string;
  datetime: Date;
  type: "deadline";
  clientName: string;
}

type Event = JobEvent | TaskEvent;

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
  viewMode,
}: CalendarViewProps) => {
  // Process jobs and tasks to create upcoming events with validated dates
  const jobEvents = jobs
    .map(job => {
      const datetime = ensureValidDate(job.date);
      if (!datetime || !job.clientName) return null;
      
      return {
        id: job.id,
        title: job.title || "Unnamed Job",
        datetime,
        type: "meeting" as const,
        clientName: job.clientName,
      };
    })
    .filter((event): event is JobEvent => event !== null);

  const taskEvents = tasks
    .map(task => {
      const datetime = ensureValidDate(task.dueDate);
      if (!datetime || !task.client?.name) return null;
      
      return {
        id: task.id,
        title: task.title,
        datetime,
        type: "deadline" as const,
        clientName: task.client.name,
      };
    })
    .filter((event): event is TaskEvent => event !== null);

  // Combine events and ensure they all have valid datetime objects before sorting
  const upcomingEvents = [...jobEvents, ...taskEvents]
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

  // Get events for the current view based on viewMode
  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(selectedDate, "EEEE, MMMM d, yyyy");
      case 'week': {
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      }
      case 'month':
        return format(selectedDate, "MMMM yyyy");
      case 'home':
        return "Schedule Overview";
      default:
        return format(selectedDate, "MMMM d, yyyy");
    }
  };

  const getEventsForCurrentView = () => {
    switch (viewMode) {
      case 'day':
        return { jobs: jobsForSelectedDate, tasks: tasksForSelectedDate };
      case 'week': {
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        const weekJobs = jobs.filter(job => {
          const jobDate = ensureValidDate(job.date);
          return jobDate && weekDays.some(day => isSameDay(jobDate, day));
        });
        
        const weekTasks = tasks.filter(task => 
          weekDays.some(day => isSameDay(task.dueDate, day))
        );
        
        return { jobs: weekJobs, tasks: weekTasks };
      }
      case 'month': {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        const monthJobs = jobs.filter(job => {
          const jobDate = ensureValidDate(job.date);
          return jobDate && monthDays.some(day => isSameDay(jobDate, day));
        });
        
        const monthTasks = tasks.filter(task => 
          monthDays.some(day => isSameDay(task.dueDate, day))
        );
        
        return { jobs: monthJobs, tasks: monthTasks };
      }
      case 'home':
        // Return upcoming events for the next 7 days
        const today = new Date();
        const nextWeek = addDays(today, 7);
        const weekDays = eachDayOfInterval({ start: today, end: nextWeek });
        
        const upcomingJobs = jobs.filter(job => {
          const jobDate = ensureValidDate(job.date);
          return jobDate && weekDays.some(day => isSameDay(jobDate, day));
        });
        
        const upcomingTasks = tasks.filter(task => 
          weekDays.some(day => isSameDay(task.dueDate, day))
        );
        
        return { jobs: upcomingJobs, tasks: upcomingTasks };
      default:
        return { jobs: jobsForSelectedDate, tasks: tasksForSelectedDate };
    }
  };

  const currentViewEvents = getEventsForCurrentView();

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
              {getViewTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Jobs ({currentViewEvents.jobs.length})</h3>
                {currentViewEvents.jobs.length === 0 ? (
                  <p className="text-muted-foreground">No jobs scheduled for this {viewMode}</p>
                ) : (
                  <div className="space-y-3">
                    {currentViewEvents.jobs.map(job => (
                      <Card key={job.id} className="p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-muted-foreground">{job.clientName}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p>${job.amount}</p>
                            <p className="text-muted-foreground capitalize">{job.status.replace('_', ' ')}</p>
                            {viewMode !== 'day' && job.date && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(job.date instanceof Date ? job.date : new Date(job.date), "MMM d")}
                              </p>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Tasks ({currentViewEvents.tasks.length})</h3>
                {currentViewEvents.tasks.length === 0 ? (
                  <p className="text-muted-foreground">No tasks due for this {viewMode}</p>
                ) : (
                  <div className="space-y-3">
                    {currentViewEvents.tasks.map(task => (
                      <Card key={task.id} className="p-3 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">{task.client.name}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="capitalize">{task.status}</p>
                            <p className="text-muted-foreground capitalize">{task.priority} priority</p>
                            {viewMode !== 'day' && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(task.dueDate, "MMM d")}
                              </p>
                            )}
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
      
      {viewMode === 'home' && <UpcomingEvents events={upcomingEvents} />}
    </div>
  );
};

export default CalendarView;
