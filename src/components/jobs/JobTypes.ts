
// Import the types from the main definitions
import type { Job as JobType, JobStatus, JobPriority, PaymentMethod } from '@/types/job';
import type { SortOption } from '@/types/sortOptions';

// Re-export them properly with 'export type'
export type Job = JobType;
export type { JobStatus, JobPriority, PaymentMethod, SortOption };

// Add any additional types needed specifically for components
export interface CreateJobFormData {
  title: string;
  description?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  date: string;
  time: string;
  status: JobStatus;
  priority: JobPriority;
  technicians?: string[];
  jobSource?: string;
  paymentMethod?: PaymentMethod;
  totalAmount?: number;
  category?: string;
}
