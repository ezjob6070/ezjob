
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, CheckIcon, Clock3Icon, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type TaskPriority = "low" | "medium" | "high";
type TaskStatus = "todo" | "in-progress" | "completed";

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: TaskPriority;
  status: TaskStatus;
  assignee: {
    name: string;
    avatar?: string;
    initials: string;
  };
  client?: {
    name: string;
    id: string;
  };
};

type TasksListProps = {
  tasks: Task[];
  onStatusChange?: (taskId: string, completed: boolean) => void;
};

const priorityColors = {
  low: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  high: "bg-red-100 text-red-800 hover:bg-red-200",
};

const statusIcons = {
  "todo": null,
  "in-progress": <Clock3Icon className="h-3 w-3" />,
  "completed": <CheckIcon className="h-3 w-3" />,
};

const statusColors = {
  "todo": "bg-gray-100 text-gray-800 hover:bg-gray-200",
  "in-progress": "bg-purple-100 text-purple-800 hover:bg-purple-200",
  "completed": "bg-green-100 text-green-800 hover:bg-green-200",
};

const TasksList = ({ tasks, onStatusChange }: TasksListProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    tasks.reduce((acc, task) => {
      acc[task.id] = task.status === "completed";
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleStatusChange = (e: React.MouseEvent, taskId: string, completed: boolean) => {
    e.stopPropagation(); // Prevent triggering the task click when clicking checkbox
    setCompletedTasks((prev) => ({ ...prev, [taskId]: completed }));
    if (onStatusChange) {
      onStatusChange(taskId, completed);
    }
  };

  const handleTaskClick = (taskId: string) => {
    // Navigate to a task detail page
    navigate(`/tasks/${taskId}`);
  };

  const isOverdue = (date: Date) => {
    return new Date() > date && !completedTasks[date.toString()];
  };

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => 
    searchQuery === "" || 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.client?.name && task.client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Task count summary */}
      <div className="text-sm text-muted-foreground mb-2">
        Showing {filteredTasks.length} of {tasks.length} tasks
        {searchQuery && " (filtered)"}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {searchQuery ? "No tasks match your search criteria" : "No tasks available"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-lg p-4 transition-all duration-200 hover:bg-accent/50 cursor-pointer border-l-4 ${
                completedTasks[task.id] 
                  ? "border-l-green-500 bg-muted/30" 
                  : task.priority === "high"
                    ? "border-l-red-500"
                    : task.priority === "medium"
                      ? "border-l-orange-500"
                      : "border-l-blue-500"
              }`}
              onClick={() => handleTaskClick(task.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={completedTasks[task.id]}
                  onCheckedChange={(checked) => {
                    // Create a synthetic MouseEvent to pass to handleStatusChange
                    const syntheticEvent = {
                      stopPropagation: () => {},
                    } as React.MouseEvent;
                    
                    handleStatusChange(syntheticEvent, task.id, checked as boolean);
                  }}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h3
                        className={`font-medium ${
                          completedTasks[task.id] ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={statusColors[task.status]}
                      >
                        <div className="flex items-center gap-1">
                          {statusIcons[task.status]}
                          <span>
                            {task.status.split("-").map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(" ")}
                          </span>
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <p
                    className={`text-sm ${
                      completedTasks[task.id] ? "text-muted-foreground" : ""
                    }`}
                  >
                    {task.description}
                  </p>
                  {task.client && (
                    <div className="mt-2">
                      <span className="text-xs text-muted-foreground">
                        Related to client:{" "}
                        <a 
                          href={`/clients/${task.client.id}`} 
                          className="text-primary hover:underline"
                          onClick={(e) => e.stopPropagation()} // Prevent triggering the task click
                        >
                          {task.client.name}
                        </a>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span
                        className={`text-xs ${
                          isOverdue(task.dueDate)
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      >
                        {format(task.dueDate, "MMM d, yyyy")}
                        {isOverdue(task.dueDate) && " (Overdue)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">Assigned to:</span>
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={task.assignee.avatar} />
                        <AvatarFallback className="text-[10px]">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;
