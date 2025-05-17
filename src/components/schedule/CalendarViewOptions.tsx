
import { Calendar, CalendarCheck, ListTodo } from "lucide-react";
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
    <ToggleGroup 
      type="single" 
      value={currentView}
      onValueChange={(value) => {
        if (value) onViewChange(value as CalendarViewMode);
      }}
      className="flex rounded-md p-1"
    >
      <ToggleGroupItem 
        value="day" 
        size="sm"
        className="data-[state=on]:bg-transparent"
        aria-label="Day view"
      >
        <Calendar className={currentView === "day" ? `h-3.5 w-3.5 text-[${iconColor}]` : "h-3.5 w-3.5"} />
        <span className={currentView === "day" ? `ml-1 text-xs font-medium text-[${iconColor}]` : "ml-1 text-xs font-medium"}>Day</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem 
        value="week" 
        size="sm"
        className="data-[state=on]:bg-transparent"
        aria-label="Week view"
      >
        <CalendarCheck className={currentView === "week" ? `h-3.5 w-3.5 text-[${iconColor}]` : "h-3.5 w-3.5"} />
        <span className={currentView === "week" ? `ml-1 text-xs font-medium text-[${iconColor}]` : "ml-1 text-xs font-medium"}>Week</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem 
        value="month" 
        size="sm"
        className="data-[state=on]:bg-transparent"
        aria-label="Month view"
      >
        <ListTodo className={currentView === "month" ? `h-3.5 w-3.5 text-[${iconColor}]` : "h-3.5 w-3.5"} />
        <span className={currentView === "month" ? `ml-1 text-xs font-medium text-[${iconColor}]` : "ml-1 text-xs font-medium"}>Month</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CalendarViewOptions;
