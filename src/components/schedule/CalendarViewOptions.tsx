
import { Calendar, CalendarDays, CalendarWeek } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type CalendarViewMode = "day" | "week" | "month";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  blueIconColor?: string;
}

const CalendarViewOptions = ({ currentView, onViewChange, blueIconColor }: CalendarViewOptionsProps) => {
  // Stronger blue color for icons and text
  const iconColor = blueIconColor || "#0077CC";
  
  return (
    <div className="inline-flex rounded-lg bg-muted/30 p-1">
      <button
        onClick={() => onViewChange("day")}
        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
          currentView === "day" 
            ? `text-[${iconColor}]` 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Calendar className="h-3.5 w-3.5" 
          style={{color: currentView === "day" ? iconColor : undefined}} 
        />
        Day
      </button>
      
      <button
        onClick={() => onViewChange("week")}
        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
          currentView === "week" 
            ? `text-[${iconColor}]` 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <CalendarWeek className="h-3.5 w-3.5" 
          style={{color: currentView === "week" ? iconColor : undefined}}
        />
        Week
      </button>
      
      <button
        onClick={() => onViewChange("month")}
        className={`px-3 py-1.5 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
          currentView === "month" 
            ? `text-[${iconColor}]` 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <CalendarDays className="h-3.5 w-3.5" 
          style={{color: currentView === "month" ? iconColor : undefined}} 
        />
        Month
      </button>
    </div>
  );
};

export default CalendarViewOptions;
