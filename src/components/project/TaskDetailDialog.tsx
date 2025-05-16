
import { useState } from "react";
import { format } from "date-fns";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProjectTask, ProjectTaskHistoryEntry } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Clock,
  PlusIcon,
  TrashIcon,
  BellIcon,
  ToggleLeft,
  ToggleRight,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  AlertCircleIcon,
  HistoryIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface TaskDetailDialogProps {
  task: ProjectTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (task: ProjectTask) => void;
  onDelete?: () => void;
  projectStaff: any[];
  isCreating?: boolean;
}

export function TaskDetailDialog({
  task,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
  projectStaff,
  isCreating = false,
}: TaskDetailDialogProps) {
  const [editedTask, setEditedTask] = useState<ProjectTask>({
    ...task,
    history: task.history || [],
    comments: task.comments || [],
    attachments: task.attachments || [],
    inspections: task.inspections || [],
  });
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    task.dueDate ? new Date(task.dueDate) : undefined
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    task.dueDate 
      ? format(new Date(task.dueDate), "HH:mm") 
      : "12:00"
  );
  const [selectedReminderTime, setSelectedReminderTime] = useState<string>(
    task.reminderTime 
      ? format(new Date(task.reminderTime), "HH:mm") 
      : "09:00"
  );
  
  const handleInputChange = (field: keyof ProjectTask, value: any) => {
    setEditedTask({ ...editedTask, [field]: value });
    
    // Add a history entry for important changes
    if (["status", "priority", "assignedTo"].includes(field)) {
      const historyEntry: ProjectTaskHistoryEntry = {
        id: uuidv4(),
        title: `Changed ${field}`,
        description: `Changed ${field} to ${value}`,
        date: new Date().toISOString(),
        userId: "current-user", // In a real app, use actual user ID
        userName: "Current User", // In a real app, use actual user name
      };
      
      setEditedTask(prev => ({
        ...prev,
        [field]: value,
        history: [...(prev.history || []), historyEntry],
        lastUpdatedAt: new Date().toISOString()
      }));
    }
  };
  
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: uuidv4(),
      content: newComment,
      date: new Date().toISOString(),
      userId: "current-user", // In a real app, use actual user ID
      userName: "Current User", // In a real app, use actual user name
    };
    
    setEditedTask({
      ...editedTask,
      comments: [...(editedTask.comments || []), comment],
      lastUpdatedAt: new Date().toISOString()
    });
    
    setNewComment("");
    toast.success("Comment added");
  };
  
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours, minutes, 0);
      
      // Update the task's dueDate
      setEditedTask({
        ...editedTask,
        dueDate: newDate.toISOString(),
        lastUpdatedAt: new Date().toISOString()
      });
    } else {
      setEditedTask({
        ...editedTask,
        dueDate: undefined,
        lastUpdatedAt: new Date().toISOString()
      });
    }
  };
  
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0);
      
      // Update the task's dueDate
      setEditedTask({
        ...editedTask,
        dueDate: newDate.toISOString(),
        lastUpdatedAt: new Date().toISOString()
      });
    }
  };
  
  const handleReminderToggle = (enabled: boolean) => {
    if (enabled) {
      // If enabling reminder, set default reminder time if dueDate exists
      if (editedTask.dueDate) {
        const dueDate = new Date(editedTask.dueDate);
        // Set reminder to 1 hour before due date by default
        const reminderTime = new Date(dueDate);
        reminderTime.setHours(reminderTime.getHours() - 1);
        
        setEditedTask({
          ...editedTask,
          isReminder: true,
          reminderTime: reminderTime.toISOString(),
          reminderSent: false,
          lastUpdatedAt: new Date().toISOString()
        });
        setSelectedReminderTime(format(reminderTime, "HH:mm"));
      } else {
        // No due date, just enable the reminder flag
        setEditedTask({
          ...editedTask,
          isReminder: true,
          reminderSent: false,
          lastUpdatedAt: new Date().toISOString()
        });
      }
    } else {
      // Disable reminder
      setEditedTask({
        ...editedTask,
        isReminder: false,
        reminderTime: undefined,
        reminderSent: undefined,
        lastUpdatedAt: new Date().toISOString()
      });
    }
  };
  
  const handleReminderTimeChange = (time: string) => {
    setSelectedReminderTime(time);
    
    if (selectedDate) {
      const [hours, minutes] = time.split(':').map(Number);
      const reminderDate = new Date(selectedDate);
      reminderDate.setHours(hours, minutes, 0);
      
      setEditedTask({
        ...editedTask,
        reminderTime: reminderDate.toISOString(),
        lastUpdatedAt: new Date().toISOString()
      });
    }
  };
  
  const handleSave = () => {
    // Create or update task
    const finalTask = {
      ...editedTask,
      lastUpdatedAt: new Date().toISOString()
    };
    
    // If we're creating a new task, add initial history entry
    if (isCreating) {
      const historyEntry: ProjectTaskHistoryEntry = {
        id: uuidv4(),
        title: "Task created",
        description: "Task was created",
        date: new Date().toISOString(),
        userId: "current-user",
        userName: "Current User",
      };
      
      finalTask.history = [historyEntry];
    }
    
    onUpdate(finalTask);
    onOpenChange(false);
  };
  
  const handleDelete = () => {
    if (!onDelete) return;
    
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete();
      onOpenChange(false);
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-blue-100 text-blue-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-purple-100 text-purple-800";
      case "completed": return "bg-green-100 text-green-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCreating ? "Create New Task" : "Edit Task"} 
            {editedTask.isReminder && (
              <Badge className="bg-purple-100 text-purple-800">
                <BellIcon className="h-3 w-3 mr-1" />
                Reminder
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isCreating 
              ? "Fill in the details to create a new task." 
              : "Make changes to the task here."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">
              Comments {editedTask.comments?.length ? `(${editedTask.comments.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="history">
              History {editedTask.history?.length ? `(${editedTask.history.length})` : ""}
            </TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={editedTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  value={editedTask.description || ""}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={editedTask.priority}
                    onValueChange={(value) => handleInputChange("priority", value)}
                  >
                    <SelectTrigger>
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
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editedTask.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <div className="flex space-x-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? (
                            format(selectedDate, "MMM dd, yyyy")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <Input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => handleTimeChange(e.target.value)}
                      className="w-[120px]"
                      disabled={!selectedDate}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select
                    value={editedTask.assignedTo || ""}
                    onValueChange={(value) => handleInputChange("assignedTo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign someone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {projectStaff.map((person) => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="client">Client</Label>
                  <Input
                    id="client"
                    placeholder="Client name"
                    value={editedTask.client || ""}
                    onChange={(e) => handleInputChange("client", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Location"
                    value={editedTask.location || ""}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="progress">Progress ({editedTask.progress}%)</Label>
                <Input
                  id="progress"
                  type="range"
                  min="0"
                  max="100"
                  value={editedTask.progress}
                  onChange={(e) => handleInputChange("progress", parseInt(e.target.value))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={Boolean(editedTask.isReminder)}
                    onCheckedChange={handleReminderToggle}
                    id="reminder-toggle"
                  />
                  <Label htmlFor="reminder-toggle" className="cursor-pointer flex items-center">
                    <BellIcon className="h-4 w-4 mr-1 text-purple-500" />
                    Set as reminder
                  </Label>
                </div>
                
                {editedTask.isReminder && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="reminderTime" className="whitespace-nowrap">Reminder time:</Label>
                    <Input
                      id="reminderTime"
                      type="time"
                      value={selectedReminderTime}
                      onChange={(e) => handleReminderTimeChange(e.target.value)}
                      className="w-[120px]"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleAddComment} className="self-end">
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="space-y-4">
                {editedTask.comments && editedTask.comments.length > 0 ? (
                  [...editedTask.comments].reverse().map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {comment.userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{comment.userName}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comment.date), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border rounded-lg bg-gray-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                      <AlertCircleIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No comments yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start the conversation by adding a comment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 pt-4">
            {editedTask.history && editedTask.history.length > 0 ? (
              <div className="space-y-0">
                {[...editedTask.history].reverse().map((entry, index) => (
                  <div key={entry.id || index} className="flex gap-3 py-3">
                    <div className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                      <HistoryIcon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1 border-b pb-3 w-full">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{entry.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.date), "MMM d, yyyy h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {entry.description}
                        {entry.userName && <span> by {entry.userName}</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg bg-gray-50">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <HistoryIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No history available</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Changes to this task will be recorded here.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 pt-4">
            <div className="space-y-4">
              {!isCreating && (
                <div className="p-4 border rounded-lg bg-muted/20">
                  <h3 className="text-sm font-medium mb-2">Task Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Created:</div>
                    <div>
                      {editedTask.createdAt 
                        ? format(new Date(editedTask.createdAt), "MMM d, yyyy h:mm a")
                        : "Not recorded"}
                    </div>
                    <div className="text-muted-foreground">Last updated:</div>
                    <div>
                      {editedTask.lastUpdatedAt
                        ? format(new Date(editedTask.lastUpdatedAt), "MMM d, yyyy h:mm a")
                        : "Never"}
                    </div>
                    <div className="text-muted-foreground">Completed:</div>
                    <div>
                      {editedTask.completedAt
                        ? format(new Date(editedTask.completedAt), "MMM d, yyyy h:mm a")
                        : "Not completed"}
                    </div>
                    <div className="text-muted-foreground">Status:</div>
                    <div>
                      <Badge className={getStatusColor(editedTask.status)}>
                        {editedTask.status === "in_progress" ? "In Progress" : 
                         editedTask.status.charAt(0).toUpperCase() + editedTask.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">Priority:</div>
                    <div>
                      <Badge className={getPriorityColor(editedTask.priority)}>
                        {editedTask.priority.charAt(0).toUpperCase() + editedTask.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  These actions cannot be undone.
                </p>
                
                <div className="p-4 border border-destructive/20 rounded-lg bg-destructive/10">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-destructive">Delete task</h4>
                      <p className="text-sm text-muted-foreground">
                        This will permanently delete the task and all associated data.
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={handleDelete}
                      disabled={isCreating || !onDelete}
                      className="flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isCreating ? "Create Task" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
