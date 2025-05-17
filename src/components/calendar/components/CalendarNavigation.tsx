
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarViewMode } from "@/components/schedule/CalendarViewOptions";
import CalendarViewOptions from "@/components/schedule/CalendarViewOptions";

interface CalendarNavigationProps {
  selectedDate: Date;
  currentMonth: Date;
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

const CalendarNavigation = ({
  selectedDate,
  currentMonth,
  viewMode,
  onViewChange,
  onPrevPeriod,
  onNextPeriod
}: CalendarNavigationProps) => {
  const getViewTitle = () => {
    switch (viewMode) {
      case 'day':
        return format(selectedDate, "EEEE, MMMM d, yyyy");
      case 'week': {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(selectedDate.getDate() - selectedDate.getDay() + (selectedDate.getDay() === 0 ? -6 : 1));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
      }
      case 'month':
        return format(currentMonth, "MMMM yyyy");
      default:
        return format(selectedDate, "MMMM d, yyyy");
    }
  };

  return (
    <div className="flex flex-col space-y-2 mb-3">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={onPrevPeriod} className="h-7 w-7 sm:h-8 sm:w-8">
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <h2 className="text-xs sm:text-sm font-medium truncate">{getViewTitle()}</h2>
        <Button variant="outline" size="icon" onClick={onNextPeriod} className="h-7 w-7 sm:h-8 sm:w-8">
          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
      
      <div className="flex justify-center">
        <CalendarViewOptions 
          currentView={viewMode}
          onViewChange={onViewChange}
        />
      </div>
    </div>
  );
};

export default CalendarNavigation;
