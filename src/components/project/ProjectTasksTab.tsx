
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, CheckIcon, Clock, PlusIcon } from "lucide-react";
import { Project, ProjectTask } from "@/types/project";
import { format } from "date-fns";
import { toast } from "sonner";

interface ProjectTasksTabProps {
  project: Project;
}

const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({ project }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || []);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    progress: 0,
  });

  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error("Task title is required");
      return;
    }
    
    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status as "pending" | "in_progress" | "completed" | "blocked",
      priority: newTask.priority as "low" | "medium" | "high" | "urgent",
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo,
      createdAt: new Date().toISOString(),
      progress: newTask.progress || 0,
    };
    
    setTasks([...tasks, task]);
    setNewTaskOpen(false);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      progress: 0,
    });
    
    toast.success("Task added successfully");
  };

  const handleUpdateTaskStatus = (taskId: string, status: "pending" | "in_progress" | "completed" | "blocked") => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status, 
          completedAt: status === "completed" ? new Date().toISOString() : task.completedAt,
          progress: status === "completed" ? 100 : task.progress
        };
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.success("Task status updated");
  };

  const handleUpdateTaskProgress = (taskId: string, progress: number) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          progress, 
          status: progress === 100 ? "completed" : (progress > 0 ? "in_progress" : task.status),
          completedAt: progress === 100 ? new Date().toISOString() : task.completedAt
        };
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
    toast.success("Task progress updated");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-amber-100 text-amber-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks & Progress</h2>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusIcon size={16} /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                  placeholder="Enter task title" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                  placeholder="Enter task description" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue={newTask.status} 
                    onValueChange={(value) => setNewTask({...newTask, status: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    defaultValue={newTask.priority} 
                    onValueChange={(value) => setNewTask({...newTask, priority: value as any})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={newTask.dueDate} 
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Input 
                    id="assignedTo" 
                    value={newTask.assignedTo} 
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} 
                    placeholder="Enter name" 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="progress">Initial Progress ({newTask.progress}%)</Label>
                <Input 
                  id="progress" 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={newTask.progress} 
                  onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value)})} 
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddTask}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Overall Project Completion</div>
              <div className="text-2xl font-bold">{project.completion}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Task Completion</div>
              <div className="text-2xl font-bold">{calculateOverallProgress()}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Tasks Status</div>
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.status === "completed").length}/{tasks.length} Complete
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-2">Project Progress</div>
            <div className="w-full h-3 bg-gray-100 rounded-full">
              <div 
                className="h-full rounded-full bg-blue-500" 
                style={{ width: `${project.completion}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-2">Task Progress</div>
            <div className="w-full h-3 bg-gray-100 rounded-full">
              <div 
                className="h-full rounded-full bg-green-500" 
                style={{ width: `${calculateOverallProgress()}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        <h3 className="font-medium text-lg">Tasks List</h3>
        
        {tasks.length === 0 ? (
          <Card className="text-center p-8">
            <div className="mb-3">
              <Clock className="h-12 w-12 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tasks yet</h3>
            <p className="text-gray-500 mb-4">
              Create your first task to start tracking project progress
            </p>
            <Button 
              onClick={() => setNewTaskOpen(true)} 
              className="mx-auto flex items-center gap-2"
            >
              <PlusIcon size={16} /> Add Task
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <div className={`h-1 ${
                  task.status === "completed" ? "bg-green-500" : 
                  task.status === "in_progress" ? "bg-blue-500" :
                  task.status === "blocked" ? "bg-red-500" :
                  "bg-gray-300"
                }`}></div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{task.title}</h3>
                    <Badge className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    
                    {task.assignedTo && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>Assigned to: {task.assignedTo}</span>
                      </div>
                    )}
                    
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full">
                      <div 
                        className={`h-full rounded-full ${
                          task.progress === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <div>
                      {task.status !== "completed" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">Update Progress</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Task Progress</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="space-y-2">
                                <Label>Current Progress: {task.progress}%</Label>
                                <Input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  step="5"
                                  defaultValue={task.progress}
                                  onChange={(e) => handleUpdateTaskProgress(task.id, parseInt(e.target.value))} 
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                  <span>0%</span>
                                  <span>50%</span>
                                  <span>100%</span>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                    
                    <div className="space-x-2">
                      {task.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleUpdateTaskStatus(task.id, "in_progress")}
                        >
                          Start Task
                        </Button>
                      )}
                      
                      {task.status === "in_progress" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                          onClick={() => handleUpdateTaskStatus(task.id, "completed")}
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTasksTab;
