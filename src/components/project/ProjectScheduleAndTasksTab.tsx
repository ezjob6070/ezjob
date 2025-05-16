
import React, { useState } from "react";
import { Project, ProjectTask } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, ListTodo, CheckSquare, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Task } from "@/components/calendar/types";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import ReminderCard from "@/components/schedule/ReminderCard";
import TaskCard from "@/components/calendar/components/TaskCard";

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
  const [activeTab, setActiveTab] = useState<"calendar" | "list">("calendar");
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
          dueDate: updates.dueDate ? updates.dueDate.toISOString() : task.dueDate,
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
      
      <Tabs defaultValue="calendar" onValueChange={(value) => setActiveTab(value as "calendar" | "list")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar" className="gap-1">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-1">
            <ListTodo className="h-4 w-4" />
            Tasks & Reminders
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="col-span-1 md:col-span-3">
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() - 1);
                    setSelectedDate(newDate);
                  }}>
                    Previous
                  </Button>
                  <h3 className="text-lg font-medium">{format(selectedDate, "MMMM yyyy")}</h3>
                  <Button variant="outline" size="sm" onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setMonth(newDate.getMonth() + 1);
                    setSelectedDate(newDate);
                  }}>
                    Next
                  </Button>
                </div>

                <div className="calendar-grid grid grid-cols-7 gap-1 mb-4">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <div key={day} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: 42 }).map((_, i) => {
                    const dayDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i - new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() + 2);
                    const isCurrentMonth = dayDate.getMonth() === selectedDate.getMonth();
                    const isSelected = isSameDay(dayDate, selectedDate);
                    
                    const dayTasks = calendarTasks.filter(task => {
                      if (!task.dueDate) return false;
                      const taskDate = new Date(task.dueDate);
                      return isSameDay(taskDate, dayDate);
                    });
                    
                    const hasTasks = dayTasks.some(task => !task.isReminder);
                    const hasReminders = dayTasks.some(task => task.isReminder);
                    
                    return (
                      <div
                        key={i}
                        onClick={() => isCurrentMonth && setSelectedDate(dayDate)}
                        className={`
                          cursor-pointer h-12 flex flex-col items-center justify-center rounded-md relative
                          ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'} 
                          ${isSelected ? 'ring-2 ring-primary' : 'hover:bg-gray-50'}
                          ${isCurrentMonth && 'border'}
                        `}
                      >
                        <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>
                          {dayDate.getDate()}
                        </span>
                        
                        {(hasTasks || hasReminders) && (
                          <div className="absolute bottom-1 flex gap-1">
                            {hasTasks && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                            {hasReminders && <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
      </Tabs>
    </div>
  );
}
