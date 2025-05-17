import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, 
  addDays, startOfMonth, endOfMonth, addMonths, subMonths
} from "date-fns";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Job } from "@/components/jobs/JobTypes";
import { Task } from "@/components/calendar/types";
import UpcomingEvents from "@/components/UpcomingEvents";
import { CalendarViewMode } from "./CalendarViewOptions";
import { useState } from "react";
import { 
  ensureValidDate, 
  JobEvent, 
  TaskEvent 
} from "./calendar/CalendarEventUtils";
import CalendarHeader from "./calendar/CalendarHeader";
import CalendarDayView from "./calendar/CalendarDayView";
import CalendarWeekView from "./calendar/CalendarWeekView";
import CalendarMonthView from "./calendar/CalendarMonthView";
import CalendarSidebar from "./calendar/CalendarSidebar";

interface CalendarViewProps {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
  viewMode,
  onViewChange,
}: CalendarViewProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  // Process jobs and tasks to create upcoming events with validated dates
  
  const jobEvents = jobs
    .map(job => {
      const datetime = ensureValidDate(job.date);
      if (!datetime || !job.clientName) return null;
      
      return {
        id: job.id,
        title: job.title || "Unnamed Job",
        datetime,
        type: "meeting" as const,
        clientName: job.clientName,
      };
    })
    .filter((event): event is JobEvent => event !== null);

  const taskEvents = tasks
    .map(task => {
      const datetime = ensureValidDate(task.dueDate);
      if (!datetime || !task.client?.name) return null;
      
      return {
        id: task.id,
        title: task.title,
        datetime,
        type: "deadline" as const,
        clientName: task.client.name,
      };
    })
    .filter((event): event is TaskEvent => event !== null);

  // Combine events and ensure they all have valid datetime objects before sorting
  const upcomingEvents = [...jobEvents, ...taskEvents]
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime())
    .slice(0, 5);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      updateSelectedDateItems(date);
    }
  };

  // Get events for the current view based on viewMode
  const getEventsForCurrentView = () => {
    switch (viewMode) {
      case 'day':
        return { jobs: jobsForSelectedDate, tasks: tasksForSelectedDate };
      case 'week': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        const weekJobs = jobs.filter(job => {
          const jobDate = ensureValidDate(job.date);
          return jobDate && weekDays.some(day => isSameDay(jobDate, day));
        });
        
        const weekTasks = tasks.filter(task => 
          weekDays.some(day => isSameDay(task.dueDate, day))
        );
        
        return { jobs: weekJobs, tasks: weekTasks };
      }
      case 'month': {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        
        const monthJobs = jobs.filter(job => {
          const jobDate = ensureValidDate(job.date);
          return jobDate && monthDays.some(day => isSameDay(jobDate, day));
        });
        
        const monthTasks = tasks.filter(task => 
          monthDays.some(day => isSameDay(task.dueDate, day))
        );
        
        return { jobs: monthJobs, tasks: monthTasks };
      }
      default:
        return { jobs: jobsForSelectedDate, tasks: tasksForSelectedDate };
    }
  };

  const currentViewEvents = getEventsForCurrentView();

  const handlePrevPeriod = () => {
    switch (viewMode) {
      case 'day':
        updateSelectedDateItems(addDays(selectedDate, -1));
        break;
      case 'week':
        updateSelectedDateItems(addDays(selectedDate, -7));
        break;
      case 'month':
        setCurrentMonth(subMonths(currentMonth, 1));
        updateSelectedDateItems(subMonths(selectedDate, 1));
        break;
      default:
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (viewMode) {
      case 'day':
        updateSelectedDateItems(addDays(selectedDate, 1));
        break;
      case 'week':
        updateSelectedDateItems(addDays(selectedDate, 7));
        break;
      case 'month':
        setCurrentMonth(addMonths(currentMonth, 1));
        updateSelectedDateItems(addMonths(selectedDate, 1));
        break;
      default:
        break;
    }
  };

  // Render different calendar views based on viewMode
  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return <CalendarDayView 
                 selectedDate={selectedDate} 
                 jobs={currentViewEvents.jobs} 
                 tasks={currentViewEvents.tasks} 
               />;
      case 'week':
        return <CalendarWeekView 
                 selectedDate={selectedDate} 
                 jobs={currentViewEvents.jobs} 
                 tasks={currentViewEvents.tasks}
                 updateSelectedDateItems={updateSelectedDateItems}
               />;
      case 'month':
        return <CalendarMonthView 
                 selectedDate={selectedDate}
                 currentMonth={currentMonth}
                 setCurrentMonth={setCurrentMonth}
                 handleDateSelect={handleDateSelect}
                 jobs={jobs}
                 tasks={tasks}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Calendar header without card wrapper */}
      <div>
        <CalendarHeader 
          selectedDate={selectedDate}
          viewMode={viewMode}
          onViewChange={onViewChange}
          onPrevPeriod={handlePrevPeriod}
          onNextPeriod={handleNextPeriod}
        />
        
        <div className="pb-8">
          {renderCalendarView()}
        </div>
      </div>
      
      {/* Upcoming events section */}
      <UpcomingEvents events={upcomingEvents} />
    </div>
  );
};

export default CalendarView;
