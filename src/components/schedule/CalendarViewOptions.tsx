
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type CalendarViewMode = "day" | "week" | "month";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  selectedDate: Date;
}

const CalendarViewOptions = ({
  currentView,
  onViewChange,
  selectedDate,
}: CalendarViewOptionsProps) => {
  return (
    <div className="flex items-center mb-4">
      <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as CalendarViewMode)} className="bg-muted/20 border rounded-md p-1">
        <ToggleGroupItem value="day" aria-label="Day View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Day</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="week" aria-label="Week View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
          <CalendarRange className="h-4 w-4" />
          <span className="text-sm">Week</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="month" aria-label="Month View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
          <CalendarDays className="h-4 w-4" />
          <span className="text-sm">Month</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CalendarViewOptions;
