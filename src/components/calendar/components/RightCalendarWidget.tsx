
import { format, isSameDay, startOfWeek, endOfWeek, eachDayOfInterval, addDays, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Job } from "@/components/jobs/JobTypes";
import { DayProps } from "react-day-picker";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CalendarViewOptions from "@/components/schedule/CalendarViewOptions";

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  jobs: Job[];
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const RightCalendarWidget = ({ selectedDate, setSelectedDate, jobs, viewMode, onViewChange }: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const getDayColor = (day: Date) => {
    const dayJobs = jobs.filter(job => isSameDay(job.date, day));
    
    if (!dayJobs.length) return "";
    
    if (dayJobs.some(job => job.status === "scheduled")) {
      return "bg-blue-100 text-blue-800";
    } else if (dayJobs.some(job => job.status === "in_progress")) {
      return "bg-yellow-100 text-yellow-800";
    } else if (dayJobs.some(job => job.status === "completed")) {
      return "bg-green-100 text-green-800";
    } else if (dayJobs.some(job => job.status === "cancelled")) {
      return "bg-red-100 text-red-800";
    }
    
    return "";
  };

  const handlePrevPeriod = () => {
    switch (viewMode) {
      case 'day':
        const prevDay = new Date(selectedDate);
        prevDay.setDate(prevDay.getDate() - 1);
        setSelectedDate(prevDay);
        break;
      case 'week':
        const prevWeek = new Date(selectedDate);
        prevWeek.setDate(prevWeek.getDate() - 7);
        setSelectedDate(prevWeek);
        break;
      case 'month':
        const prevMonth = new Date(currentMonth);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setCurrentMonth(prevMonth);
        break;
    }
  };

  const handleNextPeriod = () => {
    switch (viewMode) {
      case 'day':
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
        break;
      case 'week':
        const nextWeek = new Date(selectedDate);
        nextWeek.setDate(nextWeek.getDate() + 7);
        setSelectedDate(nextWeek);
        break;
      case 'month':
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setCurrentMonth(nextMonth);
        break;
    }
  };

  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(selectedDate, "EEEE, MMMM d, yyyy");
      case 'week': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      }
      case 'month':
        return format(currentMonth, "MMMM yyyy");
      default:
        return format(selectedDate, "MMMM d, yyyy");
    }
  };

  const renderDayView = () => (
    <div className="bg-white border rounded-md p-3 mb-4">
      <div className="text-center font-medium mb-2">
        {format(selectedDate, "EEEE, MMMM d")}
      </div>
      <div className="text-center text-3xl font-bold">
        {format(selectedDate, "d")}
      </div>
    </div>
  );

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="bg-white border rounded-md p-2 mb-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div 
              key={day.toString()} 
              onClick={() => setSelectedDate(day)}
              className={cn(
                "flex flex-col items-center justify-center p-1 rounded-md cursor-pointer",
                isSameDay(day, selectedDate) 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-gray-100"
              )}
            >
              <div className="text-xs">{format(day, "E")}</div>
              <div className="font-semibold">{format(day, "d")}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => date && setSelectedDate(date)}
      className={cn("p-0 pointer-events-auto w-full overflow-visible")}
      month={currentMonth}
      onMonthChange={setCurrentMonth}
      modifiers={{
        hasJobs: (date) => jobs.some(job => isSameDay(job.date, date)),
      }}
      modifiersClassNames={{
        hasJobs: "font-bold",
      }}
      components={{
        Day: ({ date, displayMonth, ...props }: DayProps) => {
          const isSelected = isSameDay(date, selectedDate);
          const isOutsideMonth = date.getMonth() !== displayMonth.getMonth();
          const dayColor = getDayColor(date);
          
          return (
            <button 
              type="button"
              className={cn(
                "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                dayColor,
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                "relative"
              )}
              disabled={isOutsideMonth}
              {...props}
            >
              {format(date, "d")}
              {jobs.some(job => isSameDay(job.date, date)) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></div>
              )}
            </button>
          );
        }
      }}
    />
  );

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-2 mb-3">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon" onClick={handlePrevPeriod}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-sm font-medium">{getViewTitle()}</h2>
          <Button variant="outline" size="icon" onClick={handleNextPeriod}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center">
          <CalendarViewOptions 
            currentView={viewMode}
            onViewChange={onViewChange}
          />
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        {viewMode === 'day' && renderDayView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'month' && (
          <div className="w-full overflow-visible">
            {renderMonthView()}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightCalendarWidget;
