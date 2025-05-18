
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar, ArrowDown, ArrowUp, Bell, Plus, Search, ArrowDownAZ, CalendarDays, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
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

  const filteredTasks = filterTasks(tasksForSelectedDate, viewMode, searchQuery, filterType, sortOrder);
  const tasksCount = tasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(task => task.isReminder).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-md border shadow-sm">
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
      
      <div className="bg-white rounded-md border shadow-sm mb-4">
        <div className="p-3">
          <Tabs 
            value={viewMode} 
            onValueChange={(value) => setViewMode(value as "all" | "tasks" | "reminders")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full bg-slate-100">
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
          
          <div className="mt-3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks & reminders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-24"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                title="Sort A-Z"
                onClick={() => setSortOrder("newest")}
              >
                <ArrowDownAZ className={`h-4 w-4 ${sortOrder === 'newest' ? 'text-blue-600' : 'text-muted-foreground'}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                title="Sort by Date"
                onClick={() => setSortOrder("oldest")}
              >
                <CalendarDays className={`h-4 w-4 ${sortOrder === 'oldest' ? 'text-blue-600' : 'text-muted-foreground'}`} />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 w-7 p-0" 
                title="Filter Options"
                onClick={() => {}}
              >
                <Filter className={`h-4 w-4 text-muted-foreground`} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1 bg-slate-50">
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
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-md border shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">
            {viewMode === "all" ? "Tasks & Reminders" : viewMode === "tasks" ? "Tasks" : "Reminders"} ({filteredTasks.length})
          </h3>
          
          {onTasksChange && (
            <Button 
              variant="outline" 
              size="sm"
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleCreateReminder}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Reminder
            </Button>
          )}
        </div>
        
        {filteredTasks.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-md">
            <p className="text-sm text-muted-foreground">
              {viewMode === "all" 
                ? "No tasks or reminders scheduled for this day." 
                : viewMode === "tasks" 
                  ? "No tasks scheduled for this day."
                  : "No reminders scheduled for this day."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
