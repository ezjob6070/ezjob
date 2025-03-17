
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
import TaskCard from "@/components/calendar/components/TaskCard";

interface TasksViewProps {
  selectedDate: Date;
  tasksForSelectedDate: Task[];
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const TasksView = ({ 
  selectedDate, 
  tasksForSelectedDate, 
  onPreviousDay, 
  onNextDay 
}: TasksViewProps) => {
  return (
    <div className="mb-6">
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
      
      <div className="space-y-4">
        <h3 className="font-medium">
          Tasks ({tasksForSelectedDate.length})
        </h3>
        
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks scheduled for this day.</p>
        ) : (
          <div className="space-y-4">
            {tasksForSelectedDate.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksView;
