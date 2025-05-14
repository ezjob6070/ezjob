
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, ArrowDown, ArrowUp, Bell, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TasksViewProps {
  selectedDate: Date;
  tasksForSelectedDate: Task[];
  onPreviousDay: () => void;
  onNextDay: () => void;
  onTasksChange?: (tasks: Task[]) => void;
}

const TasksView = ({ 
  selectedDate, 
  tasksForSelectedDate, 
  onPreviousDay, 
  onNextDay,
  onTasksChange
}: TasksViewProps) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "tasks" | "reminders">("all");
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [reminderTitle, setReminderTitle] = useState("");
  const [reminderDescription, setReminderDescription] = useState("");
  const [reminderTime, setReminderTime] = useState(() => {
    // Set to current time rounded to nearest 30 minutes
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 30) * 30;
    const hours = now.getHours() + (minutes >= 60 ? 1 : 0);
    return `${String(hours % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
  });

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (!onTasksChange) return;
    
    const updatedTasks = tasksForSelectedDate.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    onTasksChange(updatedTasks);
  };

  const handleCreateFollowUp = (task: Task) => {
    if (!onTasksChange) return;
    
    // Create a follow-up task that's scheduled a day after the original task
    const followUpDate = new Date(task.dueDate);
    followUpDate.setDate(followUpDate.getDate() + 1);
    
    const followUpTask: Task = {
      id: uuid(),
      title: `Follow-up: ${task.title}`,
      dueDate: followUpDate,
      followUpDate: undefined,
      start: followUpDate.toISOString(),
      end: new Date(followUpDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      priority: task.priority,
      client: task.client,
      description: `Follow-up for task: ${task.title}`,
      technician: task.technician,
      color: "#4f46e5", // indigo color for follow-up
      type: "follow-up",
      hasFollowUp: false,
      parentTaskId: task.id
    };
    
    // Mark the original task as having a follow-up
    const updatedTasks = tasksForSelectedDate.map(t => 
      t.id === task.id ? { ...t, hasFollowUp: true, followUpDate } : t
    );
    
    // Add the new follow-up task to the list
    onTasksChange([...updatedTasks, followUpTask]);
  };

  const handleCreateReminder = () => {
    if (!reminderTitle.trim()) {
      toast.error("Please provide a reminder title");
      return;
    }

    if (!onTasksChange) return;
    
    // Parse the time from input
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    // Create a new date with the selected time
    const reminderDate = new Date(selectedDate);
    reminderDate.setHours(hours, minutes, 0, 0);
    
    // Create reminder object (using Task type with isReminder flag)
    const newReminder: Task = {
      id: uuid(),
      title: reminderTitle,
      description: reminderDescription,
      dueDate: reminderDate,
      start: reminderDate.toISOString(),
      end: new Date(reminderDate.getTime() + 30 * 60 * 1000).toISOString(), // 30 min duration
      status: "scheduled",
      priority: "medium",
      client: { name: "Personal" },
      technician: { name: "Me" },
      color: "#8B5CF6", // purple color for reminders
      type: "reminder",
      isReminder: true
    };
    
    // Add the new reminder to the list
    onTasksChange([...tasksForSelectedDate, newReminder]);
    
    // Reset form and close dialog
    setReminderTitle("");
    setReminderDescription("");
    setIsReminderDialogOpen(false);
    
    toast.success("Reminder created successfully");
  };

  const filterTasks = () => {
    let filtered = [...tasksForSelectedDate];

    // Apply view mode filter
    if (viewMode === "tasks") {
      filtered = filtered.filter(task => !task.isReminder);
    } else if (viewMode === "reminders") {
      filtered = filtered.filter(task => task.isReminder);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterType !== "all") {
      filtered = filtered.filter(task => task.status === filterType);
    }

    // Apply sort order
    filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate));
      const dateB = new Date(b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate));
      
      if (sortOrder === "newest") {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

    return filtered;
  };

  const filteredTasks = filterTasks();
  const tasksCount = tasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(task => task.isReminder).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPreviousDay}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-medium">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onNextDay}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Input 
              placeholder="Search tasks & reminders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button 
              size="sm" 
              className="ml-2 bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsReminderDialogOpen(true)}
            >
              <Bell className="h-4 w-4 mr-1" />
              Add Reminder
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Tabs 
              value={viewMode} 
              onValueChange={(value) => setViewMode(value as "all" | "tasks" | "reminders")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="all" className="text-xs">
                  All ({tasksCount + remindersCount})
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Tasks ({tasksCount})
                </TabsTrigger>
                <TabsTrigger value="reminders" className="text-xs">
                  <Bell className="h-3.5 w-3.5 mr-1" />
                  Reminders ({remindersCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {filterType === "all" ? "All Status" : filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>
                  All Status
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("scheduled")}>
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("in progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("completed")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("overdue")}>
                  Overdue
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  {sortOrder === "newest" ? (
                    <><ArrowDown className="h-4 w-4 mr-1" /> Newest</>
                  ) : (
                    <><ArrowUp className="h-4 w-4 mr-1" /> Oldest</>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                  <ArrowDown className="h-4 w-4 mr-2" /> Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                  <ArrowUp className="h-4 w-4 mr-2" /> Oldest First
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">
          {viewMode === "all" ? "Items" : viewMode === "tasks" ? "Tasks" : "Reminders"} ({filteredTasks.length})
        </h3>
        
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {viewMode === "all" 
              ? "No tasks or reminders scheduled for this day." 
              : viewMode === "tasks" 
                ? "No tasks scheduled for this day."
                : "No reminders scheduled for this day."
            }
          </p>
        ) : (
          <div className="space-y-4">
            {filteredTasks.map((task) => (
              task.isReminder ? (
                <ReminderCard 
                  key={task.id} 
                  reminder={task} 
                  onReminderUpdate={handleUpdateTask}
                />
              ) : (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onTaskUpdate={handleUpdateTask}
                  onCreateFollowUp={handleCreateFollowUp}
                />
              )
            ))}
          </div>
        )}
      </div>
      
      {/* Add Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reminder</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-title">Title</Label>
              <Input
                id="reminder-title"
                placeholder="Reminder title"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-time">Time</Label>
              <Input
                id="reminder-time"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminder-description">Description (Optional)</Label>
              <Textarea
                id="reminder-description"
                placeholder="Add details about this reminder"
                value={reminderDescription}
                onChange={(e) => setReminderDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateReminder}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Bell className="h-4 w-4 mr-2" />
              Create Reminder
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksView;
