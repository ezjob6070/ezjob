import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { format, parseISO, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/ui/date-picker";
import { v4 as uuid } from "uuid";
import { Project, ProjectStaff, ProjectTask, ProjectTaskInspection } from "@/types/project";
import { 
  CalendarIcon, Clock, Plus, X, Check, FileText, 
  Calendar as CalendarIcon2, ListTodo, User, AlertTriangle, MapPin 
} from "lucide-react";
import { cn } from "@/lib/utils";
import TaskDetailDialog from "./TaskDetailDialog";

interface ProjectScheduleAndTasksTabProps {
  project: Project;
  onProjectUpdate?: (updatedProject: Project) => void;
}

interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  status: "scheduled" | "completed" | "cancelled";
  type: "task" | "inspection" | "delivery" | "meeting";
  assignedTo?: string[];
  relatedTaskId?: string;
  location?: string;
}

interface NewTaskForm {
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "blocked";
  assignedTo: string;
  dueDate: Date;
  isReminder: boolean;
}

const ProjectScheduleAndTasksTab: React.FC<ProjectScheduleAndTasksTabProps> = ({ 
  project,
  onProjectUpdate
}) => {
  const [activeTab, setActiveTab] = useState<string>("tasks");
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || []);
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 14)
  });
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTaskForm>({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    assignedTo: "",
    dueDate: new Date(),
    isReminder: false
  });
  
  // Initialize schedule events from tasks
  useEffect(() => {
    if (project.tasks) {
      const events: ScheduleEvent[] = project.tasks.map(task => {
        const taskDate = task.dueDate ? new Date(task.dueDate) : new Date();
        const endDate = new Date(taskDate);
        endDate.setHours(taskDate.getHours() + 2);
        
        return {
          id: uuid(),
          title: task.title,
          start: taskDate,
          end: endDate,
          description: task.description || "",
          status: task.status === "completed" ? "completed" : 
                 task.status === "blocked" ? "cancelled" : "scheduled",
          type: "task",
          assignedTo: task.assignedTo ? [task.assignedTo] : [],
          relatedTaskId: task.id
        };
      });
      
      setScheduleEvents(events);
      setTasks(project.tasks);
    }
  }, [project.tasks]);
  
  // Update project when tasks change
  useEffect(() => {
    if (onProjectUpdate && tasks !== project.tasks) {
      onProjectUpdate({
        ...project,
        tasks
      });
    }
  }, [tasks, onProjectUpdate, project]);
  
  const handleTaskClick = (task: ProjectTask) => {
    setSelectedTask(task);
    setIsTaskDetailOpen(true);
  };
  
  const handleTaskUpdate = (updatedTask: ProjectTask) => {
    const updatedTasks = tasks.map(t => 
      t.id === updatedTask.id ? updatedTask : t
    );
    
    setTasks(updatedTasks);
    
    // Update the corresponding schedule event
    const updatedEvents = scheduleEvents.map(event => {
      if (event.relatedTaskId === updatedTask.id) {
        const taskDate = updatedTask.dueDate ? new Date(updatedTask.dueDate) : new Date();
        const endDate = new Date(taskDate);
        endDate.setHours(taskDate.getHours() + 2);
        
        return {
          ...event,
          title: updatedTask.title,
          start: taskDate,
          end: endDate,
          description: updatedTask.description || "",
          status: updatedTask.status === "completed" ? "completed" : 
                 updatedTask.status === "blocked" ? "cancelled" : "scheduled",
          assignedTo: updatedTask.assignedTo ? [updatedTask.assignedTo] : [],
        };
      }
      return event;
    });
    
    setScheduleEvents(updatedEvents);
    toast.success("Task updated successfully");
  };
  
  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    setScheduleEvents(scheduleEvents.filter(e => e.relatedTaskId !== taskId));
    setIsTaskDetailOpen(false);
    toast.success("Task deleted successfully");
  };
  
  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    setIsCreating(false);
    setNewTaskDialogOpen(false);
    
    const newTaskId = uuid();
    const taskDueDate = newTask.dueDate || new Date();
    const endDate = new Date(taskDueDate);
    endDate.setHours(taskDueDate.getHours() + 2);
    
    // Create calendar event for the task
    const newEvent: ScheduleEvent = {
      id: uuid(),
      title: newTask.title,
      start: taskDueDate,
      end: endDate,
      description: newTask.description || "",
      status: newTask.status === "completed" ? "completed" : 
             newTask.status === "blocked" ? "cancelled" : "scheduled",
      type: "task",
      assignedTo: newTask.assignedTo ? [newTask.assignedTo] : [],
      relatedTaskId: newTaskId
    };
    
    setScheduleEvents([...scheduleEvents, newEvent]);
    
    // Add the task to the task list
    const task: ProjectTask = {
      id: newTaskId,
      title: newTask.title,
      description: newTask.description || "",
      status: newTask.status || "pending",
      priority: newTask.priority || "medium",
      dueDate: taskDueDate.toISOString(),
      assignedTo: newTask.assignedTo || "",
      createdAt: new Date().toISOString(),
      progress: 0,
      isReminder: newTask.isReminder || false
    };
    
    setTasks([...tasks, task]);
    
    // Reset the form
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      status: "pending",
      assignedTo: "",
      dueDate: new Date(),
      isReminder: false
    });
    
    toast.success("Task added successfully");
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "blocked":
        return <Badge className="bg-red-500">Blocked</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-blue-500">Medium</Badge>;
      default:
        return <Badge className="bg-green-500">Low</Badge>;
    }
  };
  
  const renderTasksList = () => {
    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No tasks yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create tasks to track progress on this project
          </p>
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Project Tasks</h3>
          <Button onClick={() => setNewTaskDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <Card 
              key={task.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleTaskClick(task)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{task.title}</h4>
                  <div className="flex gap-2">
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {task.description || "No description provided"}
                </div>
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "No due date"}
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {task.assignedTo}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {task.progress}% complete
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };
  
  const renderScheduleView = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Project Schedule</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setNewTaskDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Event
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Select Date Range</h4>
              <DatePicker
                mode="range"
                selected={selectedDateRange}
                onSelect={setSelectedDateRange}
                className="border rounded-md p-2"
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Upcoming Events</h4>
              
              {scheduleEvents.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  No events scheduled
                </div>
              ) : (
                <div className="space-y-2">
                  {scheduleEvents
                    .filter(event => {
                      if (!selectedDateRange || !selectedDateRange.from) return true;
                      if (selectedDateRange.to) {
                        return event.start >= selectedDateRange.from && 
                               event.start <= selectedDateRange.to;
                      }
                      return event.start.toDateString() === selectedDateRange.from.toDateString();
                    })
                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                    .map(event => {
                      const relatedTask = tasks.find(t => t.id === event.relatedTaskId);
                      
                      return (
                        <Card key={event.id} className={cn(
                          "border-l-4",
                          event.status === "completed" ? "border-l-green-500" :
                          event.status === "cancelled" ? "border-l-red-500" :
                          "border-l-blue-500"
                        )}>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium">{event.title}</h5>
                                <div className="text-xs text-muted-foreground">
                                  {format(event.start, "MMM d, yyyy h:mm a")} - {format(event.end, "h:mm a")}
                                </div>
                              </div>
                              
                              <Badge variant={
                                event.status === "completed" ? "default" :
                                event.status === "cancelled" ? "destructive" :
                                "outline"
                              }>
                                {event.status}
                              </Badge>
                            </div>
                            
                            {event.description && (
                              <div className="text-sm mt-2">
                                {event.description}
                              </div>
                            )}
                            
                            <div className="flex gap-2 mt-2">
                              {event.type && (
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                              )}
                              
                              {relatedTask && relatedTask.priority && (
                                <Badge className={cn(
                                  "text-xs",
                                  getPriorityColor(relatedTask.priority)
                                )}>
                                  {relatedTask.priority}
                                </Badge>
                              )}
                              
                              {event.assignedTo && event.assignedTo.length > 0 && (
                                <div className="text-xs flex items-center text-muted-foreground">
                                  <User className="h-3 w-3 mr-1" />
                                  {event.assignedTo.join(", ")}
                                </div>
                              )}
                              
                              {event.location && (
                                <div className="text-xs flex items-center text-muted-foreground">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center">
            <ListTodo className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <CalendarIcon2 className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className="mt-4">
          {renderTasksList()}
        </TabsContent>
        
        <TabsContent value="schedule" className="mt-4">
          {renderScheduleView()}
        </TabsContent>
      </Tabs>
      
      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetailDialog
          isOpen={isTaskDetailOpen}
          onClose={() => setIsTaskDetailOpen(false)}
          task={selectedTask}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
          projectStaff={project.staff || []}
        />
      )}
      
      {/* New Task Dialog */}
      <Dialog open={newTaskDialogOpen} onOpenChange={setNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Task title"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Task description"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select
                  value={newTask.priority}
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
              
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  Status
                </label>
                <Select
                  value={newTask.status}
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
            
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">
                Assigned To
              </label>
              <Select
                value={newTask.assignedTo}
                onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Assign to staff member" />
                </SelectTrigger>
                <SelectContent>
                  {(project.staff || []).map((staff: ProjectStaff) => (
                    <SelectItem key={staff.id} value={staff.name}>
                      {staff.name} ({staff.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">
                Due Date
              </label>
              <div className="flex items-center">
                <Input
                  type="datetime-local"
                  value={format(newTask.dueDate, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : new Date();
                    setNewTask({ ...newTask, dueDate: date });
                  }}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setNewTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectScheduleAndTasksTab;
