
import React, { useState } from "react";
import { Project, ProjectTask } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ListTodo, 
  CheckSquare, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Timeline,
  Check,
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  format, 
  isSameDay, 
  addDays, 
  subDays, 
  startOfWeek, 
  endOfWeek, 
  addWeeks, 
  subWeeks, 
  addMonths, 
  subMonths, 
  eachDayOfInterval,
  parseISO 
} from "date-fns";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/components/calendar/types";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import ReminderCard from "@/components/schedule/ReminderCard";
import TaskCard from "@/components/calendar/components/TaskCard";
import { cn } from "@/lib/utils";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff: any[];
  onUpdateProject: (updatedProject: Project) => void;
}

export default function ProjectScheduleAndTasksTab({
  project,
  projectStaff,
  onUpdateProject,
}: ProjectScheduleAndTasksTabProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [activeTab, setActiveTab] = useState<"calendar" | "list" | "timeline">("calendar");
  const [displayMode, setDisplayMode] = useState<"all" | "tasks" | "reminders">("all");
  
  // Convert project tasks to calendar tasks
  const convertToCalendarTasks = (projectTasks: ProjectTask[] = []): Task[] => {
    return projectTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || "",
      start: task.createdAt,
      end: task.dueDate || task.createdAt,
      client: { id: "project", name: project.clientName },
      dueDate: task.dueDate ? new Date(task.dueDate) : new Date(),
      status: task.status === "completed" ? "completed" : 
              task.status === "in_progress" ? "in progress" : "scheduled",
      priority: task.priority || "medium",
      color: task.isReminder ? "#ea384c" : "#4f46e5",
      isReminder: task.isReminder || false,
      hasFollowUp: false,
      technician: task.assignedTo || "",
      type: task.isReminder ? "reminder" : "task"
    }));
  };
  
  const calendarTasks = convertToCalendarTasks(project.tasks);
  
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = project.tasks?.map(task => {
      if (task.id === taskId) {
        // Map back from Task type to ProjectTask type
        return {
          ...task,
          status: updates.status === "completed" ? "completed" : 
                  updates.status === "in progress" ? "in_progress" : "pending",
          priority: updates.priority as "low" | "medium" | "high" | "urgent",
          dueDate: updates.dueDate ? (typeof updates.dueDate === 'string' ? updates.dueDate : updates.dueDate.toISOString()) : task.dueDate,
          isReminder: updates.isReminder || task.isReminder
        };
      }
      return task;
    }) || [];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
  };
  
  const handleCreateTask = (isReminder: boolean) => {
    const newTaskId = uuidv4();
    const now = new Date();
    
    const newTask: ProjectTask = {
      id: newTaskId,
      title: isReminder ? "New Reminder" : "New Task",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: now.toISOString(),
      dueDate: now.toISOString(),
      isReminder: isReminder,
      reminderSent: false
    };
    
    const updatedTasks = [...(project.tasks || []), newTask];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
    toast.success(isReminder ? "New reminder created" : "New task created");
  };
  
  const handleCreateTimelineEvent = () => {
    const newTaskId = uuidv4();
    const now = new Date();
    
    const newTask: ProjectTask = {
      id: newTaskId,
      title: "Timeline Event",
      description: "New timeline event",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: now.toISOString(),
      dueDate: now.toISOString(),
      isReminder: false,
      reminderSent: false,
      history: [
        {
          title: "Timeline Event Created",
          description: "Timeline event was created",
          date: now.toISOString()
        }
      ]
    };
    
    const updatedTasks = [...(project.tasks || []), newTask];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
    toast.success("New timeline event created");
  };
  
  // Filter tasks/reminders for the selected date
  const getTasksForSelectedDate = () => {
    if (!project.tasks) return [];
    
    return calendarTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
  };
  
  const tasksForSelectedDate = getTasksForSelectedDate();
  const remindersForSelectedDate = tasksForSelectedDate.filter(task => task.isReminder);
  const onlyTasksForSelectedDate = tasksForSelectedDate.filter(task => !task.isReminder);

  // Functions to get counts for display
  const getTotalTasksCount = () => calendarTasks.filter(task => !task.isReminder).length;
  const getTotalRemindersCount = () => calendarTasks.filter(task => task.isReminder).length;
  
  const getDisplayTasks = () => {
    if (displayMode === "all") return tasksForSelectedDate;
    if (displayMode === "tasks") return onlyTasksForSelectedDate;
    return remindersForSelectedDate;
  };

  // Sort tasks by due date for timeline
  const sortedTimelineTasks = [...calendarTasks]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Handle navigation for different view modes
  const handlePrev = () => {
    if (viewMode === "day") {
      setSelectedDate(subDays(selectedDate, 1));
    } else if (viewMode === "week") {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else if (viewMode === "month") {
      setSelectedDate(subMonths(selectedDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setSelectedDate(addDays(selectedDate, 1));
    } else if (viewMode === "week") {
      setSelectedDate(addWeeks(selectedDate, 1));
    } else if (viewMode === "month") {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const getViewTitle = () => {
    if (viewMode === "day") {
      return format(selectedDate, "EEEE, MMMM d, yyyy");
    } else if (viewMode === "week") {
      const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    } else {
      return format(selectedDate, "MMMM yyyy");
    }
  };

  const renderCalendarView = () => {
    switch (viewMode) {
      case "day":
        return renderDayView();
      case "week":
        return renderWeekView();
      case "month":
        return renderMonthView();
      default:
        return renderMonthView();
    }
  };

  const renderDayView = () => {
    // Day view shows hourly slots for the selected day
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{format(selectedDate, "MMMM d, yyyy")}</h3>
            <p className="text-gray-500">{format(selectedDate, "EEEE")}</p>
          </div>
          
          <div className="grid gap-2">
            {hours.map(hour => {
              const timeSlot = new Date(selectedDate);
              timeSlot.setHours(hour);
              
              const tasksAtHour = calendarTasks.filter(task => {
                if (!task.dueDate) return false;
                const taskTime = new Date(task.dueDate);
                return isSameDay(taskTime, selectedDate) && taskTime.getHours() === hour;
              });
              
              return (
                <div 
                  key={hour}
                  className={cn(
                    "p-3 border-l-4 rounded-md",
                    tasksAtHour.length > 0 
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  )}
                >
                  <div className="flex items-center">
                    <span className="w-20 text-sm font-medium">{format(timeSlot, "h:mm a")}</span>
                    <div className="flex-1 space-y-2">
                      {tasksAtHour.map(task => (
                        <div 
                          key={task.id} 
                          className={cn(
                            "p-2 rounded-md",
                            task.isReminder 
                              ? "bg-red-100 border border-red-200"
                              : "bg-indigo-100 border border-indigo-200"
                          )}
                        >
                          <div className="flex justify-between">
                            <p className="font-medium">{task.title}</p>
                            <Badge variant={task.isReminder ? "destructive" : "secondary"}>
                              {task.isReminder ? "Reminder" : "Task"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    // Week view shows the 7 days of the week with events
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const isSelected = isSameDay(day, selectedDate);
            const dayTasks = calendarTasks.filter(task => {
              if (!task.dueDate) return false;
              return isSameDay(new Date(task.dueDate), day);
            });
            
            const hasReminders = dayTasks.some(task => task.isReminder);
            const hasTasks = dayTasks.some(task => !task.isReminder);
            const remindersCount = dayTasks.filter(task => task.isReminder).length;
            const tasksCount = dayTasks.filter(task => !task.isReminder).length;
            const highPriorityCount = dayTasks.filter(task => task.priority === "high" || task.priority === "urgent").length;
            
            return (
              <div
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "cursor-pointer h-24 p-2 flex flex-col border rounded-lg",
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/10" 
                    : "hover:bg-gray-50",
                  highPriorityCount > 0 ? "bg-red-50" :
                  (hasReminders && hasTasks) ? "bg-purple-50" :
                  hasReminders ? "bg-pink-50" :
                  hasTasks ? "bg-blue-50" : ""
                )}
              >
                <div className={cn(
                  "text-center mb-1",
                  isSameDay(day, new Date()) && "bg-primary text-primary-foreground rounded-full w-6 h-6 mx-auto flex items-center justify-center"
                )}>
                  <span className="font-medium">{format(day, "d")}</span>
                </div>
                <div className="text-xs font-medium text-center">{format(day, "EEE")}</div>
                
                {(tasksCount > 0 || remindersCount > 0) && (
                  <div className="mt-auto flex flex-col gap-1">
                    {tasksCount > 0 && (
                      <div className="flex items-center justify-center bg-blue-200 text-blue-800 rounded-full px-2 py-0.5 text-xs">
                        {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
                      </div>
                    )}
                    {remindersCount > 0 && (
                      <div className="flex items-center justify-center bg-red-200 text-red-800 rounded-full px-2 py-0.5 text-xs">
                        {remindersCount} {remindersCount === 1 ? "reminder" : "reminders"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    // Month view shows the days of the month in a grid
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start
    
    // Calculate the days to show in the grid (including padding from previous/next months)
    const totalDays = Math.ceil((daysInMonth + startOffset) / 7) * 7;
    
    // Generate array of dates to display
    const daysArray = Array.from({ length: totalDays }, (_, i) => {
      const dayOffset = i - startOffset;
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), dayOffset + 1);
    });
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysArray.map((day, i) => {
            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            
            const dayTasks = calendarTasks.filter(task => {
              if (!task.dueDate) return false;
              return isSameDay(new Date(task.dueDate), day);
            });
            
            const remindersCount = dayTasks.filter(task => task.isReminder).length;
            const tasksCount = dayTasks.filter(task => !task.isReminder).length;
            const hasHighPriorityTasks = dayTasks.some(task => task.priority === "high" || task.priority === "urgent");
            
            return (
              <div
                key={i}
                onClick={() => isCurrentMonth && setSelectedDate(day)}
                className={cn(
                  "cursor-pointer h-16 md:h-20 p-1 flex flex-col border rounded-md relative",
                  !isCurrentMonth && "opacity-40",
                  isSelected && "ring-2 ring-primary",
                  isToday && !isSelected && "ring-1 ring-primary",
                  hasHighPriorityTasks ? "bg-red-50" :
                  (remindersCount > 0 && tasksCount > 0) ? "bg-purple-50" :
                  remindersCount > 0 ? "bg-pink-50" :
                  tasksCount > 0 ? "bg-blue-50" : 
                  isCurrentMonth ? "bg-white" : "bg-gray-50"
                )}
              >
                <div className={cn(
                  "text-right mb-1 px-1",
                  isToday && "font-bold text-primary"
                )}>
                  <span className={cn(
                    "text-sm",
                    isSelected && "bg-primary text-primary-foreground rounded-full w-6 h-6 inline-flex items-center justify-center"
                  )}>
                    {day.getDate()}
                  </span>
                </div>
                
                {/* Task and reminder count indicators */}
                {(tasksCount > 0 || remindersCount > 0) && isCurrentMonth && (
                  <div className="mt-auto flex flex-wrap gap-1 p-1">
                    {tasksCount > 0 && (
                      <div className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center">
                        {tasksCount}
                      </div>
                    )}
                    {remindersCount > 0 && (
                      <div className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center">
                        {remindersCount}
                      </div>
                    )}
                    {hasHighPriorityTasks && (
                      <div className="bg-amber-500 text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center">
                        !
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Timeline rendering
  const renderTimelineView = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Project Timeline</h3>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleCreateTimelineEvent}
            className="gap-1"
          >
            <Timeline className="h-4 w-4" />
            Add Timeline Event
          </Button>
        </div>
        
        {sortedTimelineTasks.length === 0 ? (
          <div className="p-12 text-center border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">No timeline events found</p>
            <p className="text-sm text-muted-foreground">Add tasks or timeline events to see them here</p>
          </div>
        ) : (
          <div className="relative pl-8 border-l-2 border-gray-200 ml-4">
            {sortedTimelineTasks.map((task, index) => {
              // Calculate if the task is past, current or future
              const now = new Date();
              const taskDate = new Date(task.dueDate);
              const isPast = taskDate < now;
              const isCurrent = isSameDay(taskDate, now);
              
              return (
                <div 
                  key={task.id} 
                  className={cn(
                    "relative mb-8 pl-6",
                    index === sortedTimelineTasks.length - 1 ? "" : ""
                  )}
                >
                  <div className={cn(
                    "absolute -left-[2.5rem] p-1 rounded-full border-4 border-white",
                    task.isReminder ? "bg-red-500" : 
                    task.status === "completed" ? "bg-green-500" :
                    isCurrent ? "bg-blue-500" :
                    isPast ? "bg-amber-500" : "bg-gray-300"
                  )}>
                    {task.isReminder ? (
                      <Clock className="h-4 w-4 text-white" />
                    ) : task.status === "completed" ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "p-4 border rounded-lg shadow-sm",
                    task.isReminder ? "bg-red-50 border-red-200" : 
                    task.status === "completed" ? "bg-green-50 border-green-200" :
                    isCurrent ? "bg-blue-50 border-blue-200" :
                    isPast ? "bg-amber-50 border-amber-200" : "bg-white"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-lg">{task.title}</h4>
                      <Badge variant={
                        task.isReminder ? "destructive" : 
                        task.status === "completed" ? "outline" : "secondary"
                      }>
                        {task.isReminder ? "Reminder" : task.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(taskDate, "PPP")}
                      </span>
                      
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(taskDate, "p")}
                      </span>
                      
                      {task.priority && (
                        <Badge variant={
                          task.priority === "high" || task.priority === "urgent" ? "destructive" :
                          task.priority === "medium" ? "secondary" : "outline"
                        } className="text-xs">
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Schedule & Tasks</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => handleCreateTask(false)}
          >
            <ListTodo className="h-4 w-4" />
            Add Task
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            onClick={() => handleCreateTask(true)}
          >
            <Clock className="h-4 w-4" />
            Add Reminder
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="calendar" onValueChange={(value) => setActiveTab(value as "calendar" | "list" | "timeline")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar" className="gap-1">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-1">
            <ListTodo className="h-4 w-4" />
            Tasks & Reminders
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1">
            <Timeline className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="col-span-1 md:col-span-3">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Calendar</CardTitle>
                  <div className="flex items-center gap-2">
                    <TabsList>
                      <TabsTrigger 
                        value="day" 
                        onClick={() => setViewMode("day")}
                        className={viewMode === "day" ? "bg-primary text-primary-foreground" : ""}
                      >
                        Day
                      </TabsTrigger>
                      <TabsTrigger 
                        value="week" 
                        onClick={() => setViewMode("week")}
                        className={viewMode === "week" ? "bg-primary text-primary-foreground" : ""}
                      >
                        Week
                      </TabsTrigger>
                      <TabsTrigger 
                        value="month" 
                        onClick={() => setViewMode("month")}
                        className={viewMode === "month" ? "bg-primary text-primary-foreground" : ""}
                      >
                        Month
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={handlePrev}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="text-lg font-medium">{getViewTitle()}</h3>
                  <Button variant="outline" size="sm" onClick={handleNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {renderCalendarView()}
                
                <div className="flex justify-center gap-6 mt-4 px-4 w-full flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-500"></div>
                    <span className="text-sm">Tasks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-100 border border-red-500"></div>
                    <span className="text-sm">Reminders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-100 border border-purple-500"></div>
                    <span className="text-sm">Both</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-100 border border-amber-500"></div>
                    <span className="text-sm">High Priority</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{format(selectedDate, "MMM d, yyyy")}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as "all" | "tasks" | "reminders")}>
                  <TabsList className="grid grid-cols-3 mb-4">
                    <TabsTrigger value="all" className="text-xs">
                      All ({tasksForSelectedDate.length})
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="text-xs">
                      Tasks ({onlyTasksForSelectedDate.length})
                    </TabsTrigger>
                    <TabsTrigger value="reminders" className="text-xs">
                      Reminders ({remindersForSelectedDate.length})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {getDisplayTasks().length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No {displayMode === "all" ? "items" : displayMode} for this day
                    </p>
                  ) : (
                    getDisplayTasks().map((task) => (
                      task.isReminder ? (
                        <ReminderCard
                          key={task.id}
                          reminder={task}
                          onReminderUpdate={handleUpdateTask}
                        />
                      ) : (
                        <TaskCard
                          key={task.id}
                          task={task}
                          onTaskUpdate={handleUpdateTask}
                        />
                      )
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="space-y-4 pt-4">
          <Tabs value={displayMode} onValueChange={(v) => setDisplayMode(v as "all" | "tasks" | "reminders")}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all" className="text-xs">
                All ({calendarTasks.length})
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs">
                Tasks ({getTotalTasksCount()})
              </TabsTrigger>
              <TabsTrigger value="reminders" className="text-xs">
                Reminders ({getTotalRemindersCount()})
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="space-y-4">
            {displayMode === "all" && calendarTasks.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No tasks or reminders found</p>
            )}
            
            {displayMode === "tasks" && getTotalTasksCount() === 0 && (
              <p className="text-center text-muted-foreground py-4">No tasks found</p>
            )}
            
            {displayMode === "reminders" && getTotalRemindersCount() === 0 && (
              <p className="text-center text-muted-foreground py-4">No reminders found</p>
            )}
            
            {(displayMode === "all" ? calendarTasks : 
              displayMode === "tasks" ? calendarTasks.filter(t => !t.isReminder) : 
              calendarTasks.filter(t => t.isReminder)
            ).map((task) => (
              task.isReminder ? (
                <ReminderCard
                  key={task.id}
                  reminder={task}
                  onReminderUpdate={handleUpdateTask}
                />
              ) : (
                <TaskCard
                  key={task.id}
                  task={task}
                  onTaskUpdate={handleUpdateTask}
                />
              )
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4 pt-4">
          {renderTimelineView()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
