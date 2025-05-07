
export interface Task {
  id: string;
  title: string;
  dueDate: Date;
  start?: string;
  end?: string;
  allDay?: boolean;
  priority?: "high" | "medium" | "low" | "urgent";
  status: string;
  client: { name: string };
  location?: string;
  description?: string;
  technician?: string;
  color?: string;
  type?: string;
}
