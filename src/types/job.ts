
export type JobStatus =
  | "scheduled"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "pending";

export interface Job {
  id: string;
  customerId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  title: string;
  description?: string;
  type?: string;
  category?: string;
  date: string; // ISO date string
  time?: string;
  scheduledDate?: string; // ISO date string
  scheduledTime?: string;
  status: JobStatus;
  address?: string;
  technician?: string;
  technicianId?: string; // Added technician ID
  amount: number;
  actualAmount?: number;
  depositRequired?: boolean;
  depositAmount?: number;
  depositPaid?: boolean;
  paymentStatus?: "paid" | "unpaid" | "partial";
  notes?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  source?: string;
  sourceId?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  images?: string[];
  documentIds?: string[];
  projectId?: string;
}

export interface JobFilters {
  status: string[];
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  technicians: string[];
  search: string;
  categories: string[];
  types: string[];
  sources: string[];
}
