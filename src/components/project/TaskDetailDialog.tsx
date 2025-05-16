
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format, isValid, parseISO } from "date-fns";
import { ProjectTask, ProjectStaff } from "@/types/project";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Building, 
  ArrowRight, 
  AlertCircle,
  Bell,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from "lucide-react";

// Props for component
export interface TaskDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: ProjectTask | null;
  projectStaff: ProjectStaff[];
  onUpdateStatus: (id: string, status: ProjectTask["status"]) => void;
  onDeleteTask: (id: string) => void;
  onAddToCalendar: (task: ProjectTask) => void;
}

// Component definition
const TaskDetailDialog = ({
  open,
  onOpenChange,
  task,
  projectStaff,
  onUpdateStatus,
  onDeleteTask,
  onAddToCalendar
}: TaskDetailDialogProps) => {
  const [activeTab, setActiveTab] = useState("details");
  const [editMode, setEditMode] = useState(false);
  const [editableTask, setEditableTask] = useState<ProjectTask | null>(null);

  // Update editable task when task changes
  useEffect(() => {
    if (task) {
      setEditableTask({ ...task });
    }
  }, [task]);

  // Safely format dates
  const safeFormatDate = (date: string | undefined) => {
    if (!date) return "Not set";
    try {
      const parsedDate = parseISO(date);
      if (!isValid(parsedDate)) return "Invalid date";
      return format(parsedDate, "MMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  // Safely format time
  const safeFormatTime = (dateTime: string | undefined) => {
    if (!dateTime) return null;
    try {
      const parsedDate = parseISO(dateTime);
      if (!isValid(parsedDate)) return null;
      return format(parsedDate, "h:mm a");
    } catch (e) {
      return null;
    }
  };

  // Save task changes
  const handleSaveChanges = () => {
    if (!editableTask) return;
    
    // In a real app, this would update the task in the database
    // But for now, just show success toast
    toast.success("Task updated successfully");
    setEditMode(false);
  };

  // Reset form to original values
  const handleCancelEdit = () => {
    if (task) {
      setEditableTask({ ...task });
    }
    setEditMode(false);
  };

  // Change task status
  const handleStatusChange = (status: ProjectTask["status"]) => {
    if (!task) return;
    
    onUpdateStatus(task.id, status);
    toast.success(`Task status updated to ${status}`);
  };

  // Delete task
  const handleDeleteTask = () => {
    if (!task) return;
    
    onDeleteTask(task.id);
    onOpenChange(false);
    toast.success("Task deleted successfully");
  };

  // Add to calendar
  const handleAddToCalendar = () => {
    if (!task) return;
    
    onAddToCalendar(task);
    toast.success("Task added to calendar");
  };

  // Get assigned staff member name
  const getAssignedStaffName = (id: string | undefined) => {
    if (!id) return "Unassigned";
    const staff = projectStaff.find(s => s.id === id);
    return staff ? staff.name : "Unknown";
  };

  // Get status badge color
  const getStatusBadgeColor = (status: ProjectTask["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "blocked":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  // Get priority badge color
  const getPriorityBadgeColor = (priority: ProjectTask["priority"]) => {
    switch (priority) {
      case "high":
      case "urgent":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Get reminder badge style
  const getReminderBadgeStyle = () => {
    return "bg-purple-100 text-purple-800";
  };

  // Format display status
  const formatStatus = (status: ProjectTask["status"]) => {
    switch (status) {
      case "in_progress": return "In Progress";
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // If no task is selected, don't render dialog content
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editMode ? "Edit Task" : task.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            {editMode ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="edit-title" className="text-sm font-medium">Title</label>
                  <Input
                    id="edit-title"
                    value={editableTask?.title || ""}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, title: e.target.value } : null)}
                  />
                </div>

                <div>
                  <label htmlFor="edit-description" className="text-sm font-medium">Description</label>
                  <Textarea
                    id="edit-description"
                    value={editableTask?.description || ""}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="edit-is-reminder"
                    checked={editableTask?.isReminder || false}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, isReminder: e.target.checked } : null)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="edit-is-reminder" className="text-sm font-medium">
                    Set as Reminder
                  </label>
                </div>

                <div>
                  <label htmlFor="edit-client" className="text-sm font-medium">Client</label>
                  <Input
                    id="edit-client"
                    value={editableTask?.client || ""}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, client: e.target.value } : null)}
                  />
                </div>

                <div>
                  <label htmlFor="edit-location" className="text-sm font-medium">Location</label>
                  <Input
                    id="edit-location"
                    value={editableTask?.location || ""}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, location: e.target.value } : null)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-priority" className="text-sm font-medium">Priority</label>
                    <Select
                      value={editableTask?.priority || "medium"}
                      onValueChange={(value) => setEditableTask(prev => prev ? { ...prev, priority: value as ProjectTask["priority"] } : null)}
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

                  <div>
                    <label htmlFor="edit-assignee" className="text-sm font-medium">Assigned To</label>
                    <Select
                      value={editableTask?.assignedTo || ""}
                      onValueChange={(value) => setEditableTask(prev => prev ? { ...prev, assignedTo: value } : null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Unassigned</SelectItem>
                        {projectStaff.map(staff => (
                          <SelectItem key={staff.id} value={staff.id}>
                            {staff.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label htmlFor="edit-due-date" className="text-sm font-medium">Due Date</label>
                  <Input
                    id="edit-due-date"
                    type="datetime-local"
                    value={editableTask?.dueDate ? new Date(editableTask.dueDate).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setEditableTask(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                  />
                </div>

                {editableTask?.isReminder && (
                  <div>
                    <label htmlFor="edit-reminder-time" className="text-sm font-medium">Reminder Time</label>
                    <Input
                      id="edit-reminder-time"
                      type="time"
                      value={editableTask?.reminderTime?.split('T')[1]?.substring(0, 5) || "09:00"}
                      onChange={(e) => {
                        if (editableTask?.dueDate) {
                          const datePart = editableTask.dueDate.split('T')[0];
                          setEditableTask(prev => prev ? { 
                            ...prev, 
                            reminderTime: `${datePart}T${e.target.value}:00` 
                          } : null);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  {task.isReminder ? (
                    <Badge className={getReminderBadgeStyle()}>
                      <span className="flex items-center gap-1">
                        <Bell className="h-3 w-3" />
                        Reminder
                      </span>
                    </Badge>
                  ) : (
                    <Badge className={getStatusBadgeColor(task.status)}>
                      {formatStatus(task.status)}
                    </Badge>
                  )}
                  <Badge className={getPriorityBadgeColor(task.priority)}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                  </Badge>
                </div>
                
                {task.client && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-md">
                    <div className="p-1.5 rounded-md bg-blue-50">
                      <Building className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-0.5">Client</p>
                      <p className="font-medium">{task.client}</p>
                    </div>
                  </div>
                )}

                {task.description && (
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="text-gray-700 text-sm">{task.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {task.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{task.location}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">Due: {safeFormatDate(task.dueDate)}</span>
                  </div>
                </div>

                {task.isReminder && task.reminderTime && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-md">
                    <div className="p-1.5 rounded-md bg-purple-100">
                      <Bell className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-600 mb-0.5">Reminder Time</p>
                      <p className="font-medium">
                        {safeFormatTime(task.reminderTime) || "Time not set"} 
                        {task.reminderSent && 
                          <span className="ml-2 text-green-600 text-xs font-semibold">(Sent)</span>
                        }
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col space-y-4 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">Assigned to</span>
                    </div>
                    <span className="text-sm">{getAssignedStaffName(task.assignedTo)}</span>
                  </div>

                  {task.createdAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Created on</span>
                      <span className="text-sm">{safeFormatDate(task.createdAt)}</span>
                    </div>
                  )}
                  
                  {task.completedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-500">Completed on</span>
                      <span className="text-sm">{safeFormatDate(task.completedAt)}</span>
                    </div>
                  )}
                </div>

                {(task.progress !== undefined && task.progress !== null) && (
                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium text-gray-500">Progress</h3>
                      <span className="text-sm font-medium">{task.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2 pt-4 border-t border-gray-100">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-x-2">
                    {task.status !== "completed" && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                        onClick={() => handleStatusChange("completed")}
                      >
                        Mark Complete
                      </Button>
                    )}
                    {task.status === "pending" && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                        onClick={() => handleStatusChange("in_progress")}
                      >
                        Start Task
                      </Button>
                    )}
                    {task.status !== "blocked" && task.status !== "completed" && (
                      <Button 
                        size="sm"
                        variant="outline"
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                        onClick={() => handleStatusChange("blocked")}
                      >
                        Block Task
                      </Button>
                    )}
                  </div>
                  <div className="space-x-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={handleAddToCalendar}
                    >
                      Add to Calendar
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => setEditMode(true)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:bg-red-50"
                      onClick={handleDeleteTask}
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 py-4">
            <div className="border rounded-md">
              <div className="p-4 border-b">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 rounded-full p-1.5">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">Task created</span>
                  </div>
                  <span className="text-sm text-gray-500">{safeFormatDate(task.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-500 ml-9">Task was created by Admin</p>
              </div>

              {task.status === "in_progress" && (
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 rounded-full p-1.5">
                        <ArrowRight className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="font-medium">Status changed</span>
                    </div>
                    <span className="text-sm text-gray-500">Today</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Status changed from Pending to In Progress</p>
                </div>
              )}
              
              {task.isReminder && task.reminderSent && (
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 rounded-full p-1.5">
                        <Bell className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Reminder sent</span>
                    </div>
                    <span className="text-sm text-gray-500">Today</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Reminder notification was sent</p>
                </div>
              )}
              
              {task.status === "completed" && task.completedAt && (
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 rounded-full p-1.5">
                        <Clock className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium">Task completed</span>
                    </div>
                    <span className="text-sm text-gray-500">{safeFormatDate(task.completedAt)}</span>
                  </div>
                  <p className="text-sm text-gray-500 ml-9">Task was marked as completed</p>
                </div>
              )}
              
              {task.history && task.history.length > 0 ? (
                task.history.map((entry, index) => (
                  <div key={index} className="p-4 border-b last:border-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{entry.title}</span>
                      <span className="text-sm text-gray-500">{safeFormatDate(entry.date)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{entry.description}</p>
                  </div>
                ))
              ) : task.status !== "in_progress" && task.status !== "completed" && !task.isReminder && (
                <div className="p-6 text-center text-gray-500">
                  <p>No additional history entries</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4 py-4">
            <div className="text-center p-8 border rounded-md">
              <p className="text-gray-500 mb-4">No files attached to this task</p>
              <Button variant="outline" size="sm">
                Attach File
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
