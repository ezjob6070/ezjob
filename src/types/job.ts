
// Assuming this file exists and we need to add missing properties
import { SortOption } from './sortOptions';

export type JobStatus = 'scheduled' | 'in_progress' | 'completed' | 'canceled';
export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';
export type PaymentMethod = 'cash' | 'credit' | 'check' | 'bank_transfer' | 'other';

export interface Job {
  id: string;
  title: string;
  description?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  date: string;
  time: string;
  status: JobStatus;
  priority?: JobPriority;
  technicians?: string[];
  technicianId?: string;
  jobSource?: string;
  jobSourceName?: string;
  paymentMethod?: PaymentMethod;
  totalAmount?: number;
  category?: string;
  contractorName?: string;
}
