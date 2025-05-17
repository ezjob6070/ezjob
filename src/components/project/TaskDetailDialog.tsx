
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProjectTask, ProjectStaff } from "@/types/project";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  FileText, 
  AlertTriangle, 
  Trash, 
  Calendar,
  BellRing,
  Bell
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

export interface TaskDetailDialogProps {
  task: ProjectTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onUpdateStatus: (taskId: string, status: "pending" | "in_progress" | "completed" | "blocked") => void;
  onDelete: (taskId: string) => void;
  onAddToCalendar: (task: ProjectTask) => void;
  projectStaff: ProjectStaff[];
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({
  task,
  open,
  onOpenChange,
  onTaskUpdate,
  onUpdateStatus,
  onDelete,
  onAddToCalendar,
  projectStaff
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<ProjectTask>({...task});

  const handleSaveChanges = () => {
    onTaskUpdate(task.id, editedTask);
    setEditMode(false);
    toast.success(task.isReminder ? "Reminder updated successfully" : "Task updated successfully");
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
  
  const handleToggleReminder = () => {
    // Convert between task and reminder
    const updates = {
      isReminder: !editedTask.isReminder,
      // If converting to a reminder, set default reminder time
      reminderTime: !editedTask.isReminder && editedTask.dueDate 
        ? `${editedTask.dueDate}T09:00:00` 
        : editedTask.reminderTime
    };
    
    setEditedTask({...editedTask, ...updates});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {task.isReminder ? (
              <>
                <BellRing className="h-5 w-5 text-purple-500" />
                <span>Reminder Details</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 text-blue-500" />
                <span>Task Details</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {editMode ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isReminder" className="font-medium text-base">Type</Label>
                <div className="flex items-center gap-2">
                  <Label htmlFor="isReminder" className={`text-sm ${editedTask.isReminder ? 'text-purple-500 font-medium' : 'text-blue-500 font-medium'}`}>
                    {editedTask.isReminder ? 'Reminder' : 'Task'}
                  </Label>
                  <Switch
                    id="isReminder"
                    checked={editedTask.isReminder}
                    onCheckedChange={handleToggleReminder}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input 
                  id="edit-title" 
                  value={editedTask.title} 
                  onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={editedTask.description || ""} 
                  onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-due-date">{editedTask.isReminder ? "Reminder Date" : "Due Date"}</Label>
                  <Input 
                    id="edit-due-date" 
                    type="date" 
                    value={editedTask.dueDate || ""}
                    onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                  />
                </div>
                
                {editedTask.isReminder ? (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-reminder-time">Reminder Time</Label>
                    <Input 
                      id="edit-reminder-time" 
                      type="time" 
                      value={editedTask.reminderTime?.split('T')[1]?.substring(0, 5) || ""}
                      onChange={(e) => {
                        if (editedTask.dueDate) {
                          setEditedTask({
                            ...editedTask, 
                            reminderTime: `${editedTask.dueDate}T${e.target.value}:00`
                          });
                        } else {
                          toast.error("Please select a date first");
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-assigned-to">Assigned To</Label>
                    <Input 
                      id="edit-assigned-to" 
                      value={editedTask.assignedTo || ""} 
                      onChange={(e) => setEditedTask({...editedTask, assignedTo: e.target.value})}
                    />
                  </div>
                )}
              </div>
              
              {!editedTask.isReminder && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Status</Label>
                      <Select 
                        value={editedTask.status} 
                        onValueChange={(value) => setEditedTask({...editedTask, status: value as any})}
                      >
                        <SelectTrigger id="edit-status">
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
                      <Label htmlFor="edit-priority">Priority</Label>
                      <Select 
                        value={editedTask.priority} 
                        onValueChange={(value) => setEditedTask({...editedTask, priority: value as any})}
                      >
                        <SelectTrigger id="edit-priority">
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
                    <Label htmlFor="edit-progress">Progress ({editedTask.progress}%)</Label>
                    <Input 
                      id="edit-progress" 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={editedTask.progress} 
                      onChange={(e) => setEditedTask({...editedTask, progress: parseInt(e.target.value)})}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{task.title}</h2>
                <div className="flex gap-2">
                  {task.isReminder ? (
                    <Badge className="bg-purple-100 text-purple-800">Reminder</Badge>
                  ) : (
                    <>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </>
                  )}
                </div>
              </div>
              
              {task.description && (
                <div className="text-gray-700 mt-2">
                  {task.description}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">{task.isReminder ? "Reminder Date" : "Due Date"}</p>
                  <p className="font-medium flex items-center gap-1 mt-1">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d, yyyy") : "Not set"}
                  </p>
                </div>
                
                {task.isReminder && task.reminderTime ? (
                  <div>
                    <p className="text-sm text-gray-500">Reminder Time</p>
                    <p className="font-medium flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      {format(new Date(task.reminderTime), "h:mm a")}
                    </p>
                  </div>
                ) : null}
                
                {!task.isReminder && (
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium flex items-center gap-1 mt-1">
                      {task.assignedTo || "Unassigned"}
                    </p>
                  </div>
                )}
              </div>
              
              {!task.isReminder && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            task.progress === 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="font-medium text-sm">{task.progress}%</span>
                  </div>
                </div>
              )}
              
              {task.createdAt && (
                <div className="text-xs text-gray-500 mt-4">
                  Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                  {task.completedAt && ` • Completed: ${format(new Date(task.completedAt), "MMM d, yyyy")}`}
                </div>
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          {editMode ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditedTask({...task});
                  setEditMode(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2 sm:order-2">
                <Button 
                  variant="destructive" 
                  className="flex items-center gap-1" 
                  onClick={() => {
                    onDelete(task.id);
                    onOpenChange(false);
                  }}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </Button>
                
                <Button 
                  variant="default" 
                  className="flex items-center gap-1" 
                  onClick={() => setEditMode(true)}
                >
                  <FileText className="h-4 w-4" />
                  Edit
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:order-1">
                {!task.isReminder ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-1"
                      onClick={() => {
                        onAddToCalendar(task);
                        toast.success("Task added to calendar");
                      }}
                    >
                      <Calendar className="h-4 w-4" />
                      Add to Calendar
                    </Button>
                    
                    {task.status !== "completed" && (
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                        onClick={() => {
                          onUpdateStatus(task.id, "completed");
                          onOpenChange(false);
                          toast.success("Task marked as completed");
                        }}
                      >
                        <Check className="h-4 w-4" />
                        Mark Complete
                      </Button>
                    )}
                  </>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => {
                      onUpdateStatus(task.id, "completed");
                      onOpenChange(false);
                      toast.success("Reminder marked as done");
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Mark as Done
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
