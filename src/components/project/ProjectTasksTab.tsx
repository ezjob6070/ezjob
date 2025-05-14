import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  AlertTriangle, 
  CalendarIcon, 
  CheckIcon, 
  Clock, 
  ClipboardCheck, 
  Eye, 
  FileCheck, 
  FileText, 
  PlusIcon,
  CheckCircle,
  XCircle,
  Clock4,
  Search,
  BellRing,
  Bell
} from "lucide-react";
import { Project, ProjectTask, ProjectTaskInspection } from "@/types/project";
import { format } from "date-fns";
import { toast } from "sonner";
import TaskDetailDialog from "./TaskDetailDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectTasksTabProps {
  project: Project;
}

const ProjectTasksTab: React.FC<ProjectTasksTabProps> = ({ project }) => {
  const [tasks, setTasks] = useState<ProjectTask[]>(project.tasks || []);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [taskDetailOpen, setTaskDetailOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [newTask, setNewTask] = useState<Partial<ProjectTask>>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    dueDate: "",
    assignedTo: "",
    progress: 0,
    isReminder: false,
    reminderTime: "",
  });
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"priority" | "dueDate" | "progress">("priority");
  const [activeTasksTab, setActiveTasksTab] = useState<"all" | "pending" | "in_progress" | "completed" | "blocked" | "reminders">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleAddTask = () => {
    if (!newTask.title) {
      toast.error("Title is required");
      return;
    }
    
    // If it's a reminder, set default values for reminder-specific fields
    if (newTask.isReminder) {
      // Default status for reminders is "pending"
      newTask.status = "pending";
      
      // If no specific reminder time is set, use the due date with default time
      if (newTask.dueDate && !newTask.reminderTime) {
        newTask.reminderTime = `${newTask.dueDate}T09:00:00`;
      }
      
      // Reminders start at 0% progress
      newTask.progress = 0;
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
      lastUpdatedAt: new Date().toISOString(),
      inspections: [],
      comments: [],
      attachments: [],
      isReminder: newTask.isReminder,
      reminderTime: newTask.reminderTime,
      reminderSent: false
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
      isReminder: false,
      reminderTime: "",
    });
    
    toast.success(newTask.isReminder ? "Reminder added successfully" : "Task added successfully");
  };

  const handleUpdateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates };
        // If selected task is being updated, update the selected task as well
        if (selectedTask && selectedTask.id === taskId) {
          setSelectedTask(updatedTask);
        }
        return updatedTask;
      }
      return task;
    });
    
    setTasks(updatedTasks);
  };

  const handleOpenTaskDetail = (task: ProjectTask) => {
    setSelectedTask(task);
    setTaskDetailOpen(true);
  };

  const handleUpdateTaskStatus = (taskId: string, status: "pending" | "in_progress" | "completed" | "blocked") => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          status, 
          lastUpdatedAt: new Date().toISOString(),
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
          lastUpdatedAt: new Date().toISOString(),
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

  const getInspectionStatusIcon = (inspections: ProjectTaskInspection[] | undefined) => {
    if (!inspections || inspections.length === 0) {
      return null;
    }
    
    const passedCount = inspections.filter(i => i.status === "passed").length;
    const failedCount = inspections.filter(i => i.status === "failed").length;
    
    if (failedCount > 0) {
      return <AlertTriangle className="h-4 w-4 text-red-500" aria-label="Failed inspections" />;
    } else if (passedCount === inspections.length) {
      return <FileCheck className="h-4 w-4 text-green-500" aria-label="All inspections passed" />;
    } else {
      return <ClipboardCheck className="h-4 w-4 text-amber-500" aria-label="Some inspections pending" />;
    }
  };

  const calculateOverallProgress = () => {
    if (tasks.length === 0) return 0;
    const totalProgress = tasks.reduce((sum, task) => sum + task.progress, 0);
    return Math.round(totalProgress / tasks.length);
  };

  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    // Apply status filter from tab selection
    if (activeTasksTab === "reminders") {
      filtered = filtered.filter(task => task.isReminder === true);
    } else if (activeTasksTab !== "all") {
      filtered = filtered.filter(task => task.status === activeTasksTab && task.isReminder !== true);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) || 
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "priority") {
        const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - 
               priorityOrder[b.priority as keyof typeof priorityOrder];
      } else if (sortOrder === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else { // progress
        return b.progress - a.progress;
      }
    });
    
    return filtered;
  };

  const filteredTasks = getFilteredTasks();
  const completedTasksCount = tasks.filter(task => task.status === "completed" && !task.isReminder).length;
  const pendingTasksCount = tasks.filter(task => task.status === "pending" && !task.isReminder).length;
  const inProgressTasksCount = tasks.filter(task => task.status === "in_progress" && !task.isReminder).length;
  const blockedTasksCount = tasks.filter(task => task.status === "blocked" && !task.isReminder).length;
  const remindersCount = tasks.filter(task => task.isReminder === true).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Tasks & Progress</h2>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
              <PlusIcon size={16} /> Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Task or Reminder</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isReminder" className="font-medium text-base">Create as Reminder</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isReminder" className={`text-sm ${newTask.isReminder ? 'text-blue-500 font-medium' : 'text-gray-500'}`}>
                    {newTask.isReminder ? 'Reminder' : 'Task'}
                  </Label>
                  <Switch
                    id="isReminder"
                    checked={newTask.isReminder}
                    onCheckedChange={(checked) => setNewTask({...newTask, isReminder: checked})}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">{newTask.isReminder ? "Reminder Title" : "Task Title"}</Label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                  placeholder={newTask.isReminder ? "Enter reminder title" : "Enter task title"}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={newTask.description} 
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                  placeholder="Enter description" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">{newTask.isReminder ? "Reminder Date" : "Due Date"}</Label>
                  <Input 
                    id="dueDate" 
                    type="date" 
                    value={newTask.dueDate} 
                    onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
                  />
                </div>
                
                {newTask.isReminder && (
                  <div className="grid gap-2">
                    <Label htmlFor="reminderTime">Reminder Time</Label>
                    <Input 
                      id="reminderTime" 
                      type="time" 
                      value={newTask.reminderTime?.split('T')[1]?.substring(0, 5) || ""} 
                      onChange={(e) => {
                        if (newTask.dueDate) {
                          setNewTask({
                            ...newTask, 
                            reminderTime: `${newTask.dueDate}T${e.target.value}:00`
                          });
                        } else {
                          toast.error("Please select a date first");
                        }
                      }} 
                    />
                  </div>
                )}
                
                {!newTask.isReminder && (
                  <div className="grid gap-2">
                    <Label htmlFor="assignedTo">Assigned To</Label>
                    <Input 
                      id="assignedTo" 
                      value={newTask.assignedTo} 
                      onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} 
                      placeholder="Enter name" 
                    />
                  </div>
                )}
              </div>
              
              {!newTask.isReminder && (
                <>
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
                </>
              )}
            </div>
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleAddTask}>
                {newTask.isReminder ? "Add Reminder" : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task Status Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 overflow-hidden">
          <div className="bg-blue-600 h-1"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700">Total Tasks</p>
                <p className="text-3xl font-bold">{tasks.filter(t => !t.isReminder).length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <ClipboardCheck className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-700 hover:text-blue-800 hover:bg-blue-200 p-0 h-auto"
                onClick={() => setActiveTasksTab("all")}
              >
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 overflow-hidden">
          <div className="bg-green-600 h-1"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700">Completed</p>
                <p className="text-3xl font-bold">{completedTasksCount}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-green-700 hover:text-green-800 hover:bg-green-200 p-0 h-auto"
                onClick={() => setActiveTasksTab("completed")}
              >
                View Completed
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 overflow-hidden">
          <div className="bg-yellow-500 h-1"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-yellow-700">In Progress</p>
                <p className="text-3xl font-bold">{inProgressTasksCount}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <Clock4 className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-yellow-700 hover:text-yellow-800 hover:bg-yellow-200 p-0 h-auto"
                onClick={() => setActiveTasksTab("in_progress")}
              >
                View In-Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 overflow-hidden">
          <div className="bg-gray-500 h-1"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-700">Pending</p>
                <p className="text-3xl font-bold">{pendingTasksCount}</p>
              </div>
              <div className="bg-gray-200 p-3 rounded-full">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-700 hover:text-gray-800 hover:bg-gray-200 p-0 h-auto"
                onClick={() => setActiveTasksTab("pending")}
              >
                View Pending
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 overflow-hidden">
          <div className="bg-purple-600 h-1"></div>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700">Reminders</p>
                <p className="text-3xl font-bold">{remindersCount}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <BellRing className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-purple-700 hover:text-purple-800 hover:bg-purple-200 p-0 h-auto"
                onClick={() => setActiveTasksTab("reminders")}
              >
                View Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview Card - Now Smaller and More Compact */}
      <Card className="bg-white border-none shadow-md">
        <CardHeader className="py-4">
          <CardTitle className="text-lg font-semibold text-gray-800">Progress Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Project Completion</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-blue-600">{project.completion}%</div>
                <div className="flex-1">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-blue-500" 
                      style={{ width: `${project.completion}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Task Completion</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-600">{calculateOverallProgress()}%</div>
                <div className="flex-1">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-green-500" 
                      style={{ width: `${calculateOverallProgress()}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 mb-1">Tasks Status</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-600">
                  {completedTasksCount}/{tasks.filter(t => !t.isReminder).length}
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </div>
          
          {/* Task Status Distribution */}
          <div>
            <div className="text-xs text-gray-500 mb-2">Task Status Distribution</div>
            <div className="flex gap-1 h-3">
              {tasks.length > 0 && (
                <>
                  <div 
                    className="bg-green-500 rounded-l"
                    style={{ width: `${(completedTasksCount / tasks.filter(t => !t.isReminder).length) * 100}%` }}
                    title={`Completed: ${completedTasksCount} tasks`}
                  ></div>
                  <div 
                    className="bg-blue-500"
                    style={{ width: `${(inProgressTasksCount / tasks.filter(t => !t.isReminder).length) * 100}%` }}
                    title={`In Progress: ${inProgressTasksCount} tasks`}
                  ></div>
                  <div 
                    className="bg-gray-400"
                    style={{ width: `${(pendingTasksCount / tasks.filter(t => !t.isReminder).length) * 100}%` }}
                    title={`Pending: ${pendingTasksCount} tasks`}
                  ></div>
                  <div 
                    className="bg-red-500 rounded-r"
                    style={{ width: `${(blockedTasksCount / tasks.filter(t => !t.isReminder).length) * 100}%` }}
                    title={`Blocked: ${blockedTasksCount} tasks`}
                  ></div>
                </>
              )}
            </div>
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                Completed
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                In Progress
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                Pending
              </div>
              <div className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
                Blocked
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List with Search Bar and Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="font-medium text-lg">
            {activeTasksTab === "all" ? "All Tasks" :
             activeTasksTab === "completed" ? "Completed Tasks" :
             activeTasksTab === "in_progress" ? "In Progress Tasks" :
             activeTasksTab === "pending" ? "Pending Tasks" :
             activeTasksTab === "blocked" ? "Blocked Tasks" :
             activeTasksTab === "reminders" ? "Reminders" : "Tasks"}
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-9 w-full"
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="priority" onValueChange={(value) => setSortOrder(value as any)}>
              <SelectTrigger className="w-full sm:w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">By Priority</SelectItem>
                <SelectItem value="dueDate">By Due Date</SelectItem>
                <SelectItem value="progress">By Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Task Status Tabs - Added Reminders Tab */}
        <div className="bg-gray-50 p-1 rounded-lg">
          <Tabs value={activeTasksTab} onValueChange={(value) => setActiveTasksTab(value as any)} className="w-full">
            <TabsList className="grid grid-cols-6 w-full bg-transparent">
              <TabsTrigger 
                value="all" 
                className={`${activeTasksTab === 'all' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                All ({tasks.filter(t => !t.isReminder).length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className={`${activeTasksTab === 'pending' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                Pending ({pendingTasksCount})
              </TabsTrigger>
              <TabsTrigger 
                value="in_progress" 
                className={`${activeTasksTab === 'in_progress' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                In Progress ({inProgressTasksCount})
              </TabsTrigger>
              <TabsTrigger 
                value="completed" 
                className={`${activeTasksTab === 'completed' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                Completed ({completedTasksCount})
              </TabsTrigger>
              <TabsTrigger 
                value="blocked" 
                className={`${activeTasksTab === 'blocked' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                Blocked ({blockedTasksCount})
              </TabsTrigger>
              <TabsTrigger 
                value="reminders" 
                className={`${activeTasksTab === 'reminders' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'} rounded-lg`}
              >
                <div className="flex items-center gap-1">
                  <Bell className="h-3.5 w-3.5" />
                  Reminders ({remindersCount})
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Empty State for No Results */}
        {filteredTasks.length === 0 && (
          <Card className="text-center p-8 border-dashed">
            <div className="mb-3">
              {searchQuery ? (
                <Search className="h-12 w-12 text-gray-400 mx-auto" />
              ) : activeTasksTab === "reminders" ? (
                <Bell className="h-12 w-12 text-gray-400 mx-auto" />
              ) : activeTasksTab === "completed" ? (
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto" />
              ) : activeTasksTab === "pending" ? (
                <Clock className="h-12 w-12 text-gray-400 mx-auto" />
              ) : activeTasksTab === "in_progress" ? (
                <Clock4 className="h-12 w-12 text-gray-400 mx-auto" />
              ) : activeTasksTab === "blocked" ? (
                <XCircle className="h-12 w-12 text-gray-400 mx-auto" />
              ) : (
                <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-1">
              {searchQuery 
                ? "No matching results found" 
                : activeTasksTab === "reminders"
                  ? "No reminders yet"
                  : `No ${activeTasksTab !== "all" ? activeTasksTab.replace("_", " ") : ""} tasks yet`}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery 
                ? "Try adjusting your search query"
                : activeTasksTab === "reminders"
                  ? "Add your first reminder to get started"
                  : activeTasksTab === "all" 
                    ? "Create your first task to start tracking project progress"
                    : `No ${activeTasksTab.replace("_", " ")} tasks available`}
            </p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setNewTask(prev => ({
                  ...prev,
                  isReminder: activeTasksTab === "reminders"
                }));
                setNewTaskOpen(true);
              }} 
              className="mx-auto flex items-center gap-2"
            >
              <PlusIcon size={16} /> 
              {activeTasksTab === "reminders" ? "Add Reminder" : "Add Task"}
            </Button>
          </Card>
        )}
        
        {/* Task Cards */}
        {filteredTasks.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className={`overflow-hidden hover:shadow-md transition-shadow duration-200 ${task.isReminder ? 'border-purple-200' : ''}`}>
                <div className={`h-1.5 ${
                  task.isReminder ? "bg-purple-500" :
                  task.status === "completed" ? "bg-green-500" : 
                  task.status === "in_progress" ? "bg-blue-500" :
                  task.status === "blocked" ? "bg-red-500" :
                  "bg-gray-300"
                }`}></div>
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {task.isReminder ? (
                        <BellRing className="h-5 w-5 text-purple-500" />
                      ) : (
                        <ClipboardCheck className="h-5 w-5 text-blue-500" />
                      )}
                      <h3 className="font-medium line-clamp-1">{task.title}</h3>
                    </div>
                    {task.isReminder ? (
                      <Badge className="bg-purple-100 text-purple-800">Reminder</Badge>
                    ) : (
                      <Badge className={getStatusColor(task.status)}>{task.status.replace('_', ' ')}</Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 text-sm">
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    
                    {task.reminderTime && (
                      <div className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{format(new Date(task.reminderTime), "h:mm a")}</span>
                      </div>
                    )}
                    
                    {task.assignedTo && !task.isReminder && (
                      <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <span>{task.assignedTo}</span>
                      </div>
                    )}
                    
                    {!task.isReminder && (
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                    )}
                  </div>
                  
                  {!task.isReminder && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{task.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            task.progress === 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between pt-2">
                    {task.isReminder ? (
                      <div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => {
                            handleUpdateTaskStatus(task.id, "completed");
                            toast.success("Reminder marked as completed");
                          }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Mark as Done
                        </Button>
                      </div>
                    ) : (
                      task.status !== "completed" && (
                        <div>
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
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="outline">Close</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      )
                    )}
                    
                    <div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex items-center gap-1" 
                        onClick={() => handleOpenTaskDetail(task)}
                      >
                        <Eye className="h-3.5 w-3.5" /> View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* TaskDetailDialog component for selected task */}
      {selectedTask && (
        <TaskDetailDialog 
          task={selectedTask}
          open={taskDetailOpen}
          onOpenChange={setTaskDetailOpen}
          onTaskUpdate={handleUpdateTask}
          onUpdateStatus={(taskId, status) => handleUpdateTaskStatus(taskId, status)}
          onDelete={() => {}}
          onAddToCalendar={() => {}}
          projectStaff={project.staff || []}
        />
      )}
    </div>
  );
};

export default ProjectTasksTab;
