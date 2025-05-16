
import React from "react";
import { ProjectTask } from "@/types/project";
import { format } from "date-fns";
import { Bell, Calendar, Clock, Check, User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TasksListProps {
  tasks: ProjectTask[];
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onTaskCreate: (task: ProjectTask) => void;
  onTaskDelete: (taskId: string) => void;
  projectStaff: any[];
  selectedTaskId?: string | null;
  onTaskSelect?: (taskId: string | null) => void;
  filterQuery?: string;
}

const TasksList = ({
  tasks,
  onTaskUpdate,
  onTaskDelete,
  projectStaff,
  selectedTaskId,
  onTaskSelect,
  filterQuery = ""
}: TasksListProps) => {
  const handleToggleComplete = (taskId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const newStatus = task.status === "completed" ? "pending" : "completed";
    onTaskUpdate(taskId, { status: newStatus });
    
    toast.success(
      newStatus === "completed" 
        ? "Task marked as completed!" 
        : "Task reopened."
    );
  };
  
  const handleTaskClick = (taskId: string) => {
    if (onTaskSelect) {
      onTaskSelect(selectedTaskId === taskId ? null : taskId);
    }
  };
  
  // Filter tasks based on search query
  const filteredTasks = tasks.filter(task => {
    if (!filterQuery) return true;
    
    return (
      task.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(filterQuery.toLowerCase())) ||
      (task.client && task.client.toLowerCase().includes(filterQuery.toLowerCase()))
    );
  });

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
          {filterQuery ? (
            <AlertCircle className="h-6 w-6 text-gray-400" />
          ) : (
            <Calendar className="h-6 w-6 text-gray-400" />
          )}
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          {filterQuery ? "No matching tasks found" : "No tasks yet"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {filterQuery ? `No tasks matching "${filterQuery}"` : "Get started by creating a new task"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task) => {
        // Find assigned staff member
        const assignedStaff = projectStaff.find(staff => staff.id === task.assignedTo);
        
        // Determine background color based on task type and selection
        let bgColor = "bg-gray-50"; // Default light gray
        
        if (selectedTaskId === task.id) {
          bgColor = "bg-amber-50"; // Light yellow when selected
        } else if (task.isReminder) {
          bgColor = "bg-red-50"; // Light red for reminders
        }
        
        return (
          <div 
            key={task.id}
            className={`${bgColor} border rounded-lg p-4 transition-all duration-200 hover:shadow-sm cursor-pointer ${
              task.status === "completed" ? "opacity-70" : ""
            }`}
            onClick={() => handleTaskClick(task.id)}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={() => handleToggleComplete(task.id)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {task.isReminder ? (
                        <Bell className="h-4 w-4 text-red-500" />
                      ) : (
                        <Calendar className="h-4 w-4 text-blue-500" />
                      )}
                      
                      <h3 className={cn(
                        "font-medium",
                        task.status === "completed" ? "line-through text-muted-foreground" : ""
                      )}>
                        {task.title}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      {task.dueDate && (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "MMM d, h:mm a")}
                        </div>
                      )}
                      
                      {task.status === "in_progress" && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                          In Progress
                        </Badge>
                      )}
                      
                      {task.status === "blocked" && (
                        <Badge variant="outline" className="bg-red-100 text-red-800 text-xs">
                          Blocked
                        </Badge>
                      )}
                      
                      {assignedStaff && (
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {assignedStaff.name}
                        </div>
                      )}
                      
                      {task.isReminder && task.reminderSent === false && (
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          Pending
                        </Badge>
                      )}
                      
                      {task.isReminder && task.reminderSent === true && (
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          Sent
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Badge variant="outline" className={cn(
                      task.priority === "low" ? "bg-blue-100 text-blue-800" :
                      task.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                      task.priority === "high" ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    )}>
                      {task.priority}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-end mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 hover:bg-red-50 hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this task?")) {
                        onTaskDelete(task.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TasksList;
