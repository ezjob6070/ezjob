
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
  assignedTo?: string;
  createdAt?: string; // Added for timeline sorting
  
  // Reminder-specific fields
  isReminder?: boolean;
  reminderTime?: string; // Specific time for the reminder
  reminderSent?: boolean;
  
  // Document attachments
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  
  // Comments
  comments?: {
    id: string;
    text: string;
    author: string;
    date: string;
  }[];
  
  // Progress tracking
  progress?: number;
}
