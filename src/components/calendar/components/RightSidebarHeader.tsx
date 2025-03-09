
import { CalendarIcon } from "lucide-react";

const RightSidebarHeader = () => (
  <div className="h-16 flex items-center px-6 border-b border-border justify-between">
    <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
      <CalendarIcon size={18} />
      <span>Calendar</span>
    </h2>
  </div>
);

export default RightSidebarHeader;
