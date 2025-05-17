
import { useState, useEffect } from "react";
import { Task } from "@/components/calendar/types";
import { subDays, addDays, isSameDay } from "date-fns";
import { TasksViewProps, TasksFilterType, TasksSortOrder, TasksViewMode } from "./TasksTypes";
import TasksHeader from "./TasksHeader";
import TasksFilters from "./TasksFilters";
import TasksList from "./TasksList";
import { filterAndSortTasks } from "./TasksUtils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

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
  const [showCalendar, setShowCalendar] = useState(false);

  // Filter and sort tasks based on the current filter, sort, search, and view settings
  const filteredTasks = filterAndSortTasks(
    tasksForSelectedDate, 
    filterType, 
    sortOrder, 
    searchQuery, 
    viewMode
  );

  const tasksCount = tasksForSelectedDate.filter(task => !task.isReminder).length;
  const remindersCount = tasksForSelectedDate.filter(task => task.isReminder).length;

  // Handle task update
  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    if (onTasksChange) {
      const updatedTasks = tasksForSelectedDate.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      );
      onTasksChange(updatedTasks);
    }
  };

  // Handle create follow-up task
  const handleCreateFollowUp = (task: Task) => {
    console.log("Creating follow-up task for:", task);
    // Implementation would go here
  };

  // Handle date selection from calendar
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      // Update the selected date (this would need to update parent component state)
      console.log("Selected date:", date);
      setShowCalendar(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <TasksHeader 
          selectedDate={selectedDate}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
        />
        <Button 
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <CalendarIcon className="h-4 w-4" />
          {showCalendar ? "Hide Calendar" : "Show Calendar"}
        </Button>
      </div>

      {showCalendar && (
        <div className="p-1 rounded-lg shadow-sm bg-white">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="w-full"
          />
        </div>
      )}
      
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
      />
      
      <TasksList 
        filteredTasks={filteredTasks}
        viewMode={viewMode}
        onTaskUpdate={handleTaskUpdate}
        onCreateFollowUp={handleCreateFollowUp}
      />
    </div>
  );
};

export default TasksView;
