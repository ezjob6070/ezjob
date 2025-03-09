
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { isSameDay } from "date-fns";
import JobsList from "@/components/calendar/components/JobsList";
import { Task } from "@/components/calendar/types";
import { mockTasks } from "@/components/calendar/data/mockTasks";
import CalendarView from "@/components/schedule/CalendarView";
import TasksView from "@/components/schedule/TasksView";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const Schedule = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);

  const updateSelectedDateItems = (date: Date) => {
    const filteredJobs = jobs.filter(job => isSameDay(job.date, date));
    setJobsForSelectedDate(filteredJobs);
    
    const filteredTasks = tasks.filter(task => isSameDay(task.dueDate, date));
    setTasksForSelectedDate(filteredTasks);
    
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

  // Use useEffect instead of useState for initial loading
  useEffect(() => {
    updateSelectedDateItems(selectedDate);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Schedule</h1>
          <p className="text-muted-foreground">
            Manage your appointments, jobs, and tasks in one place.
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <CalendarIcon className="h-4 w-4" />
          Show Calendar
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView 
            jobs={jobs}
            tasks={tasks}
            selectedDate={selectedDate}
            jobsForSelectedDate={jobsForSelectedDate}
            tasksForSelectedDate={tasksForSelectedDate}
            updateSelectedDateItems={updateSelectedDateItems}
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
