
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
  // Additional fields needed by components
  clientEmail?: string;
  clientPhone?: string;
  contractorId?: string;
  contractorName?: string;
  signature?: string;
  hasImages?: boolean;
  imageCount?: number;
  parts?: any[];
  source?: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export type PaymentMethod = "cash" | "credit" | "check" | "bank" | "online" | "invoice" | "other";

export type JobTab = "all" | "scheduled" | "in-progress" | "completed" | "cancelled";
