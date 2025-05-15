
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarHeaderProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

const SidebarHeader = ({ currentMonth, onPrevMonth, onNextMonth }: SidebarHeaderProps) => (
  <div className="h-16 flex items-center px-6 border-b border-border justify-between">
    <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
      <CalendarIcon size={18} />
      <span>Calendar</span>
    </h2>
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={onPrevMonth}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium">
        {format(currentMonth, "MMMM yyyy")}
      </span>
      <Button variant="ghost" size="sm" onClick={onNextMonth}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  </div>
);

export default SidebarHeader;
