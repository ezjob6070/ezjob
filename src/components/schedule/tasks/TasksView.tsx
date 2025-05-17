
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { Task } from "@/components/calendar/types";
import TasksHeader from "./TasksHeader";
import TasksFilters from "./TasksFilters";
import TasksList from "./TasksList";
import { TasksFilterType, TasksSortOrder, TasksViewMode, TasksViewProps } from "./TasksTypes";
import { createDefaultReminder, filterTasks } from "./TasksUtils";

const TasksView = ({ 
  selectedDate, 
  tasksForSelectedDate, 
  onPreviousDay, 
  onNextDay,
  onTasksChange
}: TasksViewProps) => {
  const [filterType, setFilterType] = useState<TasksFilterType>("all");
  const [sortOrder, setSortOrder] = useState<TasksSortOrder>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<TasksViewMode>("all");

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    if (!onTasksChange) return;
    
    const updatedTasks = tasksForSelectedDate.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    onTasksChange(updatedTasks);
  };

  const handleCreateReminder = () => {
    if (!onTasksChange) return;
    
    const newReminder = createDefaultReminder(selectedDate, uuid());
    
    onTasksChange([...tasksForSelectedDate, newReminder]);
    toast.success("Reminder created");
  };

  const handleCreateFollowUp = (task: Task) => {
    if (!onTasksChange) return;
    
    // Create a follow-up task that's scheduled a day after the original task
    const followUpDate = new Date(task.dueDate);
    followUpDate.setDate(followUpDate.getDate() + 1);
    
    const followUpTask: Task = {
      id: uuid(),
      title: `Follow-up: ${task.title}`,
      dueDate: followUpDate,
      followUpDate: undefined,
      start: followUpDate.toISOString(),
      end: new Date(followUpDate.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      priority: task.priority,
      client: task.client,
      description: `Follow-up for task: ${task.title}`,
      technician: task.technician,
      color: "#4f46e5", // indigo color for follow-up
      type: "follow-up",
      hasFollowUp: false,
      parentTaskId: task.id
    };
    
    // Mark the original task as having a follow-up
    const updatedTasks = tasksForSelectedDate.map(t => 
      t.id === task.id ? { ...t, hasFollowUp: true, followUpDate } : t
    );
    
    // Add the new follow-up task to the list
    onTasksChange([...updatedTasks, followUpTask]);
  };

  const filteredTasks = filterTasks(
    tasksForSelectedDate,
    viewMode,
    searchQuery,
    filterType,
    sortOrder
  );
  
  const tasksCount = tasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(task => task.isReminder).length;

  return (
    <div className="mb-6">
      <TasksHeader 
        selectedDate={selectedDate} 
        onPreviousDay={onPreviousDay} 
        onNextDay={onNextDay} 
      />
      
      <TasksFilters
        filterType={filterType}
        setFilterType={setFilterType}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
        tasksCount={tasksCount}
        remindersCount={remindersCount}
        onCreateReminder={onTasksChange ? handleCreateReminder : undefined}
      />
      
      <TasksList 
        filteredTasks={filteredTasks}
        viewMode={viewMode}
        onTaskUpdate={handleUpdateTask}
        onCreateFollowUp={handleCreateFollowUp}
      />
    </div>
  );
};

export default TasksView;
