
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  Check, 
  Clock, 
  FileText, 
  AlertTriangle,
  Calendar as CalendarIcon,
  ListTodo,
  User,
  Edit,
  Trash2,
  X
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { ProjectTask, ProjectStaff } from "@/types/project";
import { cn } from "@/lib/utils";

export interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ProjectTask;
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onUpdateStatus: (taskId: string, status: ProjectTask["status"]) => void;
  onDelete: (taskId: string) => void;
  onAddToCalendar: (task: ProjectTask) => void;
  projectStaff: ProjectStaff[];
}

export default function TaskDetailDialog({
  open,
  onOpenChange,
  task,
  onTaskUpdate,
  onUpdateStatus,
  onDelete,
  onAddToCalendar,
  projectStaff
}: TaskDetailDialogProps) {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<ProjectTask>(task);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    setEditedTask(task);
    setEditMode(false);
  }, [task]);

  const handleStatusChange = (newStatus: ProjectTask["status"]) => {
    setLoading(true);
    setTimeout(() => {
      onUpdateStatus(task.id, newStatus);
      setLoading(false);
    }, 500);
  };
  
  const handlePriorityChange = (newPriority: ProjectTask["priority"]) => {
    onTaskUpdate(task.id, { priority: newPriority });
    toast.success(`Task priority updated to ${newPriority}`);
  };

  const handleAssigneeChange = (staffId: string) => {
    onTaskUpdate(task.id, { assignedTo: staffId });
    toast.success("Task assignee updated");
  };

  const handleProgressChange = (progress: number) => {
    onTaskUpdate(task.id, { progress });
    toast.success(`Progress updated to ${progress}%`);
  };

  const handleSaveChanges = () => {
    onTaskUpdate(task.id, editedTask);
    setEditMode(false);
    toast.success("Task updated successfully");
  };

  const handleDeleteTask = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onOpenChange(false);
      toast.success("Task deleted successfully");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {task && (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{editMode ? "Edit Task" : "Task Details"}</span>
              <div className="flex items-center gap-2">
                {!editMode && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => setEditMode(true)}
                  >
                    <Edit size={16} />
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {editMode ? (
            <div className="space-y-4 py-2">
              <div className="grid gap-2">
                <label htmlFor="task-title" className="text-sm font-medium">
                  Task Title
                </label>
                <input
                  type="text"
                  id="task-title"
                  className="w-full border rounded-md p-2"
                  value={editedTask.title}
                  onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="task-description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="task-description"
                  value={editedTask.description || ""}
                  onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="task-priority" className="text-sm font-medium">
                    Priority
                  </label>
                  <Select 
                    value={editedTask.priority} 
                    onValueChange={(value) => setEditedTask({ 
                      ...editedTask, 
                      priority: value as ProjectTask["priority"] 
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="task-status" className="text-sm font-medium">
                    Status
                  </label>
                  <Select 
                    value={editedTask.status} 
                    onValueChange={(value) => setEditedTask({
                      ...editedTask,
                      status: value as ProjectTask["status"]
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="task-assigned" className="text-sm font-medium">
                    Assign To
                  </label>
                  <Select 
                    value={editedTask.assignedTo || ""} 
                    onValueChange={(value) => setEditedTask({
                      ...editedTask,
                      assignedTo: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {projectStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>{staff.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="task-progress" className="text-sm font-medium">
                    Progress
                  </label>
                  <Select 
                    value={String(editedTask.progress)} 
                    onValueChange={(value) => setEditedTask({
                      ...editedTask,
                      progress: Number(value)
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Not Started (0%)</SelectItem>
                      <SelectItem value="25">Initial Work (25%)</SelectItem>
                      <SelectItem value="50">Half Complete (50%)</SelectItem>
                      <SelectItem value="75">Almost Complete (75%)</SelectItem>
                      <SelectItem value="100">Complete (100%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="task-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  type="date"
                  id="task-due-date"
                  className="w-full border rounded-md p-2"
                  value={editedTask.dueDate}
                  onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div>
                <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn(
                    task.status === "completed" ? "bg-green-100 text-green-800" : 
                    task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                    task.status === "blocked" ? "bg-red-100 text-red-800" : 
                    "bg-amber-100 text-amber-800"
                  )}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                  
                  <Badge variant="outline" className="capitalize">
                    {task.priority} priority
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(task.dueDate), "PPP")}
                  </p>
                </div>
              </div>
              
              {task.description && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
              )}
              
              {task.assignedTo && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Assigned To</p>
                    <p className="text-sm text-muted-foreground">
                      {projectStaff.find(staff => staff.id === task.assignedTo)?.name || "Unassigned"}
                    </p>
                  </div>
                </div>
              )}
              
              {task.createdAt && (
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(task.createdAt), "PPP")}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{task.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={cn(
                      "h-2 rounded-full",
                      task.progress >= 100 ? "bg-green-500" :
                      task.progress >= 70 ? "bg-blue-500" :
                      task.progress >= 30 ? "bg-yellow-500" :
                      "bg-red-500"
                    )}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Task inspections if any */}
              {task.inspections && task.inspections.length > 0 && (
                <div className="border-t pt-3">
                  <h3 className="text-sm font-medium mb-2">Inspections</h3>
                  <div className="space-y-2">
                    {task.inspections.map(inspection => (
                      <div key={inspection.id} className="bg-gray-50 p-2 rounded-md text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{inspection.title}</span>
                          <Badge className={
                            inspection.status === "passed" ? "bg-green-100 text-green-800" :
                            inspection.status === "failed" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
                          }>
                            {inspection.status}
                          </Badge>
                        </div>
                        {inspection.notes && (
                          <p className="text-xs text-gray-600 mt-1">{inspection.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div className="border-t pt-3">
                <h3 className="text-sm font-medium mb-2">Update Progress</h3>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => handleProgressChange(25)} disabled={task.status === "completed"}>
                    25%
                  </Button>
                  <Button size="sm" onClick={() => handleProgressChange(50)} disabled={task.status === "completed"}>
                    50%
                  </Button>
                  <Button size="sm" onClick={() => handleProgressChange(75)} disabled={task.status === "completed"}>
                    75%
                  </Button>
                  <Button size="sm" onClick={() => handleProgressChange(100)} disabled={task.status === "completed"}>
                    100%
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-3">
                <h3 className="text-sm font-medium mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  {task.status !== "pending" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusChange("pending")}
                      className="text-amber-600 border-amber-200 hover:bg-amber-50"
                      disabled={loading}
                    >
                      <Clock size={14} className="mr-1" /> Pending
                    </Button>
                  )}
                  
                  {task.status !== "in_progress" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusChange("in_progress")}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      disabled={loading}
                    >
                      <ListTodo size={14} className="mr-1" /> In Progress
                    </Button>
                  )}
                  
                  {task.status !== "completed" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusChange("completed")}
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      disabled={loading}
                    >
                      <Check size={14} className="mr-1" /> Completed
                    </Button>
                  )}
                  
                  {task.status !== "blocked" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleStatusChange("blocked")}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      disabled={loading}
                    >
                      <AlertTriangle size={14} className="mr-1" /> Blocked
                    </Button>
                  )}
                </div>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleDeleteTask}
                >
                  <Trash2 size={14} className="mr-1" /> Delete Task
                </Button>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAddToCalendar(task)}
                  >
                    <CalendarIcon size={14} className="mr-1" /> Add to Calendar
                  </Button>
                  
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      )}
    </Dialog>
  );
}
