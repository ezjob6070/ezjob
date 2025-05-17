
import { useState, useEffect } from "react";
import { isSameDay } from "date-fns";
import { Job } from "@/components/jobs/JobTypes";
import { initialJobs } from "@/data/jobs";
import RightSidebarHeader from "./components/RightSidebarHeader";
import RightCalendarWidget from "./components/RightCalendarWidget";
import JobsList from "./components/JobsList";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { JobType } from "@/types/jobs";

interface CalendarSidebarProps {
  isOpen: boolean;
}

const CalendarSidebar = ({ isOpen }: CalendarSidebarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // Convert JobType[] to Job[] by mapping and ensuring required properties are set
  const convertedJobs: Job[] = initialJobs.map(job => ({
    ...job,
    amount: job.amount || 0,
    date: job.date || new Date(),
    status: job.status === "canceled" ? "cancelled" as Job["status"] : job.status as any
  }));
  const [jobs, setJobs] = useState<Job[]>(convertedJobs);
  const [jobsForSelectedDate, setJobsForSelectedDate] = useState<Job[]>([]);
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");

  useEffect(() => {
    const filtered = jobs.filter(job => 
      isSameDay(new Date(job.date), selectedDate)
    );
    setJobsForSelectedDate(filtered);
  }, [selectedDate, jobs]);

  if (!isOpen) return null;

  return (
    <aside className="fixed top-0 right-0 z-20 h-screen w-80 flex flex-col bg-card text-card-foreground border-l border-border shadow-lg transition-all duration-300 ease-in-out">
      <RightSidebarHeader />
      <div className="flex-1 py-6 px-4 overflow-auto">
        <div className="w-full min-w-[240px] overflow-x-auto">
          <RightCalendarWidget 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate} 
            jobs={jobs}
            viewMode={viewMode}
            onViewChange={setViewMode}
          />
        </div>
        <JobsList 
          selectedDate={selectedDate}
          jobsForSelectedDate={jobsForSelectedDate}
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
          allJobs={jobs}
        />
      </div>
    </aside>
  );
};

export default CalendarSidebar;
