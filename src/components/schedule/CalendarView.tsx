
import { useState } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfDay, 
  endOfDay,
  eachDayOfInterval, 
  format, 
  isSameDay, 
  isSameMonth, 
  addMonths,
  subMonths,
  isToday,
  addDays,
  startOfWeek,
  endOfWeek,
  getDay,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Task as TaskIcon } from "lucide-react";
import { Task } from "@/components/calendar/types";
import { Job } from "@/types/project";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { Button } from "@/components/ui/button";
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  selectedDate: Date;
  updateSelectedDateItems: (date: Date) => void;
  jobs: Job[];
  tasks: Task[];
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  viewMode: CalendarViewMode;
}

const CalendarView = ({
  selectedDate,
  updateSelectedDateItems,
  jobs,
  tasks,
  jobsForSelectedDate,
  tasksForSelectedDate,
  viewMode,
}: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const dayHasItems = (day: Date) => {
    // Check if day has tasks or jobs
    const hasJobs = jobs.some((job) => {
      const jobDate = typeof job.date === 'string' ? new Date(job.date) : job.date;
      return isSameDay(jobDate, day);
    });

    const hasTasks = tasks.some((task) => isSameDay(task.dueDate, day));

    return hasJobs || hasTasks;
  };

  const getItemsCountForDay = (day: Date) => {
    // Count jobs and tasks for a specific day
    const jobsCount = jobs.filter((job) => {
      const jobDate = typeof job.date === 'string' ? new Date(job.date) : job.date;
      return isSameDay(jobDate, day);
    }).length;

    const tasksCount = tasks.filter((task) => isSameDay(task.dueDate, day)).length;

    return jobsCount + tasksCount;
  };

  const handlePrevious = () => {
    switch (viewMode) {
      case "day":
        updateSelectedDateItems(addDays(selectedDate, -1));
        break;
      case "week":
        updateSelectedDateItems(addDays(selectedDate, -7));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate()));
        break;
    }
  };

  const handleNext = () => {
    switch (viewMode) {
      case "day":
        updateSelectedDateItems(addDays(selectedDate, 1));
        break;
      case "week":
        updateSelectedDateItems(addDays(selectedDate, 7));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "year":
        setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate()));
        break;
    }
  };

  const handleSelectToday = () => {
    updateSelectedDateItems(new Date());
    setCurrentDate(new Date());
  };

  const renderMonthCalendar = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    
    // Get the start of the week for the first day of the month
    const startDate = startOfWeek(firstDayOfMonth);
    // Get the end of the week for the last day of the month
    const endDate = endOfWeek(lastDayOfMonth);
    
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleDayClick = (day: Date) => {
      updateSelectedDateItems(day);
      setCurrentDate(day);
    };

    return (
      <div>
        <div className="grid grid-cols-7 mb-1">
          {weekDays.map((day) => (
            <div key={day} className="text-center py-1 text-xs font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isDifferentMonth = !isSameMonth(day, currentDate);
            const today = isToday(day);
            const hasItems = dayHasItems(day);
            const itemsCount = getItemsCountForDay(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "h-12 flex flex-col items-center justify-center rounded-md relative",
                  isSelected && "bg-blue-100 text-blue-600 font-semibold",
                  isDifferentMonth && !isSelected && "text-gray-300",
                  !isSelected && today && "bg-blue-50 text-blue-500",
                  !isSelected && !today && !isDifferentMonth && "hover:bg-gray-100"
                )}
              >
                <span className={cn(
                  "text-xs",
                  isSelected && "font-semibold"
                )}>
                  {format(day, "d")}
                </span>
                
                {hasItems && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-blue-500" />
                )}
                
                {itemsCount > 0 && (
                  <span className="absolute top-1 right-1 text-[9px] p-[2px] leading-none font-semibold">
                    {itemsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCalendarHeader = () => {
    let dateRangeText = "";
    
    switch (viewMode) {
      case "day":
        dateRangeText = format(selectedDate, "MMMM d, yyyy");
        break;
      case "week": {
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        dateRangeText = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
        break;
      }
      case "month":
        dateRangeText = format(currentDate, "MMMM yyyy");
        break;
      case "year":
        dateRangeText = format(currentDate, "yyyy");
        break;
    }

    return (
      <div className="flex items-center justify-between px-2 py-4">
        <h2 className="text-xl font-semibold">{dateRangeText}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleSelectToday}>Today</Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full">
      {/* Calendar View */}
      <div className="flex-1 p-4 bg-white rounded-lg border shadow-sm">
        {renderCalendarHeader()}
        <div>
          {renderMonthCalendar()}
        </div>
      </div>

      {/* Side Panel for Tasks & Events */}
      {sidebarVisible && (
        <div className="w-[300px] ml-4 p-4 border rounded-lg shadow-sm bg-white overflow-auto flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm">{format(selectedDate, "MMMM d, yyyy")}</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={() => setSidebarVisible(false)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {tasksForSelectedDate.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <TaskIcon className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              No tasks scheduled
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-gray-500 mb-1">TASKS & REMINDERS</h4>
              {tasksForSelectedDate.map(task => (
                <div key={task.id} className="text-sm">
                  {task.isReminder ? (
                    <ReminderCard 
                      reminder={task} 
                      onReminderUpdate={() => {}} 
                    />
                  ) : (
                    <TaskCard 
                      task={task} 
                      onTaskUpdate={() => {}} 
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!sidebarVisible && (
        <Button
          variant="outline"
          size="sm"
          className="ml-2 h-8 w-8 p-0"
          onClick={() => setSidebarVisible(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CalendarView;
