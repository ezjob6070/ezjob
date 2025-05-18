
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskAttachment } from "@/components/calendar/types";
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
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Check, 
  X, 
  FileText, 
  AlertTriangle, 
  Bell,
  BellRing,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { v4 as uuidv4 } from "uuid";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: Partial<Task>) => void;
  defaultDate?: Date;
}

const CreateTaskDialog = ({
  open,
  onOpenChange,
  onCreateTask,
  defaultDate = new Date()
}: CreateTaskDialogProps) => {
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    dueDate: format(defaultDate, "yyyy-MM-dd"),
    status: "scheduled",
    isReminder: false,
    priority: "medium",
    client: { name: "" },
    progress: 0,
    description: "",
    attachments: [],
    estimatedHours: 1,
    actualHours: 0,
    comments: []
  });
  
  const [files, setFiles] = useState<File[]>([]);
  
  const handleCreateTask = () => {
    if (!newTask.title?.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    // Process file attachments
    const attachments: TaskAttachment[] = files.map(file => ({
      id: uuidv4(),
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "Current User"
    }));
    
    onCreateTask({
      ...newTask,
      attachments: [...(newTask.attachments || []), ...attachments]
    });
    
    onOpenChange(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewTask({
      title: "",
      dueDate: format(defaultDate, "yyyy-MM-dd"),
      status: "scheduled",
      isReminder: false,
      priority: "medium",
      client: { name: "" },
      progress: 0,
      description: "",
      attachments: [],
      estimatedHours: 1,
      actualHours: 0,
      comments: []
    });
    setFiles([]);
  };
  
  const handleToggleReminder = () => {
    setNewTask({
      ...newTask,
      isReminder: !newTask.isReminder,
      // If converting to a reminder, set default reminder time
      reminderTime: !newTask.isReminder ? `${newTask.dueDate}T09:00:00` : undefined
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {newTask.isReminder ? (
              <>
                <BellRing className="h-5 w-5 text-purple-500" />
                <span>Create New Reminder</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 text-blue-500" />
                <span>Create New Task</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="isReminder" className="font-medium text-base">Type</Label>
            <div className="flex items-center gap-2">
              <Label htmlFor="isReminder" className={`text-sm ${newTask.isReminder ? 'text-purple-500 font-medium' : 'text-blue-500 font-medium'}`}>
                {newTask.isReminder ? 'Reminder' : 'Task'}
              </Label>
              <Switch
                id="isReminder"
                checked={newTask.isReminder}
                onCheckedChange={handleToggleReminder}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title" className="required-field">Title</Label>
            <Input 
              id="title" 
              value={newTask.title} 
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={newTask.description} 
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              placeholder="Enter description (optional)"
              rows={3}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="client">Client</Label>
            <Input 
              id="client" 
              value={newTask.client?.name} 
              onChange={(e) => setNewTask({...newTask, client: { name: e.target.value }})}
              placeholder="Client name (optional)"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="due-date">{newTask.isReminder ? "Reminder Date" : "Due Date"}</Label>
              <Input 
                id="due-date" 
                type="date" 
                value={newTask.dueDate?.toString().split('T')[0]} 
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
              />
            </div>
            
            {newTask.isReminder ? (
              <div className="grid gap-2">
                <Label htmlFor="reminder-time">Reminder Time</Label>
                <Input 
                  id="reminder-time" 
                  type="time" 
                  value={newTask.reminderTime?.split('T')[1]?.substring(0, 5) || "09:00"}
                  onChange={(e) => {
                    if (newTask.dueDate) {
                      setNewTask({
                        ...newTask, 
                        reminderTime: `${newTask.dueDate}T${e.target.value}:00`
                      });
                    }
                  }}
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="assigned-to">Assigned To</Label>
                <Input 
                  id="assigned-to" 
                  value={newTask.assignedTo || ""} 
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  placeholder="Who is responsible?"
                />
              </div>
            )}
          </div>
          
          {!newTask.isReminder && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={newTask.status} 
                    onValueChange={(value) => setNewTask({...newTask, status: value})}
                  >
                    <SelectTrigger id="status">
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
                  <Label htmlFor="priority">Priority</Label>
                  <Select 
                    value={newTask.priority} 
                    onValueChange={(value) => setNewTask({...newTask, priority: value as "high" | "medium" | "low" | "urgent"})}
                  >
                    <SelectTrigger id="priority">
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
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  value={newTask.location || ""} 
                  onChange={(e) => setNewTask({...newTask, location: e.target.value})}
                  placeholder="Location (optional)"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="technician">Technician</Label>
                <Input 
                  id="technician" 
                  value={newTask.technician || ""} 
                  onChange={(e) => setNewTask({...newTask, technician: e.target.value})}
                  placeholder="Technician name (optional)"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="estimated-hours">Estimated Hours</Label>
                  <Input 
                    id="estimated-hours" 
                    type="number" 
                    step="0.5"
                    min="0"
                    value={newTask.estimatedHours || ""} 
                    onChange={(e) => setNewTask({...newTask, estimatedHours: parseFloat(e.target.value)})}
                    placeholder="Estimated hours to complete"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input 
                    id="progress" 
                    type="number" 
                    min="0"
                    max="100"
                    value={newTask.progress || 0} 
                    onChange={(e) => setNewTask({...newTask, progress: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              {/* Attachments section */}
              <div className="grid gap-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="attachments" className="text-base font-medium">Attachments</Label>
                  <Label 
                    htmlFor="file-upload" 
                    className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded cursor-pointer hover:bg-blue-100 text-sm font-medium"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                    Attach Files
                  </Label>
                  <Input 
                    id="file-upload" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple 
                  />
                </div>
                
                {files.length > 0 ? (
                  <div className="border rounded-md p-3 space-y-2 mt-2 bg-slate-50">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between text-sm border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(0)} KB
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 hover:bg-red-50 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground bg-slate-50">
                    <p className="text-sm">No files attached</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreateTask} className="gap-1">
            <Paperclip className="h-4 w-4" />
            {newTask.isReminder ? "Create Reminder" : "Create Professional Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
