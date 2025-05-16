
import React from 'react';
import { 
  format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval,
  addDays, startOfMonth, endOfMonth, isToday, getDay
} from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Job } from '@/types/job';
import { Task } from '@/components/calendar/types';
import { Badge } from '@/components/ui/badge';
import { CalendarViewMode } from './CalendarViewOptions';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
        
        <div className="border rounded-md overflow-hidden">
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
        <div className="grid grid-cols-8 text-center border-b">
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
        
        <div className="min-h-[600px] border rounded-md overflow-hidden">
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
        className="rounded-md border"
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
                  "relative h-12 w-12 p-0 font-normal aria-selected:opacity-100"
                )}
              >
                <div className="absolute inset-0 flex flex-col justify-between p-1">
                  <div className={cn(
                    "flex justify-center items-center rounded-full h-6 w-6",
                    isSameDay(date, selectedDate) && "bg-primary text-primary-foreground"
                  )}>
                    {format(date, 'd')}
                  </div>
                  <div className="flex justify-center gap-1 mt-auto">
                    {hasTasks && (
                      <div className="h-1 w-1 rounded-full bg-amber-500 opacity-70" />
                    )}
                    {hasJobs && (
                      <div className="h-1 w-1 rounded-full bg-blue-500 opacity-70" />
                    )}
                    {hasReminders && (
                      <div className="h-1 w-1 rounded-full bg-purple-500 opacity-70" />
                    )}
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
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Calendar</CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-xs"
              onClick={() => updateSelectedDateItems(new Date())}
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
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
        {/* View toggle inside calendar */}
        <div className="mb-4 flex justify-center">
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && onViewChange(value as CalendarViewMode)} className="bg-muted/20 border rounded-md p-1">
            <ToggleGroupItem value="day" aria-label="Day View" className="gap-1 h-8 px-3 data-[state=on]:bg-white data-[state=on]:shadow-sm">
              <span className="text-sm">Day</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="week" aria-label="Week View" className="gap-1 h-8 px-3 data-[state=on]:bg-white data-[state=on]:shadow-sm">
              <span className="text-sm">Week</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="month" aria-label="Month View" className="gap-1 h-8 px-3 data-[state=on]:bg-white data-[state=on]:shadow-sm">
              <span className="text-sm">Month</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        {renderCalendarView()}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500 opacity-70"></div>
            <span className="text-xs text-muted-foreground">Jobs</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500 opacity-70"></div>
            <span className="text-xs text-muted-foreground">Tasks</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-purple-500 opacity-70"></div>
            <span className="text-xs text-muted-foreground">Reminders</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
