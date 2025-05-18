
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskAttachment } from "@/components/calendar/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  FileText, 
  Trash,
  Calendar,
  BellRing,
  Bell,
  ArrowDown,
  ArrowUp,
  Paperclip,
  MessageCircle,
  Timer,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const TaskDetailDialog = ({
  task,
  open,
  onOpenChange,
  onTaskUpdate,
  onDeleteTask,
  onCreateFollowUp
}: TaskDetailDialogProps) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTask, setEditedTask] = useState<Task>({...task});
  const [newComment, setNewComment] = useState("");
  const [timeTracking, setTimeTracking] = useState({
    isTracking: false,
    startTime: "",
    description: ""
  });

  const handleSaveChanges = () => {
    onTaskUpdate(task.id, editedTask);
    setEditMode(false);
    toast.success("Task updated successfully");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: uuidv4(),
      text: newComment,
      author: "Current User",
      date: new Date().toISOString()
    };
    
    const updatedComments = [...(editedTask.comments || []), comment];
    setEditedTask({...editedTask, comments: updatedComments});
    onTaskUpdate(task.id, { comments: updatedComments });
    setNewComment("");
    toast.success("Comment added");
  };

  const handleStartTimeTracking = () => {
    if (!timeTracking.description.trim()) {
      toast.error("Please add a description for this time entry");
      return;
    }
    
    const newTimeEntry = {
      id: uuidv4(),
      description: timeTracking.description,
      startTime: new Date().toISOString(),
      user: "Current User",
      date: new Date().toISOString(),
      billable: true
    };
    
    const updatedTimeEntries = [...(editedTask.timeEntries || []), newTimeEntry];
    setEditedTask({...editedTask, timeEntries: updatedTimeEntries});
    onTaskUpdate(task.id, { timeEntries: updatedTimeEntries });
    setTimeTracking({
      isTracking: true,
      startTime: new Date().toISOString(),
      description: timeTracking.description
    });
    toast.success("Time tracking started");
  };

  const handleStopTimeTracking = () => {
    if (!timeTracking.isTracking) return;
    
    const updatedTimeEntries = editedTask.timeEntries?.map(entry => {
      if (entry.id === editedTask.timeEntries?.[editedTask.timeEntries.length - 1].id) {
        const startTime = new Date(entry.startTime);
        const endTime = new Date();
        const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 1000 / 60);
        
        return {
          ...entry,
          endTime: endTime.toISOString(),
          duration: durationMinutes
        };
      }
      return entry;
    });
    
    setEditedTask({...editedTask, timeEntries: updatedTimeEntries});
    onTaskUpdate(task.id, { timeEntries: updatedTimeEntries });
    setTimeTracking({
      isTracking: false,
      startTime: "",
      description: ""
    });
    toast.success("Time tracking stopped");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800";
      case "in progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "low": return "bg-green-100 text-green-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-yellow-100 text-yellow-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const handleToggleReminder = () => {
    setEditedTask({
      ...editedTask,
      isReminder: !editedTask.isReminder,
      // If converting to a reminder, set default reminder time
      reminderTime: !editedTask.isReminder 
        ? `${typeof editedTask.dueDate === 'string' 
            ? editedTask.dueDate 
            : format(editedTask.dueDate, "yyyy-MM-dd")}T09:00:00` 
        : editedTask.reminderTime
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden">
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
        
        <ScrollArea className="flex-1 -mr-4 pr-4">
        {editMode ? (
          <div className="space-y-4 py-4">
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
              <Label htmlFor="edit-title" className="required-field">Title</Label>
              <Input 
                id="edit-title" 
                value={editedTask.title} 
                onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                required
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
                  value={typeof editedTask.dueDate === "string" 
                    ? editedTask.dueDate.split('T')[0] 
                    : format(editedTask.dueDate, "yyyy-MM-dd")} 
                  onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
                />
              </div>
              
              {editedTask.isReminder ? (
                <div className="grid gap-2">
                  <Label htmlFor="edit-reminder-time">Reminder Time</Label>
                  <Input 
                    id="edit-reminder-time" 
                    type="time" 
                    value={editedTask.reminderTime?.split('T')[1]?.substring(0, 5) || "09:00"}
                    onChange={(e) => {
                      const dateStr = typeof editedTask.dueDate === "string" 
                        ? editedTask.dueDate.split('T')[0] 
                        : format(editedTask.dueDate, "yyyy-MM-dd");
                      
                      setEditedTask({
                        ...editedTask, 
                        reminderTime: `${dateStr}T${e.target.value}:00`
                      });
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
                      onValueChange={(value) => setEditedTask({...editedTask, status: value})}
                    >
                      <SelectTrigger id="edit-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <Select 
                      value={editedTask.priority} 
                      onValueChange={(value) => setEditedTask({...editedTask, priority: value as "high" | "medium" | "low" | "urgent"})}
                    >
                      <SelectTrigger id="edit-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input 
                    id="edit-location" 
                    value={editedTask.location || ""} 
                    onChange={(e) => setEditedTask({...editedTask, location: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-technician">Technician</Label>
                  <Input 
                    id="edit-technician" 
                    value={editedTask.technician || ""} 
                    onChange={(e) => setEditedTask({...editedTask, technician: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="edit-client">Client</Label>
                  <Input 
                    id="edit-client" 
                    value={editedTask.client?.name || ""} 
                    onChange={(e) => setEditedTask({...editedTask, client: { name: e.target.value }})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-estimated-hours">Estimated Hours</Label>
                    <Input 
                      id="edit-estimated-hours" 
                      type="number" 
                      step="0.5"
                      min="0"
                      value={editedTask.estimatedHours || 0} 
                      onChange={(e) => setEditedTask({...editedTask, estimatedHours: parseFloat(e.target.value)})}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-actual-hours">Actual Hours</Label>
                    <Input 
                      id="edit-actual-hours" 
                      type="number" 
                      step="0.5"
                      min="0"
                      value={editedTask.actualHours || 0} 
                      onChange={(e) => setEditedTask({...editedTask, actualHours: parseFloat(e.target.value)})}
                    />
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
                    value={editedTask.progress || 0} 
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
          <div className="space-y-5 py-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <div className="flex gap-1">
                {task.isReminder ? (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-300">Reminder</Badge>
                ) : (
                  <>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority?.charAt(0).toUpperCase() + (task.priority?.slice(1) || '')}
                    </Badge>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status.replace('_', ' ')}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            
            {task.description && (
              <div className="bg-slate-50 p-3 rounded-md">
                <h3 className="text-sm text-slate-600 mb-1">Description</h3>
                <p className="text-sm">{task.description}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">{task.isReminder ? "Reminder Date" : "Due Date"}</p>
                <p className="font-medium flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-4 w-4 text-blue-500" />
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </p>
              </div>
              
              {task.isReminder && task.reminderTime ? (
                <div>
                  <p className="text-sm text-gray-500">Reminder Time</p>
                  <p className="font-medium flex items-center gap-1 mt-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    {format(new Date(task.reminderTime), "h:mm a")}
                  </p>
                </div>
              ) : null}
              
              {!task.isReminder && (
                <>
                  {task.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium mt-1">{task.assignedTo}</p>
                    </div>
                  )}
                  
                  {task.client?.name && (
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium mt-1">{task.client.name}</p>
                    </div>
                  )}
                  
                  {task.location && (
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium mt-1">{task.location}</p>
                    </div>
                  )}
                  
                  {task.technician && (
                    <div>
                      <p className="text-sm text-gray-500">Technician</p>
                      <p className="font-medium mt-1">{task.technician}</p>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {!task.isReminder && (
              <>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            task.progress === 100 ? "bg-green-500" : "bg-blue-500"
                          }`}
                          style={{ width: `${task.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="font-medium text-sm">{task.progress || 0}%</span>
                  </div>
                </div>
                
                {task.estimatedHours && (
                  <div className="mt-4 flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Hours</p>
                      <p className="font-medium">{task.estimatedHours}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Actual Hours</p>
                      <p className="font-medium">{task.actualHours || 0}</p>
                    </div>
                  </div>
                )}
                
                {/* Attachments Section */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Paperclip className="h-4 w-4" />
                    Attachments ({task.attachments?.length || 0})
                  </h3>
                  
                  {task.attachments && task.attachments.length > 0 ? (
                    <div className="space-y-2">
                      {task.attachments.map((attachment) => (
                        <div 
                          key={attachment.id} 
                          className="flex items-center justify-between p-2 border rounded-md hover:bg-slate-50"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate text-sm">{attachment.name}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {(attachment.size && (attachment.size / 1024).toFixed(0) + " KB") || ""}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => window.open(attachment.url, "_blank")}
                              className="h-8 w-8 p-0"
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No attachments</p>
                  )}
                </div>
                
                {/* Comments Section */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <MessageCircle className="h-4 w-4" />
                    Comments ({task.comments?.length || 0})
                  </h3>
                  
                  {task.comments && task.comments.length > 0 ? (
                    <div className="space-y-3">
                      {task.comments.map((comment) => (
                        <div key={comment.id} className="border-l-2 border-blue-200 pl-3 py-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {format(new Date(comment.date), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <p className="text-sm">{comment.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No comments yet</p>
                  )}
                  
                  <div className="mt-3 flex gap-2">
                    <Input 
                      placeholder="Add a comment..." 
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={handleAddComment}>Add</Button>
                  </div>
                </div>
                
                {/* Time Tracking Section */}
                <div className="mt-5">
                  <h3 className="text-sm font-medium flex items-center gap-1 mb-2">
                    <Timer className="h-4 w-4" />
                    Time Tracking
                  </h3>
                  
                  {task.timeEntries && task.timeEntries.length > 0 ? (
                    <div className="space-y-2">
                      {task.timeEntries.map((entry) => {
                        const duration = entry.duration || 
                          (entry.endTime ? 
                            Math.round((new Date(entry.endTime).getTime() - new Date(entry.startTime).getTime()) / 1000 / 60) 
                            : 0);
                          
                        const hours = Math.floor(duration / 60);
                        const minutes = duration % 60;
                        
                        return (
                          <div 
                            key={entry.id} 
                            className="flex flex-col border rounded-md p-2 bg-slate-50"
                          >
                            <div className="flex justify-between mb-1">
                              <span className="font-medium text-sm">{entry.description}</span>
                              <Badge variant={entry.billable ? "default" : "outline"}>
                                {entry.billable ? "Billable" : "Non-billable"}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span>
                                {format(new Date(entry.startTime), "MMM d, h:mm a")} 
                                {entry.endTime && ` - ${format(new Date(entry.endTime), "h:mm a")}`}
                              </span>
                              {entry.endTime && (
                                <span className="font-medium">
                                  {hours > 0 ? `${hours}h ` : ''}{minutes}m
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No time entries</p>
                  )}
                  
                  {timeTracking.isTracking ? (
                    <div className="mt-3 flex flex-col gap-2 border rounded-md p-3 bg-blue-50">
                      <div className="flex justify-between">
                        <span className="font-medium">{timeTracking.description}</span>
                        <span className="text-sm text-blue-600 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(new Date(), "h:mm a")}
                        </span>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="mt-2"
                        onClick={handleStopTimeTracking}
                      >
                        Stop Tracking
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-3 flex flex-col gap-2">
                      <Input 
                        placeholder="What are you working on?" 
                        value={timeTracking.description}
                        onChange={(e) => setTimeTracking({...timeTracking, description: e.target.value})}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-1"
                        onClick={handleStartTimeTracking}
                      >
                        <Clock className="h-4 w-4" />
                        Start Tracking
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {task.createdAt && (
              <div className="text-xs text-gray-500 mt-4">
                Created: {format(new Date(task.createdAt), "MMM d, yyyy")}
                {task.completedAt && ` • Completed: ${format(new Date(task.completedAt), "MMM d, yyyy")}`}
              </div>
            )}
          </div>
        )}
        </ScrollArea>
        
        <DialogFooter className="border-t pt-4 mt-4 flex-col sm:flex-row sm:justify-between gap-2">
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
                    onDeleteTask(task.id);
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
                {!task.isReminder && onCreateFollowUp && !task.hasFollowUp && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={() => {
                      if (onCreateFollowUp) {
                        onCreateFollowUp(task);
                        onOpenChange(false);
                      }
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                    Create Follow-Up
                  </Button>
                )}
                
                {task.status !== "completed" && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => {
                      const completedAt = new Date().toISOString();
                      onTaskUpdate(task.id, { 
                        status: "completed", 
                        completedAt,
                        progress: 100
                      });
                      onOpenChange(false);
                      toast.success(task.isReminder ? "Reminder marked as done" : "Task marked as completed");
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Mark Complete
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
