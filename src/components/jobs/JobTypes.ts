
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type PaymentMethod = "credit_card" | "cash" | "check" | "zelle" | "venmo" | "paypal";

export interface Job {
  id: string;
  clientName: string;
  title?: string;
  status: JobStatus;
  date: Date;
  scheduledDate?: Date;
  isAllDay?: boolean;
  technicianId?: string;
  technicianName?: string;
  address?: string;
  amount?: number;
  actualAmount?: number;
  paymentMethod?: PaymentMethod;
  description?: string;
  notes?: string;
  cancellationReason?: string;
  source?: string;
  // Additional properties
  clientId?: string;
  clientEmail?: string;
  clientPhone?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  parts?: string[];
  createdAt?: Date;
}

export interface JobTab {
  id: string;
  label: string;
  status: JobStatus | "all";
  count: number;
}
