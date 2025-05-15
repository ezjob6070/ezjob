
export interface Task {
  id: string;
  title: string;
  dueDate: Date | string;
  start?: string | Date;
  end?: string | Date;
  allDay?: boolean;
  priority?: "high" | "medium" | "low" | "urgent";
  status: string;
  client: { name: string };
  location?: string;
  description?: string;
  technician?: string;
  color?: string;
  type?: string;
  followUpDate?: Date | string;
  hasFollowUp?: boolean;
  parentTaskId?: string;
  
  // Reminder-specific fields
  isReminder?: boolean;
  reminderTime?: string; // Specific time for the reminder
  reminderSent?: boolean;
}
