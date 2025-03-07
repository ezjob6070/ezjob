
import { Task } from "../types";

// Mock task data - in a real app, this would come from a central store or API
export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up on proposal",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    priority: "high",
    status: "todo",
    client: { name: "John Doe" }
  },
  {
    id: "2",
    title: "Schedule quarterly review",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
    priority: "medium",
    status: "in-progress",
    client: { name: "Jane Smith" }
  },
  {
    id: "3",
    title: "Update client information",
    dueDate: new Date(new Date().setDate(new Date().getDate())),
    priority: "low",
    status: "todo",
    client: { name: "Bob Johnson" }
  }
];
