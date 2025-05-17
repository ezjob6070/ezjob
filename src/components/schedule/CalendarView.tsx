import React, { useState } from 'react';
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval,
  addDays, startOfMonth, endOfMonth, isToday, getDay
} from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Eye } from "lucide-react";
import { Job } from '@/types/job';
import { Task } from '@/components/calendar/types';
import { Badge } from '@/components/ui/badge';
import { CalendarViewMode } from './CalendarViewOptions';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import DayDetailDialog from './DayDetailDialog';

type CalendarViewProps = {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
};

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
  viewMode,
  onViewChange,
}) => {
  const [dayDetailOpen, setDayDetailOpen] = useState(false);
  
  // Generate week dates for week view
  const weekDates = React.useMemo(() => {
    const start = startOfWeek(selectedDate);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [selectedDate]);

  const getJobsForDate = (date: Date) => {
    return jobs.filter(job => {
      if (!job.date) return false;
      const jobDate = job.date instanceof Date ? job.date : new Date(job.date as string);
      return isSameDay(jobDate, date);
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => {
      return isSameDay(task.dueDate, date);
    });
  };

  const renderDayView = () => {
    const dayJobs = jobsForSelectedDate;
    const dayTasks = tasksForSelectedDate;
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
            {isToday(selectedDate) && (
              <Badge className="ml-2 bg-blue-50 text-blue-800">Today</Badge>
            )}
          </h3>
        </div>
        
        <div className="border rounded-md overflow-hidden bg-white shadow-sm">
          <div className="min-h-[600px] flex flex-col">
            {/* Time slots */}
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-12 border-b last:border-b-0">
                <div className="col-span-1 py-2 px-2 text-xs text-muted-foreground border-r">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                </div>
                <div className="col-span-11 py-2 min-h-[60px]">
                  {/* Events could be rendered here based on their start time */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="space-y-4 overflow-x-auto">
        <div className="grid grid-cols-8 text-center border-b bg-white">
          <div className="py-3 text-xs text-muted-foreground"></div>
          {weekDates.map((date, i) => (
            <div 
              key={i}
              className={cn(
                "py-3 cursor-pointer",
                isSameDay(date, selectedDate) && "bg-primary/10 font-bold",
                isToday(date) && "text-primary"
              )}
              onClick={() => updateSelectedDateItems(date)}
            >
              <p className="text-xs text-muted-foreground">{format(date, 'EEE')}</p>
              <p>{format(date, 'd')}</p>
            </div>
          ))}
        </div>
        
        <div className="min-h-[600px] border rounded-md overflow-hidden bg-white shadow-sm">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="py-2 px-2 text-xs text-muted-foreground border-r">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              {weekDates.map((date, i) => (
                <div 
                  key={i}
                  className={cn(
                    "py-2 min-h-[40px]",
                    isSameDay(date, selectedDate) && "bg-primary/5"
                  )}
                  onClick={() => updateSelectedDateItems(date)}
                >
                  {/* Events could be rendered here based on their start time */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleViewDay = (date: Date) => {
    updateSelectedDateItems(date);
    setDayDetailOpen(true);
  };

  const renderMonthView = () => {
    const handleSelectDate = (newDate: Date | undefined) => {
      if (newDate) {
        updateSelectedDateItems(newDate);
      }
    };

    return (
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelectDate}
        className="rounded-xl border-0 w-full max-w-none bg-transparent shadow-none"
        components={{
          Day: ({ date, ...props }) => {
            const dayJobs = getJobsForDate(date);
            const dayTasks = getTasksForDate(date);
            
            const hasJobs = dayJobs.length > 0;
            const hasTasks = dayTasks.length > 0;
            const hasReminders = dayTasks.filter(task => task.isReminder).length > 0;
            
            return (
              <div 
                className={cn(
                  props.className,
                  "relative h-16 w-full p-0 font-normal aria-selected:opacity-100 border border-gray-100 rounded-lg hover:bg-gray-50/70 transition-colors"
                )}
              >
                <div className="absolute inset-0 flex flex-col h-full w-full p-1">
                  <div className={cn(
                    "flex justify-center items-center h-6 w-6 rounded-full",
                    isSameDay(date, selectedDate) && "bg-blue-600 text-white",
                    isToday(date) && !isSameDay(date, selectedDate) && "border-2 border-blue-500"
                  )}>
                    {format(date, 'd')}
                  </div>
                  
                  <div className="flex justify-start gap-1 mt-1 overflow-hidden flex-wrap">
                    {hasJobs && (
                      <div className="text-[0.65rem] px-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-sm truncate">
                        {dayJobs.length} {dayJobs.length === 1 ? 'job' : 'jobs'}
                      </div>
                    )}
                    {hasTasks && !hasReminders && (
                      <div className="text-[0.65rem] px-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-sm truncate">
                        {dayTasks.filter(t => !t.isReminder).length} tasks
                      </div>
                    )}
                    {hasReminders && (
                      <div className="text-[0.65rem] px-1 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-sm truncate">
                        {dayTasks.filter(t => t.isReminder).length} reminders
                      </div>
                    )}
                  </div>
                  
                  {/* View button */}
                  <div className="flex justify-end mt-auto">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 p-0 px-1 text-[0.6rem] text-blue-600 hover:text-blue-700 hover:bg-blue-50/80"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDay(date);
                      }}
                    >
                      <Eye className="h-2.5 w-2.5 mr-0.5" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          }
        }}
      />
    );
  };

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return renderDayView();
      case 'week':
        return renderWeekView();
      case 'month':
      default:
        return renderMonthView();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium text-gray-800">Calendar</h2>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => {
              const newDate = viewMode === 'day' 
                ? addDays(selectedDate, -1) 
                : viewMode === 'week' 
                  ? addDays(selectedDate, -7)
                  : addDays(selectedDate, -30);
              updateSelectedDateItems(newDate);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-3 text-xs rounded-full border-gray-200 hover:bg-gray-50 text-gray-600 hover:text-gray-900"
            onClick={() => updateSelectedDateItems(new Date())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => {
              const newDate = viewMode === 'day' 
                ? addDays(selectedDate, 1) 
                : viewMode === 'week' 
                  ? addDays(selectedDate, 7)
                  : addDays(selectedDate, 30);
              updateSelectedDateItems(newDate);
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* View toggle inside calendar */}
      <div className="flex justify-center mb-4">
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && onViewChange(value as CalendarViewMode)} 
          className="bg-gray-50/80 border border-gray-200 rounded-full p-0.5 shadow-sm"
        >
          <ToggleGroupItem 
            value="day" 
            aria-label="Day View" 
            className="rounded-full gap-1 text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-gray-800 data-[state=on]:shadow-sm"
          >
            Day
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="week" 
            aria-label="Week View" 
            className="rounded-full gap-1 text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-gray-800 data-[state=on]:shadow-sm"
          >
            Week
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="month" 
            aria-label="Month View" 
            className="rounded-full gap-1 text-xs h-7 px-3 data-[state=on]:bg-white data-[state=on]:text-gray-800 data-[state=on]:shadow-sm"
          >
            Month
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="bg-white/70 backdrop-blur-sm p-0.5 rounded-xl border border-gray-100 shadow-sm">
        {renderCalendarView()}
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-500">Jobs</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-xs text-gray-500">Tasks</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="text-xs text-gray-500">Reminders</span>
        </div>
      </div>

      {/* Day detail dialog */}
      <DayDetailDialog
        open={dayDetailOpen}
        onOpenChange={setDayDetailOpen}
        date={selectedDate}
        jobs={jobsForSelectedDate}
        tasks={tasksForSelectedDate}
      />
    </div>
  );
};

export default CalendarView;
