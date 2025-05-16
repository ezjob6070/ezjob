
import { Calendar, CalendarDays } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type CalendarViewMode = "day" | "week" | "month" | "home";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const CalendarViewOptions = ({ currentView, onViewChange }: CalendarViewOptionsProps) => {
  return (
    <div className="flex items-center justify-end gap-2">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as CalendarViewMode)}>
        <ToggleGroupItem value="day" aria-label="Daily View" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Day</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="Weekly View" className="gap-1">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Week</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="Monthly View" className="gap-1">
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Month</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CalendarViewOptions;
