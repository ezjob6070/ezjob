
import React, { useState } from "react";
import { Task, TaskAttachment } from "../types";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, Clock, Upload, FileText, Trash2, PaperclipIcon, AlertCircle, Check, User
} from "lucide-react";
import { toast } from "sonner";

interface TaskDetailDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const TaskDetailDialog = ({ task, open, onOpenChange, onTaskUpdate }: TaskDetailDialogProps) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState<"high" | "medium" | "low" | "urgent">(task.priority || "medium");
  const [assignedTo, setAssignedTo] = useState(task.assignedTo || "");
  const [progress, setProgress] = useState(task.progress || 0);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [attachments, setAttachments] = useState<TaskAttachment[]>(task.attachments || []);

  const handleSave = () => {
    onTaskUpdate(task.id, {
      title,
      description,
      status,
      priority,
      assignedTo,
      progress,
      attachments
    });
    
    toast.success("Task updated successfully");
    onOpenChange(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingFile(true);
    
    // In a real app, this would upload to a server
    // For now we'll simulate it with a timeout
    setTimeout(() => {
      const newAttachment: TaskAttachment = {
        id: `file-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString(),
        url: "#" // In a real app, this would be the URL from the server
      };
      
      setAttachments([...attachments, newAttachment]);
      setUploadingFile(false);
      toast.success("File uploaded successfully");
    }, 1000);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    setAttachments(attachments.filter(a => a.id !== attachmentId));
    toast.success("File removed successfully");
  };

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in progress": case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "scheduled": return "bg-purple-100 text-purple-800 border-purple-200";
      case "overdue": case "blocked": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    return '📁';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Task Details</DialogTitle>
          <DialogDescription>
            View and edit task information
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Task Info Section */}
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
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

            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={priority} 
                onValueChange={(value: "high" | "medium" | "low" | "urgent") => setPriority(value)}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="Enter name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Progress ({progress}%)</Label>
              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created: {task.createdAt ? format(new Date(task.createdAt), "MMM d, yyyy") : "Unknown"}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Due: {typeof task.dueDate === 'string' ? 
                format(new Date(task.dueDate), "MMM d, yyyy") : 
                format(task.dueDate, "MMM d, yyyy")}</span>
            </div>
          </div>

          <Separator />

          {/* Attachments Section */}
          <div>
            <h3 className="text-lg font-medium mb-2">Attachments</h3>
            
            <div className="mb-4">
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-md p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">Upload document</span>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                />
              </Label>
            </div>

            {uploadingFile && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="animate-spin">
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                  <span>Uploading file...</span>
                </div>
              </div>
            )}

            {attachments.length > 0 ? (
              <div className="space-y-3">
                {attachments.map(attachment => (
                  <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">
                        {getFileIcon(attachment.type)}
                      </div>
                      <div>
                        <p className="font-medium">{attachment.name}</p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(attachment.size)} • {format(new Date(attachment.uploadDate), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 border border-dashed rounded-md">
                <PaperclipIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No attachments yet</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDetailDialog;
