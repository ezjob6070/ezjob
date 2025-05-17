
import TaskCard from "@/components/calendar/components/TaskCard";
import ReminderCard from "@/components/schedule/ReminderCard";
import { TasksListProps } from "./TasksTypes";

const TasksList = ({ 
  filteredTasks, 
  viewMode, 
  onTaskUpdate, 
  onCreateFollowUp 
}: TasksListProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">
        {viewMode === "all" ? "Tasks & Reminders" : viewMode === "tasks" ? "Tasks" : "Reminders"} ({filteredTasks.length})
      </h3>
      
      {filteredTasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {viewMode === "all" 
            ? "No tasks or reminders scheduled for this day." 
            : viewMode === "tasks" 
              ? "No tasks scheduled for this day."
              : "No reminders scheduled for this day."
          }
        </p>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            task.isReminder ? (
              <ReminderCard 
                key={task.id} 
                reminder={task} 
                onReminderUpdate={onTaskUpdate}
              />
            ) : (
              <TaskCard 
                key={task.id} 
                task={task} 
                onTaskUpdate={onTaskUpdate}
                onCreateFollowUp={onCreateFollowUp}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksList;
