
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskAttachment, TaskComment, TimeEntry } from "@/components/calendar/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
  Bell,
  PlusCircle,
  FileUp,
  MessageSquare,
  Timer,
  Paperclip,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [selectedTab, setSelectedTab] = useState<string>("details");
  
  // For attachments
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [isAddingTimeEntry, setIsAddingTimeEntry] = useState(false);
  const [newTimeEntry, setNewTimeEntry] = useState<Partial<TimeEntry>>({
    description: "",
    startTime: new Date().toISOString().slice(0, 16),
    date: new Date().toISOString().slice(0, 10),
    user: "Current User",
    billable: false
  });

  const handleSaveChanges = () => {
    onTaskUpdate(task.id, editedTask);
    setEditMode(false);
    toast.success(task.isReminder ? "Reminder updated successfully" : "Task updated successfully");
  };

  const handleCreateFollowUp = () => {
    if (onCreateFollowUp) {
      onCreateFollowUp(task);
      onOpenChange(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      case "scheduled": return "bg-purple-100 text-purple-800";
      case "overdue": return "bg-red-100 text-red-800";
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
        ? `${typeof editedTask.dueDate === 'string' ? editedTask.dueDate : format(editedTask.dueDate, 'yyyy-MM-dd')}T09:00:00` 
        : editedTask.reminderTime
    };
    
    setEditedTask({...editedTask, ...updates});
  };

  const handleAddAttachment = () => {
    setUploadingAttachment(true);
    
    // Simulate file upload
    setTimeout(() => {
      const newAttachment: TaskAttachment = {
        id: uuidv4(),
        name: "Document_" + new Date().getTime() + ".pdf",
        type: "application/pdf",
        url: "#",
        size: 1024 * 1024 * Math.random() * 3, // Random size between 0-3MB
        uploadedAt: new Date().toISOString(),
        uploadedBy: "Current User"
      };
      
      const updatedAttachments = editedTask.attachments 
        ? [...editedTask.attachments, newAttachment] 
        : [newAttachment];
      
      setEditedTask({
        ...editedTask,
        attachments: updatedAttachments
      });
      
      setUploadingAttachment(false);
      toast.success("Attachment added successfully");
    }, 1500);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    if (!editedTask.attachments) return;
    
    const updatedAttachments = editedTask.attachments.filter(a => a.id !== attachmentId);
    setEditedTask({
      ...editedTask,
      attachments: updatedAttachments
    });
    
    toast.success("Attachment removed successfully");
  };

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    
    const newComment: TaskComment = {
      id: uuidv4(),
      text: newCommentText,
      author: "Current User",
      date: new Date().toISOString()
    };
    
    const updatedComments = editedTask.comments 
      ? [...editedTask.comments, newComment] 
      : [newComment];
    
    setEditedTask({
      ...editedTask,
      comments: updatedComments
    });
    
    setNewCommentText("");
    toast.success("Comment added");
  };

  const handleSaveTimeEntry = () => {
    if (!newTimeEntry.description || !newTimeEntry.startTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Calculate duration if end time is provided
    let duration: number | undefined = undefined;
    if (newTimeEntry.endTime) {
      const start = new Date(newTimeEntry.startTime).getTime();
      const end = new Date(newTimeEntry.endTime).getTime();
      if (end > start) {
        duration = Math.round((end - start) / (1000 * 60)); // duration in minutes
      }
    }
    
    const timeEntry: TimeEntry = {
      id: uuidv4(),
      description: newTimeEntry.description || "",
      startTime: newTimeEntry.startTime || new Date().toISOString(),
      endTime: newTimeEntry.endTime,
      duration: duration,
      user: newTimeEntry.user || "Current User",
      date: newTimeEntry.date || new Date().toISOString().slice(0, 10),
      billable: newTimeEntry.billable || false
    };
    
    const updatedTimeEntries = editedTask.timeEntries 
      ? [...editedTask.timeEntries, timeEntry] 
      : [timeEntry];
    
    // Calculate total actual hours
    let totalMinutes = 0;
    updatedTimeEntries.forEach(entry => {
      if (entry.duration) {
        totalMinutes += entry.duration;
      }
    });
    
    const actualHours = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
    
    setEditedTask({
      ...editedTask,
      timeEntries: updatedTimeEntries,
      actualHours: actualHours
    });
    
    setIsAddingTimeEntry(false);
    setNewTimeEntry({
      description: "",
      startTime: new Date().toISOString().slice(0, 16),
      date: new Date().toISOString().slice(0, 10),
      user: "Current User",
      billable: false
    });
    
    toast.success("Time entry added");
  };

  const handleDeleteTimeEntry = (timeEntryId: string) => {
    if (!editedTask.timeEntries) return;
    
    const updatedTimeEntries = editedTask.timeEntries.filter(te => te.id !== timeEntryId);
    
    // Recalculate total actual hours
    let totalMinutes = 0;
    updatedTimeEntries.forEach(entry => {
      if (entry.duration) {
        totalMinutes += entry.duration;
      }
    });
    
    const actualHours = Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
    
    setEditedTask({
      ...editedTask,
      timeEntries: updatedTimeEntries,
      actualHours: actualHours
    });
    
    toast.success("Time entry removed");
  };

  const formatDuration = (minutes?: number): string => {
    if (!minutes) return "0h 0m";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "0 KB";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024) * 10) / 10} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
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
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-2">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="attachments">
              Attachments
              {editedTask.attachments?.length ? ` (${editedTask.attachments.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="comments">
              Comments
              {editedTask.comments?.length ? ` (${editedTask.comments.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="time" disabled={task.isReminder}>Time</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
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
                    <Label htmlFor="edit-due-date">{editedTask.isReminder ? "Reminder Date" : "Due Date"}</Label>
                    <Input 
                      id="edit-due-date" 
                      type="date" 
                      value={typeof editedTask.dueDate === 'string' 
                        ? editedTask.dueDate.split('T')[0] 
                        : format(editedTask.dueDate, 'yyyy-MM-dd')}
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
                          const dateStr = typeof editedTask.dueDate === 'string' 
                            ? editedTask.dueDate.split('T')[0] 
                            : format(editedTask.dueDate, 'yyyy-MM-dd');
                          
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
                            <SelectItem value="overdue">Overdue</SelectItem>
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
                      <Label htmlFor="edit-progress">Progress ({editedTask.progress || 0}%)</Label>
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
                          step="0.1"
                          min="0"
                          value={editedTask.actualHours || 0}
                          disabled
                          className="bg-gray-50"
                        />
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
                        <Badge className={getPriorityColor(task.priority || "")}>
                          {task.priority ? (task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) : 'Medium'}
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
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
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
                  
                  {task.client?.name && (
                    <div>
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="font-medium mt-1">
                        {task.client.name}
                      </p>
                    </div>
                  )}
                  
                  {!task.isReminder && task.assignedTo && (
                    <div>
                      <p className="text-sm text-gray-500">Assigned To</p>
                      <p className="font-medium mt-1">
                        {task.assignedTo}
                      </p>
                    </div>
                  )}
                </div>
                
                {!task.isReminder && (
                  <>
                    {task.location && (
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium mt-1">
                          {task.location}
                        </p>
                      </div>
                    )}
                    
                    {task.technician && (
                      <div>
                        <p className="text-sm text-gray-500">Technician</p>
                        <p className="font-medium mt-1">
                          {task.technician}
                        </p>
                      </div>
                    )}
                  
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Progress</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                (task.progress || 0) === 100 ? "bg-green-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${task.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <span className="font-medium text-sm">{task.progress || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Estimated Hours</p>
                        <p className="font-medium mt-1">
                          {task.estimatedHours || "Not set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Actual Hours</p>
                        <p className="font-medium mt-1">
                          {task.actualHours || "0"}
                        </p>
                      </div>
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
          </TabsContent>
          
          <TabsContent value="attachments">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-base">Attachments</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleAddAttachment} 
                  disabled={uploadingAttachment}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  {uploadingAttachment ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <FileUp className="h-4 w-4 mr-1" />
                  )}
                  Upload File
                </Button>
              </div>
              
              {!editedTask.attachments?.length ? (
                <div className="text-center py-8 bg-slate-50 rounded-md border border-dashed border-gray-300">
                  <Paperclip className="h-8 w-8 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No attachments yet
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2"
                    onClick={handleAddAttachment}
                    disabled={uploadingAttachment}
                  >
                    {uploadingAttachment ? "Uploading..." : "Add Attachment"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {editedTask.attachments.map((attachment) => (
                    <div 
                      key={attachment.id} 
                      className="flex items-center justify-between p-3 rounded-md border bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{attachment.name}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(attachment.size)} • {format(new Date(attachment.uploadedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0" 
                          onClick={() => { 
                            // In a real app, this would download the file
                            toast.success("Download started"); 
                          }}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteAttachment(attachment.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="comments">
            <div className="space-y-4">
              <h3 className="font-medium text-base">Comments</h3>
              
              <div className="flex gap-2">
                <Textarea 
                  placeholder="Add a comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  variant="outline" 
                  className="self-end"
                  onClick={handleAddComment}
                  disabled={!newCommentText.trim()}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              {!editedTask.comments?.length ? (
                <div className="text-center py-6 bg-slate-50 rounded-md border border-dashed border-gray-300">
                  <MessageSquare className="h-6 w-6 mx-auto text-gray-400" />
                  <p className="text-sm text-muted-foreground mt-2">
                    No comments yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {editedTask.comments.map((comment) => (
                    <div 
                      key={comment.id} 
                      className="p-3 rounded-md border bg-gray-50"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">{comment.author}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(comment.date), "MMM d, yyyy h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="time">
            {task.isReminder ? (
              <div className="text-center py-6 bg-slate-50 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Time tracking is not available for reminders.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-base">Time Tracking</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsAddingTimeEntry(true)} 
                    disabled={isAddingTimeEntry}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Timer className="h-4 w-4 mr-1" />
                    Add Time Entry
                  </Button>
                </div>
                
                {isAddingTimeEntry && (
                  <div className="p-4 border rounded-md bg-slate-50 space-y-3">
                    <h4 className="font-medium">New Time Entry</h4>
                    <div className="grid gap-2">
                      <Label htmlFor="time-description">Description</Label>
                      <Input 
                        id="time-description" 
                        value={newTimeEntry.description} 
                        onChange={(e) => setNewTimeEntry({...newTimeEntry, description: e.target.value})}
                        placeholder="What did you work on?"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="time-date">Date</Label>
                        <Input 
                          id="time-date" 
                          type="date" 
                          value={newTimeEntry.date}
                          onChange={(e) => setNewTimeEntry({...newTimeEntry, date: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time-user">User</Label>
                        <Input 
                          id="time-user" 
                          value={newTimeEntry.user}
                          onChange={(e) => setNewTimeEntry({...newTimeEntry, user: e.target.value})}
                          placeholder="User name"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start-time">Start Time</Label>
                        <Input 
                          id="start-time" 
                          type="datetime-local" 
                          value={newTimeEntry.startTime}
                          onChange={(e) => setNewTimeEntry({...newTimeEntry, startTime: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end-time">End Time (optional)</Label>
                        <Input 
                          id="end-time" 
                          type="datetime-local"
                          value={newTimeEntry.endTime || ""}
                          onChange={(e) => setNewTimeEntry({...newTimeEntry, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsAddingTimeEntry(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleSaveTimeEntry}
                      >
                        Save Time Entry
                      </Button>
                    </div>
                  </div>
                )}
                
                {!editedTask.timeEntries?.length ? (
                  <div className="text-center py-6 bg-slate-50 rounded-md border border-dashed border-gray-300">
                    <Clock className="h-6 w-6 mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-2">
                      No time entries yet
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setIsAddingTimeEntry(true)}
                    >
                      Add Time Entry
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-5 gap-2 text-xs font-medium text-gray-500 pb-1 border-b">
                      <div>Date</div>
                      <div className="col-span-2">Description</div>
                      <div>Duration</div>
                      <div>User</div>
                    </div>
                    
                    {editedTask.timeEntries.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="grid grid-cols-5 gap-2 py-2 border-b last:border-0 text-sm items-center"
                      >
                        <div>{format(new Date(entry.date), "MMM d, yyyy")}</div>
                        <div className="col-span-2">{entry.description}</div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {formatDuration(entry.duration)}
                        </div>
                        <div className="flex items-center justify-between">
                          <span>{entry.user}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                            onClick={() => handleDeleteTimeEntry(entry.id)}
                          >
                            <Trash className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-2 font-medium">
                      <span>Total</span>
                      <span>{formatDuration(editedTask.timeEntries.reduce((acc, entry) => acc + (entry.duration || 0), 0))}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2 pt-4 border-t mt-4">
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
                {onCreateFollowUp && !task.isReminder && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1"
                    onClick={handleCreateFollowUp}
                  >
                    <PlusCircle className="h-4 w-4" />
                    Create Follow-Up
                  </Button>
                )}
                
                {!task.isReminder && task.status !== "completed" && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => {
                      onTaskUpdate(task.id, { 
                        status: "completed", 
                        completedAt: new Date().toISOString(),
                        progress: 100
                      });
                      onOpenChange(false);
                      toast.success("Task marked as completed");
                    }}
                  >
                    <Check className="h-4 w-4" />
                    Mark Complete
                  </Button>
                )}
                
                {task.isReminder && (
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={() => {
                      onTaskUpdate(task.id, { 
                        status: "completed", 
                        completedAt: new Date().toISOString()
                      });
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
