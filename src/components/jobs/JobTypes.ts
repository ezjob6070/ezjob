
import { SortOption } from "@/types/sortOptions";

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  address?: string;
  description?: string;
  status: "scheduled" | "in-progress" | "completed" | "cancelled" | "canceled";
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
  paymentMethod?: string;
  paymentStatus?: string;
  technicianId?: string; // Add technician ID field
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface JobViewProps {
  jobs: Job[];
}

export type JobStatusType = Job["status"];

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
