
import React from 'react';
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval,
  addDays, startOfMonth, endOfMonth, isToday, getDay, parseISO 
} from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/types/job';
import { Task } from '@/components/calendar/types';
import { Badge } from '@/components/ui/badge';

type CalendarViewMode = 'day' | 'week' | 'month';

type CalendarViewProps = {
  jobs: Job[];
  tasks: Task[];
  selectedDate: Date;
  jobsForSelectedDate: Job[];
  tasksForSelectedDate: Task[];
  updateSelectedDateItems: (date: Date) => void;
  viewMode: CalendarViewMode;
};

const CalendarView = ({
  jobs,
  tasks,
  selectedDate,
  jobsForSelectedDate,
  tasksForSelectedDate,
  updateSelectedDateItems,
  viewMode,
}: CalendarViewProps) => {
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

  const getDayContent = (day: Date) => {
    const dayJobs = getJobsForDate(day);
    const dayTasks = getTasksForDate(day);
    
    const hasJobs = dayJobs.length > 0;
    const hasTasks = dayTasks.length > 0;
    const hasReminders = dayTasks.filter(task => task.isReminder).length > 0;
    
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-1">
        <div className="flex justify-center items-center rounded-full h-6 w-6">
          {format(day, 'd')}
        </div>
        <div className="flex justify-center gap-1 mt-auto">
          {hasTasks && (
            <div className="h-2 w-2 rounded-full bg-amber-500" />
          )}
          {hasJobs && (
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          )}
          {hasReminders && (
            <div className="h-2 w-2 rounded-full bg-purple-500" />
          )}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayJobs = jobsForSelectedDate;
    const dayTasks = tasksForSelectedDate;
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
            {isToday(selectedDate) && (
              <Badge className="ml-2 bg-blue-100 text-blue-800">Today</Badge>
            )}
          </h3>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 text-center">
          {weekDates.map((date, i) => (
            <div 
              key={i}
              className={cn(
                "py-2 cursor-pointer",
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
      </div>
    );
  };

  const renderMonthView = () => {
    const handleSelectDate = (newDate: Date | undefined) => {
      if (newDate) {
        updateSelectedDateItems(newDate);
      }
    };

    const renderDay = (day: Date, otherProps: React.HTMLAttributes<HTMLDivElement>) => {
      const dayJobs = getJobsForDate(day);
      const dayTasks = getTasksForDate(day);
      
      const hasJobs = dayJobs.length > 0;
      const hasTasks = dayTasks.length > 0;
      const hasReminders = dayTasks.filter(task => task.isReminder).length > 0;
      
      return (
        <div 
          {...otherProps}
          className={cn(
            otherProps.className,
            "relative h-12 w-12 p-0 font-normal aria-selected:opacity-100"
          )}
        >
          <div className="absolute inset-0 flex flex-col justify-between p-1">
            <div className={cn(
              "flex justify-center items-center rounded-full h-6 w-6",
              isSameDay(day, selectedDate) && "bg-primary text-primary-foreground"
            )}>
              {format(day, 'd')}
            </div>
            <div className="flex justify-center gap-1 mt-auto">
              {hasTasks && (
                <div className="h-2 w-2 rounded-full bg-amber-500" />
              )}
              {hasJobs && (
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              )}
              {hasReminders && (
                <div className="h-2 w-2 rounded-full bg-purple-500" />
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelectDate}
        className="rounded-md border"
        components={{
          Day: ({ date, ...props }) => renderDay(date, props)
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
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
              onClick={() => updateSelectedDateItems(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
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
      </CardHeader>
      <CardContent>
        {renderCalendarView()}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Jobs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs">Tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs">Reminders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
