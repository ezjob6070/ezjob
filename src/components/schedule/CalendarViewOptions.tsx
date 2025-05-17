
import { Calendar, CalendarCheck, ListTodo } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type CalendarViewMode = "day" | "week" | "month";

interface CalendarViewOptionsProps {
  currentView: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  blueIconColor?: string;
}

const CalendarViewOptions = ({ currentView, onViewChange, blueIconColor }: CalendarViewOptionsProps) => {
  // Stronger blue color for icons and text (using a deeper shade)
  const iconColor = blueIconColor || "#0077CC"; // Using a stronger blue color
  
  return (
    <ToggleGroup 
      type="single" 
      value={currentView}
      onValueChange={(value) => {
        if (value) onViewChange(value as CalendarViewMode);
      }}
      className="bg-muted rounded-md p-1 border"
    >
      <ToggleGroupItem 
        value="day" 
        size="sm"
        className="data-[state=on]:bg-white data-[state=on]:text-primary"
        aria-label="Day view"
      >
        <Calendar className={`h-3.5 w-3.5 ${currentView === "day" ? `text-[${iconColor}]` : ""}`} />
        <span className={`ml-1 text-xs font-medium ${currentView === "day" ? `text-[${iconColor}]` : ""}`}>Day</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem 
        value="week" 
        size="sm"
        className="data-[state=on]:bg-white data-[state=on]:text-primary"
        aria-label="Week view"
      >
        <CalendarCheck className={`h-3.5 w-3.5 ${currentView === "week" ? `text-[${iconColor}]` : ""}`} />
        <span className={`ml-1 text-xs font-medium ${currentView === "week" ? `text-[${iconColor}]` : ""}`}>Week</span>
      </ToggleGroupItem>
      
      <ToggleGroupItem 
        value="month" 
        size="sm"
        className="data-[state=on]:bg-white data-[state=on]:text-primary"
        aria-label="Month view"
      >
        <ListTodo className={`h-3.5 w-3.5 ${currentView === "month" ? `text-[${iconColor}]` : ""}`} />
        <span className={`ml-1 text-xs font-medium ${currentView === "month" ? `text-[${iconColor}]` : ""}`}>Month</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default CalendarViewOptions;
