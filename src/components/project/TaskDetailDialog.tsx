
import React, { useState } from "react";
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
  React.useEffect(() => {
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

  // If no task is selected, don't render dialog content
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Description</h3>
                  <p className="text-gray-700">{task.description || "No description provided."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Priority</h3>
                    <Badge className={
                      task.priority === "high" || task.priority === "urgent" ? 
                      "bg-red-100 text-red-800" : 
                      task.priority === "medium" ? 
                      "bg-amber-100 text-amber-800" : 
                      "bg-blue-100 text-blue-800"
                    }>
                      {task.priority}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Status</h3>
                    <Badge className={
                      task.status === "completed" ? "bg-green-100 text-green-800" : 
                      task.status === "in_progress" ? "bg-blue-100 text-blue-800" : 
                      task.status === "blocked" ? "bg-red-100 text-red-800" : 
                      "bg-amber-100 text-amber-800"
                    }>
                      {task.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Due Date</h3>
                    <p>{safeFormatDate(task.dueDate)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Assigned To</h3>
                    <p>{getAssignedStaffName(task.assignedTo)}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-1">Created On</h3>
                    <p>{safeFormatDate(task.createdAt)}</p>
                  </div>

                  {task.completedAt && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">Completed On</h3>
                      <p>{safeFormatDate(task.completedAt)}</p>
                    </div>
                  )}
                </div>

                {task.progress !== undefined && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium">Progress</h3>
                      <span className="text-sm">{task.progress}%</span>
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

            <div className="flex flex-wrap justify-between gap-2 pt-4">
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
            <div className="text-center py-6 text-gray-500">
              <p>Task history will be displayed here.</p>
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4 py-4">
            <div className="text-center py-6 text-gray-500">
              <p>Related files will be displayed here.</p>
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
