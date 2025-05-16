
import React, { useState } from "react";
import { Project, ProjectTask } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListTodo, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TasksList from "./TasksList";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  projectStaff: any[];
  onUpdateProject: (updatedProject: Project) => void;
}

type CalendarViewType = "day" | "week" | "month";

export default function ProjectScheduleAndTasksTab({
  project,
  projectStaff,
  onUpdateProject,
}: ProjectScheduleAndTasksTabProps) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"calendar" | "tasks">("calendar");
  const [calendarView, setCalendarView] = useState<CalendarViewType>("month");
  
  const handleUpdateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    const updatedTasks = project.tasks?.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    ) || [];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
  };
  
  const handleCreateTask = () => {
    // Create a new task
    const task: ProjectTask = {
      id: uuidv4(),
      title: "New Task",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString()
    };
    
    const updatedTasks = [...(project.tasks || []), task];
    const updatedProject = { ...project, tasks: updatedTasks };
    
    onUpdateProject(updatedProject);
    toast.success("Task created successfully!");
  };
  
  const handleCreateReminder = () => {
    // Create a new reminder
    const reminder: ProjectTask = {
      id: uuidv4(),
      title: "New Reminder",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      isReminder: true,
      reminderSent: false
    };
    
    const updatedTasks = [...(project.tasks || []), reminder];
    const updatedProject = { ...project, tasks: updatedTasks };
    
    onUpdateProject(updatedProject);
    toast.success("Reminder created successfully!");
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks?.filter(task => task.id !== taskId) || [];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
    toast.success("Task deleted successfully");
  };
  
  // Calculate task statistics
  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Schedule & Tasks</h3>
          <p className="text-sm text-muted-foreground">
            {totalTasks} Tasks • {completedTasks} Completed ({completionRate}% complete)
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={handleCreateReminder}
            size="sm"
          >
            <Clock className="h-4 w-4" />
            Add Reminder
          </Button>
          <Button 
            size="sm"
            onClick={handleCreateTask}
            className="gap-1"
          >
            <ListTodo className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "calendar" | "tasks")}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-1">
              <ListTodo className="h-4 w-4" />
              Tasks & Reminders
            </TabsTrigger>
          </TabsList>
          
          {activeTab === "calendar" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  {calendarView.charAt(0).toUpperCase() + calendarView.slice(1)} View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCalendarView("day")}>Day</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalendarView("week")}>Week</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCalendarView("month")}>Month</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        
        <TabsContent value="calendar" className="mt-4">
          <ProjectCalendarView 
            tasks={tasks} 
            view={calendarView} 
            onUpdateTask={handleUpdateTask} 
          />
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="reminders">Reminders</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <TasksList
                tasks={tasks}
                onTaskUpdate={handleUpdateTask}
                onTaskCreate={handleCreateTask}
                onTaskDelete={handleDeleteTask}
                projectStaff={projectStaff}
                selectedTaskId={selectedTaskId}
                onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
                filterQuery=""
              />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <TasksList
                tasks={tasks.filter(task => !task.isReminder)}
                onTaskUpdate={handleUpdateTask}
                onTaskCreate={handleCreateTask}
                onTaskDelete={handleDeleteTask}
                projectStaff={projectStaff}
                selectedTaskId={selectedTaskId}
                onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
                filterQuery=""
              />
            </TabsContent>
            
            <TabsContent value="reminders" className="mt-4">
              <TasksList
                tasks={tasks.filter(task => task.isReminder)}
                onTaskUpdate={handleUpdateTask}
                onTaskCreate={handleCreateReminder}
                onTaskDelete={handleDeleteTask}
                projectStaff={projectStaff}
                selectedTaskId={selectedTaskId}
                onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
                filterQuery=""
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// New component for Calendar View
function ProjectCalendarView({ 
  tasks, 
  view, 
  onUpdateTask 
}: { 
  tasks: ProjectTask[]; 
  view: CalendarViewType; 
  onUpdateTask: (taskId: string, updates: Partial<ProjectTask>) => void; 
}) {
  const viewDisplayMap = {
    day: "Daily View",
    week: "Weekly View",
    month: "Monthly View"
  };

  // Group tasks by date for better organization
  const tasksByDate = tasks.reduce<Record<string, ProjectTask[]>>((acc, task) => {
    if (!task.dueDate) return acc;
    
    const dateKey = format(new Date(task.dueDate), 'yyyy-MM-dd');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(task);
    return acc;
  }, {});

  // For simplicity, just render a calendar-like view with tasks
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b p-4 font-medium">
        {viewDisplayMap[view]} - {format(new Date(), 'MMMM yyyy')}
      </div>
      
      <div className="p-4">
        {view === "month" && (
          <div className="grid grid-cols-7 gap-1">
            {/* Display calendar header (day names) */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center p-2 font-medium text-sm">
                {day}
              </div>
            ))}
            
            {/* Display calendar days */}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i + 1;
              const hasEvents = Math.random() > 0.7; // Simulate some days having events
              
              return (
                <div 
                  key={i} 
                  className={`border rounded min-h-[100px] p-2 ${day === 15 ? 'bg-blue-50' : ''}`}
                >
                  <div className="font-medium text-sm">{day}</div>
                  {hasEvents && (
                    <div className="mt-2">
                      <div className="bg-green-100 text-green-800 text-xs p-1 rounded mb-1">
                        Task Example
                      </div>
                      {Math.random() > 0.5 && (
                        <div className="bg-red-100 text-red-800 text-xs p-1 rounded">
                          Reminder
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {view === "week" && (
          <div className="space-y-4">
            {/* Week view - show 7 days with tasks */}
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - date.getDay() + i);
              const dateStr = format(date, 'yyyy-MM-dd');
              const dayTasks = tasksByDate[dateStr] || [];
              
              return (
                <div key={i} className="border rounded overflow-hidden">
                  <div className={`p-3 ${i === 3 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                    <h4 className="font-medium">{format(date, 'EEEE, MMMM d')}</h4>
                  </div>
                  
                  <div className="p-2 space-y-2">
                    {dayTasks.length > 0 ? (
                      dayTasks.map(task => (
                        <div 
                          key={task.id} 
                          className={`p-2 rounded text-sm ${task.isReminder ? 'bg-red-50' : 'bg-gray-50'}`}
                        >
                          <div className="font-medium">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(task.dueDate!), 'h:mm a')}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-center text-muted-foreground py-4">
                        No tasks scheduled
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {view === "day" && (
          <div className="space-y-4">
            <div className="text-center p-4 border-b">
              <h3 className="font-medium">{format(new Date(), 'EEEE, MMMM d, yyyy')}</h3>
            </div>
            
            <div className="space-y-2">
              {/* Show tasks for today in hourly slots */}
              {Array.from({ length: 12 }).map((_, i) => {
                const hour = i + 8; // Start at 8 AM
                const hasTask = Math.random() > 0.7; // Simulate some hours having tasks
                
                return (
                  <div key={i} className="flex border-b pb-2 last:border-b-0">
                    <div className="w-20 text-sm text-muted-foreground">
                      {hour % 12 || 12}{hour >= 12 ? 'pm' : 'am'}
                    </div>
                    <div className="flex-1">
                      {hasTask ? (
                        <div className={`p-2 rounded ${Math.random() > 0.7 ? 'bg-red-50' : 'bg-gray-50'}`}>
                          <div className="font-medium text-sm">
                            {Math.random() > 0.7 ? 'Reminder: ' : ''}
                            Sample Task {i + 1}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {Math.random() > 0.5 ? 'High priority' : 'Medium priority'}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
