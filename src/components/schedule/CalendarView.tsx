
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

  // Only show home view now
  const renderHomeView = () => {
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
      
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-7 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(dayName => (
            <div key={dayName} className="text-center font-medium text-sm p-2">
              {dayName}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {/* Today's overview */}
          <Card className="col-span-full border shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex justify-between items-center">
                Today
                <Button variant="outline" size="sm" onClick={() => updateSelectedDateItems(new Date())}>
                  View Details
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Tasks</h4>
                  {tasksForSelectedDate.length > 0 ? (
                    <div className="space-y-2">
                      {tasksForSelectedDate.slice(0, 3).map(task => (
                        <div key={task.id} className="bg-amber-50 p-2 rounded border border-amber-100">
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm">{task.client?.name}</p>
                        </div>
                      ))}
                      {tasksForSelectedDate.length > 3 && (
                        <p className="text-sm text-amber-600">+{tasksForSelectedDate.length - 3} more</p>
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
                        <div key={reminder.id} className="bg-blue-50 p-2 rounded border border-blue-100">
                          <p className="font-medium">{reminder.title}</p>
                          <p className="text-sm">{reminder.client?.name}</p>
                        </div>
                      ))}
                      {tasksForSelectedDate.filter(t => t.isReminder).length > 3 && (
                        <p className="text-sm text-blue-600">+{tasksForSelectedDate.filter(t => t.isReminder).length - 3} more</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No reminders due</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Next 7 days overview cards */}
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(new Date(), i);
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
                      <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                      <span className="text-xs">{dayTasks.filter(t => !t.isReminder).length} tasks</span>
                    </p>
                    <p className="flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs">{dayTasks.filter(t => t.isReminder).length} reminders</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

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
      
      {renderHomeView()}
      
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

export default CalendarView;
