
import React from "react";
import { 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Check, 
  FileText, 
  Trash, 
  Plus 
} from "lucide-react";
import { useTasks } from "./TasksContext";
import { getStatusBadgeColor, getPriorityBadgeColor } from "./TaskUtils";

const TaskDetail: React.FC = () => {
  const [editMode, setEditMode] = React.useState(false);
  const { 
    selectedTask, 
    setSelectedTask, 
    handleUpdateTask, 
    handleDeleteTask,
    handleAddDocument,
    setIsTaskDialogOpen
  } = useTasks();

  if (!selectedTask) return null;

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Task Details</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4 py-2">
        {editMode ? (
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={selectedTask.title} 
                onChange={(e) => setSelectedTask({...selectedTask, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description" 
                value={selectedTask.description || ""} 
                onChange={(e) => setSelectedTask({...selectedTask, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={selectedTask.status} 
                  onValueChange={(value) => setSelectedTask({...selectedTask, status: value as any})}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select 
                  value={selectedTask.priority} 
                  onValueChange={(value) => setSelectedTask({...selectedTask, priority: value as any})}
                >
                  <SelectTrigger id="edit-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input 
                  id="edit-due-date" 
                  type="date" 
                  value={selectedTask.dueDate || ""}
                  onChange={(e) => setSelectedTask({...selectedTask, dueDate: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-assigned-to">Assigned To</Label>
                <Input 
                  id="edit-assigned-to" 
                  value={selectedTask.assignedTo || ""} 
                  onChange={(e) => setSelectedTask({...selectedTask, assignedTo: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-progress">Progress ({selectedTask.progress}%)</Label>
              <Input 
                id="edit-progress" 
                type="range" 
                min="0" 
                max="100" 
                step="5"
                value={selectedTask.progress} 
                onChange={(e) => setSelectedTask({...selectedTask, progress: parseInt(e.target.value)})}
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{selectedTask.title}</h2>
              <div className="flex gap-2">
                <Badge className={getPriorityBadgeColor(selectedTask.priority)}>
                  {selectedTask.priority.charAt(0).toUpperCase() + selectedTask.priority.slice(1)}
                </Badge>
                <Badge className={getStatusBadgeColor(selectedTask.status)}>
                  {selectedTask.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            {selectedTask.description && (
              <div className="text-gray-700 mt-2">
                {selectedTask.description}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium flex items-center gap-1 mt-1">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  {selectedTask.dueDate ? format(new Date(selectedTask.dueDate), "MMM d, yyyy") : "Not set"}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium flex items-center gap-1 mt-1">
                  {selectedTask.assignedTo || "Unassigned"}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Progress</p>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        selectedTask.progress === 100 ? "bg-green-500" : "bg-blue-500"
                      }`}
                      style={{ width: `${selectedTask.progress}%` }}
                    ></div>
                  </div>
                </div>
                <span className="font-medium text-sm">{selectedTask.progress}%</span>
              </div>
            </div>
            
            {selectedTask.createdAt && (
              <div className="text-xs text-gray-500 mt-4">
                Created: {format(new Date(selectedTask.createdAt), "MMM d, yyyy")}
                {selectedTask.completedAt && ` • Completed: ${format(new Date(selectedTask.completedAt), "MMM d, yyyy")}`}
              </div>
            )}
            
            {/* Attachments section */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <Label>Attachments</Label>
                <Button variant="outline" size="sm" onClick={handleAddDocument} className="flex items-center gap-1">
                  <Plus size={14} />
                  Add Document
                </Button>
              </div>
              
              <div className="border rounded-md">
                {selectedTask.attachments && selectedTask.attachments.length > 0 ? (
                  <div className="divide-y">
                    {selectedTask.attachments.map(doc => (
                      <div key={doc.id} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-600" />
                          <span>{doc.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{doc.uploadedAt}</span>
                          <Button variant="ghost" size="sm">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No documents attached
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
        {editMode ? (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => {
              handleUpdateTask();
              setEditMode(false);
            }}>Save Changes</Button>
          </>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-2 sm:order-2">
              <Button 
                variant="destructive" 
                className="flex items-center gap-1" 
                onClick={() => {
                  handleDeleteTask(selectedTask.id);
                  setIsTaskDialogOpen(false);
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
              {selectedTask.status !== "completed" && (
                <Button 
                  variant="outline" 
                  className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                  onClick={() => {
                    setSelectedTask({...selectedTask, status: "completed", progress: 100});
                    handleUpdateTask();
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
  );
};

export default TaskDetail;
