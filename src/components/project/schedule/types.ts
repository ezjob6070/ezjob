
export interface ScheduleEvent {
  id: string;
  title: string;
  start?: Date | string;
  end?: Date | string;
  location?: string;
  description?: string;
  assignedTo: string[];
  status: string;
  type: string;
}

export interface Job {
  id: string;
  title?: string;
  description?: string;
  scheduledDate?: Date | string;
  date?: Date | string;
  amount: number;
  actualAmount?: number;
  status: string;
  technicianId?: string;
  clientName?: string;
  address?: string;
  type?: string;
}

// Adding ProjectStaff interface that's missing and referenced in several errors
export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  assignedTasks?: number;
  availability?: string;
}
