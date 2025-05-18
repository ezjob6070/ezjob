
import React, { useState, useEffect } from "react";
import {
  Calendar,
  CheckCircle,
  Clock,
  ListTodo,
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  User,
  Calendar as CalendarIcon,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Task } from "@/components/calendar/types";
import { format, isAfter, isBefore, parseISO } from "date-fns";
import TaskDetailDialog from "@/components/calendar/components/TaskDetailDialog";
import TaskCard from "@/components/calendar/components/TaskCard";
import { toast } from "sonner";

// Sample data - in a real app this would come from an API
const sampleTasks: Task[] = [
  {
    id: "task-1",
    title: "Install new HVAC system",
    description: "Complete installation of new heating and cooling system",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    status: "in_progress",
    priority: "high",
    client: { name: "Acme Corporation" },
    assignedTo: "John Doe",
    progress: 65,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    attachments: [
      {
        id: "att-1",
        name: "HVAC_specs.pdf",
        type: "application/pdf",
        size: 1458000,
        uploadDate: new Date().toISOString(),
        url: "#"
      }
    ]
  },
  {
    id: "task-2",
    title: "Repair leaking roof",
    description: "Fix roof leaks in sections A and B of building",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    status: "pending",
    priority: "urgent",
    client: { name: "Johnson & Co" },
    assignedTo: "Sarah Smith",
    progress: 0,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "task-3",
    title: "Electrical wiring inspection",
    description: "Complete wiring inspection for permit approval",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    status: "completed",
    priority: "medium",
    client: { name: "BuildRight Properties" },
    assignedTo: "Mike Johnson",
    progress: 100,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    attachments: [
      {
        id: "att-2",
        name: "inspection_report.docx",
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        size: 245000,
        uploadDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        url: "#"
      },
      {
        id: "att-3",
        name: "wiring_photos.zip",
        type: "application/zip",
        size: 3890000,
        uploadDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
        url: "#"
      }
    ]
  },
  {
    id: "task-4",
    title: "Paint interior walls",
    description: "Paint all interior walls with approved color scheme",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    status: "scheduled",
    priority: "low",
    client: { name: "Sunshine Apartments" },
    assignedTo: "Lisa Chen",
    progress: 0,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
  },
  {
    id: "task-5",
    title: "Install plumbing fixtures",
    description: "Install all bathroom and kitchen fixtures",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 3)),
    status: "in_progress",
    priority: "medium",
    client: { name: "Riverside Development" },
    assignedTo: "Robert Williams",
    progress: 45,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
  },
];

type SortOption = "priority" | "dueDate" | "progress" | "createdAt";
type FilterStatus = "all" | "pending" | "in_progress" | "completed" | "overdue" | "scheduled";

const TasksAndProgress = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("dueDate");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // New task template
  const newTaskTemplate: Task = {
    id: "",
    title: "",
    description: "",
    dueDate: new Date(),
    status: "pending",
    priority: "medium",
    client: { name: "" },
    assignedTo: "",
    progress: 0,
    createdAt: new Date().toISOString(),
    attachments: []
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query)) ||
        (task.client?.name && task.client.name.toLowerCase().includes(query)) ||
        (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "overdue") {
        result = result.filter(task => 
          task.status !== "completed" && 
          isBefore(new Date(task.dueDate), new Date())
        );
      } else {
        result = result.filter(task => task.status === statusFilter);
      }
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "priority": {
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
          const aVal = a.priority ? priorityOrder[a.priority as keyof typeof priorityOrder] : 4;
          const bVal = b.priority ? priorityOrder[b.priority as keyof typeof priorityOrder] : 4;
          return aVal - bVal;
        }
        case "dueDate":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case "progress":
          return (b.progress || 0) - (a.progress || 0);
        case "createdAt":
          return new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime();
        default:
          return 0;
      }
    });
    
    setFilteredTasks(result);
  }, [tasks, searchQuery, sortBy, statusFilter]);

  const handleCreateTask = () => {
    setSelectedTask({
      ...newTaskTemplate,
      id: `task-${Date.now()}`
    });
    setIsCreateDialogOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
  };

  const handleCreateNewTask = (taskId: string, taskData: Partial<Task>) => {
    if (taskData.title) {
      const newTask: Task = {
        ...newTaskTemplate,
        ...taskData,
        id: taskId,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, newTask]);
      toast.success("Task created successfully");
    }
  };

  // Task metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const inProgressTasks = tasks.filter(t => t.status === "in_progress").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const overdueTasks = tasks.filter(t => 
    t.status !== "completed" && isBefore(new Date(t.dueDate), new Date())
  ).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks & Progress</h1>
          <p className="text-muted-foreground">Manage and track task progress across all projects</p>
        </div>
        <Button onClick={handleCreateTask} className="flex items-center gap-2">
          <PlusCircle size={16} />
          Create New Task
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Tasks</span>
                <span className="text-2xl font-bold">{totalTasks}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-2xl font-bold">{completedTasks}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-2xl font-bold">{inProgressTasks}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-2xl font-bold">{pendingTasks}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Overdue</span>
                <span className="text-2xl font-bold">{overdueTasks}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Overall Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">
              {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
            </div>
            <div className="flex-1">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full bg-blue-500" 
                  style={{ 
                    width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%" 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          {/* Status Distribution */}
          <div className="flex gap-0.5 h-2">
            <div 
              className="bg-green-500 rounded-l-full" 
              style={{ 
                width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : "0%" 
              }}
            ></div>
            <div 
              className="bg-yellow-500" 
              style={{ 
                width: totalTasks > 0 ? `${(inProgressTasks / totalTasks) * 100}%` : "0%" 
              }}
            ></div>
            <div 
              className="bg-gray-400" 
              style={{ 
                width: totalTasks > 0 ? `${(pendingTasks / totalTasks) * 100}%` : "0%" 
              }}
            ></div>
            <div 
              className="bg-red-500 rounded-r-full" 
              style={{ 
                width: totalTasks > 0 ? `${(overdueTasks / totalTasks) * 100}%` : "0%" 
              }}
            ></div>
          </div>
          
          <div className="flex justify-around text-xs text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span>Overdue</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as FilterStatus)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dueDate">Due Date</SelectItem>
            <SelectItem value="priority">Priority</SelectItem>
            <SelectItem value="progress">Progress</SelectItem>
            <SelectItem value="createdAt">Recently Added</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Tasks List */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <div key={task.id} 
              onClick={() => handleTaskClick(task)} 
              className="cursor-pointer transform transition-transform hover:scale-[1.01]"
            >
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md bg-gray-50">
          <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No tasks found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery ? "Try adjusting your search or filters" : "Create your first task to get started"}
          </p>
          <Button onClick={handleCreateTask}>Create New Task</Button>
        </div>
      )}

      {/* Task Detail Dialog */}
      {selectedTask && (
        <>
          <TaskDetailDialog
            task={selectedTask}
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onTaskUpdate={handleTaskUpdate}
          />
          
          <TaskDetailDialog
            task={selectedTask}
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            onTaskUpdate={handleCreateNewTask}
          />
        </>
      )}
    </div>
  );
};

export default TasksAndProgress;
