
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "estimate" | "pending";
export type JobPriority = "low" | "medium" | "high" | "urgent";
export type PaymentMethod = "cash" | "credit_card" | "check" | "online" | "invoice" | null;

export interface Job {
  id: string;
  jobNumber?: string;
  clientName: string;
  clientId?: string;
  technicianName?: string;
  technicianId?: string;
  contractorId?: string;
  contractorName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  date?: Date | string;
  scheduledDate?: Date | string;
  isAllDay?: boolean;
  address?: string;
  status: JobStatus;
  priority?: JobPriority;
  description?: string;
  notes?: string;
  category?: string;
  serviceType?: string;
  amount?: number;
  actualAmount?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: "paid" | "unpaid" | "partial";
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  title?: string;
  clientEmail?: string;
  clientPhone?: string;
  duration?: number;
  estimateId?: string;
  signature?: string;
  parts?: any[];
  hasImages?: boolean;
  imageCount?: number;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface TechnicianFilter {
  name: string;
  selected: boolean;
  category?: string;
  role?: string;
}

export interface FilterGroup {
  name: string;
  filters: TechnicianFilter[];
}

export interface CompactFilterProps {
  label: string;
  count: number;
  onClear: () => void;
  children?: React.ReactNode;
}
