
interface TaskCardProps {
  task: {
    id: string;
    title: string;
    priority: string;
    status: string;
    client: { name: string };
  };
}

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TaskCard = ({ task }: TaskCardProps) => {
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500 hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-3 pb-1">
        <div className="flex justify-between items-start">
          <CardTitle className="text-md">{task.title}</CardTitle>
          <Badge className={getPriorityBadgeColor(task.priority)}>
            {task.priority}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-1">
        <div className="text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client:</span>
            <span className="font-medium">{task.client.name}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{task.status.replace('-', ' ')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
