
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TasksHeaderProps } from "./TasksTypes";

const TasksHeader = ({ selectedDate, onPreviousDay, onNextDay }: TasksHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPreviousDay}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <h3 className="text-lg font-medium">
        {format(selectedDate, "EEEE, MMMM d, yyyy")}
      </h3>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onNextDay}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TasksHeader;
