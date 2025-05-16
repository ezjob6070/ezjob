import { format } from "date-fns";
import { Calendar, Bell, Search, Filter, SortAsc, SortDesc, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { useState } from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "a-z" | "z-a">("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"all" | "tasks" | "reminders">("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

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

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === dateFilter.toDateString();
      });
    }

    // Apply sort order
    filtered.sort((a, b) => {
      if (sortOrder === "a-z") {
        return a.title.localeCompare(b.title);
      } else if (sortOrder === "z-a") {
        return b.title.localeCompare(a.title);
      }
      
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

  const clearDateFilter = () => {
    setDateFilter(undefined);
    toast.success("Date filter cleared");
  };

  const filteredTasks = filterTasks();
  const tasksCount = tasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(task => task.isReminder).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPreviousDay}>Previous</Button>
          <Button variant="outline" size="sm" onClick={onNextDay}>Next</Button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex flex-col gap-3">
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
          
          {/* Search and filter bar in a single row */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks & reminders..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-xs"
              />
            </div>
            
            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup value={filterType} onValueChange={setFilterType}>
                  <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="scheduled">Scheduled</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="in progress">In Progress</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="overdue">Overdue</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Order */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  {sortOrder === "newest" || sortOrder === "oldest" ? (
                    sortOrder === "newest" ? (
                      <SortDesc className="h-3.5 w-3.5" />
                    ) : (
                      <SortAsc className="h-3.5 w-3.5" />
                    )
                  ) : (
                    sortOrder === "a-z" ? (
                      <span className="text-xs font-bold">A→Z</span>
                    ) : (
                      <span className="text-xs font-bold">Z→A</span>
                    )
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuRadioGroup 
                  value={sortOrder} 
                  onValueChange={(value) => setSortOrder(value as "newest" | "oldest" | "a-z" | "z-a")}
                >
                  <DropdownMenuRadioItem value="newest">
                    <SortDesc className="h-3.5 w-3.5 mr-2" /> Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">
                    <SortAsc className="h-3.5 w-3.5 mr-2" /> Oldest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="a-z">A to Z</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="z-a">Z to A</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {dateFilter ? format(dateFilter, "MMM d") : "Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                {dateFilter && (
                  <div className="p-3 border-t border-border flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearDateFilter}
                      className="text-xs"
                    >
                      Clear Filter
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
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
    </div>
  );
};

export default TasksView;
