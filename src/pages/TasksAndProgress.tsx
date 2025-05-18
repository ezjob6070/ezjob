
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, Plus, ClipboardList, CheckCircle, Clock, 
  AlertCircle, FileText, Paperclip, Calendar 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ProjectTask } from "@/types/project";

// Sample data
const initialTasks: ProjectTask[] = [
  {
    id: "task-1",
    title: "Site preparation",
    description: "Clear the site and prepare for foundation work",
    status: "completed",
    priority: "high",
    dueDate: "2024-05-25",
    assignedTo: "John Carpenter",
    createdAt: "2024-05-10",
    progress: 100,
    attachments: [
      { id: "att1", name: "Site plan.pdf", type: "pdf", url: "#", uploadedAt: "2024-05-10", uploadedBy: "Sarah Admin" }
    ]
  },
  {
    id: "task-2",
    title: "Foundation construction",
    description: "Pour and set foundation concrete",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2024-05-30",
    assignedTo: "Mike Builder",
    createdAt: "2024-05-12",
    progress: 65,
    attachments: [
      { id: "att2", name: "Foundation_specs.pdf", type: "pdf", url: "#", uploadedAt: "2024-05-12", uploadedBy: "Sarah Admin" }
    ]
  },
  {
    id: "task-3",
    title: "Framing and structural work",
    description: "Complete all framing according to blueprints",
    status: "in_progress",
    priority: "high",
    dueDate: "2024-06-10",
    assignedTo: "Mike Builder",
    createdAt: "2024-05-15",
    progress: 30,
    attachments: []
  },
  {
    id: "task-4",
    title: "Building inspection - initial",
    description: "Schedule and prepare for initial building inspection",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-15",
    assignedTo: "Sarah Admin",
    createdAt: "2024-05-16",
    progress: 0,
    attachments: []
  },
  {
    id: "task-5",
    title: "Electrical rough-in",
    description: "Install electrical wiring and boxes",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-20",
    assignedTo: "Tom Electrician",
    createdAt: "2024-05-17",
    progress: 0,
    attachments: []
  },
  {
    id: "task-6",
    title: "Plumbing rough-in",
    description: "Install water and waste lines",
    status: "pending",
    priority: "medium",
    dueDate: "2024-06-25",
    assignedTo: "Gary Plumber",
    createdAt: "2024-05-18",
    progress: 0,
    attachments: []
  },
];

// Mock function to get task status count
const getStatusCounts = (tasks: ProjectTask[]) => {
  return {
    total: tasks.length,
    completed: tasks.filter(t => t.status === "completed").length,
    inProgress: tasks.filter(t => t.status === "in_progress").length,
    pending: tasks.filter(t => t.status === "pending").length,
    blocked: tasks.filter(t => t.status === "blocked").length,
  };
};

