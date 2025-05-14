import React, { useState } from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Calendar, CheckCircle, Circle, Clock, FileText, Image, Paperclip, Plus, User, XCircle } from "lucide-react";
import { ProjectTask, ProjectTaskComment, ProjectTaskInspection, ProjectTaskAttachment } from "@/types/project";
import { toast } from "sonner";
import { ProjectStaff } from "@/types/project";

export interface TaskDetailDialogProps {
  task: ProjectTask;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<ProjectTask>) => void;
  onUpdateStatus?: (taskId: string, status: "completed" | "pending" | "in_progress" | "blocked") => void;
  onDelete?: (taskId: string) => void;
  onAddToCalendar?: (task: ProjectTask) => void;
  projectStaff?: ProjectStaff[];
}

const TaskDetailDialog: React.FC<TaskDetailDialogProps> = ({ 
  task, 
  open, 
  onOpenChange,
  onTaskUpdate,
  onUpdateStatus,
  onDelete,
  onAddToCalendar,
  projectStaff = []
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [newComment, setNewComment] = useState("");
  const [newInspection, setNewInspection] = useState<Partial<ProjectTaskInspection>>({
    title: "",
    status: "pending"
  });
  
  const handleUpdateProgress = (progress: number) => {
    onTaskUpdate(task.id, { 
      progress,
      lastUpdatedAt: new Date().toISOString()
    });
    toast.success("Task progress updated");
  };

  const handleUpdateStatus = (status: "pending" | "in_progress" | "completed" | "blocked") => {
    if (onUpdateStatus) {
      onUpdateStatus(task.id, status);
      return;
    }
    
    const updates: Partial<ProjectTask> = { 
      status,
      lastUpdatedAt: new Date().toISOString()
    };
    
    // If task is being completed, set progress to 100% and record completion date
    if (status === "completed") {
      updates.progress = 100;
      updates.completedAt = new Date().toISOString();
    }
    
    onTaskUpdate(task.id, updates);
    toast.success("Task status updated");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    
    const comment: ProjectTaskComment = {
      id: `comment-${Date.now()}`,
      text: newComment,
      author: "Current User", // In a real app, get this from auth context
      date: new Date().toISOString()
    };
    
    const comments = [...(task.comments || []), comment];
    
    onTaskUpdate(task.id, { 
      comments,
      lastUpdatedAt: new Date().toISOString()
    });
    
    setNewComment("");
    toast.success("Comment added");
  };

  const handleAddInspection = () => {
    if (!newInspection.title?.trim()) {
      toast.error("Inspection title cannot be empty");
      return;
    }
    
    const inspection: ProjectTaskInspection = {
      id: `inspection-${Date.now()}`,
      title: newInspection.title,
      status: newInspection.status as "pending" | "passed" | "failed" | "not_applicable",
      date: new Date().toISOString(),
      inspector: "Current User", // In a real app, get this from auth context
      notes: newInspection.notes
    };
    
    const inspections = [...(task.inspections || []), inspection];
    
    onTaskUpdate(task.id, { 
      inspections,
      lastUpdatedAt: new Date().toISOString()
    });
    
    setNewInspection({
      title: "",
      status: "pending",
      notes: ""
    });
    
    toast.success("Inspection added");
  };

  const handleAddToCalendar = () => {
    if (onAddToCalendar) {
      onAddToCalendar(task);
      toast.success("Task added to calendar");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed": return <CheckCircle className="text-green-500 h-5 w-5" />;
      case "failed": return <XCircle className="text-red-500 h-5 w-5" />;
      case "pending": return <Clock className="text-amber-500 h-5 w-5" />;
      case "not_applicable": return <Circle className="text-gray-400 h-5 w-5" />;
      default: return <Circle className="h-5 w-5" />;
    }
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

  const getInspectionStatusColor = (status: string) => {
    switch (status) {
      case "passed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "pending": return "bg-amber-100 text-amber-800";
      case "not_applicable": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex justify-between items-center">
            <span>{task.title}</span>
            <Badge className={getStatusColor(task.status)}>{task.status.replace("_", " ")}</Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="inspections">Inspections</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="mt-4 space-y-4">
            {/* Status and Priority section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Select 
                  value={task.status} 
                  onValueChange={(value) => handleUpdateStatus(value as any)}
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
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Priority</p>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </div>
            </div>
            
            {/* Description section */}
            {task.description && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p className="p-3 bg-gray-50 rounded-md">{task.description}</p>
              </div>
            )}
            
            {/* Assignment and Date section */}
            <div className="grid grid-cols-2 gap-4">
              {task.assignedTo && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span>Assigned to: {task.assignedTo}</span>
                </div>
              )}
              
              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                </div>
              )}
            </div>
            
            {/* Progress section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{task.progress}%</span>
              </div>
              
              <div>
                <Input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={task.progress}
                  onChange={(e) => handleUpdateProgress(parseInt(e.target.value))} 
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
            
            {/* Activity log section */}
            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">Activity</p>
              <div className="space-y-3">
                {task.createdAt && (
                  <div className="flex gap-3 text-sm">
                    <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
                    <div>
                      <p>Task created</p>
                      <p className="text-gray-500">{format(new Date(task.createdAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                )}
                
                {task.lastUpdatedAt && (
                  <div className="flex gap-3 text-sm">
                    <div className="w-1 h-1 rounded-full bg-gray-400 mt-2"></div>
                    <div>
                      <p>Task updated</p>
                      <p className="text-gray-500">{format(new Date(task.lastUpdatedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                )}
                
                {task.completedAt && (
                  <div className="flex gap-3 text-sm">
                    <div className="w-1 h-1 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p>Task completed</p>
                      <p className="text-gray-500">{format(new Date(task.completedAt), "MMM d, yyyy 'at' h:mm a")}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Calendar integration */}
            {onAddToCalendar && (
              <div className="pt-4">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2" 
                  onClick={handleAddToCalendar}
                >
                  <Calendar className="h-4 w-4" /> Add to Calendar
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inspections" className="mt-4 space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-medium">Add New Inspection</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="inspection-title">Inspection Title</Label>
                  <Input 
                    id="inspection-title"
                    value={newInspection.title || ''} 
                    onChange={(e) => setNewInspection({...newInspection, title: e.target.value})}
                    placeholder="Enter inspection title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="inspection-status">Status</Label>
                  <Select 
                    value={newInspection.status} 
                    onValueChange={(value) => setNewInspection({...newInspection, status: value as any})}
                  >
                    <SelectTrigger id="inspection-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="not_applicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="inspection-notes">Notes (optional)</Label>
                  <Textarea 
                    id="inspection-notes"
                    value={newInspection.notes || ''} 
                    onChange={(e) => setNewInspection({...newInspection, notes: e.target.value})}
                    placeholder="Add inspection notes..."
                    rows={3}
                  />
                </div>
                
                <Button onClick={handleAddInspection} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Inspection
                </Button>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Inspections List</h3>
              
              {(!task.inspections || task.inspections.length === 0) ? (
                <div className="text-center p-6 bg-gray-50 rounded-md">
                  <AlertTriangle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                  <p className="text-gray-600">No inspections recorded yet</p>
                </div>
              ) : (
                task.inspections.map((inspection) => (
                  <div key={inspection.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(inspection.status)}
                        <h4 className="font-medium">{inspection.title}</h4>
                      </div>
                      <Badge className={getInspectionStatusColor(inspection.status)}>
                        {inspection.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    {inspection.notes && (
                      <p className="text-sm text-gray-600 mb-3">{inspection.notes}</p>
                    )}
                    
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>
                        {inspection.inspector && `Inspector: ${inspection.inspector}`}
                      </span>
                      <span>
                        {inspection.date && format(new Date(inspection.date), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="comments" className="mt-4 space-y-4">
            <div className="space-y-3">
              <Textarea 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)} 
                placeholder="Add a comment..."
                rows={3}
              />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>
            
            <div className="space-y-3">
              {(!task.comments || task.comments.length === 0) ? (
                <p className="text-center p-6 text-gray-500">No comments yet</p>
              ) : (
                task.comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">{comment.author}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(comment.date), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="attachments" className="mt-4 space-y-4">
            <div className="bg-gray-50 border-dashed border-2 border-gray-300 rounded-md p-8 text-center">
              <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600 mb-2">Drag & drop files here or click to browse</p>
              <Button>Upload Files</Button>
              <p className="text-xs text-gray-500 mt-2">Supported formats: PDF, DOC, JPG, PNG (Max size: 10MB)</p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium">Attachments</h3>
              
              {(!task.attachments || task.attachments.length === 0) ? (
                <p className="text-center p-6 text-gray-500">No attachments yet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {task.attachments.map((attachment) => (
                    <div key={attachment.id} className="border rounded-md p-3 flex items-center gap-3">
                      {attachment.type.includes("image") ? (
                        <Image className="h-6 w-6 text-blue-500" />
                      ) : (
                        <FileText className="h-6 w-6 text-blue-500" />
                      )}
                      
                      <div className="flex-1">
                        <p className="font-medium truncate">{attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(attachment.uploadedAt), "MMM d, yyyy")}
                        </p>
                      </div>
                      
                      <Button variant="ghost" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Dialog footer with action buttons */}
        <DialogFooter className="gap-2 sm:gap-0">
          {onDelete && (
            <Button 
              variant="destructive"
              onClick={() => onDelete(task.id)}
            >
              Delete Task
            </Button>
          )}
          
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
