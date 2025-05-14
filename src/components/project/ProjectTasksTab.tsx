
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, CheckCircle2, Circle, AlertCircle, Clock, Calendar as CalendarIconSolid, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Project, ProjectStaff, ProjectTask } from "@/types/project";
import { toast } from "sonner";
import TaskDetailDialog from "./TaskDetailDialog";
import { convertTaskToEvent, generateId } from "./utils/scheduleTaskIntegration";

interface ProjectTasksTabProps {
  project: Project;
  onTaskCreate?: (task: ProjectTask) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onAddToCalendar?: (task: ProjectTask) => void;
}

export default function ProjectTasksTab({ 
  project, 
  onTaskCreate, 
  onTaskUpdate,
  onTaskDelete,
  onAddToCalendar
}: ProjectTasksTabProps) {
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || []);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [newTask, setNewTask] = useState<Omit<ProjectTask, "id" | "createdAt">>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    progress: 0,
    dependencies: [],
    dueDate: format(new Date(), "yyyy-MM-dd"),
  });
  
  // New state for calendar view toggle
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // New state for "Add to Calendar" option
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Update local tasks when project tasks change
  useEffect(() => {
    if (project.tasks) {
      setTasks(project.tasks);
    }
  }, [project.tasks]);

  const handleAddTask = () => {
    const newTaskWithId: ProjectTask = {
      id: generateId('task'),
      createdAt: format(new Date(), "yyyy-MM-dd"),
      ...newTask,
      inspections: [],
      comments: [],
      attachments: []
    };
    
    setTasks(prev => [...prev, newTaskWithId]);
    if (onTaskCreate) {
      onTaskCreate(newTaskWithId);
    }
    
    // If Add to Calendar is checked, convert to calendar event
    if (addToCalendar && onAddToCalendar) {
      onAddToCalendar(newTaskWithId);
    }
    
    setShowAddTaskDialog(false);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      progress: 0,
      dependencies: [],
      dueDate: format(new Date(), "yyyy-MM-dd"),
    });
    setAddToCalendar(false);
    toast.success("Task added successfully");
  };

  const handleUpdateTaskStatus = (taskId: string, status: ProjectTask["status"]) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { 
        ...task, 
        status, 
        progress: status === "completed" ? 100 : status === "pending" ? 0 : task.progress,
        completedAt: status === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined
      } : task
    );
    
    setTasks(updatedTasks);
    
    if (onTaskUpdate) {
      onTaskUpdate(taskId, { 
        status, 
        progress: status === "completed" ? 100 : status === "pending" ? 0 : undefined,
        completedAt: status === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined
      });
    }
    
    toast.success(`Task marked as ${status}`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    if (onTaskDelete) {
      onTaskDelete(taskId);
    }
    setSelectedTask(null);
    setShowTaskDetail(false);
    toast.success("Task deleted successfully");
  };

  const getPriorityColor = (priority: ProjectTask["priority"]) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: ProjectTask["status"]) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "in_progress": return <Clock className="h-5 w-5 text-blue-600" />;
      case "blocked": return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };
  
  // Get tasks for a specific date in calendar view
  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.getDate() === date.getDate() && 
        taskDate.getMonth() === date.getMonth() && 
        taskDate.getFullYear() === date.getFullYear();
    });
  };

  // Function to add existing task to calendar
  const handleAddTaskToCalendar = (task: ProjectTask) => {
    if (onAddToCalendar) {
      onAddToCalendar(task);
      toast.success("Task added to calendar");
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Tasks</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowCalendarView(!showCalendarView)}
            className="flex items-center gap-2"
          >
            {showCalendarView ? 
              <><CalendarCheck className="h-4 w-4" /> List View</> : 
              <><CalendarIconSolid className="h-4 w-4" /> Calendar View</>
            }
          </Button>
          <Button onClick={() => setShowAddTaskDialog(true)} className="flex items-center gap-2">
            <Plus size={16} /> Add Task
          </Button>
        </div>
      </div>

      {showCalendarView ? (
        // Calendar View
        <Card>
          <CardHeader>
            <CardTitle>Tasks Calendar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calendar Component */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                  style={{width: "300px"}}
                />
              </PopoverContent>
            </Popover>
            
            {/* Tasks for Selected Date */}
            <div className="mt-4">
              <h3 className="font-medium mb-2">Tasks for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Today"}</h3>
              <div className="space-y-2">
                {getTasksForDate(selectedDate || new Date()).length > 0 ? (
                  getTasksForDate(selectedDate || new Date()).map(task => (
                    <Card key={task.id} className="mb-2">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{task.title}</span>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{task.description?.substring(0, 60)}...</p>
                          </div>
                          <div className="flex gap-2">
                            {getStatusIcon(task.status)}
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => {
                                setSelectedTask(task);
                                setShowTaskDetail(true);
                              }}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No tasks due on this date.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // List View
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Task List</span>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <Card key={task.id} className="overflow-hidden">
                    <div className={`h-1 ${
                      task.status === "completed" ? "bg-green-500" :
                      task.status === "in_progress" ? "bg-blue-500" :
                      task.status === "blocked" ? "bg-red-500" : "bg-gray-200"
                    }`}></div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-muted-foreground">
                              Due: {format(new Date(task.dueDate), "MMM d")}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex gap-4">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleUpdateTaskStatus(
                              task.id, 
                              task.status === "completed" ? "pending" : "completed"
                            )}
                          >
                            {task.status === "completed" ? "Mark Incomplete" : "Mark Complete"}
                          </Button>
                          
                          {task.status !== "in_progress" && task.status !== "completed" && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8"
                              onClick={() => handleUpdateTaskStatus(task.id, "in_progress")}
                            >
                              Start Task
                            </Button>
                          )}
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8"
                            onClick={() => handleAddTaskToCalendar(task)}
                          >
                            <CalendarIconSolid className="h-4 w-4 mr-1" /> 
                            Add to Calendar
                          </Button>
                        </div>
                        
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="h-8"
                          onClick={() => {
                            setSelectedTask(task);
                            setShowTaskDetail(true);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks added yet.</p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => setShowAddTaskDialog(true)}
                  >
                    Add Your First Task
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Add Task Dialog with Calendar integration */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="task-title" className="text-sm font-medium">
                Task Title
              </label>
              <Input
                id="task-title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="task-description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="task-description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="task-status" className="text-sm font-medium">
                  Status
                </label>
                <Select 
                  defaultValue="pending"
                  onValueChange={(value) => setNewTask({ 
                    ...newTask, 
                    status: value as ProjectTask["status"] 
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
              
              <div className="grid gap-2">
                <label htmlFor="task-priority" className="text-sm font-medium">
                  Priority
                </label>
                <Select 
                  defaultValue="medium"
                  onValueChange={(value) => setNewTask({ 
                    ...newTask, 
                    priority: value as ProjectTask["priority"] 
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
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="task-due-date" className="text-sm font-medium">
                Due Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTask.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTask.dueDate ? format(new Date(newTask.dueDate), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newTask.dueDate ? new Date(newTask.dueDate) : undefined}
                    onSelect={(date) => setNewTask({ 
                      ...newTask, 
                      dueDate: date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd") 
                    })}
                    className="rounded-md border pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="task-assignee" className="text-sm font-medium">
                Assign To
              </label>
              <Select onValueChange={(value) => setNewTask({ ...newTask, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  {(project.staff || []).map(staff => (
                    <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Add to Calendar checkbox */}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="add-to-calendar" 
                checked={addToCalendar}
                onCheckedChange={(checked) => setAddToCalendar(!!checked)} 
              />
              <label 
                htmlFor="add-to-calendar" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Also add to project calendar
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetailDialog
          open={showTaskDetail}
          onOpenChange={setShowTaskDetail}
          task={selectedTask}
          onUpdateStatus={handleUpdateTaskStatus}
          onDelete={handleDeleteTask}
          onAddToCalendar={handleAddTaskToCalendar}
          projectStaff={project.staff || []}
        />
      )}
    </div>
  );
}
