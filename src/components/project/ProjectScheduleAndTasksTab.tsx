
import React, { useState } from "react";
import { Project, ProjectTask } from "@/types/project";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListTodo, Clock, Bell, Search, Plus, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import TasksList from "./TasksList";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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

export default function ProjectScheduleAndTasksTab({
  project,
  projectStaff,
  onUpdateProject,
}: ProjectScheduleAndTasksTabProps) {
  const [view, setView] = useState<"calendar" | "list" | "kanban">("list");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showCreateTaskDialog, setShowCreateTaskDialog] = useState(false);
  const [showCreateReminderDialog, setShowCreateReminderDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    progress: 0,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString()
  });
  
  const [newReminder, setNewReminder] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    progress: 0,
    createdAt: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    isReminder: true
  });
  
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
    const task: ProjectTask = {
      id: uuidv4(),
      title: newTask.title || "New Task",
      description: newTask.description || "",
      status: newTask.status as "pending" | "in_progress" | "completed" | "blocked",
      priority: newTask.priority as "low" | "medium" | "high" | "urgent",
      dueDate: newTask.dueDate,
      createdAt: new Date().toISOString(),
      progress: 0,
      assignedTo: newTask.assignedTo
    };
    
    const updatedTasks = [...(project.tasks || []), task];
    const updatedProject = { ...project, tasks: updatedTasks };
    
    onUpdateProject(updatedProject);
    setShowCreateTaskDialog(false);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString()
    });
    toast.success("Task created successfully!");
  };
  
  const handleCreateReminder = () => {
    const reminder: ProjectTask = {
      id: uuidv4(),
      title: newReminder.title || "New Reminder",
      description: newReminder.description || "",
      status: newReminder.status as "pending" | "in_progress" | "completed" | "blocked",
      priority: newReminder.priority as "low" | "medium" | "high" | "urgent",
      dueDate: newReminder.dueDate,
      createdAt: new Date().toISOString(),
      progress: 0,
      isReminder: true,
      reminderSent: false
    };
    
    const updatedTasks = [...(project.tasks || []), reminder];
    const updatedProject = { ...project, tasks: updatedTasks };
    
    onUpdateProject(updatedProject);
    setShowCreateReminderDialog(false);
    setNewReminder({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      createdAt: new Date().toISOString(),
      dueDate: new Date().toISOString(),
      isReminder: true
    });
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
      {/* Simplified header with stats and actions */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <Card className="w-full md:w-auto">
          <CardContent className="p-4 flex items-center gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="text-2xl font-semibold">{completionRate}%</div>
              <Progress value={completionRate} className="h-2 w-24 mt-1" />
            </div>
            <div className="border-l h-12 pl-6">
              <div className="text-sm text-muted-foreground">Tasks</div>
              <div className="text-2xl font-semibold">{totalTasks}</div>
            </div>
            <div className="border-l h-12 pl-6">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-semibold">{completedTasks}</div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowCreateReminderDialog(true)}
            className="gap-1"
          >
            <Bell className="h-4 w-4" />
            Add Reminder
          </Button>
          <Button 
            size="sm"
            onClick={() => setShowCreateTaskDialog(true)}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="ml-4">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <ListTodo className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {view === "list" ? (
            <TasksList
              tasks={tasks}
              onTaskUpdate={handleUpdateTask}
              onTaskCreate={() => setShowCreateTaskDialog(true)}
              onTaskDelete={handleDeleteTask}
              projectStaff={projectStaff}
              selectedTaskId={selectedTaskId}
              onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
              filterQuery={searchQuery}
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="border rounded-lg">
                  <div className="flex items-center justify-between border-b p-4">
                    <div className="text-lg font-medium">Calendar View</div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                          Month <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Day</DropdownMenuItem>
                        <DropdownMenuItem>Week</DropdownMenuItem>
                        <DropdownMenuItem>Month</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="p-6 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900">Calendar View</h3>
                      <p className="mt-1 text-gray-500">
                        This feature will be available soon.
                      </p>
                      <Button className="mt-4" onClick={() => toast.success("Coming soon!")}>
                        Notify me when available
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="tasks" className="mt-4">
          <TasksList
            tasks={tasks.filter(task => !task.isReminder)}
            onTaskUpdate={handleUpdateTask}
            onTaskCreate={() => setShowCreateTaskDialog(true)}
            onTaskDelete={handleDeleteTask}
            projectStaff={projectStaff}
            selectedTaskId={selectedTaskId}
            onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
            filterQuery={searchQuery}
          />
        </TabsContent>
        
        <TabsContent value="reminders" className="mt-4">
          <TasksList
            tasks={tasks.filter(task => task.isReminder)}
            onTaskUpdate={handleUpdateTask}
            onTaskCreate={() => setShowCreateReminderDialog(true)}
            onTaskDelete={handleDeleteTask}
            projectStaff={projectStaff}
            selectedTaskId={selectedTaskId}
            onTaskSelect={(taskId) => setSelectedTaskId(taskId)}
            filterQuery={searchQuery}
          />
        </TabsContent>
      </Tabs>
      
      {/* Create Task Dialog */}
      <Dialog open={showCreateTaskDialog} onOpenChange={setShowCreateTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <label htmlFor="task-title" className="block text-sm font-medium mb-1">Task Title</label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="task-priority" className="block text-sm font-medium mb-1">Priority</label>
                <Select
                  value={newTask.priority as string}
                  onValueChange={(value) => setNewTask({ 
                    ...newTask, 
                    priority: value as "low" | "medium" | "high" | "urgent" 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="task-status" className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={newTask.status as string}
                  onValueChange={(value) => setNewTask({ 
                    ...newTask, 
                    status: value as "pending" | "in_progress" | "completed" | "blocked" 
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="task-due" className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                id="task-due"
                type="datetime-local"
                value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="task-assignee" className="block text-sm font-medium mb-1">Assigned To</label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to someone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {projectStaff.map((staff) => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="task-description" className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateTaskDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateTask}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create Reminder Dialog */}
      <Dialog open={showCreateReminderDialog} onOpenChange={setShowCreateReminderDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Reminder</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div>
              <label htmlFor="reminder-title" className="block text-sm font-medium mb-1">Reminder Title</label>
              <Input
                id="reminder-title"
                value={newReminder.title}
                onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                placeholder="Enter reminder title"
              />
            </div>
            
            <div>
              <label htmlFor="reminder-due" className="block text-sm font-medium mb-1">Due Date</label>
              <Input
                id="reminder-due"
                type="datetime-local"
                value={newReminder.dueDate ? new Date(newReminder.dueDate).toISOString().slice(0, 16) : ''}
                onChange={(e) => setNewReminder({ ...newReminder, dueDate: e.target.value })}
              />
            </div>
            
            <div>
              <label htmlFor="reminder-priority" className="block text-sm font-medium mb-1">Priority</label>
              <Select
                value={newReminder.priority as string}
                onValueChange={(value) => setNewReminder({ 
                  ...newReminder, 
                  priority: value as "low" | "medium" | "high" | "urgent" 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="reminder-description" className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                id="reminder-description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                placeholder="Enter reminder description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateReminderDialog(false)}>Cancel</Button>
            <Button onClick={handleCreateReminder}>Create Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
