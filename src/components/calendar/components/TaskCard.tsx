
import { Task } from "@/components/calendar/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { CalendarClock, Clock, User, ArrowRightCircle, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const TaskCard = ({ task, onTaskUpdate, onCreateFollowUp }: TaskCardProps) => {
  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    const newStatus = task.status === "completed" ? "scheduled" : "completed";
    onTaskUpdate(task.id, { status: newStatus });
    
    toast.success(
      newStatus === "completed" 
        ? "Task marked as completed!" 
        : "Task reopened."
    );
  };

  const handleCreateFollowUp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    if (onCreateFollowUp) {
      onCreateFollowUp(task);
      toast.success("Follow-up task created");
    }
  };
  
  // Status color styling
  const getStatusColor = () => {
    switch (task.status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in progress": return "bg-blue-100 text-blue-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Priority color styling
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className={cn(
      "border rounded-lg p-3 relative",
      task.status === "completed" ? "opacity-80" : ""
    )}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "completed"}
          onCheckedChange={() => {}}
          onClick={handleToggleComplete}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className={cn(
                "font-medium line-clamp-2",
                task.status === "completed" ? "line-through text-muted-foreground" : ""
              )}>
                {task.title}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {task.client && task.client.name && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <User className="h-3 w-3 mr-1" />
                    {task.client.name}
                  </div>
                )}
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(task.dueDate), "h:mm a")}
                </div>
                
                {task.type === "follow-up" && (
                  <Badge variant="outline" className="bg-indigo-100 text-indigo-800 text-xs">
                    Follow-up
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className={getStatusColor()}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </Badge>
              
              {task.priority && (
                <Badge variant="outline" className={getPriorityColor()}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-xs text-muted-foreground mt-2 line-clamp-2",
              task.status === "completed" ? "text-muted-foreground/70" : ""
            )}>
              {task.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center">
              {task.hasFollowUp ? (
                <div className="text-xs text-muted-foreground flex items-center">
                  <CalendarClock className="h-3 w-3 mr-1 text-indigo-500" />
                  <span>
                    Follow-up: {format(new Date(task.followUpDate!), "MMM d")}
                  </span>
                </div>
              ) : (
                task.status !== "completed" && onCreateFollowUp && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-xs px-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                    onClick={handleCreateFollowUp}
                  >
                    <ArrowRightCircle className="h-3 w-3 mr-1" />
                    Add follow-up
                  </Button>
                )
              )}
            </div>
            
            {task.technician && (
              <div className="flex items-center text-xs text-muted-foreground">
                <User className="h-3 w-3 mr-1" />
                {task.technician}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
