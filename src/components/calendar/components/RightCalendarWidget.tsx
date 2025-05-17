
import { useState } from "react";
import { Job } from "@/components/jobs/JobTypes";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import CalendarDayView from "./calendar-views/CalendarDayView";
import CalendarWeekView from "./calendar-views/CalendarWeekView";
import CalendarMonthView from "./calendar-views/CalendarMonthView";
import CalendarNavigation from "./CalendarNavigation";
import { getDayColorBasedOnJobs } from "../utils/calendarHelpers";

interface CalendarWidgetProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  jobs: Job[];
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const RightCalendarWidget = ({ 
  selectedDate, 
  setSelectedDate, 
  jobs, 
  viewMode, 
  onViewChange 
}: CalendarWidgetProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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

  const renderCalendarView = () => {
    switch (viewMode) {
      case 'day':
        return <CalendarDayView 
                 selectedDate={selectedDate}
                 onDateClick={setSelectedDate}
               />;
      case 'week':
        return <CalendarWeekView 
                 selectedDate={selectedDate}
                 onDateClick={setSelectedDate}
               />;
      case 'month':
        return <CalendarMonthView
                 selectedDate={selectedDate} 
                 onDateSelect={setSelectedDate}
                 currentMonth={currentMonth}
                 onMonthChange={setCurrentMonth}
                 jobs={jobs}
                 getDayColor={(date) => getDayColorBasedOnJobs(date, jobs)}
               />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <CalendarNavigation 
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        viewMode={viewMode}
        onViewChange={onViewChange}
        onPrevPeriod={handlePrevPeriod}
        onNextPeriod={handleNextPeriod}
      />

      <div className="flex justify-center">
        <div className="w-full min-w-0 overflow-visible">
          {renderCalendarView()}
        </div>
      </div>
    </div>
  );
};

export default RightCalendarWidget;
