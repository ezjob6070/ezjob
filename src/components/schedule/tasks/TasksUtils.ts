
import { v4 as uuid } from "uuid";
import { Task } from "@/components/calendar/types";
import { toast } from "sonner";

export const createReminder = (selectedDate: Date, existingTasks: Task[]): Task => {
  const reminderTime = new Date(selectedDate);
  // Default to 9:00 AM for new reminders
  reminderTime.setHours(9, 0, 0, 0);
  
  const newReminder: Task = {
    id: uuid(),
    title: "New Reminder",
    dueDate: reminderTime,
    start: reminderTime.toISOString(),
    end: new Date(reminderTime.getTime() + 30 * 60 * 1000).toISOString(),
    status: "scheduled",
    priority: "medium",
    client: { name: "" },
    description: "",
    technician: { name: "" },
    color: "#9b87f5", // Purple for reminders
    type: "reminder",
    isReminder: true,
    hasFollowUp: false
  };
  
  toast.success("Reminder created");
  return newReminder;
};

export const createFollowUp = (task: Task): Task => {
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
  
  return followUpTask;
};

export const filterTasks = (
  tasks: Task[], 
  viewMode: "all" | "tasks" | "reminders", 
  searchQuery: string, 
  filterType: string,
  sortOrder: "newest" | "oldest"
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
