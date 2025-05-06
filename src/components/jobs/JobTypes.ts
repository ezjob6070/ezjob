
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type PaymentMethod = "credit_card" | "cash" | "check" | "zelle" | "venmo" | "paypal";

export interface AmountRange {
  min: number;
  max: number;
}

export interface Job {
  id: string;
  clientName: string;
  title?: string;
  status: JobStatus;
  date: Date | string; // Accept either Date or string
  scheduledDate?: Date | string;
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
  jobSource?: string;
  parts?: string[];
  createdAt?: Date;
  assignedTechId?: string;
  assignedTechName?: string;
  priority?: string;
  estimateId?: string;
  attachments?: any[];
  jobNumber?: string;
  // New fields for signature and images
  signature?: string;
  hasImages?: boolean;
  imageCount?: number;
  images?: string[];
  // Add service category
  category?: string;
  serviceType?: string;
}

export interface JobTab {
  id: string;
  label: string;
  status: JobStatus | "all";
  count: number;
}
