
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/components/calendar/types";
import { cn } from "@/lib/utils";

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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onPreviousDay}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle>{format(selectedDate, "EEEE, MMMM d, yyyy")}</CardTitle>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onNextDay}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {tasksForSelectedDate.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No tasks due for this day</p>
        ) : (
          <div className="space-y-4">
            {tasksForSelectedDate.map(task => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.client.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        className={cn(
                          task.priority === "low" && "bg-blue-500",
                          task.priority === "medium" && "bg-yellow-500",
                          task.priority === "high" && "bg-red-500"
                        )}
                      >
                        {task.priority}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-1 capitalize">{task.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksView;
