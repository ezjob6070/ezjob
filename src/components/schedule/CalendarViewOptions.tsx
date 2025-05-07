
import { Calendar, CalendarDays, LayoutGrid, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type CalendarViewMode = "day" | "week" | "month" | "home";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
}

const CalendarViewOptions = ({ currentView, onViewChange }: CalendarViewOptionsProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-2">
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
          <ToggleGroupItem value="home" aria-label="Home View" className="gap-1">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button variant="outline" size="sm" onClick={() => onViewChange("day")}>
        Today
      </Button>
    </div>
  );
};

export default CalendarViewOptions;
