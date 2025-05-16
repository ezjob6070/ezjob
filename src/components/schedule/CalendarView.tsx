
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, 
  addDays, startOfMonth, endOfMonth, addMonths, subMonths,
  startOfDay, endOfDay, addHours, setHours, setMinutes, 
  isSameMonth, addWeeks, subWeeks, getDay, startOfToday,
  isToday
} from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";
import { CalendarViewMode } from "./CalendarViewOptions";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";

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

// Function to get items for a specific date
function getItemsForDate(date: Date, jobs: Job[], tasks: Task[]) {
  const jobsForDate = jobs.filter(job => {
    const jobDate = ensureValidDate(job.date);
    return jobDate && isSameDay(jobDate, date);
  });

  const tasksForDate = tasks.filter(task => isSameDay(task.dueDate, date));
  
  return { jobsForDate, tasksForDate };
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
  const [weekStartDate, setWeekStartDate] = useState<Date>(
    startOfWeek(selectedDate, { weekStartsOn: 1 }) // Start week on Monday
  );
  
  // Update week start date when selectedDate changes
  useEffect(() => {
    setWeekStartDate(startOfWeek(selectedDate, { weekStartsOn: 1 }));
  }, [selectedDate]);
  
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

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handlePreviousWeek = () => {
    setWeekStartDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setWeekStartDate(prev => addWeeks(prev, 1));
  };

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

  // Function to render month view
  const renderMonthView = () => {
    return (
      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          className="rounded-md w-full border-none pointer-events-auto"
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
              
              // Get jobs and tasks for this date
              const { jobsForDate, tasksForDate } = getItemsForDate(date, jobs, tasks);
              
              return (
                <div 
                  className={cn(
                    "h-20 min-w-[5rem] p-1 rounded-md relative",
                    getDayClassName(date),
                    isSelected && "ring-2 ring-primary",
                    isOutsideMonth && "opacity-40"
                  )}
                >
                  <button 
                    type="button"
                    className={cn(
                      "absolute top-1 right-1 h-6 w-6 flex items-center justify-center rounded-full text-sm",
                      isToday(date) && "bg-primary text-primary-foreground",
                      isSelected && !isToday(date) && "font-bold"
                    )}
                    onClick={() => handleDateSelect(date)}
                    disabled={isOutsideMonth}
                    {...props}
                  >
                    {format(date, "d")}
                  </button>
                  
                  <div className="mt-6 overflow-hidden max-h-[calc(100%-1.5rem)]">
                    {jobsForDate.length > 0 && (
                      <div className="text-xs mb-1 line-clamp-1">
                        <div className="bg-blue-100 rounded px-1 py-0.5 text-blue-800 mb-0.5 truncate">
                          {jobsForDate.length > 1 
                            ? `${jobsForDate.length} jobs` 
                            : jobsForDate[0].title || "Job"}
                        </div>
                      </div>
                    )}
                    
                    {tasksForDate.filter(t => !t.isReminder).length > 0 && (
                      <div className="text-xs mb-1 line-clamp-1">
                        <div className="bg-amber-100 rounded px-1 py-0.5 text-amber-800 mb-0.5 truncate">
                          {tasksForDate.filter(t => !t.isReminder).length > 1 
                            ? `${tasksForDate.filter(t => !t.isReminder).length} tasks` 
                            : tasksForDate.filter(t => !t.isReminder)[0].title}
                        </div>
                      </div>
                    )}
                    
                    {tasksForDate.filter(t => t.isReminder).length > 0 && (
                      <div className="text-xs line-clamp-1">
                        <div className="bg-purple-100 rounded px-1 py-0.5 text-purple-800 truncate">
                          {tasksForDate.filter(t => t.isReminder).length > 1 
                            ? `${tasksForDate.filter(t => t.isReminder).length} reminders` 
                            : tasksForDate.filter(t => t.isReminder)[0].title}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }}
        />
      </div>
    );
  };
  
  // Function to render day view
  const renderDayView = () => {
    const hoursOfDay = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM to 8 PM
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h2>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateSelectedDateItems(addDays(selectedDate, -1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Day
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => updateSelectedDateItems(addDays(selectedDate, 1))}
            >
              Next Day <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <div className="bg-muted/20 p-3 border-b">
            <h3 className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</h3>
            {isToday(selectedDate) && (
              <Badge variant="outline" className="bg-primary/10 text-primary mt-1">Today</Badge>
            )}
          </div>
          
          <div className="divide-y">
            {hoursOfDay.map((hour) => {
              const hourStart = setHours(selectedDate, hour);
              const hourEnd = setHours(selectedDate, hour + 1);
              
              const hourTasks = tasksForSelectedDate.filter(task => {
                const taskStart = new Date(task.start || task.dueDate);
                return taskStart.getHours() === hour;
              });
              
              const hourJobs = jobsForSelectedDate.filter(job => {
                const jobDate = ensureValidDate(job.date);
                return jobDate && jobDate.getHours() === hour;
              });
              
              return (
                <div key={hour} className="flex p-2 min-h-16">
                  <div className="w-16 text-muted-foreground text-sm py-2 text-center">
                    {format(hourStart, "h a")}
                  </div>
                  
                  <div className="flex-1 min-h-12 pl-2">
                    {hourJobs.map(job => (
                      <div key={job.id} className="mb-1 p-1.5 bg-blue-100 text-blue-800 rounded border border-blue-200 text-sm">
                        <div className="font-medium">{job.title || "Untitled Job"}</div>
                        <div className="text-xs">{job.clientName}</div>
                      </div>
                    ))}
                    
                    {hourTasks.map(task => (
                      <div 
                        key={task.id}
                        className={cn(
                          "mb-1 p-1.5 rounded border text-sm",
                          task.isReminder 
                            ? "bg-purple-100 text-purple-800 border-purple-200" 
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        )}
                      >
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs">{task.client?.name}</div>
                      </div>
                    ))}
                    
                    {hourJobs.length === 0 && hourTasks.length === 0 && (
                      <div className="h-4"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  // Function to render week view
  const renderWeekView = () => {
    // Create array with the days of the current week
    const weekDays = eachDayOfInterval({
      start: weekStartDate,
      end: addDays(weekStartDate, 6)
    });
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {format(weekStartDate, "MMM d")} - {format(addDays(weekStartDate, 6), "MMM d, yyyy")}
          </h2>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={handlePreviousWeek}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous Week
            </Button>
            <Button variant="outline" size="sm" onClick={handleNextWeek}>
              Next Week <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          {/* Week header with days */}
          <div className="grid grid-cols-7 bg-muted/20 border-b">
            {weekDays.map((day, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-2 text-center border-r last:border-r-0",
                  isSameDay(day, selectedDate) && "bg-primary/10"
                )}
                onClick={() => updateSelectedDateItems(day)}
              >
                <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
                <div className={cn(
                  "text-lg font-medium",
                  isToday(day) && "text-primary"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          
          {/* Week grid with events */}
          <div className="grid grid-cols-7 divide-x">
            {weekDays.map((day, dayIndex) => {
              const { jobsForDate, tasksForDate } = getItemsForDate(day, jobs, tasks);
              
              return (
                <div key={dayIndex} className={cn(
                  "min-h-[250px] divide-y p-1",
                  isSameDay(day, selectedDate) && "bg-primary/5"
                )}>
                  {/* Show events for this day */}
                  <div className="space-y-1 pt-1">
                    {jobsForDate.map(job => (
                      <div key={job.id} className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate border border-blue-200">
                        {job.title || "Untitled Job"}
                      </div>
                    ))}
                    
                    {tasksForDate.filter(t => !t.isReminder).map(task => (
                      <div 
                        key={task.id} 
                        className="text-xs p-1 bg-amber-100 text-amber-800 rounded truncate border border-amber-200"
                      >
                        {task.title}
                      </div>
                    ))}
                    
                    {tasksForDate.filter(t => t.isReminder).map(reminder => (
                      <div 
                        key={reminder.id} 
                        className="text-xs p-1 bg-purple-100 text-purple-800 rounded truncate border border-purple-200"
                      >
                        {reminder.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Render appropriate view based on viewMode
  const renderView = () => {
    switch(viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
        return renderMonthView();
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        {renderView()}
        
        <div className="flex justify-center gap-6 mt-4 px-4 w-full flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div>
            <span className="text-sm">Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
            <span className="text-sm">Jobs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-500"></div>
            <span className="text-sm">Reminders</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Daily Overview Section */}
        <Card className="border shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex justify-between items-center">
              {format(selectedDate, "MMMM d, yyyy")} - Overview
              <Badge variant={isToday(selectedDate) ? "default" : "outline"}>{isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Jobs</h4>
                {jobsForSelectedDate.length > 0 ? (
                  <div className="space-y-2">
                    {jobsForSelectedDate.slice(0, 3).map(job => (
                      <div key={job.id} className="bg-blue-50 p-2 rounded border border-blue-100">
                        <p className="font-medium">{job.title || "Untitled Job"}</p>
                        <p className="text-sm">{job.clientName}</p>
                      </div>
                    ))}
                    {jobsForSelectedDate.length > 3 && (
                      <p className="text-sm text-blue-600">+{jobsForSelectedDate.length - 3} more jobs</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No jobs scheduled</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Tasks</h4>
                {tasksForSelectedDate.filter(t => !t.isReminder).length > 0 ? (
                  <div className="space-y-2">
                    {tasksForSelectedDate.filter(t => !t.isReminder).slice(0, 3).map(task => (
                      <div key={task.id} className="bg-amber-50 p-2 rounded border border-amber-100">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm">{task.client?.name}</p>
                      </div>
                    ))}
                    {tasksForSelectedDate.filter(t => !t.isReminder).length > 3 && (
                      <p className="text-sm text-amber-600">+{tasksForSelectedDate.filter(t => !t.isReminder).length - 3} more tasks</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tasks due</p>
                )}
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Reminders</h4>
                {tasksForSelectedDate.filter(t => t.isReminder).length > 0 ? (
                  <div className="space-y-2">
                    {tasksForSelectedDate.filter(t => t.isReminder).slice(0, 3).map(reminder => (
                      <div key={reminder.id} className="bg-purple-50 p-2 rounded border border-purple-100">
                        <p className="font-medium">{reminder.title}</p>
                        <p className="text-sm">{reminder.client?.name}</p>
                      </div>
                    ))}
                    {tasksForSelectedDate.filter(t => t.isReminder).length > 3 && (
                      <p className="text-sm text-purple-600">+{tasksForSelectedDate.filter(t => t.isReminder).length - 3} more reminders</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No reminders due</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <UpcomingEvents events={upcomingEvents} />
      </div>
    </div>
  );
};

export default CalendarView;
