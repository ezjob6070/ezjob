
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
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as CalendarViewMode)} className="bg-muted/20 border rounded-md p-1">
          <ToggleGroupItem value="day" aria-label="Daily View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Day</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Weekly View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Week</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Monthly View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Month</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="home" aria-label="Home View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Home</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button variant="outline" size="sm" onClick={() => onViewChange("day")} className="h-8 bg-white">
        Today
      </Button>
    </div>
  );
};

export default CalendarViewOptions;
