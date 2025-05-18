
import React from "react";
import { ProjectTask } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Calendar } from "lucide-react";
import { getStatusBadgeColor, getPriorityBadgeColor, formatStatus } from "./TaskUtils";

interface TaskCardProps {
  task: ProjectTask;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{task.title}</h3>
            <Badge className={getStatusBadgeColor(task.status)}>
              {formatStatus(task.status)}
            </Badge>
            <Badge className={getPriorityBadgeColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
          {task.attachments && task.attachments.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Paperclip size={14} />
              <span>{task.attachments.length}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{task.dueDate}</span>
          </div>
          <Badge variant="outline" className="ml-2">{task.assignedTo}</Badge>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
        <div 
          className={`h-1.5 rounded-full ${
            task.status === "completed" ? "bg-green-500" : "bg-blue-500"
          }`}
          style={{ width: `${task.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default TaskCard;
