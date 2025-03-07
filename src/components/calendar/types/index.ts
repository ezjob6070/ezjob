
export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  priority: "high" | "medium" | "low";
  status: string;
  client: { name: string };
}
