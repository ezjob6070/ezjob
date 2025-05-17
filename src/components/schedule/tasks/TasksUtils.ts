
import { Task } from "@/components/calendar/types";
import { TasksFilterType, TasksSortOrder, TasksViewMode } from "./TasksTypes";

export const filterTasks = (
  tasks: Task[],
  viewMode: TasksViewMode,
  searchQuery: string,
  filterType: TasksFilterType,
  sortOrder: TasksSortOrder
): Task[] => {
  let filtered = [...tasks];

  // Apply view mode filter
  if (viewMode === "tasks") {
    filtered = filtered.filter(task => !task.isReminder);
  } else if (viewMode === "reminders") {
    filtered = filtered.filter(task => task.isReminder);
  }

  // Apply search filter
  if (searchQuery) {
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }

  // Apply status filter
  if (filterType !== "all") {
    filtered = filtered.filter(task => task.status === filterType);
  }

  // Apply sort order
  filtered.sort((a, b) => {
    const dateA = new Date(a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate));
    const dateB = new Date(b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate));
    
    if (sortOrder === "newest") {
      return dateB.getTime() - dateA.getTime();
    } else {
      return dateA.getTime() - dateB.getTime();
    }
  });

  return filtered;
};

export const createDefaultReminder = (selectedDate: Date, id: string): Task => {
  const reminderTime = new Date(selectedDate);
  // Default to 9:00 AM for new reminders
  reminderTime.setHours(9, 0, 0, 0);
  
  return {
    id: id,
    title: "New Reminder",
    dueDate: reminderTime,
    start: reminderTime.toISOString(),
    end: new Date(reminderTime.getTime() + 30 * 60 * 1000).toISOString(),
    status: "scheduled",
    priority: "medium",
    client: { name: "", id: "" },
    description: "",
    technician: { name: "", id: "" },
    color: "#9b87f5", // Purple for reminders
    type: "reminder",
    isReminder: true,
    hasFollowUp: false
  };
};
