
import { SortOption } from "@/types/sortOptions";
import { JobPriority, JobStatus, PaymentMethod } from "@/types/job";

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  address?: string;
  description?: string;
  status: JobStatus;
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
  
  // Job source related properties
  jobSourceId?: string;
  jobSourceName?: string;
  
  // Contractor related properties
  contractorId?: string;
  contractorName?: string;
  
  // Category and other properties
  category?: string;
  
  // Job priority
  priority?: JobPriority;
  
  // Cancellation related
  cancellationReason?: string;
}

export { JobPriority, JobStatus, PaymentMethod };
export type { AmountRange, CreateJobFormData } from "@/types/job";

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
