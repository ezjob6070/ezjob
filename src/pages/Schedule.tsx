
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/types/job";
import { isSameDay } from "date-fns";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import CalendarView from "@/components/schedule/CalendarView";
import TasksView from "@/components/schedule/TasksView";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ListFilter } from "lucide-react";
import CompactFilterBar from "@/components/schedule/CompactFilterBar";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import CalendarViewOptions, { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import TaskAndScheduleSidebar from "@/components/schedule/TaskAndScheduleSidebar";
import { toast } from "sonner";
import JobsList from "@/components/calendar/components/JobsList";

const Schedule = () => {
  const { jobs: globalJobs } = useGlobalState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [showSidebar, setShowSidebar] = useState(true);

  // Sync with global jobs
  useEffect(() => {
    setJobs(globalJobs);
  }, [globalJobs]);

  // Update jobs for selected date whenever jobs or date changes
  useEffect(() => {
    const filteredJobs = jobs.filter(job => {
      if (!job.date) return false;
      const jobDate = job.date instanceof Date ? job.date : new Date(job.date);
      return isSameDay(jobDate, selectedDate);
    });
    setJobsForSelectedDate(filteredJobs);
    
    const filteredTasks = tasks.filter(task => {
      const taskDate = task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate);
      return isSameDay(taskDate, selectedDate);
    });
    setTasksForSelectedDate(filteredTasks);
  }, [jobs, tasks, selectedDate]);

  const updateSelectedDateItems = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    updateSelectedDateItems(prevDay);
  };

  const handleNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    updateSelectedDateItems(nextDay);
  };

  const handleViewChange = (newView: CalendarViewMode) => {
    setViewMode(newView);
    // If switching to calendar view from another tab
    if (activeTab !== "calendar") {
      setActiveTab("calendar");
    }
  };

  const handleJobUpdate = (jobId: string, updates: Partial<Job>) => {
    const updatedJobs = jobs.map(job => 
      job.id === jobId ? { ...job, ...updates } : job
    );
    setJobs(updatedJobs);
    toast.success("Job updated successfully");
  };

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    toast.success("Task updated successfully");
  };

  const handleCreateFollowUp = (task: Task) => {
    // Create a follow-up task
    const followUpDate = new Date();
    followUpDate.setDate(followUpDate.getDate() + 1);
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `Follow up: ${task.title}`,
      dueDate: followUpDate,
      status: "scheduled",
      client: task.client,
      priority: task.priority,
      description: `Follow up for: ${task.title}`,
      hasFollowUp: false,
      parentTaskId: task.id
    };
    
    setTasks(prev => [...prev, newTask]);
    
    // Mark the original task as having a follow-up
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, hasFollowUp: true } : t
    );
    setTasks(updatedTasks);
    
    toast.success("Follow-up task created");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your appointments, jobs, and tasks in one place.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 h-9"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            <ListFilter className="h-4 w-4" />
            {showSidebar ? "Hide Sidebar" : "Show Sidebar"}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 h-9"
            onClick={() => setActiveTab("calendar")}
          >
            <CalendarIcon className="h-4 w-4" />
            Show Calendar
          </Button>
        </div>
      </div>

      <CalendarViewOptions 
        currentView={viewMode} 
        onViewChange={handleViewChange} 
      />

      <Tabs 
        defaultValue="calendar" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        {(activeTab === "jobs" || activeTab === "tasks") && (
          <CompactFilterBar 
            jobs={jobs} 
            tasks={tasks} 
            selectedTabValue={activeTab} 
          />
        )}
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView 
            jobs={jobs}
            tasks={tasks}
            selectedDate={selectedDate}
            jobsForSelectedDate={jobsForSelectedDate}
            tasksForSelectedDate={tasksForSelectedDate}
            updateSelectedDateItems={updateSelectedDateItems}
            viewMode={viewMode}
          />
        </TabsContent>
        
        <TabsContent value="jobs">
          <JobsList 
            selectedDate={selectedDate}
            jobsForSelectedDate={jobsForSelectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            allJobs={jobs}
            onJobUpdate={handleJobUpdate}
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksView 
            selectedDate={selectedDate}
            tasksForSelectedDate={tasksForSelectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
            onTaskUpdate={handleTaskUpdate}
            onTasksChange={setTasks}
          />
        </TabsContent>
      </Tabs>
      
      {/* Tasks & Schedule Sidebar */}
      <TaskAndScheduleSidebar
        jobs={jobs}
        tasks={tasks}
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        onJobUpdate={handleJobUpdate}
        onTaskUpdate={handleTaskUpdate}
        onCreateFollowUp={handleCreateFollowUp}
      />
    </div>
  );
};

export default Schedule;
