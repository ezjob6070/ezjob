import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Job } from "@/types/job"; 
import { Task } from "@/components/calendar/types";
import JobCard from "@/components/calendar/components/JobCard";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface TaskAndScheduleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  jobs: Job[];
  tasks: Task[];
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const TaskAndScheduleSidebar = ({
  isOpen,
  onClose,
  jobs,
  tasks,
  onJobUpdate,
  onTaskUpdate,
  onCreateFollowUp
}: TaskAndScheduleSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedView, setSelectedView] = useState<"all" | "jobs" | "tasks" | "reminders">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  
  const [filteredItems, setFilteredItems] = useState<Array<Job | Task>>([]);
  
  // Filter and sort items when dependencies change
  useEffect(() => {
    // Get jobs for selected date
    const jobsForDate = jobs.filter(job => {
      const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
      return jobDate.toDateString() === selectedDate.toDateString();
    });
    
    // Get tasks for selected date
    const tasksForDate = tasks.filter(task => {
      const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      return taskDate.toDateString() === selectedDate.toDateString();
    });
    
    // Apply view filter
    let filtered: Array<Job | Task> = [];
    if (selectedView === "all") {
      filtered = [...jobsForDate, ...tasksForDate];
    } else if (selectedView === "jobs") {
      filtered = [...jobsForDate];
    } else if (selectedView === "tasks") {
      filtered = tasksForDate.filter(task => !task.isReminder);
    } else if (selectedView === "reminders") {
      filtered = tasksForDate.filter(task => task.isReminder);
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const title = 'title' in item ? item.title.toLowerCase() : '';
        const description = 'description' in item ? item.description?.toLowerCase() || '' : '';
        const clientName = 'client' in item ? item.client.name.toLowerCase() : 
                          'clientName' in item ? item.clientName?.toLowerCase() || '' : '';
        
        return (
          title.includes(searchQuery.toLowerCase()) ||
          description.includes(searchQuery.toLowerCase()) ||
          clientName.includes(searchQuery.toLowerCase())
        );
      });
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter(item => item.status === filterStatus);
    }
    
    // Apply priority filter
    if (filterPriority !== "all") {
      filtered = filtered.filter(item => item.priority === filterPriority);
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      const dateA = 'date' in a ? a.date instanceof Date ? a.date : new Date(a.date) : 
                  'dueDate' in a ? a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate as string) : new Date();
                  
      const dateB = 'date' in b ? b.date instanceof Date ? b.date : new Date(b.date) : 
                  'dueDate' in b ? b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate as string) : new Date();
                  
      return sortOrder === "newest" ? 
        dateB.getTime() - dateA.getTime() : 
        dateA.getTime() - dateB.getTime();
    });
    
    setFilteredItems(filtered);
  }, [jobs, tasks, selectedDate, selectedView, searchQuery, filterStatus, filterPriority, sortOrder]);
  
  if (!isOpen) return null;
  
  const jobsCount = jobs.filter(job => {
    const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
    return jobDate.toDateString() === selectedDate.toDateString();
  }).length;
  
  const tasksCount = tasks.filter(task => {
    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return taskDate.toDateString() === selectedDate.toDateString() && !task.isReminder;
  }).length;
  
  const remindersCount = tasks.filter(task => {
    const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
    return taskDate.toDateString() === selectedDate.toDateString() && task.isReminder;
  }).length;

  return (
    <aside className="fixed top-0 right-0 z-30 h-screen w-80 flex flex-col bg-card text-card-foreground border-l border-border transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="py-4 px-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Tasks &amp; Schedule
        </h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>
      
      {/* Calendar */}
      <div className="p-4 border-b">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="w-full"
        />
      </div>
      
      {/* Filters */}
      <div className="p-4 space-y-3 border-b">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
          prefix={<Search className="h-4 w-4" />}
        />
        
        <Tabs 
          value={selectedView} 
          onValueChange={(value) => setSelectedView(value as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all" className="text-xs">
              All ({jobsCount + tasksCount + remindersCount})
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs">
              Jobs ({jobsCount})
            </TabsTrigger>
            <TabsTrigger value="tasks" className="text-xs">
              Tasks ({tasksCount})
            </TabsTrigger>
            <TabsTrigger value="reminders" className="text-xs">
              Reminders ({remindersCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                {filterStatus === "all" ? "All Status" : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                All Status
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("scheduled")}>
                Scheduled
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("in-progress")}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>
                Cancelled
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              {filterPriority === "all" ? "All Priorities" : filterPriority.charAt(0).toUpperCase() + filterPriority.slice(1) + " Priority"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterPriority("all")}>
              All Priorities
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setFilterPriority("low")}>
              Low Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
              Medium Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPriority("high")}>
              High Priority
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterPriority("urgent")}>
              Urgent Priority
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Items List */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="font-medium mb-3">
          {format(selectedDate, "MMMM d, yyyy")} • {filteredItems.length} items
        </h3>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No items scheduled for this day.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              // Check if item is a Job
              if ('clientName' in item) {
                return (
                  <JobCard 
                    key={`job-${item.id}`} 
                    job={item as Job} 
                    onJobUpdate={onJobUpdate}
                  />
                );
              } 
              // Check if item is a Reminder
              else if ('isReminder' in item && item.isReminder) {
                return (
                  <ReminderCard 
                    key={`reminder-${item.id}`} 
                    reminder={item as Task} 
                    onReminderUpdate={onTaskUpdate}
                  />
                );
              } 
              // Otherwise it's a Task
              else {
                return (
                  <TaskCard 
                    key={`task-${item.id}`} 
                    task={item as Task} 
                    onTaskUpdate={onTaskUpdate}
                    onCreateFollowUp={onCreateFollowUp ? () => onCreateFollowUp(item as Task) : undefined}
                  />
                );
              }
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default TaskAndScheduleSidebar;
