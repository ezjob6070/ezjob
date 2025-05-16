
import React, { useState } from "react";
import { Project, ProjectTask } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Clock, ListTodo, CheckSquare, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TasksList from "./TasksList";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

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
  const [view, setView] = useState<"calendar" | "list">("list");
  
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
  
  const handleCreateTask = (newTask: ProjectTask) => {
    const updatedTasks = [...(project.tasks || []), newTask];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
  };
  
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks?.filter(task => task.id !== taskId) || [];
    
    const updatedProject = {
      ...project,
      tasks: updatedTasks,
    };
    
    onUpdateProject(updatedProject);
  };
  
  // Calculate task statistics
  const tasks = project.tasks || [];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const pendingTasks = tasks.filter(task => task.status === "pending").length;
  const inProgressTasks = tasks.filter(task => task.status === "in_progress").length;
  const blockedTasks = tasks.filter(task => task.status === "blocked").length;
  const reminders = tasks.filter(task => task.isReminder).length;
  
  // Function to check if a task has an upcoming deadline (within next 3 days)
  const isUpcomingDeadline = (task: ProjectTask) => {
    if (!task.dueDate) return false;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    const threeDaysLater = new Date();
    threeDaysLater.setDate(now.getDate() + 3);
    
    return dueDate > now && dueDate <= threeDaysLater;
  };
  
  const upcomingDeadlines = tasks.filter(isUpcomingDeadline);
  
  // Get overdue tasks (due date passed but not completed)
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === "completed") return false;
    
    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    return dueDate < now;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-blue-500" />
              Tasks Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-semibold text-blue-700">{totalTasks}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-semibold text-green-700">{completedTasks}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-semibold text-purple-700">{inProgressTasks}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-semibold text-yellow-700">{pendingTasks}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Completion Rate</span>
                <span className="font-medium">
                  {totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-6 border-dashed border-2 rounded-md">
                <p className="text-muted-foreground">No upcoming deadlines</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.slice(0, 3).map((task) => (
                  <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                    <div>
                      <p className="text-sm font-medium">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>Due {format(new Date(task.dueDate!), "MMM d")}</span>
                        <Badge 
                          className={`
                            ${task.priority === "high" ? "bg-orange-100 text-orange-800" : 
                              task.priority === "urgent" ? "bg-red-100 text-red-800" : 
                              task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : 
                              "bg-blue-100 text-blue-800"}
                          `}
                          variant="outline"
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={task.status === "in_progress" ? "secondary" : "outline"}>
                      {task.status === "in_progress" ? "In Progress" : 
                       task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </div>
                ))}
                
                {upcomingDeadlines.length > 3 && (
                  <div className="text-center text-xs text-muted-foreground pt-2">
                    + {upcomingDeadlines.length - 3} more upcoming deadlines
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Reminders & Overdue Tasks */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-red-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  Overdue Tasks
                </h4>
                
                {overdueTasks.length === 0 ? (
                  <div className="text-center py-3 border-dashed border-2 rounded-md">
                    <p className="text-xs text-muted-foreground">No overdue tasks</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {overdueTasks.slice(0, 2).map((task) => (
                      <div key={task.id} className="border-l-2 border-red-500 pl-3 py-1">
                        <p className="text-sm font-medium">{task.title}</p>
                        <div className="flex items-center gap-2 text-xs text-red-600">
                          <CalendarIcon className="h-3 w-3" />
                          <span>
                            Due {format(new Date(task.dueDate!), "MMM d")} 
                            ({formatDaysOverdue(new Date(task.dueDate!))})
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {overdueTasks.length > 2 && (
                      <div className="text-center text-xs text-muted-foreground pt-1">
                        + {overdueTasks.length - 2} more overdue tasks
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Active Reminders
                </h4>
                
                {reminders === 0 ? (
                  <div className="text-center py-3 border-dashed border-2 rounded-md">
                    <p className="text-xs text-muted-foreground">No active reminders</p>
                  </div>
                ) : (
                  <div className="text-center py-3 bg-purple-50 rounded-md">
                    <p className="text-lg font-semibold text-purple-700">{reminders}</p>
                    <p className="text-xs text-purple-700">Active reminders</p>
                  </div>
                )}
              </div>
              
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-1"
                onClick={() => {
                  // Create a new reminder task
                  const reminderTask: ProjectTask = {
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
                  
                  handleCreateTask(reminderTask);
                  toast.success("New reminder created");
                }}
              >
                <Clock className="h-4 w-4" />
                Create Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tasks" className="mt-8">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks & Reminders
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-4">
          <TasksList
            tasks={project.tasks || []}
            onTaskUpdate={handleUpdateTask}
            onTaskCreate={handleCreateTask}
            onTaskDelete={handleDeleteTask}
            projectStaff={projectStaff}
          />
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-4">
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-center p-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Calendar View</h3>
              <p className="mt-1 text-gray-500">
                This feature will be available in an upcoming update.
              </p>
              <Button className="mt-4" onClick={() => toast.success("Coming soon!")}>
                Notify me when available
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper function to format days overdue
function formatDaysOverdue(dueDate: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dueDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1 ? "1 day overdue" : `${diffDays} days overdue`;
}
