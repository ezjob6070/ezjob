
import { Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type CalendarViewMode = "day" | "week" | "month";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  selectedDate: Date;
  onPreviousDate: () => void;
  onNextDate: () => void;
  onTodayClick: () => void;
}

const CalendarViewOptions = ({
  currentView,
  onViewChange,
  selectedDate,
  onPreviousDate,
  onNextDate,
  onTodayClick
}: CalendarViewOptionsProps) => {
  return (
    <div className="flex items-center justify-between w-full mb-4 border-b pb-4">
      <div className="flex items-center">
        <h2 className="text-lg font-medium mr-4">
          {format(selectedDate, currentView === "day" ? "MMMM d, yyyy" : 
                            currentView === "week" ? "'Week of' MMMM d, yyyy" : 
                            "MMMM yyyy")}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <ToggleGroup type="single" value={currentView} onValueChange={(value) => value && onViewChange(value as CalendarViewMode)} className="bg-muted/20 border rounded-md p-1">
          <ToggleGroupItem value="day" aria-label="Day View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Day</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="week" aria-label="Week View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <CalendarRange className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Week</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Month View" className="gap-1 h-8 data-[state=on]:bg-white data-[state=on]:shadow-sm">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline text-sm">Month</span>
          </ToggleGroupItem>
        </ToggleGroup>

        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onPreviousDate} className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onNextDate} className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={onTodayClick} className="h-8">
            Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CalendarViewOptions;
