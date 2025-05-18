
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
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
} from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

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
  });
  
  const handleCreateTask = () => {
    if (!newTask.title?.trim()) {
      toast.error("Task title is required");
      return;
    }
    
    onCreateTask(newTask);
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
    });
  };
  
  const handleToggleReminder = () => {
    setNewTask({
      ...newTask,
      isReminder: !newTask.isReminder,
      // If converting to a reminder, set default reminder time
      reminderTime: !newTask.isReminder ? `${newTask.dueDate}T09:00:00` : undefined
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetForm();
    }}>
      <DialogContent className="sm:max-w-[550px]">
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
          <Button onClick={handleCreateTask}>
            {newTask.isReminder ? "Create Reminder" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
