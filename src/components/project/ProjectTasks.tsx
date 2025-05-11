
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, List, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Define the task type
export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: "not-started" | "in-progress" | "completed";
  dueDate?: string;
  assignedTo?: string;
  priority: "low" | "medium" | "high";
}

interface ProjectTasksProps {
  projectId: number | string;
  projectName: string;
}

const ProjectTasks: React.FC<ProjectTasksProps> = ({ projectId, projectName }) => {
  // Sample tasks for demonstration
  const [tasks, setTasks] = useState<ProjectTask[]>([
    {
      id: "task-1",
      title: "Create architectural drawings",
      description: "Finalize all architectural drawings for permit submission",
      status: "completed",
      dueDate: "2024-06-15",
      assignedTo: "Sarah Chen",
      priority: "high"
    },
    {
      id: "task-2",
      title: "Secure permits from city",
      description: "Submit all required paperwork and follow up with city officials",
      status: "in-progress",
      dueDate: "2024-07-01",
      assignedTo: "Thomas Wright",
      priority: "high"
    },
    {
      id: "task-3",
      title: "Order construction materials",
      description: "Order the first batch of construction materials",
      status: "not-started",
      dueDate: "2024-07-10",
      assignedTo: "James Wilson",
      priority: "medium"
    },
    {
      id: "task-4",
      title: "Schedule site inspection",
      description: "Coordinate with inspector for initial site review",
      status: "not-started",
      dueDate: "2024-07-15",
      assignedTo: "Daniel Park",
      priority: "low"
    }
  ]);
  
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Omit<ProjectTask, "id">>({
    title: "",
    description: "",
    status: "not-started",
    priority: "medium"
  });

  // Calculate project progress based on completed tasks
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === "completed").length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, completed: boolean) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: completed ? "completed" : "not-started"
        };
      }
      return task;
    }));
    
    toast.success(completed ? "Task marked as completed" : "Task marked as not started");
  };

  // Add a new task
  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error("Please enter a task title");
      return;
    }
    
    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      ...newTask
    };
    
    setTasks([...tasks, task]);
    setIsAddTaskDialogOpen(false);
    setNewTask({
      title: "",
      description: "",
      status: "not-started",
      priority: "medium"
    });
    
    toast.success("Task added successfully");
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "in-progress":
        return <Clock className="h-4 w-4" />;
      default:
        return <List className="h-4 w-4" />;
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Project Tasks</h2>
          <p className="text-muted-foreground">
            Track tasks and progress for {projectName}
          </p>
        </div>
        <Button 
          onClick={() => setIsAddTaskDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Progress</span>
            <span className="text-xl">{calculateProgress()}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress()} className="h-3" />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
            <div>
              <div className="font-medium">{tasks.length}</div>
              <div className="text-muted-foreground">Total Tasks</div>
            </div>
            <div>
              <div className="font-medium">{tasks.filter(t => t.status === "completed").length}</div>
              <div className="text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="font-medium">{tasks.filter(t => t.status === "in-progress").length}</div>
              <div className="text-muted-foreground">In Progress</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
          >
            <div className="flex gap-3">
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={(checked) => handleStatusChange(task.id, !!checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(task.status)}
                      <span>
                        {task.status === "in-progress" ? "In Progress" : 
                         task.status === "completed" ? "Completed" : "Not Started"}
                      </span>
                    </Badge>
                  </div>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  {task.description}
                </p>
                {(task.dueDate || task.assignedTo) && (
                  <div className="flex justify-between mt-3 text-xs text-muted-foreground">
                    {task.dueDate && (
                      <div>Due: {task.dueDate}</div>
                    )}
                    {task.assignedTo && (
                      <div>Assigned to: {task.assignedTo}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-10 border rounded-lg">
            <List className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-2 font-medium">No tasks yet</h3>
            <p className="text-muted-foreground mb-4">Add tasks to track progress</p>
            <Button 
              variant="outline" 
              onClick={() => setIsAddTaskDialogOpen(true)}
              className="mx-auto"
            >
              Add First Task
            </Button>
          </div>
        )}
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Provide task details"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full border rounded-md h-10 px-3"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({
                    ...newTask, 
                    priority: e.target.value as "low" | "medium" | "high"
                  })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assign To</Label>
              <Input 
                id="assignedTo" 
                value={newTask.assignedTo || ''}
                onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                placeholder="Enter team member name"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask}>
              Add Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTasks;
