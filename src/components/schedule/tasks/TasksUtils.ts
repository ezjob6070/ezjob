
import { Task } from "@/components/calendar/types";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

export const filterTasks = (
  tasks: Task[],
  viewMode: "all" | "tasks" | "reminders",
  searchQuery: string,
  filterType: string,
  sortOrder: "newest" | "oldest"
): Task[] => {
  // Filter by view mode (all, tasks, reminders)
  let filteredTasks = tasks;
  if (viewMode === "tasks") {
    filteredTasks = tasks.filter(task => !task.isReminder);
  } else if (viewMode === "reminders") {
    filteredTasks = tasks.filter(task => task.isReminder);
  }
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query)) ||
      (task.client?.name && task.client.name.toLowerCase().includes(query)) ||
      (task.assignedTo && task.assignedTo.toLowerCase().includes(query))
    );
  }
  
  // Filter by status
  if (filterType !== "all") {
    filteredTasks = filteredTasks.filter(task => 
      task.status.toLowerCase() === filterType.toLowerCase()
    );
  }
  
  // Sort by creation date
  return filteredTasks.sort((a, b) => {
    const dateA = new Date(a.createdAt || '').getTime();
    const dateB = new Date(b.createdAt || '').getTime();
    
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
};

export const createReminder = (date: Date, existingTasks: Task[]): Task => {
  const newId = uuidv4();
  const formattedDate = format(date, "yyyy-MM-dd");
  
  return {
    id: newId,
    title: "New Reminder",
    dueDate: date,
    status: "pending",
    isReminder: true,
    reminderTime: "09:00",
    reminderSent: false,
    createdAt: new Date().toISOString(),
    client: { name: "Personal" },
    progress: 0,
  };
};

export const createFollowUp = (originalTask: Task): Task => {
  const newId = uuidv4();
  // Create due date 3 days after the original task
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 3);
  
  return {
    id: newId,
    title: `Follow-up: ${originalTask.title}`,
    dueDate,
    status: "pending",
    priority: originalTask.priority,
    description: `Follow-up task for: ${originalTask.title}`,
    assignedTo: originalTask.assignedTo,
    client: originalTask.client,
    parentTaskId: originalTask.id,
    createdAt: new Date().toISOString(),
    progress: 0,
  };
};
