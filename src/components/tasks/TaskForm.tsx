
import React from "react";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "./TasksContext";

interface TaskFormProps {
  isNew: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ isNew }) => {
  const { 
    newTask, 
    setNewTask, 
    handleAddTask,
    setIsNewTaskDialogOpen
  } = useTasks();

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogDescription>
          Add a new task to the project
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <Label htmlFor="new-task-title">Title*</Label>
          <Input 
            id="new-task-title" 
            value={newTask.title} 
            onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="new-task-description">Description</Label>
          <Textarea 
            id="new-task-description" 
            value={newTask.description || ""} 
            onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="new-task-status">Status*</Label>
            <Select 
              value={newTask.status as string} 
              onValueChange={(value) => setNewTask({
                ...newTask, 
                status: value as "pending" | "in_progress" | "completed" | "blocked"
              })}
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
          
          <div className="space-y-2">
            <Label htmlFor="new-task-priority">Priority*</Label>
            <Select 
              value={newTask.priority as string} 
              onValueChange={(value) => setNewTask({
                ...newTask, 
                priority: value as "low" | "medium" | "high" | "urgent"
              })}
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
          <div className="space-y-2">
            <Label htmlFor="new-task-due-date">Due Date*</Label>
            <Input 
              id="new-task-due-date" 
              type="date" 
              value={newTask.dueDate || ""} 
              onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="new-task-assigned-to">Assigned To*</Label>
            <Input 
              id="new-task-assigned-to" 
              value={newTask.assignedTo || ""} 
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})} 
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => setIsNewTaskDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddTask}
            disabled={!newTask.title || !newTask.dueDate || !newTask.assignedTo}
          >
            Create Task
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default TaskForm;
