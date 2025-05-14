
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckIcon, Clock3Icon, Bell } from "lucide-react";

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
  onAddReminder?: (taskId: string) => void;
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

const TasksList = ({ tasks, onStatusChange, onAddReminder }: TasksListProps) => {
  const navigate = useNavigate();
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

  const handleAddReminder = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation(); // Prevent triggering the task click when clicking the reminder button
    if (onAddReminder) {
      onAddReminder(taskId);
    }
  };

  const handleTaskClick = (taskId: string) => {
    // Navigate to a task detail page (we'll create this route next)
    navigate(`/tasks/${taskId}`);
  };

  const isOverdue = (date: Date) => {
    return new Date() > date && !completedTasks[date.toString()];
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
            completedTasks[task.id] ? "bg-muted/50" : ""
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 border-purple-200 hover:bg-purple-50 text-purple-700"
                  onClick={(e) => handleAddReminder(e, task.id)}
                >
                  <Bell className="h-4 w-4 mr-1" />
                  Reminder
                </Button>
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
  );
};

export default TasksList;