const TasksAndProgress = () => {
  const [tasks, setTasks] = useState<ProjectTask[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    progress: 0,
    attachments: []
  });

  const statusCounts = getStatusCounts(tasks);
  
  // Filter tasks based on search term, status and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (task.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Calculate overall progress
  const overallProgress = tasks.length > 0 
    ? Math.round(tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length)
    : 0;

  const handleAddTask = () => {
    const newTaskId = `task-${tasks.length + 1}`;
    const taskToAdd: ProjectTask = {
      ...newTask as ProjectTask,
      id: newTaskId,
      createdAt: new Date().toISOString().split('T')[0],
      attachments: newTask.attachments || []
    };
    
    setTasks([...tasks, taskToAdd]);
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: "",
      assignedTo: "",
      progress: 0,
      attachments: []
    });
    setIsNewTaskDialogOpen(false);
    toast.success("Task added successfully");
  };

  const handleUpdateTask = () => {
    if (!selectedTask) return;
    
    setTasks(tasks.map(task => 
      task.id === selectedTask.id ? selectedTask : task
    ));
    
    setIsTaskDialogOpen(false);
    toast.success("Task updated successfully");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setIsTaskDialogOpen(false);
    toast.success("Task deleted successfully");
  };

  const handleAddDocument = () => {
    if (!selectedTask) return;
    
    // This would be replaced with an actual file upload in a real application
    const newDocument = {
      id: `doc-${Date.now()}`,
      name: "New Document.pdf",
      type: "pdf",
      url: "#",
      uploadedAt: new Date().toISOString().split('T')[0],
      uploadedBy: "Current User"
    };
    
    const updatedTask = {
      ...selectedTask,
      attachments: [...(selectedTask.attachments || []), newDocument]
    };
    
    setSelectedTask(updatedTask);
    toast.success("Document added successfully");
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in_progress": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "pending": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "blocked": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "medium": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "low": return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "in_progress": return "In Progress";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-100 shadow-sm rounded-lg -mx-4 -mt-4 md:-mx-6 md:-mt-6 px-5 pt-6 pb-4 md:px-7 md:pt-7 md:pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-4">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Tasks and Progress</h1>
            <p className="text-gray-600 text-sm">Manage and track all project tasks</p>
          </div>
          <Button onClick={() => setIsNewTaskDialogOpen(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add New Task
          </Button>
        </div>
      </div>

      {/* Progress overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-blue-900">{statusCounts.total}</span>
              <ClipboardList className="text-blue-500 mb-1" size={20} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-green-900">{statusCounts.completed}</span>
              <CheckCircle className="text-green-500 mb-1" size={20} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-amber-900">{statusCounts.inProgress}</span>
              <Clock className="text-amber-500 mb-1" size={20} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-purple-900">{statusCounts.pending}</span>
              <AlertCircle className="text-purple-500 mb-1" size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall progress bar */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Overall Progress</CardTitle>
            <span className="font-bold text-lg">{overallProgress}%</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Task list with filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Task List</CardTitle>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search tasks..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <div 
                  key={task.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedTask(task);
                    setIsTaskDialogOpen(true);
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{task.title}</h3>
                        <Badge className={getStatusBadgeColor(task.status)}>
                          {formatStatus(task.status)}
                        </Badge>
                        <Badge className={getPriorityBadgeColor(task.priority)}>
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                      {task.attachments && task.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Paperclip size={14} />
                          <span>{task.attachments.length}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar size={14} />
                        <span>{task.dueDate}</span>
                      </div>
                      <Badge variant="outline" className="ml-2">{task.assignedTo}</Badge>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                    <div 
                      className={`h-1.5 rounded-full ${
                        task.status === "completed" ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No tasks match your filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Task detail dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              View and edit task information
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="task-title">Title</Label>
                <Input 
                  id="task-title" 
                  value={selectedTask.title} 
                  onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-description">Description</Label>
                <Textarea 
                  id="task-description" 
                  value={selectedTask.description || ""} 
                  onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-status">Status</Label>
                  <Select 
                    value={selectedTask.status} 
                    onValueChange={(value) => setSelectedTask({
                      ...selectedTask, 
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
                
                <div className="space-y-2">
                  <Label htmlFor="task-priority">Priority</Label>
                  <Select 
                    value={selectedTask.priority} 
                    onValueChange={(value) => setSelectedTask({
                      ...selectedTask, 
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-due-date">Due Date</Label>
                  <Input 
                    id="task-due-date" 
                    type="date" 
                    value={selectedTask.dueDate || ""} 
                    onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="task-assigned-to">Assigned To</Label>
                  <Input 
                    id="task-assigned-to" 
                    value={selectedTask.assignedTo || ""} 
                    onChange={(e) => setSelectedTask({...selectedTask, assignedTo: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="task-progress">Progress ({selectedTask.progress}%)</Label>
                <Input 
                  id="task-progress" 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={selectedTask.progress} 
                  onChange={(e) => setSelectedTask({
                    ...selectedTask, 
                    progress: parseInt(e.target.value),
                    status: parseInt(e.target.value) === 100 ? "completed" : selectedTask.status
                  })} 
                />
              </div>
              
              {/* Attachments section */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <Label>Attachments</Label>
                  <Button variant="outline" size="sm" onClick={handleAddDocument} className="flex items-center gap-1">
                    <Plus size={14} />
                    Add Document
                  </Button>
                </div>
                
                <div className="border rounded-md">
                  {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                    <div className="divide-y">
                      {selectedTask.attachments.map(doc => (
                        <div key={doc.id} className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText size={16} className="text-blue-600" />
                            <span>{doc.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{doc.uploadedAt}</span>
                            <Button variant="ghost" size="sm">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No documents attached
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteTask(selectedTask.id)}
                >
                  Delete Task
                </Button>
                <Button onClick={handleUpdateTask}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* New task dialog */}
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to the project
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="new-task-title">Title*</Label>
              <Input 
                id="new-task-title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="new-task-description">Description</Label>
              <Textarea 
                id="new-task-description" 
                value={newTask.description || ""} 
                onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-task-status">Status*</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="new-task-priority">Priority*</Label>
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
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-task-due-date">Due Date*</Label>
                <Input 
                  id="new-task-due-date" 
                  type="date" 
                  value={newTask.dueDate || ""} 
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-task-assigned-to">Assigned To*</Label>
                <Input 
                  id="new-task-assigned-to" 
                  value={newTask.assignedTo || ""} 
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} 
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.dueDate || !newTask.assignedTo}
              >
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksAndProgress;
