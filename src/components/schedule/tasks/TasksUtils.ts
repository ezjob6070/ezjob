
import { Task } from "@/components/calendar/types";
import { v4 as uuidv4 } from 'uuid';

// Filter tasks based on user selections
export const filterTasks = (
  tasks: Task[],
  viewMode: "all" | "tasks" | "reminders",
  searchQuery: string,
  filterType: string,
  sortOrder: "newest" | "oldest"
): Task[] => {
  // Filter by task type first
  let filtered = tasks;
  if (viewMode === "tasks") {
    filtered = tasks.filter(task => !task.isReminder);
  } else if (viewMode === "reminders") {
    filtered = tasks.filter(task => task.isReminder);
  }
  
  // Then apply status filter if not "all"
  if (filterType !== "all") {
    filtered = filtered.filter(task => task.status.toLowerCase() === filterType.toLowerCase());
  }
  
  // Apply search filter if present
  if (searchQuery) {
    filtered = filtered.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  
  // Apply sort order
  return filtered.sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
};

// Create a new reminder for a specific date
export const createReminder = (
  date: Date,
  existingTasks: Task[]
): Task => {
  const newReminder: Task = {
    id: uuidv4(),
    title: "New Reminder",
    dueDate: date,
    client: { name: "" },
    status: "scheduled",
    isReminder: true,
    reminderTime: "09:00",
    description: "",
  };
  
  return newReminder;
};

// Create a follow-up task based on an existing task
export const createFollowUp = (originalTask: Task): Task => {
  // Create a new date for follow-up (1 day later)
  const followUpDate = new Date(originalTask.dueDate);
  followUpDate.setDate(followUpDate.getDate() + 1);
  
  return {
    id: uuidv4(),
    title: `Follow-up: ${originalTask.title}`,
    dueDate: followUpDate,
    client: originalTask.client,
    status: "scheduled",
    description: `Follow-up task for: ${originalTask.description || originalTask.title}`,
    location: originalTask.location,
    technician: originalTask.technician,
    priority: originalTask.priority,
    parentTaskId: originalTask.id,
    type: "follow-up",
    isReminder: false,
  };
};
