
import { SortOption } from "@/types/sortOptions";

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  address?: string;
  description?: string;
  status: "scheduled" | "in-progress" | "in_progress" | "completed" | "cancelled" | "canceled";
  date: Date | string; // Accept both Date and string
  scheduledDate?: Date | string; // Accept both Date and string
  expectedEndDate?: string;
  amount: number;
  actualAmount?: number;
  jobType?: string;
  serviceType?: string;
  source?: string;
  sourceId?: string;
  isAllDay?: boolean;
  paymentMethod?: PaymentMethod;
  paymentStatus?: string;
  technicianId?: string; // Add technician ID field
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Additional fields needed by calendar components
  title?: string;
  technicianName?: string;
  
  // Additional fields for compatibility
  jobSourceId?: string;
  jobSourceName?: string;
  contractorId?: string;
  contractorName?: string;
  category?: string;
  cancellationReason?: string;
  priority?: JobPriority;
  parts?: any[];
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface JobViewProps {
  jobs: Job[];
}

export type JobStatusType = Job["status"];
export type JobStatus = "scheduled" | "in-progress" | "in_progress" | "completed" | "cancelled" | "canceled" | "reschedule" | "estimate";
export type PaymentMethod = "cash" | "credit" | "check" | "invoice" | "other" | "";
export type JobPriority = "low" | "medium" | "high" | "urgent";

export interface JobBaseProps {
  onAddJob?: (job: Job) => void;
  onUpdateJob?: (job: Job) => void;
  onDeleteJob?: (id: string) => void;
}

export interface JobListProps extends JobBaseProps {
  jobs: Job[];
  sortBy?: SortOption;
  searchTerm?: string;
}

export interface CreateJobFormData {
  title: string;
  clientName: string;
  technicianId: string;
  amount: number;
  date: Date;
  time?: Date;
  isAllDay: boolean;
  priority: string;
  description?: string;
  category?: string;
  serviceType?: string;
  jobSourceId?: string;
  contractorId?: string;
}
