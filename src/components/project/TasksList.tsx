
import React, { useState } from "react";
import { format } from "date-fns";
import { ProjectTask } from "@/types/project";
import { 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  AlertCircleIcon, 
  BellIcon, 
  UserIcon, 
  MapPinIcon,
  ArrowUpCircleIcon,
  ArrowDownCircleIcon,
  BarChart2Icon,
  SearchIcon,
  FilterIcon,
  PlusIcon,
  XIcon,
  EditIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskDetailDialog } from "./TaskDetailDialog";
import { toast } from "sonner";

interface TasksListProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskCreate: (task: ProjectTask) => void;
  onTaskDelete: (taskId: string) => void;
  projectStaff: any[];
}

const priorityIcons = {
  low: <ArrowDownCircleIcon className="h-4 w-4 text-blue-500" />,
  medium: <BarChart2Icon className="h-4 w-4 text-yellow-500" />,
  high: <ArrowUpCircleIcon className="h-4 w-4 text-orange-500" />,
  urgent: <AlertCircleIcon className="h-4 w-4 text-red-500" />,
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
  high: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  urgent: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusColors = {
  pending: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  in_progress: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  completed: "bg-green-100 text-green-800 hover:bg-green-200",
  blocked: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusLabels = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
};

const TasksList = ({ tasks, onTaskUpdate, onTaskCreate, onTaskDelete, projectStaff }: TasksListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [reminderFilter, setReminderFilter] = useState<boolean | "all">("all");
  const [taskToEdit, setTaskToEdit] = useState<ProjectTask | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [sortBy, setSortBy] = useState<string>("dueDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter and sort tasks based on current filters
  const filteredTasks = tasks
    .filter((task) => {
      // Search term filter
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.client?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !task.location?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && task.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== "all" && task.priority !== priorityFilter) {
        return false;
      }

      // Reminder filter
      if (reminderFilter !== "all" && task.isReminder !== reminderFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate": {
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        }
        case "priority": {
          const priorityValues = { 
            low: 0, 
            medium: 1, 
            high: 2, 
            urgent: 3 
          };
          const priorityA = priorityValues[a.priority as keyof typeof priorityValues];
          const priorityB = priorityValues[b.priority as keyof typeof priorityValues];
          return sortDirection === "asc" ? priorityA - priorityB : priorityB - priorityA;
        }
        case "title": {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();
          return sortDirection === "asc" 
            ? titleA.localeCompare(titleB)
            : titleB.localeCompare(titleA);
        }
        case "status": {
          const statusValues = { 
            pending: 0, 
            in_progress: 1, 
            completed: 2, 
            blocked: 3 
          };
          const statusA = statusValues[a.status as keyof typeof statusValues];
          const statusB = statusValues[b.status as keyof typeof statusValues];
          return sortDirection === "asc" ? statusA - statusB : statusB - statusA;
        }
        default:
          return 0;
      }
    });

  const handleEditTask = (task: ProjectTask) => {
    setTaskToEdit(task);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<ProjectTask>) => {
    onTaskUpdate(taskId, updates);
    setTaskToEdit(null);
    
    // If marking a task as completed
    if (updates.status === "completed") {
      toast.success("Task marked as completed!");
    }
  };

  const handleCreateTask = (task: ProjectTask) => {
    onTaskCreate(task);
    setIsCreatingTask(false);
    toast.success("Task created successfully!");
  };

  const handleDeleteTask = (taskId: string) => {
    onTaskDelete(taskId);
    toast.success("Task deleted successfully!");
  };

  const handleToggleCompletion = (taskId: string, completed: boolean) => {
    onTaskUpdate(taskId, { status: completed ? "completed" : "pending" });
    toast.success(completed ? "Task marked as completed!" : "Task reopened!");
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setReminderFilter("all");
    setSortBy("dueDate");
    setSortDirection("asc");
    toast.success("Filters reset!");
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const isFilterActive = 
    searchTerm !== "" || 
    statusFilter !== "all" || 
    priorityFilter !== "all" || 
    reminderFilter !== "all";

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsCreatingTask(true)} 
              size="sm" 
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              New Task
            </Button>
            
            {isFilterActive && (
              <Button 
                onClick={resetFilters} 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
              >
                <XIcon className="h-3 w-3" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Filter options */}
        <div className="mt-3 flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[120px]">
              <div className="flex items-center gap-1">
                <FilterIcon className="h-3 w-3" />
                <span>Status</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-8 w-[120px]">
              <div className="flex items-center gap-1">
                <FilterIcon className="h-3 w-3" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={reminderFilter === true ? "reminder" : reminderFilter === false ? "task" : "all"} 
            onValueChange={(val) => setReminderFilter(val === "reminder" ? true : val === "task" ? false : "all")}
          >
            <SelectTrigger className="h-8 w-[120px]">
              <div className="flex items-center gap-1">
                <FilterIcon className="h-3 w-3" />
                <span>Type</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
              <SelectItem value="reminder">Reminders</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(val) => {
            setSortBy(val);
            setSortDirection("asc");
          }}>
            <SelectTrigger className="h-8 w-[120px]">
              <div className="flex items-center gap-1">
                {sortDirection === "asc" ? (
                  <ArrowUpCircleIcon className="h-3 w-3" />
                ) : (
                  <ArrowDownCircleIcon className="h-3 w-3" />
                )}
                <span>Sort By</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dueDate" onClick={() => toggleSort("dueDate")}>Due Date</SelectItem>
              <SelectItem value="priority" onClick={() => toggleSort("priority")}>Priority</SelectItem>
              <SelectItem value="title" onClick={() => toggleSort("title")}>Title</SelectItem>
              <SelectItem value="status" onClick={() => toggleSort("status")}>Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FilterIcon className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isFilterActive ? 
                "Try adjusting your filters to see more results." : 
                "Get started by creating a new task."}
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => setIsCreatingTask(true)} 
                size="sm" 
                className="flex items-center gap-1 mx-auto"
              >
                <PlusIcon className="h-4 w-4" />
                New Task
              </Button>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
                task.status === "completed" ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={(checked) => handleToggleCompletion(task.id, Boolean(checked))}
                  className={task.status === "completed" ? "text-green-600" : ""}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-medium ${
                          task.status === "completed" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.isReminder && (
                          <BellIcon className="h-4 w-4 inline-block mr-1 text-purple-500" />
                        )} 
                        {task.title}
                      </h3>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        <div className="flex items-center gap-1">
                          {priorityIcons[task.priority]}
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </Badge>
                      <Badge variant="outline" className={statusColors[task.status]}>
                        {statusLabels[task.status]}
                      </Badge>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full" 
                      onClick={() => handleEditTask(task)}
                    >
                      <EditIcon className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm ${task.status === "completed" ? "text-muted-foreground" : ""}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="mt-3">
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
                    {task.dueDate && (
                      <div className="flex items-center">
                        <CalendarIcon className="mr-1 h-3.5 w-3.5" />
                        <span>Due {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    
                    {task.assignedTo && (
                      <div className="flex items-center">
                        <UserIcon className="mr-1 h-3.5 w-3.5" />
                        <span>
                          {projectStaff.find(staff => staff.id === task.assignedTo)?.name || task.assignedTo}
                        </span>
                      </div>
                    )}
                    
                    {task.client && (
                      <div className="flex items-center">
                        <ClockIcon className="mr-1 h-3.5 w-3.5" />
                        <span>For: {task.client}</span>
                      </div>
                    )}
                    
                    {task.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="mr-1 h-3.5 w-3.5" />
                        <span>{task.location}</span>
                      </div>
                    )}
                    
                    {task.isReminder && task.reminderTime && (
                      <div className="flex items-center">
                        <BellIcon className="mr-1 h-3.5 w-3.5 text-purple-500" />
                        <span>Reminder at {format(new Date(task.reminderTime), "h:mm a")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Edit task dialog */}
      {taskToEdit && (
        <TaskDetailDialog
          task={taskToEdit}
          open={Boolean(taskToEdit)}
          onOpenChange={() => setTaskToEdit(null)}
          onUpdate={(updates) => handleUpdateTask(taskToEdit.id, updates)}
          onDelete={() => handleDeleteTask(taskToEdit.id)}
          projectStaff={projectStaff}
        />
      )}
      
      {/* Create task dialog */}
      {isCreatingTask && (
        <TaskDetailDialog
          task={{
            id: `task-${Date.now()}`, // Temporary ID
            title: "",
            status: "pending",
            priority: "medium",
            progress: 0,
            createdAt: new Date().toISOString(),
          } as ProjectTask}
          open={isCreatingTask}
          onOpenChange={() => setIsCreatingTask(false)}
          onUpdate={handleCreateTask}
          projectStaff={projectStaff}
          isCreating
        />
      )}
    </div>
  );
};

export default TasksList;
