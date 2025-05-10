
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/components/jobs/JobTypes";
import { isSameDay } from "date-fns";
import JobsList from "@/components/calendar/components/JobsList";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import CalendarView from "@/components/schedule/CalendarView";
import TasksView from "@/components/schedule/TasksView";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import CompactFilterBar from "@/components/schedule/CompactFilterBar";
import { useGlobalState } from "@/components/providers/GlobalStateProvider";
import CalendarViewOptions, { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";

const Schedule = () => {
  const { jobs: globalJobs } = useGlobalState();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState("calendar");
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

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
    
    const filteredTasks = tasks.filter(task => isSameDay(task.dueDate, selectedDate));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your appointments, jobs, and tasks in one place.
          </p>
        </div>
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
          />
        </TabsContent>
        
        <TabsContent value="tasks">
          <TasksView 
            selectedDate={selectedDate}
            tasksForSelectedDate={tasksForSelectedDate}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Schedule;
