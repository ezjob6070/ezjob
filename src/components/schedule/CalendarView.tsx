import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, 
  addDays, startOfMonth, endOfMonth, addMonths, subMonths,
  startOfDay, endOfDay, addHours, setHours, setMinutes
} from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";
import CalendarViewOptions, { CalendarViewMode } from "./CalendarViewOptions";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

// Helper function to safely get hours from date that could be string or Date
const getHoursFromDate = (date: string | Date): number => {
  if (typeof date === 'string') {
    return new Date(date).getHours();
  }
  return date.getHours();
};

// Helper function to safely check if a date is the same day
function isSameDayHelper(dateA: Date | string | undefined, dateB: Date | string | undefined): boolean {
  if (!dateA || !dateB) return false;
  
  const dateObjA = typeof dateA === 'string' ? new Date(dateA) : dateA;
  const dateObjB = typeof dateB === 'string' ? new Date(dateB) : dateB;
  
  return isSameDay(dateObjA, dateObjB);
}

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
  viewMode,
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
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
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      }
      case 'month':
        return format(selectedDate, "MMMM yyyy");
      default:
        return format(selectedDate, "MMMM d, yyyy");
    }
  };

  const getEventsForCurrentView = () => {
    switch (viewMode) {
      case 'day':
        return { jobs: jobsForSelectedDate, tasks: tasksForSelectedDate };
      case 'week': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
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

  const handlePrevPeriod = () => {
    switch (viewMode) {
      case 'day':
        updateSelectedDateItems(addDays(selectedDate, -1));
        break;
      case 'week':
        updateSelectedDateItems(addDays(selectedDate, -7));
        break;
      case 'month':
        setCurrentMonth(subMonths(currentMonth, 1));
        updateSelectedDateItems(subMonths(selectedDate, 1));
        break;
      default:
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (viewMode) {
      case 'day':
        updateSelectedDateItems(addDays(selectedDate, 1));
        break;
      case 'week':
        updateSelectedDateItems(addDays(selectedDate, 7));
        break;
      case 'month':
        setCurrentMonth(addMonths(currentMonth, 1));
        updateSelectedDateItems(addMonths(selectedDate, 1));
        break;
      default:
        break;
    }
  };

  // Render different calendar views based on viewMode
  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium">{getViewTitle()}</h2>
                <CalendarViewOptions
                  currentView={viewMode}
                  onViewChange={(view) => updateSelectedDateItems(selectedDate)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={handleNextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 24 }).map((_, hour) => {
                const timeSlot = setHours(selectedDate, hour);
                const jobsAtHour = currentViewEvents.jobs.filter(job => {
                  const jobDate = ensureValidDate(job.date);
                  return jobDate && 
                    jobDate.getHours() === hour && 
                    isSameDay(jobDate, selectedDate);
                });
                
                const tasksAtHour = currentViewEvents.tasks.filter(task => {
                  // Fix: Use our helper function to safely get hours from task.dueDate
                  const taskDate = ensureValidDate(task.dueDate);
                  return taskDate && 
                    getHoursFromDate(task.dueDate) === hour && 
                    isSameDay(taskDate, selectedDate);
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
        
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
        
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium">{getViewTitle()}</h2>
                <CalendarViewOptions
                  currentView={viewMode}
                  onViewChange={(view) => updateSelectedDateItems(selectedDate)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={handleNextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
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
                const dayJobs = currentViewEvents.jobs.filter(job => {
                  const jobDate = ensureValidDate(job.date);
                  return jobDate && isSameDay(jobDate, day);
                });
                
                const dayTasks = currentViewEvents.tasks.filter(task => 
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
                              {format(job.date instanceof Date ? job.date : new Date(job.date), "h:mm a")}
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
        
      case 'month':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-medium">{getViewTitle()}</h2>
                <CalendarViewOptions
                  currentView={viewMode}
                  onViewChange={(view) => updateSelectedDateItems(selectedDate)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={handleNextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              className="border rounded-md shadow-sm w-full max-w-4xl mx-auto bg-white"
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
                        "h-12 w-12 p-0 font-normal aria-selected:opacity-100 rounded-md relative pointer-events-auto flex flex-col items-center justify-center",
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

      case 'home':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-7 gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
                <div key={dayName} className="text-center font-medium text-sm p-2">
                  {dayName}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
              {/* Today's overview */}
              <Card className="col-span-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex justify-between items-center">
                    Today
                    <Button variant="outline" size="sm" onClick={() => updateSelectedDateItems(new Date())}>
                      View Details
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Upcoming Jobs</h4>
                      {jobsForSelectedDate.length > 0 ? (
                        <div className="space-y-2">
                          {jobsForSelectedDate.slice(0, 2).map(job => (
                            <div key={job.id} className="bg-blue-50 p-2 rounded border border-blue-100">
                              <p className="font-medium">{job.title}</p>
                              <p className="text-sm">{job.clientName}</p>
                            </div>
                          ))}
                          {jobsForSelectedDate.length > 2 && (
                            <p className="text-sm text-blue-600">+{jobsForSelectedDate.length - 2} more</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No jobs scheduled</p>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Tasks Due</h4>
                      {tasksForSelectedDate.length > 0 ? (
                        <div className="space-y-2">
                          {tasksForSelectedDate.slice(0, 2).map(task => (
                            <div key={task.id} className="bg-amber-50 p-2 rounded border border-amber-100">
                              <p className="font-medium">{task.title}</p>
                              <p className="text-sm">{task.client?.name}</p>
                            </div>
                          ))}
                          {tasksForSelectedDate.length > 2 && (
                            <p className="text-sm text-amber-600">+{tasksForSelectedDate.length - 2} more</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No tasks due</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Next 7 days overview cards */}
              {Array.from({ length: 7 }).map((_, i) => {
                const day = addDays(new Date(), i);
                const dayJobs = jobs.filter(job => {
                  const jobDate = ensureValidDate(job.date);
                  return jobDate && isSameDay(jobDate, day);
                });
                
                const dayTasks = tasks.filter(task => 
                  isSameDay(task.dueDate, day)
                );
                
                const isToday = i === 0;
                
                return (
                  <Card 
                    key={i} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md", 
                      isToday && "border-primary"
                    )}
                    onClick={() => updateSelectedDateItems(day)}
                  >
                    <CardHeader className={cn("pb-2", isToday && "bg-primary text-primary-foreground")}>
                      <CardTitle className="text-base flex flex-col items-center">
                        <span>{format(day, "EEE")}</span>
                        <span className="text-2xl font-bold">{format(day, "d")}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3">
                      <div className="space-y-1 text-center">
                        <p className="flex items-center justify-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          <span className="text-xs">{dayJobs.length} jobs</span>
                        </p>
                        <p className="flex items-center justify-center gap-1">
                          <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                          <span className="text-xs">{dayTasks.length} tasks</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="pb-8">
            {renderCalendarView()}
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
                            <p className="text-sm text-muted-foreground">{task.client?.name}</p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="capitalize">{task.status}</p>
                            <p className="text-muted-foreground capitalize">{task.priority} priority</p>
                            {viewMode !== 'day' && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {format(task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate), "MMM d")}
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
