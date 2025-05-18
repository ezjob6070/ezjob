
import React, { useState } from "react";
import { Task } from "../types";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Clock, Calendar, AlertCircle, User, ChevronRight, 
  MoreVertical, CheckCircle, ArrowRightCircle, Clock3 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import TaskDetailDialog from "./TaskDetailDialog";

interface TaskCardProps {
  task: Task;
  onTaskUpdate?: (id: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const TaskCard = ({ task, onTaskUpdate, onCreateFollowUp }: TaskCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleStatusChange = (newStatus: string) => {
    if (onTaskUpdate) {
      const updates: Partial<Task> = { status: newStatus };
      
      // If marking as completed, set progress to 100%
      if (newStatus === "completed") {
        updates.progress = 100;
      }
      
      onTaskUpdate(task.id, updates);
    }
  };

  const statusColor = (status: string): string => {
    switch(status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in progress": 
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending": return "bg-gray-100 text-gray-800 border-gray-200";
      case "overdue": return "bg-red-100 text-red-800 border-red-200";
      case "scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      case "blocked": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const priorityColor = (priority?: string): string => {
    switch(priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  const formatDate = (date: Date | string) => {
    if (!date) return "No date";
    return typeof date === 'string' ? format(new Date(date), "MMM d, yyyy") : format(date, "MMM d, yyyy");
  };

  // Safe client name to prevent "Cannot read properties of undefined" error
  const clientName = task.client?.name || "Unassigned";

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-base font-medium">{task.title}</CardTitle>
            <div className="flex items-center gap-2">
              {task.priority && (
                <Badge className={priorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowDetails(true)}>
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                    Mark as Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("in_progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange("blocked")}>
                    Mark as Blocked
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {onCreateFollowUp && (
                    <DropdownMenuItem onClick={() => onCreateFollowUp(task)}>
                      Create Follow-Up Task
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-2">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500 gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                <span>{task.assignedTo || "Unassigned"}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            </div>

            {task.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            )}
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span>{task.progress || 0}%</span>
              </div>
              <Progress value={task.progress || 0} className="h-1.5" />
            </div>
            
            {(task.hasFollowUp && task.followUpDate) && (
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <ArrowRightCircle className="h-3.5 w-3.5" />
                <span>Follow-up scheduled for {formatDate(task.followUpDate)}</span>
              </div>
            )}
            
            {task.attachments && task.attachments.length > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>📎 {task.attachments.length} file{task.attachments.length > 1 ? 's' : ''} attached</span>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-2 flex justify-between items-center">
          <Badge className={statusColor(task.status)}>
            {task.status.charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
          </Badge>
          
          <div className="flex items-center text-xs text-gray-500">
            <span>Client: {clientName}</span>
          </div>
        </CardFooter>
      </Card>
      
      {showDetails && (
        <TaskDetailDialog 
          task={task} 
          open={showDetails} 
          onOpenChange={setShowDetails}
          onTaskUpdate={(id, updates) => {
            if (onTaskUpdate) {
              onTaskUpdate(id, updates);
            }
          }}
        />
      )}
    </>
  );
};

export default TaskCard;
