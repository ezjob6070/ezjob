
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, 
  addDays, startOfMonth, endOfMonth, addMonths, subMonths,
  startOfDay, endOfDay, addHours, setHours, setMinutes
} from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";
import { CalendarViewMode } from "./CalendarViewOptions";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";

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

  const renderDayView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border shadow">
          <h3 className="font-medium text-lg mb-4">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Morning Hours */}
              <div className="border rounded-md p-3">
                <h4 className="font-medium mb-2">Morning</h4>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const hour = idx + 6; // 6 AM to 11 AM
                    const hourDate = setHours(selectedDate, hour);
                    const hourEvents = [...jobEvents, ...taskEvents].filter(event => 
                      isSameDay(event.datetime, selectedDate) && 
                      getHoursFromDate(event.datetime) === hour
                    );
                    
                    return (
                      <div key={`morning-${hour}`} className="flex items-start py-2 border-b last:border-b-0">
                        <div className="w-12 font-medium text-sm">{format(hourDate, 'h a')}</div>
                        <div className="flex-1">
                          {hourEvents.length > 0 ? (
                            hourEvents.map(event => (
                              <div key={event.id} className={`rounded-md p-1 px-2 mb-1 text-sm ${event.type === 'meeting' ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'}`}>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">{event.clientName}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-sm italic">No events</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Afternoon Hours */}
              <div className="border rounded-md p-3">
                <h4 className="font-medium mb-2">Afternoon</h4>
                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const hour = idx + 12; // 12 PM to 5 PM
                    const hourDate = setHours(selectedDate, hour);
                    const hourEvents = [...jobEvents, ...taskEvents].filter(event => 
                      isSameDay(event.datetime, selectedDate) && 
                      getHoursFromDate(event.datetime) === hour
                    );
                    
                    return (
                      <div key={`afternoon-${hour}`} className="flex items-start py-2 border-b last:border-b-0">
                        <div className="w-12 font-medium text-sm">{format(hourDate, 'h a')}</div>
                        <div className="flex-1">
                          {hourEvents.length > 0 ? (
                            hourEvents.map(event => (
                              <div key={event.id} className={`rounded-md p-1 px-2 mb-1 text-sm ${event.type === 'meeting' ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'}`}>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">{event.clientName}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-sm italic">No events</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Evening Hours */}
              <div className="border rounded-md p-3 md:col-span-2">
                <h4 className="font-medium mb-2">Evening</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, idx) => {
                    const hour = idx + 18; // 6 PM to 11 PM
                    const hourDate = setHours(selectedDate, hour);
                    const hourEvents = [...jobEvents, ...taskEvents].filter(event => 
                      isSameDay(event.datetime, selectedDate) && 
                      getHoursFromDate(event.datetime) === hour
                    );
                    
                    return (
                      <div key={`evening-${hour}`} className="flex items-start py-2 border-b last:border-b-0">
                        <div className="w-12 font-medium text-sm">{format(hourDate, 'h a')}</div>
                        <div className="flex-1">
                          {hourEvents.length > 0 ? (
                            hourEvents.map(event => (
                              <div key={event.id} className={`rounded-md p-1 px-2 mb-1 text-sm ${event.type === 'meeting' ? 'bg-blue-50 border border-blue-100' : 'bg-amber-50 border border-amber-100'}`}>
                                <div className="font-medium">{event.title}</div>
                                <div className="text-xs text-muted-foreground">{event.clientName}</div>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted-foreground text-sm italic">No events</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Get the start of the week (Sunday) for the selected date
    const startOfTheWeek = startOfWeek(selectedDate);
    // Get the end of the week (Saturday) for the selected date
    const endOfTheWeek = endOfWeek(selectedDate);
    // Get all days in the week
    const weekDays = eachDayOfInterval({ start: startOfTheWeek, end: endOfTheWeek });

    return (
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-md border shadow">
          <h3 className="font-medium text-lg mb-4">
            {format(startOfTheWeek, 'MMM d')} - {format(endOfTheWeek, 'MMM d, yyyy')}
          </h3>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-7 gap-2 min-w-[700px]">
              {/* Day headers */}
              {weekDays.map((day, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "text-center p-2 font-medium border-b-2",
                    isSameDay(day, new Date()) && "border-primary",
                    !isSameDay(day, new Date()) && "border-transparent"
                  )}
                >
                  <div className="text-muted-foreground text-xs">{format(day, 'EEE')}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                </div>
              ))}
              
              {/* Main content grid */}
              {weekDays.map((day, dayIndex) => {
                // Get all events for this day
                const dayEvents = [...jobEvents, ...taskEvents].filter(event => 
                  isSameDay(event.datetime, day)
                ).sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
                
                return (
                  <div key={dayIndex} className="border rounded-md h-40 overflow-y-auto p-1">
                    {dayEvents.length > 0 ? (
                      dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={cn(
                            "rounded text-xs p-1 mb-1 truncate",
                            event.type === 'meeting' ? "bg-blue-50 border border-blue-100" : "bg-amber-50 border border-amber-100"
                          )}
                          title={`${event.title} - ${event.clientName}`}
                        >
                          <div className="font-medium">{format(event.datetime, 'h:mm a')} {event.title}</div>
                          <div className="text-xs opacity-75 truncate">{event.clientName}</div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground text-xs italic">
                        No events
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="outline" size="sm" onClick={() => {
                const prevMonth = subMonths(currentMonth, 1);
                setCurrentMonth(prevMonth);
              }}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium">{format(currentMonth, "MMMM yyyy")}</h2>
              <Button variant="outline" size="sm" onClick={() => {
                const nextMonth = addMonths(currentMonth, 1);
                setCurrentMonth(nextMonth);
              }}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              className="rounded-md w-full max-w-4xl mx-auto border-none"
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
                          {tasks.some(task => {
                            const taskDate = ensureValidDate(task.dueDate);
                            return taskDate && isSameDay(taskDate, date) && !task.isReminder;
                          }) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                          )}
                          {tasks.some(task => {
                            const taskDate = ensureValidDate(task.dueDate);
                            return taskDate && isSameDay(taskDate, date) && task.isReminder;
                          }) && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                          )}
                        </div>
                      )}
                    </button>
                  );
                }
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-6 mt-4 px-4 w-full flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div>
            <span className="text-sm">Tasks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
            <span className="text-sm">Reminders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div>
            <span className="text-sm">High Priority</span>
          </div>
        </div>
        
        <UpcomingEvents events={upcomingEvents} />
      </div>
    );
  };

  // Render the current view based on the viewMode
  const renderCurrentView = () => {
    switch (viewMode) {
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
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default CalendarView;
