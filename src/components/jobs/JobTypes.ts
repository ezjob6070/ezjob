
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled";

export interface Job {
  id: string;
  title?: string;
  clientName: string;
  date: string | Date;
  scheduledDate?: string;
  status: JobStatus;
  amount: number;
  actualAmount?: number;
  isAllDay?: boolean;
  cancellationReason?: string;
  technicianId?: string;
  technicianName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  description?: string;
  category?: string;
  serviceType?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  priority?: "low" | "medium" | "high";
  notes?: string;
  paymentMethod?: string;
  estimateId?: string;
}

export interface AmountRange {
  min: number;
  max: number;
}
