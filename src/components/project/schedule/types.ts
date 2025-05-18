
export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
}

// Event types
export interface ScheduleEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  assignedTo?: string[];
  status: "scheduled" | "completed" | "cancelled";
  type: "meeting" | "deadline" | "milestone" | "task" | "inspection" | "reminder";
}
