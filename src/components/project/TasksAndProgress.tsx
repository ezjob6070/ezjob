
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Clock, FileText, MoreHorizontal, Paperclip, Plus, Search, Upload, X } from "lucide-react";
import { Project, ProjectTask, ProjectTaskAttachment } from "@/types/project";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { toast } from "sonner";

interface TasksAndProgressProps {
  project: Project;
  onUpdateProject?: (updatedProject: Project) => void;
}

const TasksAndProgress = ({ project, onUpdateProject }: TasksAndProgressProps) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || []);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showTaskDialog, setShowTaskDialog] = useState<boolean>(false);
  const [showTaskDetail, setShowTaskDetail] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<ProjectTask | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showUploadDialog, setShowUploadDialog] = useState<boolean>(false);
  const [newAttachment, setNewAttachment] = useState<{
    name: string;
    type: string;
    url: string;
  }>({ name: "", type: "", url: "" });
  const [newComment, setNewComment] = useState<string>("");
  
  // Task form fields
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    status: "pending" | "in_progress" | "completed" | "blocked";
    priority: "low" | "medium" | "high" | "urgent";
    dueDate: string;
    assignedTo: string;
    progress: number;
  }>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: format(new Date(), "yyyy-MM-dd"),
    assignedTo: "",
    progress: 0
  });

  // Stats
  const completedTasksCount = tasks.filter(task => task.status === "completed").length;
  const totalTasksCount = tasks.length;
  const completionRate = totalTasksCount > 0 ? (completedTasksCount / totalTasksCount) * 100 : 0;
  
  const highPriorityCount = tasks.filter(task => task.priority === "high" || task.priority === "urgent").length;
  const blockedTasksCount = tasks.filter(task => task.status === "blocked").length;
  const inProgressTasksCount = tasks.filter(task => task.status === "in_progress").length;
  const pendingTasksCount = tasks.filter(task => task.status === "pending").length;

  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter(task => {
    // Filter by tab
    if (activeTab === "all") {
      // No status filter
    } else if (activeTab === "completed" && task.status !== "completed") {
      return false;
    } else if (activeTab === "in-progress" && task.status !== "in_progress") {
      return false;
    } else if (activeTab === "pending" && task.status !== "pending") {
      return false;
    } else if (activeTab === "blocked" && task.status !== "blocked") {
      return false;
    } else if (activeTab === "high-priority" && task.priority !== "high" && task.priority !== "urgent") {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Handle new task creation
  const handleCreateTask = () => {
    const task: ProjectTask = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
      assignedTo: newTask.assignedTo || undefined,
      createdAt: format(new Date(), "yyyy-MM-dd"),
      progress: newTask.progress,
      attachments: [],
      comments: []
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success("Task created successfully");
    setShowTaskDialog(false);
    resetNewTaskForm();
  };

  // Handle task update
  const handleUpdateTask = () => {
    if (!currentTask) return;
    
    const updatedTasks = tasks.map(task => 
      task.id === currentTask.id ? {
        ...task,
        title: newTask.title,
        description: newTask.description,
        status: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        assignedTo: newTask.assignedTo || undefined,
        progress: newTask.progress,
        lastUpdatedAt: format(new Date(), "yyyy-MM-dd")
      } : task
    );
    
    setTasks(updatedTasks);
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success("Task updated successfully");
    setEditMode(false);
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success("Task deleted");
    setShowTaskDetail(false);
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: "pending" | "in_progress" | "completed" | "blocked") => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? {
        ...task,
        status: newStatus,
        completedAt: newStatus === "completed" ? format(new Date(), "yyyy-MM-dd") : task.completedAt,
        lastUpdatedAt: format(new Date(), "yyyy-MM-dd")
      } : task
    );
    
    setTasks(updatedTasks);
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success(`Task marked as ${newStatus.replace('_', ' ')}`);
  };

  // Handle adding attachment
  const handleAddAttachment = () => {
    if (!currentTask) return;
    
    const attachment: ProjectTaskAttachment = {
      id: `attachment-${Date.now()}`,
      name: newAttachment.name,
      type: newAttachment.type,
      url: newAttachment.url,
      uploadedAt: format(new Date(), "yyyy-MM-dd"),
      uploadedBy: "Current User" // This would come from auth context in a real app
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === currentTask.id ? {
        ...task,
        attachments: [...(task.attachments || []), attachment],
        lastUpdatedAt: format(new Date(), "yyyy-MM-dd")
      } : task
    );
    
    setTasks(updatedTasks);
    setCurrentTask({
      ...currentTask,
      attachments: [...(currentTask.attachments || []), attachment]
    });
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success("Document attached successfully");
    setShowUploadDialog(false);
    setNewAttachment({ name: "", type: "", url: "" });
  };

  // Handle adding comment
  const handleAddComment = () => {
    if (!currentTask || !newComment.trim()) return;
    
    const comment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      author: "Current User", // This would come from auth context in a real app
      date: format(new Date(), "yyyy-MM-dd")
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === currentTask.id ? {
        ...task,
        comments: [...(task.comments || []), comment],
        lastUpdatedAt: format(new Date(), "yyyy-MM-dd")
      } : task
    );
    
    setTasks(updatedTasks);
    setCurrentTask({
      ...currentTask,
      comments: [...(currentTask.comments || []), comment]
    });
    
    if (onUpdateProject) {
      onUpdateProject({
        ...project,
        tasks: updatedTasks
      });
    }
    
    toast.success("Comment added");
    setNewComment("");
  };

  const resetNewTaskForm = () => {
    setNewTask({
      title: "",
      description: "",
      status: "pending",
      priority: "medium",
      dueDate: format(new Date(), "yyyy-MM-dd"),
      assignedTo: "",
      progress: 0
    });
  };

  const openTaskDetail = (task: ProjectTask) => {
    setCurrentTask(task);
    setShowTaskDetail(true);
    
    // Populate form with current task data for potential editing
    setNewTask({
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || format(new Date(), "yyyy-MM-dd"),
      assignedTo: task.assignedTo || "",
      progress: task.progress
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "blocked":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tasks Progress</CardTitle>
            <CardDescription>Overall completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>{completedTasksCount} of {totalTasksCount} tasks completed</span>
                  <span className="font-medium">{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-blue-50 rounded-md p-3">
                  <div className="text-xs text-blue-600 mb-1">In Progress</div>
                  <div className="text-2xl font-semibold">{inProgressTasksCount}</div>
                </div>
                <div className="bg-yellow-50 rounded-md p-3">
                  <div className="text-xs text-yellow-600 mb-1">Pending</div>
                  <div className="text-2xl font-semibold">{pendingTasksCount}</div>
                </div>
                <div className="bg-red-50 rounded-md p-3">
                  <div className="text-xs text-red-600 mb-1">Blocked</div>
                  <div className="text-2xl font-semibold">{blockedTasksCount}</div>
                </div>
                <div className="bg-purple-50 rounded-md p-3">
                  <div className="text-xs text-purple-600 mb-1">High Priority</div>
                  <div className="text-2xl font-semibold">{highPriorityCount}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Project Tasks</CardTitle>
                <CardDescription>Manage and track all project tasks</CardDescription>
              </div>
              <Button onClick={() => {
                setEditMode(false);
                resetNewTaskForm();
                setShowTaskDialog(true);
              }} className="flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 pb-1">
            <div className="px-4 pb-2 pt-1">
              <div className="flex items-center border rounded-md px-3 py-1.5">
                <Search className="h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search tasks..." 
                  className="border-0 focus-visible:ring-0 focus-visible:ring-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="border-t">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0">
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="all"
                    >
                      All
                    </TabsTrigger>
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="in-progress"
                    >
                      In Progress
                    </TabsTrigger>
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="pending"
                    >
                      Pending
                    </TabsTrigger>
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="completed"
                    >
                      Completed
                    </TabsTrigger>
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="blocked"
                    >
                      Blocked
                    </TabsTrigger>
                    <TabsTrigger 
                      className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent"
                      value="high-priority"
                    >
                      High Priority
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value={activeTab} className="m-0">
                  <ScrollArea className="h-[280px]">
                    <div className="px-4">
                      {filteredTasks.length > 0 ? (
                        <div className="space-y-2 py-2">
                          {filteredTasks.map((task) => (
                            <div 
                              key={task.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-white hover:bg-gray-50 cursor-pointer"
                              onClick={() => openTaskDetail(task)}
                            >
                              <div className="flex items-center gap-3">
                                <Checkbox 
                                  checked={task.status === "completed"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(
                                      task.id,
                                      task.status === "completed" ? "pending" : "completed"
                                    );
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{task.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {task.dueDate && `Due: ${format(new Date(task.dueDate), "MMM d, yyyy")}`}
                                    {task.assignedTo && ` • Assigned: ${task.assignedTo}`}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {task.attachments && task.attachments.length > 0 && (
                                  <div className="text-xs text-gray-500 flex items-center">
                                    <Paperclip className="h-3 w-3 mr-1" />
                                    {task.attachments.length}
                                  </div>
                                )}
                                <Badge className={getStatusBadgeColor(task.status)}>
                                  {task.status === "in_progress" ? "In Progress" : 
                                   task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                                </Badge>
                                <Badge className={getPriorityBadgeColor(task.priority)}>
                                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-8 text-center text-gray-500">
                          {searchQuery ? (
                            <>
                              <p>No matching tasks found.</p>
                              <p className="text-sm">Try adjusting your search or filters.</p>
                            </>
                          ) : (
                            <>
                              <p>No tasks in this category.</p>
                              <Button 
                                variant="link" 
                                onClick={() => {
                                  setEditMode(false);
                                  resetNewTaskForm();
                                  setShowTaskDialog(true);
                                }}
                              >
                                Create a new task
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Task Creation/Edit Dialog */}
      <Dialog open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editMode ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Title</Label>
              <Input 
                id="task-title" 
                value={newTask.title} 
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="task-description">Description</Label>
              <Textarea 
                id="task-description" 
                value={newTask.description} 
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task description" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="task-status">Status</Label>
                <Select 
                  value={newTask.status} 
                  onValueChange={(value: "pending" | "in_progress" | "completed" | "blocked") => 
                    setNewTask({...newTask, status: value})
                  }
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
                <Label htmlFor="task-priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") => 
                    setNewTask({...newTask, priority: value})
                  }
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
              <div className="grid gap-2">
                <Label htmlFor="task-due-date">Due Date</Label>
                <Input 
                  id="task-due-date" 
                  type="date" 
                  value={newTask.dueDate} 
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="task-assigned-to">Assigned To</Label>
                <Input 
                  id="task-assigned-to" 
                  value={newTask.assignedTo} 
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  placeholder="Enter name" 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="task-progress">Progress ({newTask.progress}%)</Label>
              </div>
              <Input 
                id="task-progress" 
                type="range" 
                min="0" 
                max="100" 
                value={newTask.progress} 
                onChange={(e) => setNewTask({...newTask, progress: Number(e.target.value)})}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTaskDialog(false)}>Cancel</Button>
            <Button onClick={editMode ? handleUpdateTask : handleCreateTask}>
              {editMode ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Task Detail Dialog */}
      <Dialog open={showTaskDetail} onOpenChange={setShowTaskDetail}>
        <DialogContent className="sm:max-w-[700px]">
          {currentTask && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">
                    {editMode ? (
                      <Input 
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        className="text-xl font-semibold"
                      />
                    ) : (
                      currentTask.title
                    )}
                  </DialogTitle>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!editMode && (
                        <DropdownMenuItem onClick={() => setEditMode(true)}>
                          Edit Task
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(currentTask.id, "completed");
                        if (currentTask.status !== "completed") {
                          setCurrentTask({...currentTask, status: "completed"});
                        }
                      }}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        handleStatusChange(currentTask.id, "in_progress");
                        if (currentTask.status !== "in_progress") {
                          setCurrentTask({...currentTask, status: "in_progress"});
                        }
                      }}>
                        Mark as In Progress
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => handleDeleteTask(currentTask.id)}
                      >
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  {editMode ? (
                    <div className="flex gap-2">
                      <Select 
                        value={newTask.status} 
                        onValueChange={(value: "pending" | "in_progress" | "completed" | "blocked") => 
                          setNewTask({...newTask, status: value})
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="blocked">Blocked</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select 
                        value={newTask.priority} 
                        onValueChange={(value: "low" | "medium" | "high" | "urgent") => 
                          setNewTask({...newTask, priority: value})
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <>
                      <Badge className={getStatusBadgeColor(currentTask.status)}>
                        {currentTask.status === "in_progress" ? "In Progress" : 
                         currentTask.status.charAt(0).toUpperCase() + currentTask.status.slice(1)}
                      </Badge>
                      <Badge className={getPriorityBadgeColor(currentTask.priority)}>
                        {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)}
                      </Badge>
                    </>
                  )}
                </div>
              </DialogHeader>
              
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="attachments">
                    Attachments ({currentTask.attachments?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="comments">
                    Comments ({currentTask.comments?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Description</Label>
                      {editMode ? (
                        <Textarea 
                          value={newTask.description} 
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          className="mt-1"
                          rows={4}
                        />
                      ) : (
                        <p className="mt-1">{currentTask.description || "No description provided."}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Assigned To</Label>
                        {editMode ? (
                          <Input 
                            value={newTask.assignedTo} 
                            onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1">{currentTask.assignedTo || "Unassigned"}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Due Date</Label>
                        {editMode ? (
                          <Input 
                            type="date"
                            value={newTask.dueDate} 
                            onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1">
                            {currentTask.dueDate ? format(new Date(currentTask.dueDate), "MMM d, yyyy") : "No due date"}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Created At</Label>
                        <p className="mt-1">{format(new Date(currentTask.createdAt), "MMM d, yyyy")}</p>
                      </div>
                      
                      <div>
                        <Label className="text-sm text-muted-foreground">Last Updated</Label>
                        <p className="mt-1">
                          {currentTask.lastUpdatedAt ? 
                            format(new Date(currentTask.lastUpdatedAt), "MMM d, yyyy") : 
                            "Not updated yet"
                          }
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center">
                        <Label className="text-sm text-muted-foreground">Progress</Label>
                        <span className="text-sm font-medium">{currentTask.progress}%</span>
                      </div>
                      {editMode ? (
                        <Input 
                          type="range" 
                          min="0" 
                          max="100" 
                          value={newTask.progress} 
                          onChange={(e) => setNewTask({...newTask, progress: Number(e.target.value)})}
                          className="mt-1 cursor-pointer"
                        />
                      ) : (
                        <Progress value={currentTask.progress} className="mt-2 h-2" />
                      )}
                    </div>
                    
                    {editMode && (
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => setEditMode(false)}>Cancel</Button>
                        <Button onClick={handleUpdateTask}>Save Changes</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="attachments" className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Task Documents</h3>
                    <Button onClick={() => setShowUploadDialog(true)} className="flex items-center gap-1">
                      <Upload className="h-4 w-4" /> Upload Document
                    </Button>
                  </div>
                  
                  {currentTask.attachments && currentTask.attachments.length > 0 ? (
                    <div className="space-y-3">
                      {currentTask.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex justify-between items-center p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-md">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-xs text-gray-500">
                                Uploaded on {format(new Date(attachment.uploadedAt), "MMM d, yyyy")}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full w-full">
                              <span className="sr-only">Download</span>
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 border rounded-md">
                      <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 mb-2">No documents attached yet</p>
                      <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                        Upload Document
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="comments" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <Textarea 
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {currentTask.comments && currentTask.comments.length > 0 ? (
                    <div className="space-y-4">
                      {currentTask.comments.map((comment) => (
                        <div key={comment.id} className="border rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{comment.author}</span>
                            <span className="text-xs text-gray-500">{format(new Date(comment.date), "MMM d, yyyy")}</span>
                          </div>
                          <p>{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No comments yet. Add the first comment!
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Document Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="document-name">Document Name</Label>
              <Input 
                id="document-name" 
                value={newAttachment.name} 
                onChange={(e) => setNewAttachment({...newAttachment, name: e.target.value})}
                placeholder="Enter document name" 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="document-type">Document Type</Label>
              <Select 
                value={newAttachment.type} 
                onValueChange={(value) => setNewAttachment({...newAttachment, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Word Document</SelectItem>
                  <SelectItem value="xls">Excel Spreadsheet</SelectItem>
                  <SelectItem value="img">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="document-url">Document URL</Label>
              <Input 
                id="document-url" 
                value={newAttachment.url} 
                onChange={(e) => setNewAttachment({...newAttachment, url: e.target.value})}
                placeholder="Enter document URL" 
              />
            </div>
            
            <div className="bg-gray-50 p-3 rounded-md border">
              <p className="text-sm text-gray-500">
                Note: In a production app, you would upload files directly. This is a simplified version using URLs for demo purposes.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleAddAttachment}
              disabled={!newAttachment.name || !newAttachment.type || !newAttachment.url}
            >
              Attach Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksAndProgress;
