
import { DateRange } from "react-day-picker";

export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "rescheduled" | "estimate";
export type JobPriority = "low" | "medium" | "high" | "urgent";
export type PaymentMethod = "cash" | "creditCard" | "check" | "bankTransfer" | "mobile";

export interface Job {
  id: string;
  title?: string;
  jobNumber?: string;
  clientName: string;
  amount: number;
  status: JobStatus;
  actualAmount?: number;
  technicianId?: string;
  technicianName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  date: Date | string;
  scheduledDate?: Date | string;
  createdAt?: string;
  priority?: JobPriority;
  details?: string;
  address?: string;
  clientPhone?: string;
  clientEmail?: string;
  notes?: string;
  description?: string;
  serviceType?: string;
  category?: string;
  estimateId?: string;
  isAllDay?: boolean;
  paymentStatus?: "paid" | "unpaid" | "partial";
  paymentMethod?: PaymentMethod;
  cancellationReason?: string;
  source?: string;
  contractorName?: string;
  contractorId?: string;
}

export interface JobTab {
  id: string;
  label: string;
  status: string;
  count: number;
}

export interface ServiceTypeFilter {
  name: string;
  amount: number;
  percentage: number;
}

export interface CreateJobFormData {
  title: string;
  clientName: string;
  technicianId: string;
  amount: number;
  date: Date;
  time?: Date;
  isAllDay: boolean;
  priority: JobPriority;
  description?: string;
  category?: string;
  serviceType?: string;
  jobSourceId?: string;
  contractorId?: string;
}

export interface JobFilters {
  searchTerm: string;
  technicianFilter: string;
  dateFilter: "today" | "tomorrow" | "yesterday" | "thisWeek" | "nextWeek" | "lastWeek" | "thisMonth" | "lastMonth" | "custom";
  customDateRange: DateRange;
}

export interface AmountRange {
  min?: number;
  max?: number;
}
