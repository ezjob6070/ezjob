
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, ArrowDown, ArrowUp, Bell, Plus } from "lucide-react";
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
import { filterTasks, createReminder, createFollowUp } from "../schedule/tasks/TasksUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (!onTasksChange) return;
    
    const updatedTasks = tasksForSelectedDate.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    onTasksChange(updatedTasks);
  };

  const handleCreateReminder = () => {
    if (!onTasksChange) return;
    const newReminder = createReminder(selectedDate, tasksForSelectedDate);
    onTasksChange([...tasksForSelectedDate, newReminder]);
  };

  const handleCreateFollowUp = (task: Task) => {
    if (!onTasksChange) return;
    
    // Create a follow-up task
    const followUpTask = createFollowUp(task);
    
    // Mark the original task as having a follow-up
    const updatedTasks = tasksForSelectedDate.map(t => 
      t.id === task.id ? { ...t, hasFollowUp: true, followUpDate: followUpTask.dueDate } : t
    );
    
    // Add the new follow-up task to the list
    onTasksChange([...updatedTasks, followUpTask]);
  };

  // Make sure tasks have the expected properties to avoid undefined errors
  const safeTasksForSelectedDate = tasksForSelectedDate.map(task => ({
    ...task,
    client: task.client || { name: "Unassigned" },
    progress: task.progress || 0,
    assignedTo: task.assignedTo || "",
    createdAt: task.createdAt || new Date().toISOString()
  }));

  const filteredTasks = filterTasks(safeTasksForSelectedDate, viewMode, searchQuery, filterType, sortOrder);
  const tasksCount = safeTasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = safeTasksForSelectedDate.filter(task => task.isReminder).length;

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
          <div className="flex gap-2">
            <Input 
              placeholder="Search tasks & reminders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            {onTasksChange && (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleCreateReminder}
                  title="Add Reminder"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            )}
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
                <TabsTrigger value="tasks" className="text-xs flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-[#1EAEDB]" />
                  Tasks ({tasksCount})
                </TabsTrigger>
                <TabsTrigger value="reminders" className="text-xs flex items-center">
                  <Bell className="h-3.5 w-3.5 mr-1 text-[#1EAEDB]" />
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
          {viewMode === "all" ? "Tasks & Reminders" : viewMode === "tasks" ? "Tasks" : "Reminders"} ({filteredTasks.length})
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
    </div>
  );
};

export default TasksView;
