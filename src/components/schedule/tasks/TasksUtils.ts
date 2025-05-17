import { Task } from "@/components/calendar/types";
import { TasksFilterType, TasksSortOrder, TasksViewMode } from "./TasksTypes";
import { compareDesc, parseISO } from "date-fns";

// Filter and sort tasks based on filter type, sort order, search query, and view mode
export const filterAndSortTasks = (
  tasks: Task[], 
  filterType: TasksFilterType,
  sortOrder: TasksSortOrder,
  searchQuery: string,
  viewMode: TasksViewMode
): Task[] => {
  // First filter by view mode (tasks vs reminders)
  let filteredTasks = tasks;
  if (viewMode !== "all") {
    filteredTasks = tasks.filter(task => 
      viewMode === "tasks" ? !task.isReminder : task.isReminder
    );
  }
  
  // Then filter by status
  switch (filterType) {
    case "scheduled":
      filteredTasks = filteredTasks.filter(task => task.status === "scheduled");
      break;
    case "in progress":
      filteredTasks = filteredTasks.filter(task => task.status === "in progress");
      break;
    case "completed":
      filteredTasks = filteredTasks.filter(task => task.status === "completed");
      break;
    case "overdue":
      filteredTasks = filteredTasks.filter(task => task.status === "overdue");
      break;
    case "all":
    default:
      // Keep all tasks
      break;
  }
  
  // Apply search filter if search query is not empty
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description?.toLowerCase().includes(query) ||
      task.client?.name.toLowerCase().includes(query)
    );
  }
  
  // Sort the tasks
  return filteredTasks.sort((a, b) => {
    if (sortOrder === "newest") {
      return compareDesc(
        a.dueDate instanceof Date ? a.dueDate : parseISO(a.dueDate as unknown as string),
        b.dueDate instanceof Date ? b.dueDate : parseISO(b.dueDate as unknown as string)
      );
    } else {
      return compareDesc(
        b.dueDate instanceof Date ? b.dueDate : parseISO(b.dueDate as unknown as string),
        a.dueDate instanceof Date ? a.dueDate : parseISO(a.dueDate as unknown as string)
      );
    }
  });
};

// Create a dummy task with default values
export const createDummyTask = (): Task => {
  return {
    id: crypto.randomUUID(),
    title: "New Task",
    description: "Task description",
    dueDate: new Date(),
    status: "scheduled",
    priority: "medium",
    client: {
      name: "Client Name",
    },
    isReminder: false,
    createdAt: new Date(),
  };
};
