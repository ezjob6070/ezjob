
import { useState, useEffect } from "react";
import { isSameDay, addMonths, subMonths, format } from "date-fns";
import { Calendar as CalendarIcon, List, CheckSquare, LayoutGrid, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { Task } from "@/components/calendar/types";
import { Job } from "@/types/job";
import { cn } from "@/lib/utils";

// Components
import SidebarHeader from "@/components/calendar/components/SidebarHeader";
import CalendarWidget from "@/components/calendar/components/CalendarWidget";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import JobCard from "@/components/calendar/components/JobCard";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface UnifiedSidebarProps {
  jobs: Job[];
  tasks: Task[];
  isOpen: boolean;
  onClose?: () => void;
  onJobUpdate?: (jobId: string, updates: Partial<Job>) => void;
  onTaskUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onCreateFollowUp?: (task: Task) => void;
}

const UnifiedSidebar = ({ 
  jobs, 
  tasks, 
  isOpen, 
  onClose,
  onJobUpdate,
  onTaskUpdate,
  onCreateFollowUp
}: UnifiedSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "jobs" | "tasks">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  useEffect(() => {
    // Filter jobs for the selected date
    const filteredJobs = jobs.filter(job => {
      if (!job.date) return false;
      const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
      return isSameDay(jobDate, selectedDate);
    });
    setJobsForSelectedDate(filteredJobs);
    
    // Filter tasks for the selected date
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
    setTasksForSelectedDate(filteredTasks);
  }, [selectedDate, jobs, tasks]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const filterItems = () => {
    let filteredJobs: Job[] = [...jobsForSelectedDate];
    let filteredTasks: Task[] = [...tasksForSelectedDate];
    
    // Apply search filter
    if (searchQuery) {
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.description && job.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.clientName && job.clientName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      filteredTasks = filteredTasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        task.client.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply priority filter
    if (filterPriority !== "all") {
      filteredJobs = filteredJobs.filter(job => job.priority === filterPriority);
      filteredTasks = filteredTasks.filter(task => task.priority === filterPriority);
    }
    
    // Apply status filter
    if (filterStatus !== "all") {
      filteredJobs = filteredJobs.filter(job => job.status === filterStatus);
      filteredTasks = filteredTasks.filter(task => task.status === filterStatus);
    }
    
    // Apply sort
    const sortItems = (a: any, b: any) => {
      const dateA = new Date(a.date || a.dueDate);
      const dateB = new Date(b.date || b.dueDate);
      return sortOrder === "newest" 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    };
    
    filteredJobs.sort(sortItems);
    filteredTasks.sort(sortItems);
    
    return { filteredJobs, filteredTasks };
  };
  
  const { filteredJobs, filteredTasks } = filterItems();
  
  const jobsCount = jobsForSelectedDate.length;
  const tasksCount = tasksForSelectedDate.filter(t => !t.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(t => t.isReminder).length;
  const totalCount = jobsCount + tasksCount + remindersCount;

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 z-20 h-screen w-80 flex flex-col bg-card text-card-foreground border-l border-border shadow-lg transition-all duration-300 ease-in-out pt-16">
      <SidebarHeader 
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      
      <div className="flex-1 py-4 px-4 overflow-auto">
        <CalendarWidget 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          jobs={jobs}
          tasks={tasks}
          currentMonth={currentMonth}
        />
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">
              {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePreviousDay}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                size="icon" 
                onClick={handleNextDay}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Input 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
          />
          
          <div className="flex justify-between items-center mb-4">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "all" | "jobs" | "tasks")}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="all" className="text-xs">
                  All ({totalCount})
                </TabsTrigger>
                <TabsTrigger value="jobs" className="text-xs">
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  Jobs ({jobsCount})
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-xs">
                  <CheckSquare className="h-3.5 w-3.5 mr-1" />
                  Tasks ({tasksCount + remindersCount})
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="h-8 px-2"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {showFilters && (
            <div className="flex flex-col gap-2 mb-4 p-2 border rounded-md">
              <div className="grid grid-cols-2 gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      {filterPriority === "all" ? "Priority" : filterPriority}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setFilterPriority("all")}>
                      All Priorities
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                      High
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterPriority("urgent")}>
                      Urgent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full justify-between">
                      {filterStatus === "all" ? "Status" : filterStatus}
                      <ChevronDown className="h-4 w-4 ml-1" />
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
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full justify-between">
                    Sort: {sortOrder === "newest" ? "Newest First" : "Oldest First"}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOrder("newest")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("oldest")}>
                    Oldest First
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Content based on active tab */}
          <TabsContent value="all" className="mt-0 space-y-4">
            {filteredJobs.length === 0 && filteredTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No items scheduled for this day.</p>
            ) : (
              <>
                {filteredJobs.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                      <h3 className="font-medium">Jobs ({filteredJobs.length})</h3>
                    </div>
                    <div className="space-y-2">
                      {filteredJobs.map((job) => (
                        <JobCard 
                          key={job.id}
                          job={job}
                          onJobUpdate={onJobUpdate}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredTasks.filter(t => !t.isReminder).length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <CheckSquare className="h-4 w-4 mr-2 text-primary" />
                      <h3 className="font-medium">Tasks ({filteredTasks.filter(t => !t.isReminder).length})</h3>
                    </div>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => !t.isReminder).map((task) => (
                        <TaskCard 
                          key={task.id}
                          task={task}
                          onTaskUpdate={onTaskUpdate}
                          onCreateFollowUp={onCreateFollowUp}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredTasks.filter(t => t.isReminder).length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                      <h3 className="font-medium">Reminders ({filteredTasks.filter(t => t.isReminder).length})</h3>
                    </div>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => t.isReminder).map((reminder) => (
                        <ReminderCard 
                          key={reminder.id}
                          reminder={reminder}
                          onReminderUpdate={onTaskUpdate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="jobs" className="mt-0">
            {filteredJobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No jobs scheduled for this day.</p>
            ) : (
              <div className="space-y-2">
                {filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id}
                    job={job}
                    onJobUpdate={onJobUpdate}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            {filteredTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
            ) : (
              <div className="space-y-4">
                {filteredTasks.filter(t => !t.isReminder).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tasks ({filteredTasks.filter(t => !t.isReminder).length})</h3>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => !t.isReminder).map((task) => (
                        <TaskCard 
                          key={task.id}
                          task={task}
                          onTaskUpdate={onTaskUpdate}
                          onCreateFollowUp={onCreateFollowUp}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {filteredTasks.filter(t => t.isReminder).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Reminders ({filteredTasks.filter(t => t.isReminder).length})</h3>
                    <div className="space-y-2">
                      {filteredTasks.filter(t => t.isReminder).map((reminder) => (
                        <ReminderCard 
                          key={reminder.id}
                          reminder={reminder}
                          onReminderUpdate={onTaskUpdate}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </aside>
  );
};

export default UnifiedSidebar;
