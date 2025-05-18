
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
  completedAt?: string; // Date when the task was completed
  
  // Reminder-specific fields
  isReminder?: boolean;
  reminderTime?: string; // Specific time for the reminder
  reminderSent?: boolean;
  
  // Document attachments
  attachments?: TaskAttachment[];
  
  // Comments
  comments?: TaskComment[];
  
  // Progress tracking
  progress?: number;
  
  // Time tracking
  estimatedHours?: number;
  actualHours?: number;
  timeEntries?: TimeEntry[];
}

export interface TaskAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size?: number;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface TaskComment {
  id: string;
  text: string;
  author: string;
  date: string;
}

export interface TimeEntry {
  id: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  user: string;
  date: string;
  billable?: boolean;
}
