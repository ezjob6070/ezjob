
import { useState, useEffect } from "react";
import { isSameDay, addMonths, subMonths } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import { Task } from "./types";
import { mockTasks } from "./data/mockTasks";
import SidebarHeader from "./components/SidebarHeader";
import CalendarWidget from "./components/CalendarWidget";
import DaySummary from "./components/DaySummary";

interface LeftCalendarSidebarProps {
  isOpen: boolean;
}

const LeftCalendarSidebar = ({ isOpen }: LeftCalendarSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState<Task[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  useEffect(() => {
    const filteredJobs = jobs.filter(job => 
      isSameDay(job.date, selectedDate)
    );
    setJobsForSelectedDate(filteredJobs);
    
    const filteredTasks = tasks.filter(task => 
      isSameDay(task.dueDate, selectedDate)
    );
    setTasksForSelectedDate(filteredTasks);
  }, [selectedDate, jobs, tasks]);

  const handlePrevMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  // Added console log to debug visibility
  console.log("LeftCalendarSidebar isOpen:", isOpen);

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-80 flex flex-col bg-card text-card-foreground border-r border-border shadow-lg transition-all duration-300 ease-in-out pt-16"> {/* Added pt-16 to account for the fixed header */}
      <SidebarHeader 
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />
      <div className="flex-1 py-6 px-4 overflow-auto">
        <CalendarWidget 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          jobs={jobs}
          tasks={tasks}
          currentMonth={currentMonth}
        />
        <DaySummary 
          selectedDate={selectedDate}
          jobsForSelectedDate={jobsForSelectedDate}
          tasksForSelectedDate={tasksForSelectedDate}
          onPreviousDay={() => {
            const prevDay = new Date(selectedDate);
            prevDay.setDate(prevDay.getDate() - 1);
            setSelectedDate(prevDay);
          }}
          onNextDay={() => {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            setSelectedDate(nextDay);
          }}
        />
      </div>
    </aside>
  );
};

export default LeftCalendarSidebar;
