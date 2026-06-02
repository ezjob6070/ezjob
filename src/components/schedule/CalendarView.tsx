import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval,
  addDays, startOfMonth, endOfMonth, addMonths, subMonths,
  startOfDay, endOfDay, addHours, setHours, setMinutes, isAfter
} from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";
import UpcomingEvents from "@/components/UpcomingEvents";
import { CalendarViewMode } from "./CalendarViewOptions";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import CalendarViewOptions from "./CalendarViewOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
function getHoursFromDate(date: Date | string): number {
  if (date instanceof Date) {
    return date.getHours();
  }
  if (typeof date === 'string') {
    return new Date(date).getHours();
  }
  return 0;
}

// Helper function to safely check if a date is the same day
function isSameDayHelper(dateA: Date | string | undefined, dateB: Date | string | undefined): boolean {
  if (!dateA || !dateB) return false;
  
  const dateObjA = typeof dateA === 'string' ? new Date(dateA) : dateA;
  const dateObjB = typeof dateB === 'string' ? new Date(dateB) : dateB;
  
  return isSameDay(dateObjA, dateObjB);
}

interface CalendarViewProps {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
  viewMode,
  onViewChange,
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
            <div className="grid grid-cols-1 gap-4 min-w-[600px]">
              {Array.from({ length: 24 }).map((_, hour) => {
                const timeSlot = setHours(selectedDate, hour);
                const jobsAtHour = currentViewEvents.jobs.filter(job => {
                  const jobDate = ensureValidDate(job.date);
                  return jobDate && 
                    jobDate instanceof Date &&
                    jobDate.getHours() === hour && 
                    isSameDay(jobDate, selectedDate);
                });
                
                const tasksAtHour = currentViewEvents.tasks.filter(task => {
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
        
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
        
        return (
          <div className="space-y-4 min-w-[800px]">
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
          <div className="w-full">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="border rounded-md shadow-sm w-full pointer-events-auto p-3 [&_table]:w-full [&_.rdp-cell]:p-0 [&_.rdp-head_cell]:w-11"
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
              modifiersClassNames={{ hasEvents: "font-bold" }}
              components={{
                Day: ({ date, displayMonth, ...props }) => {
                  const isSelected = isSameDay(date, selectedDate);
                  const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
                  const hasJobs = jobs.some(job => {
                    const jobDate = ensureValidDate(job.date);
                    return jobDate && isSameDay(jobDate, date);
                  });
                  const hasTasks = tasks.some(task => {
                    const taskDate = ensureValidDate(task.dueDate);
                    return taskDate && isSameDay(taskDate, date);
                  });
                  const hasHighPriority = tasks.some(task => {
                    const taskDate = ensureValidDate(task.dueDate);
                    return taskDate && isSameDay(taskDate, date) && task.priority === 'high';
                  });

                  return (
                    <button
                      type="button"
                      className={cn(
                        "h-11 w-11 p-0 aria-selected:opacity-100 rounded-md relative pointer-events-auto flex flex-col items-center justify-center text-sm mx-auto",
                        getDayClassName(date),
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                        isOutsideMonth && "text-muted-foreground opacity-50"
                      )}
                      disabled={isOutsideMonth}
                      onClick={() => handleDateSelect(date)}
                      {...props}
                    >
                      <span>{format(date, "d")}</span>
                      {(hasJobs || hasTasks) && !isSelected && (
                        <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
                          {hasJobs && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                          {hasTasks && <div className={cn("w-1.5 h-1.5 rounded-full", hasHighPriority ? "bg-red-500" : "bg-amber-500")} />}
                        </div>
                      )}
                    </button>
                  );
                }
              }}
            />

            <div className="flex justify-center gap-4 mt-3 px-2 w-full flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Jobs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-muted-foreground">Tasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-muted-foreground">High Priority</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Sort helpers for the selected-day panel
  const sortedDayJobs = [...jobsForSelectedDate].sort((a, b) => {
    const da = ensureValidDate(a.date)?.getTime() ?? 0;
    const db = ensureValidDate(b.date)?.getTime() ?? 0;
    return da - db;
  });
  const sortedDayTasks = [...tasksForSelectedDate].sort((a, b) => {
    const da = ensureValidDate(a.dueDate)?.getTime() ?? 0;
    const db = ensureValidDate(b.dueDate)?.getTime() ?? 0;
    return da - db;
  });

  // Hours 7am–8pm for the compact timeline
  const timelineHours = Array.from({ length: 14 }, (_, i) => i + 7);

  const isMonthMode = viewMode === 'month';

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid grid-cols-1 gap-6",
        isMonthMode ? "lg:grid-cols-2" : "md:grid-cols-3"
      )}>
        <Card className={cn("flex flex-col", !isMonthMode && "md:col-span-2 overflow-x-auto")}>
          <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-base truncate">{getViewTitle()}</CardTitle>
              <Button variant="outline" size="icon" onClick={handleNextPeriod}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <CalendarViewOptions
              currentView={viewMode}
              onViewChange={onViewChange}
            />
          </CardHeader>
          <CardContent className={cn("pb-6 flex-1", !isMonthMode && "overflow-x-auto")}>
            <div className={cn("h-full", !isMonthMode && "min-w-fit")}>
              {renderCalendarView()}
            </div>
          </CardContent>
        </Card>

        <Card className={cn("flex flex-col", !isMonthMode && "md:col-span-1")}>
          <CardHeader className="pb-3 flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">
                {format(selectedDate, "EEEE, MMM d")}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {sortedDayJobs.length} job{sortedDayJobs.length !== 1 && 's'} · {sortedDayTasks.length} task{sortedDayTasks.length !== 1 && 's'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => setAllJobsOpen(true)}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              All jobs
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-5">
            {/* Hourly timeline strip */}
            <div className="rounded-md border bg-muted/30 p-2">
              <div className="grid gap-px" style={{ gridTemplateColumns: `repeat(${timelineHours.length}, minmax(0, 1fr))` }}>
                {timelineHours.map(hour => {
                  const jobsAtHour = sortedDayJobs.filter(j => {
                    const d = ensureValidDate(j.date);
                    return d && d.getHours() === hour;
                  });
                  const tasksAtHour = sortedDayTasks.filter(t => {
                    const td = ensureValidDate(t.dueDate);
                    return td && td.getHours() === hour;
                  });
                  const hasJob = jobsAtHour.length > 0;
                  const hasTask = tasksAtHour.length > 0;
                  return (
                    <div key={hour} className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "h-6 w-full rounded-sm",
                          hasJob && hasTask ? "bg-purple-400" :
                          hasJob ? "bg-blue-400" :
                          hasTask ? "bg-amber-400" :
                          "bg-muted"
                        )}
                        title={`${format(setHours(selectedDate, hour), "h a")}: ${jobsAtHour.length} job(s), ${tasksAtHour.length} task(s)`}
                      />
                      <span className="text-[9px] text-muted-foreground leading-none">
                        {hour === 12 ? '12p' : hour > 12 ? `${hour - 12}p` : `${hour}a`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jobs */}
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Jobs ({sortedDayJobs.length})
              </h3>
              {sortedDayJobs.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No jobs scheduled</p>
              ) : (
                <div className="space-y-2">
                  {sortedDayJobs.map(job => {
                    const d = ensureValidDate(job.date);
                    return (
                      <button
                        key={job.id}
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="w-full text-left flex items-start gap-3 p-2.5 rounded-md border bg-blue-50/50 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                      >
                        <div className="text-xs font-semibold text-blue-700 w-14 shrink-0 pt-0.5">
                          {d ? format(d, "h:mm a") : "—"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{job.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{job.clientName}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-medium">${job.amount}</p>
                          <p className="text-[10px] text-muted-foreground capitalize">{job.status.replace('_', ' ')}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Tasks */}
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Tasks ({sortedDayTasks.length})
              </h3>
              {sortedDayTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">No tasks due</p>
              ) : (
                <div className="space-y-2">
                  {sortedDayTasks.map(task => {
                    const td = ensureValidDate(task.dueDate);
                    return (
                      <div key={task.id} className="flex items-start gap-3 p-2.5 rounded-md border bg-amber-50/50 hover:bg-amber-50 transition-colors">
                        <div className="text-xs font-semibold text-amber-700 w-14 shrink-0 pt-0.5">
                          {td ? format(td, "h:mm a") : "—"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{task.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{task.client?.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={cn(
                            "inline-block text-[10px] px-1.5 py-0.5 rounded capitalize",
                            task.priority === 'high' ? "bg-red-100 text-red-700" :
                            task.priority === 'medium' ? "bg-amber-100 text-amber-700" :
                            "bg-gray-100 text-gray-700"
                          )}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {!isMonthMode && <UpcomingEvents events={upcomingEvents} />}

      {/* Job detail dialog */}
      <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
        <DialogContent className="max-w-md">
          {selectedJob && (() => {
            const d = ensureValidDate(selectedJob.date);
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedJob.title}</DialogTitle>
                  <DialogDescription>
                    {selectedJob.clientName}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Date & Time</span>
                    <span className="font-medium">{d ? format(d, "EEE, MMM d · h:mm a") : "—"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Status</span>
                    <Badge variant="outline" className="capitalize">{selectedJob.status.replace('_', ' ')}</Badge>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">${selectedJob.amount}</span>
                  </div>
                  {selectedJob.technicianName && (
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Technician</span>
                      <span className="font-medium">{selectedJob.technicianName}</span>
                    </div>
                  )}
                  {selectedJob.address && (
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground shrink-0">Address</span>
                      <span className="font-medium text-right">{selectedJob.address}</span>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* All upcoming jobs dialog */}
      <Dialog open={allJobsOpen} onOpenChange={setAllJobsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>All Upcoming Jobs</DialogTitle>
            <DialogDescription>
              {allUpcomingJobs.length} job{allUpcomingJobs.length !== 1 && 's'} scheduled from today onward
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-y-auto space-y-2 pr-1">
            {allUpcomingJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No upcoming jobs.</p>
            ) : (
              allUpcomingJobs.map(job => {
                const d = ensureValidDate(job.date);
                return (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => {
                      if (d) updateSelectedDateItems(d);
                      setAllJobsOpen(false);
                      setSelectedJob(job);
                    }}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-md border bg-card hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center w-14 shrink-0 bg-blue-50 rounded-md p-1.5 text-blue-700">
                      <span className="text-[10px] font-semibold uppercase">{d ? format(d, "MMM") : "—"}</span>
                      <span className="text-lg font-bold leading-none">{d ? format(d, "d") : "—"}</span>
                      <span className="text-[10px] mt-0.5">{d ? format(d, "h:mma") : ""}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{job.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{job.clientName}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">${job.amount}</p>
                      <Badge variant="outline" className="text-[10px] capitalize mt-1">{job.status.replace('_', ' ')}</Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
