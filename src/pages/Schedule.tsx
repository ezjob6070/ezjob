
import { useState, useEffect } from "react";
import { Job } from "@/types/job";
import { 
  isSameDay, format, isToday, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, addMonths, subMonths,
  addWeeks, subWeeks, addDays, subDays
} from "date-fns";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus, Clock, AlarmClock, Bell } from "lucide-react";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import CalendarViewOptions, { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import TasksView from "@/components/schedule/TasksView";

const Schedule = () => {
  const { jobs: globalJobs } = useGlobalState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showAddReminderDialog, setShowAddReminderDialog] = useState(false);
  const [showTasksManagerDialog, setShowTasksManagerDialog] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    id: "",
    title: "",
    dueDate: new Date(),
    priority: "medium",
    status: "scheduled",
    client: { name: "" },
    description: "",
  });
  const [newReminder, setNewReminder] = useState<Partial<Task>>({
    id: "",
    title: "",
    dueDate: new Date(),
    status: "scheduled",
    client: { name: "" },
    description: "",
    isReminder: true
  });

  // Sync with global jobs
  useEffect(() => {
    setJobs(globalJobs as Job[]);
  }, [globalJobs]);

  // Update filtered items based on view mode and selected date
  useEffect(() => {
    let relevantJobs: Job[] = [];
    let relevantTasks: Task[] = [];

    if (viewMode === "day") {
      // Filter for the selected day only
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return isSameDay(jobDate, selectedDate);
      });
      
      relevantTasks = tasks.filter(task => isSameDay(task.dueDate, selectedDate));
    } 
    else if (viewMode === "week") {
      // Filter for the selected week
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 0 });
      
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return jobDate >= weekStart && jobDate <= weekEnd;
      });
      
      relevantTasks = tasks.filter(task => {
        const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
    } 
    else if (viewMode === "month") {
      // Filter for the selected month
      const monthStart = startOfMonth(selectedDate);
      const monthEnd = endOfMonth(selectedDate);
      
      relevantJobs = jobs.filter(job => {
        if (!job.date) return false;
        const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
        return jobDate >= monthStart && jobDate <= monthEnd;
      });
      
      relevantTasks = tasks.filter(task => {
        const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
        return taskDate >= monthStart && taskDate <= monthEnd;
      });
    }
    
    setJobsForSelectedDate(relevantJobs);
    setTasksForSelectedDate(relevantTasks);
  }, [jobs, tasks, selectedDate, viewMode]);

  const handlePreviousDate = () => {
    if (viewMode === "day") {
      setSelectedDate(prev => subDays(prev, 1));
    } else if (viewMode === "week") {
      setSelectedDate(prev => subWeeks(prev, 1));
    } else if (viewMode === "month") {
      setSelectedDate(prev => subMonths(prev, 1));
    }
  };

  const handleNextDate = () => {
    if (viewMode === "day") {
      setSelectedDate(prev => addDays(prev, 1));
    } else if (viewMode === "week") {
      setSelectedDate(prev => addWeeks(prev, 1));
    } else if (viewMode === "month") {
      setSelectedDate(prev => addMonths(prev, 1));
    }
  };

  const handleTodayClick = () => {
    setSelectedDate(new Date());
  };

  const handleViewChange = (newView: CalendarViewMode) => {
    setViewMode(newView);
  };

  const handleAddTask = () => {
    const taskDueDate = newTask.dueDate || new Date();
    const isoString = taskDueDate instanceof Date ? taskDueDate.toISOString() : taskDueDate;
    
    const task: Task = {
      id: uuid(),
      title: newTask.title || "New Task",
      dueDate: newTask.dueDate || new Date(),
      priority: newTask.priority as "high" | "medium" | "low" | "urgent",
      status: newTask.status || "scheduled",
      client: { name: newTask.client?.name || "No Client" },
      description: newTask.description || "",
      start: isoString,
      end: isoString
    };
    
    setTasks(prevTasks => [...prevTasks, task]);
    setShowAddTaskDialog(false);
    setNewTask({
      id: "",
      title: "",
      dueDate: new Date(),
      priority: "medium",
      status: "scheduled",
      client: { name: "" },
      description: "",
    });
    toast.success("Task added successfully");
  };

  const handleAddReminder = () => {
    const reminderDueDate = newReminder.dueDate || new Date();
    const isoString = reminderDueDate instanceof Date ? reminderDueDate.toISOString() : reminderDueDate;
    
    const reminder: Task = {
      id: uuid(),
      title: newReminder.title || "New Reminder",
      dueDate: newReminder.dueDate || new Date(),
      status: newReminder.status || "scheduled",
      client: { name: newReminder.client?.name || "No Client" },
      description: newReminder.description || "",
      start: isoString,
      end: isoString,
      isReminder: true
    };
    
    setTasks(prevTasks => [...prevTasks, reminder]);
    setShowAddReminderDialog(false);
    setNewReminder({
      id: "",
      title: "",
      dueDate: new Date(),
      status: "scheduled",
      client: { name: "" },
      description: "",
      isReminder: true
    });
    toast.success("Reminder added successfully");
  };

  const handleTasksChange = (updatedTasks: Task[]) => {
    setTasks(prevTasks => {
      // Update only the tasks from the selected date
      const tasksForOtherDates = prevTasks.filter(task => 
        !isSameDay(task.dueDate, selectedDate)
      );
      return [...tasksForOtherDates, ...updatedTasks];
    });
    toast.success("Tasks updated successfully");
  };

  const handleViewAllTasks = () => {
    setShowTasksManagerDialog(true);
  };

  // Render the Month View
  const renderMonthView = () => {
    return (
      <div className="border rounded-md p-4 bg-white">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="pointer-events-auto w-full"
          modifiers={{
            hasEvents: (date) => 
              jobs.some(job => {
                const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
                return isSameDay(jobDate, date);
              }) || 
              tasks.some(task => {
                const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                return isSameDay(taskDate, date);
              }),
          }}
          modifiersClassNames={{
            hasEvents: "font-bold bg-blue-50 text-blue-700",
            today: "border border-primary",
            selected: "bg-primary text-primary-foreground"
          }}
          components={{
            Day: ({ date, displayMonth, ...props }) => {
              // Get jobs and tasks for this day
              const dayJobs = jobs.filter(job => {
                const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
                return isSameDay(jobDate, date);
              });
              
              const dayTasks = tasks.filter(task => {
                const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                return isSameDay(taskDate, date);
              });
              
              const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
              const isSelectedDay = isSameDay(date, selectedDate);
              
              return (
                <div 
                  className={cn(
                    "h-24 w-full p-1 font-normal flex flex-col relative",
                    isToday(date) && "border border-primary rounded-md",
                    isSelectedDay && "bg-primary/10 rounded-md",
                    !isCurrentMonth && "text-muted-foreground opacity-50",
                    (dayJobs.length > 0 || dayTasks.length > 0) && !isSelectedDay && "bg-blue-50"
                  )}
                  onClick={() => setSelectedDate(date)}
                  {...props}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={cn(
                      "text-lg font-medium",
                      isToday(date) && "text-primary",
                      isSelectedDay && "font-bold"
                    )}>
                      {format(date, "d")}
                    </span>
                    {(dayJobs.length > 0 || dayTasks.length > 0) && (
                      <div className="flex gap-1">
                        {dayJobs.length > 0 && (
                          <Badge variant="outline" className="bg-blue-100 text-xs py-0 px-1 h-4">
                            {dayJobs.length}
                          </Badge>
                        )}
                        {dayTasks.length > 0 && (
                          <Badge variant="outline" className="bg-amber-100 text-xs py-0 px-1 h-4">
                            {dayTasks.length}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Show mini previews of events */}
                  <div className="space-y-1 overflow-hidden text-xs">
                    {dayJobs.slice(0, 2).map(job => (
                      <div key={job.id} className="truncate text-blue-800 bg-blue-100 px-1 py-0.5 rounded">
                        {job.title || "Job"}
                      </div>
                    ))}
                    {dayTasks.filter(t => !t.isReminder).slice(0, 2).map(task => (
                      <div key={task.id} className="truncate text-amber-800 bg-amber-100 px-1 py-0.5 rounded">
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.filter(t => t.isReminder).slice(0, 1).map(reminder => (
                      <div key={reminder.id} className="truncate text-purple-800 bg-purple-100 px-1 py-0.5 rounded">
                        {reminder.title}
                      </div>
                    ))}
                    
                    {/* Show indicator for more events if needed */}
                    {(dayJobs.length + dayTasks.length) > 5 && (
                      <div className="text-muted-foreground text-center">
                        +{(dayJobs.length + dayTasks.length - 5)} more
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

  // Render the Week View
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className="border rounded-md overflow-hidden bg-white">
        {/* Week header */}
        <div className="grid grid-cols-7 bg-muted/20 border-b">
          {weekDays.map((day, i) => (
            <div 
              key={i} 
              className={cn(
                "p-2 text-center",
                isSameDay(day, selectedDate) && "bg-primary/10"
              )}
              onClick={() => setSelectedDate(day)}
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
        
        {/* Simplified events for the week */}
        <div className="grid grid-cols-7 divide-x">
          {weekDays.map((day, i) => {
            const dayJobs = jobs.filter(job => {
              const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
              return isSameDay(jobDate, day);
            });
            
            const dayTasks = tasks.filter(task => {
              const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
              return isSameDay(taskDate, day);
            });
            
            return (
              <div 
                key={i} 
                className={cn(
                  "min-h-[200px] p-2",
                  isSameDay(day, selectedDate) && "bg-primary/5"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="space-y-1">
                  {dayJobs.slice(0, 3).map(job => (
                    <div key={job.id} className="text-xs p-1 bg-blue-100 text-blue-800 rounded truncate">
                      {job.title || "Untitled Job"}
                    </div>
                  ))}
                  
                  {dayJobs.length > 3 && (
                    <div className="text-xs text-blue-600">+{dayJobs.length - 3} more jobs</div>
                  )}
                  
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={task.isReminder 
                        ? "text-xs p-1 bg-purple-100 text-purple-800 rounded truncate" 
                        : "text-xs p-1 bg-amber-100 text-amber-800 rounded truncate"
                      }
                    >
                      {task.title}
                    </div>
                  ))}
                  
                  {dayTasks.length > 3 && (
                    <div className="text-xs text-amber-600">+{dayTasks.length - 3} more tasks</div>
                  )}
                  
                  {dayJobs.length === 0 && dayTasks.length === 0 && (
                    <div className="text-xs text-muted-foreground py-1">No events</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the Day View
  const renderDayView = () => {
    return (
      <div className="border rounded-md overflow-hidden bg-white">
        <div className="bg-muted/20 p-3 border-b">
          <h3 className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
          {isToday(selectedDate) && (
            <Badge variant="outline" className="bg-primary/10 text-primary mt-1">Today</Badge>
          )}
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-medium mb-2 text-sm">Morning</h4>
            <div className="space-y-1 pl-2">
              {jobsForSelectedDate
                .filter(job => {
                  const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
                  const hours = jobDate.getHours();
                  return hours < 12;
                })
                .map(job => (
                  <div key={job.id} className="p-2 bg-blue-50 border border-blue-100 rounded-md mb-1">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.clientName}</div>
                    <div className="text-xs text-blue-600">
                      {job.date instanceof Date 
                        ? format(job.date, "h:mm a") 
                        : format(new Date(job.date as string), "h:mm a")}
                    </div>
                  </div>
                ))}
              
              {tasksForSelectedDate
                .filter(task => {
                  const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                  const hours = taskDate.getHours();
                  return hours < 12;
                })
                .map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-2 border rounded-md mb-1",
                      task.isReminder ? "bg-purple-50 border-purple-100" : "bg-amber-50 border-amber-100"
                    )}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.client?.name}</div>
                    <div className="text-xs text-amber-600">
                      {format(new Date(task.dueDate), "h:mm a")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-sm">Afternoon</h4>
            <div className="space-y-1 pl-2">
              {jobsForSelectedDate
                .filter(job => {
                  const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
                  const hours = jobDate.getHours();
                  return hours >= 12 && hours < 17;
                })
                .map(job => (
                  <div key={job.id} className="p-2 bg-blue-50 border border-blue-100 rounded-md mb-1">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.clientName}</div>
                    <div className="text-xs text-blue-600">
                      {job.date instanceof Date 
                        ? format(job.date, "h:mm a") 
                        : format(new Date(job.date as string), "h:mm a")}
                    </div>
                  </div>
                ))}
              
              {tasksForSelectedDate
                .filter(task => {
                  const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                  const hours = taskDate.getHours();
                  return hours >= 12 && hours < 17;
                })
                .map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-2 border rounded-md mb-1",
                      task.isReminder ? "bg-purple-50 border-purple-100" : "bg-amber-50 border-amber-100"
                    )}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.client?.name}</div>
                    <div className="text-xs text-amber-600">
                      {format(new Date(task.dueDate), "h:mm a")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2 text-sm">Evening</h4>
            <div className="space-y-1 pl-2">
              {jobsForSelectedDate
                .filter(job => {
                  const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
                  const hours = jobDate.getHours();
                  return hours >= 17;
                })
                .map(job => (
                  <div key={job.id} className="p-2 bg-blue-50 border border-blue-100 rounded-md mb-1">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">{job.clientName}</div>
                    <div className="text-xs text-blue-600">
                      {job.date instanceof Date 
                        ? format(job.date, "h:mm a") 
                        : format(new Date(job.date as string), "h:mm a")}
                    </div>
                  </div>
                ))}
              
              {tasksForSelectedDate
                .filter(task => {
                  const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
                  const hours = taskDate.getHours();
                  return hours >= 17;
                })
                .map(task => (
                  <div 
                    key={task.id} 
                    className={cn(
                      "p-2 border rounded-md mb-1",
                      task.isReminder ? "bg-purple-50 border-purple-100" : "bg-amber-50 border-amber-100"
                    )}
                  >
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-muted-foreground">{task.client?.name}</div>
                    <div className="text-xs text-amber-600">
                      {format(new Date(task.dueDate), "h:mm a")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentView = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
      default:
        return renderMonthView();
    }
  };

  // Group tasks by status for the selected date
  const overdueCount = tasksForSelectedDate.filter(t => t.status === 'overdue').length;
  const scheduledCount = tasksForSelectedDate.filter(t => t.status === 'scheduled').length;
  const inProgressCount = tasksForSelectedDate.filter(t => t.status === 'in progress').length;
  const completedCount = tasksForSelectedDate.filter(t => t.status === 'completed').length;
  const reminderCount = tasksForSelectedDate.filter(t => t.isReminder).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Schedule</h1>
          <p className="text-muted-foreground text-sm">
            Manage your appointments, tasks, and reminders in one place.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setShowAddReminderDialog(true)}
            size="sm"
          >
            <Bell className="h-4 w-4" />
            Add Reminder
          </Button>
          <Button 
            className="gap-1"
            size="sm"
            onClick={() => setShowAddTaskDialog(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section - 2/3 width on large screens */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            <CalendarViewOptions 
              currentView={viewMode} 
              onViewChange={handleViewChange} 
              selectedDate={selectedDate}
              onViewAllTasks={handleViewAllTasks}
            />
            
            <div className="bg-white border rounded-lg shadow-sm">
              {renderCurrentView()}
            </div>
          </div>
        </div>
        
        {/* Sidebar Section - 1/3 width on large screens */}
        <div className="space-y-4">
          {/* Date header */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-muted/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {format(selectedDate, "MMMM d, yyyy")}
                </CardTitle>
                <Badge variant={isToday(selectedDate) ? "default" : "outline"} className="h-6">
                  {isToday(selectedDate) ? "Today" : format(selectedDate, "EEEE")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <div className="text-muted-foreground">Tasks</div>
                  <div className="text-xl font-bold">{tasksForSelectedDate.filter(t => !t.isReminder).length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Jobs</div>
                  <div className="text-xl font-bold">{jobsForSelectedDate.length}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Reminders</div>
                  <div className="text-xl font-bold">{reminderCount}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks Status Overview */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Task Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Overdue</span>
                  </div>
                  <Badge variant="outline" className="bg-red-50 text-red-700">{overdueCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Scheduled</span>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">{scheduledCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span>In Progress</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">{inProgressCount}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Completed</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700">{completedCount}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jobs for Today */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-blue-50">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Jobs
                </div>
                <Badge variant="outline" className="bg-blue-100">{jobsForSelectedDate.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 max-h-[200px] overflow-y-auto">
              {jobsForSelectedDate.length > 0 ? (
                <div className="space-y-3">
                  {jobsForSelectedDate.map(job => (
                    <div 
                      key={job.id} 
                      className="p-2 rounded-md border border-blue-100 bg-blue-50"
                    >
                      <div className="flex justify-between">
                        <div className="font-medium">{job.title || "Untitled Job"}</div>
                        <div className="text-xs text-blue-800 px-1.5 py-0.5 bg-blue-100 rounded-full">
                          ${job.amount}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{job.clientName}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No jobs scheduled for this day</p>
              )}
            </CardContent>
          </Card>
          
          {/* Tasks for Today */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-amber-50">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlarmClock className="h-4 w-4" />
                  Tasks
                </div>
                <Badge variant="outline" className="bg-amber-100">{tasksForSelectedDate.filter(t => !t.isReminder).length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 max-h-[200px] overflow-y-auto">
              {tasksForSelectedDate.filter(t => !t.isReminder).length > 0 ? (
                <div className="space-y-3">
                  {tasksForSelectedDate.filter(t => !t.isReminder).map(task => (
                    <div key={task.id} className="p-2 rounded-md border border-amber-100 bg-amber-50">
                      <div className="flex justify-between">
                        <div className="font-medium">{task.title}</div>
                        <Badge variant="outline" className={cn(
                          "text-xs",
                          task.priority === "high" && "bg-red-100 text-red-800 border-red-200",
                          task.priority === "medium" && "bg-amber-100 text-amber-800 border-amber-200",
                          task.priority === "low" && "bg-green-100 text-green-800 border-green-200",
                          task.priority === "urgent" && "bg-purple-100 text-purple-800 border-purple-200"
                        )}>
                          {task.priority}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{task.client.name}</div>
                      <div className="text-xs text-amber-700 mt-1">
                        {format(new Date(task.dueDate), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No tasks due for this day</p>
              )}
            </CardContent>
          </Card>

          {/* Reminders for Today */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 bg-purple-50">
              <CardTitle className="text-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Reminders
                </div>
                <Badge variant="outline" className="bg-purple-100">{reminderCount}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 max-h-[200px] overflow-y-auto">
              {tasksForSelectedDate.filter(t => t.isReminder).length > 0 ? (
                <div className="space-y-3">
                  {tasksForSelectedDate.filter(t => t.isReminder).map(reminder => (
                    <div key={reminder.id} className="p-2 rounded-md border border-purple-100 bg-purple-50">
                      <div className="font-medium">{reminder.title}</div>
                      <div className="text-sm text-muted-foreground">{reminder.client.name}</div>
                      <div className="text-xs text-purple-700 mt-1">
                        {format(new Date(reminder.dueDate), "h:mm a")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">No reminders due for this day</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-client" className="text-sm font-medium">
                Client Name
              </label>
              <Input
                id="task-client"
                value={newTask.client?.name}
                onChange={e => setNewTask({ ...newTask, client: { name: e.target.value } })}
                placeholder="Enter client name"
                className="h-9"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTask.priority}
                  onValueChange={(value) => 
                    setNewTask({ 
                      ...newTask, 
                      priority: value as "high" | "medium" | "low" | "urgent" 
                    })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-date" className="text-sm font-medium">
                Due Date
              </label>
              <Input
                id="task-date"
                type="datetime-local"
                value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : ''}
                onChange={e => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task details"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)} size="sm">Cancel</Button>
            <Button onClick={handleAddTask} size="sm">Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reminder Dialog */}
      <Dialog open={showAddReminderDialog} onOpenChange={setShowAddReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div className="grid gap-1">
              <label htmlFor="reminder-title" className="text-sm font-medium">
                Reminder Title
              </label>
              <Input
                id="reminder-title"
                value={newReminder.title}
                onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="Enter reminder title"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-client" className="text-sm font-medium">
                Client Name (Optional)
              </label>
              <Input
                id="reminder-client"
                value={newReminder.client?.name}
                onChange={e => setNewReminder({ ...newReminder, client: { name: e.target.value } })}
                placeholder="Enter client name"
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-date" className="text-sm font-medium">
                Reminder Date & Time
              </label>
              <Input
                id="reminder-date"
                type="datetime-local"
                value={newReminder.dueDate ? new Date(newReminder.dueDate).toISOString().slice(0, 16) : ''}
                onChange={e => setNewReminder({ ...newReminder, dueDate: new Date(e.target.value) })}
                className="h-9"
              />
            </div>

            <div className="grid gap-1">
              <label htmlFor="reminder-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="reminder-description"
                value={newReminder.description}
                onChange={e => setNewReminder({ ...newReminder, description: e.target.value })}
                placeholder="Enter reminder details"
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowAddReminderDialog(false)} size="sm">Cancel</Button>
            <Button onClick={handleAddReminder} size="sm">Add Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tasks Manager Dialog */}
      <Dialog 
        open={showTasksManagerDialog} 
        onOpenChange={setShowTasksManagerDialog}
      >
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">Tasks & Reminders Manager</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto py-2">
            <TasksView
              selectedDate={selectedDate}
              tasksForSelectedDate={tasks} // Show all tasks, not just for selected date
              onPreviousDay={handlePreviousDate}
              onNextDay={handleNextDate}
              onTasksChange={handleTasksChange}
            />
          </div>
          <DialogFooter className="sm:justify-end">
            <Button variant="outline" onClick={() => setShowTasksManagerDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;
