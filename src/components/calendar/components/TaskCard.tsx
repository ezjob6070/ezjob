
import { useState } from "react";
import { Task } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  CalendarDays, 
  Check, 
  Clock, 
  MoreHorizontal, 
  MoveVertical, 
  ArrowUp, 
  ArrowDown 
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface TaskCardProps {
  task: Task;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const TaskCard = ({ task, onTaskUpdate, onCreateFollowUp }: TaskCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-600 hover:bg-red-700";
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      case "in progress":
        return "bg-blue-500 hover:bg-blue-600";
      case "scheduled":
        return "bg-purple-500 hover:bg-purple-600";
      case "overdue":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (onTaskUpdate) {
        onTaskUpdate(task.id, { status: newStatus });
        toast.success(`Task status updated to ${newStatus}`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handlePriorityChange = (newPriority: "high" | "medium" | "low" | "urgent") => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (onTaskUpdate) {
        onTaskUpdate(task.id, { priority: newPriority });
        toast.success(`Task priority updated to ${newPriority}`);
      }
      setIsLoading(false);
    }, 500);
  };

  const handleCreateFollowUp = () => {
    if (onCreateFollowUp) {
      onCreateFollowUp(task);
      toast.success("Follow-up task created");
    }
  };

  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, "MMM d, h:mm a");
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{task.title}</CardTitle>
          <div className="flex gap-1">
            <Badge className={getPriorityBadgeColor(task.priority)}>
              {task.priority}
            </Badge>
            {task.hasFollowUp && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                Follow-up
              </Badge>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={isLoading}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem 
                  disabled={task.status === "completed"}
                  onClick={() => handleStatusChange("completed")}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark as Completed
                </DropdownMenuItem>
                <DropdownMenuItem 
                  disabled={task.status === "in progress"}
                  onClick={() => handleStatusChange("in progress")}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Mark as In Progress
                </DropdownMenuItem>
                <DropdownMenuItem 
                  disabled={task.status === "scheduled"}
                  onClick={() => handleStatusChange("scheduled")}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Mark as Scheduled
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleCreateFollowUp}>
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Create Follow-Up Task
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={() => handlePriorityChange("urgent")}>
                  <ArrowUp className="mr-2 h-4 w-4 text-red-600" />
                  Set as Urgent
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityChange("high")}>
                  <ArrowUp className="mr-2 h-4 w-4 text-red-500" />
                  Set as High Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityChange("medium")}>
                  <MoveVertical className="mr-2 h-4 w-4 text-yellow-500" />
                  Set as Medium Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePriorityChange("low")}>
                  <ArrowDown className="mr-2 h-4 w-4 text-green-500" />
                  Set as Low Priority
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{task.client?.name || 'Not assigned'}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Status:</span>
            <Badge className={`${getStatusBadgeColor(task.status)} text-xs`}>
              {task.status.replace('-', ' ')}
            </Badge>
          </div>
          {task.technician && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Technician:</span>
              <span className="font-medium">{task.technician}</span>
            </div>
          )}
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Due:</span>
            <span className="font-medium">
              {typeof task.dueDate === 'string' 
                ? format(new Date(task.dueDate), "MMM d, h:mm a") 
                : format(task.dueDate, "MMM d, h:mm a")}
            </span>
          </div>
          {task.hasFollowUp && task.followUpDate && (
            <div className="flex justify-between mt-1">
              <span className="text-muted-foreground">Follow-up:</span>
              <span className="font-medium">
                {typeof task.followUpDate === 'string'
                  ? format(new Date(task.followUpDate), "MMM d, h:mm a")
                  : format(task.followUpDate, "MMM d, h:mm a")}
              </span>
            </div>
          )}
        </div>
        
        {task.description && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-600">{task.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
