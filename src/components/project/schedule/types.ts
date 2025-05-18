
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
