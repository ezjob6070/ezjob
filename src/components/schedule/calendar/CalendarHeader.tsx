
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarViewMode } from "../CalendarViewOptions";
import CalendarViewOptions from "../CalendarViewOptions";

interface CalendarHeaderProps {
  selectedDate: Date;
  viewMode: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onPrevPeriod: () => void;
  onNextPeriod: () => void;
}

const CalendarHeader = ({ 
  selectedDate, 
  viewMode, 
  onViewChange, 
  onPrevPeriod, 
  onNextPeriod 
}: CalendarHeaderProps) => {
  // Get the title based on the current view mode
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
        return format(selectedDate, "MMMM yyyy");
      default:
        return format(selectedDate, "MMMM d, yyyy");
    }
  };

  return (
    <div className="flex items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrevPeriod}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">{getViewTitle()}</h2>
        <Button variant="outline" size="icon" onClick={onNextPeriod}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <CalendarViewOptions 
        currentView={viewMode}
        onViewChange={onViewChange}
      />
    </div>
  );
};

export default CalendarHeader;
