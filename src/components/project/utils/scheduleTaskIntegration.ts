
import { format } from "date-fns";
import { ScheduleEvent } from "../ProjectTimeScheduleTab";
import { ProjectTask } from "@/types/project";

/**
 * Converts a schedule event to a project task
 */
export const convertEventToTask = (event: ScheduleEvent): Omit<ProjectTask, "id" | "createdAt"> => {
  return {
    title: event.title,
    description: event.description || "",
    status: event.status === "completed" ? "completed" : 
            event.status === "cancelled" ? "blocked" : "in_progress",
    priority: event.type === "deadline" || event.type === "milestone" ? "high" : "medium",
    dueDate: format(event.end, "yyyy-MM-dd"),
    assignedTo: event.assignedTo ? event.assignedTo[0] : undefined,
    completedAt: event.status === "completed" ? format(new Date(), "yyyy-MM-dd") : undefined,
    progress: event.status === "completed" ? 100 : event.status === "cancelled" ? 0 : 50,
    dependencies: [],
    inspections: [],
    comments: [],
    attachments: [],
  };
};

/**
 * Converts a project task to a schedule event
 */
export const convertTaskToEvent = (task: ProjectTask): Omit<ScheduleEvent, "id"> => {
  const date = task.dueDate ? new Date(task.dueDate) : new Date();
  
  // Set the time to 9:00 AM for the start and 10:00 AM for the end
  const start = new Date(date);
  start.setHours(9, 0, 0, 0);
  
  const end = new Date(date);
  end.setHours(10, 0, 0, 0);
  
  return {
    title: task.title,
    start: start,
    end: end,
    description: task.description,
    location: "",
    assignedTo: task.assignedTo ? [task.assignedTo] : [],
    status: task.status === "completed" ? "completed" :
            task.status === "blocked" ? "cancelled" : "scheduled",
    type: "task"
  };
};

/**
 * Generates a unique ID for events or tasks
 */
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};
