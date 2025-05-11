
import { DateRange } from "react-day-picker";

export interface Job {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address?: string; // Make address optional to match the JobTypes.ts definition
  status: "scheduled" | "in-progress" | "in_progress" | "completed" | "canceled" | "cancelled" | "rescheduled" | "reschedule" | "estimate" | string;
  scheduledDate: string;
  amount: number;
  actualAmount?: number;
  description?: string;
  technician?: string;
  technicianName?: string;
  technicianId?: string;
  paymentMethod?: string;
  notes?: string;
  
  // Properties needed by components
  date?: string | Date;
  title?: string;
  
  // Additional properties needed by various components
  jobType?: string;
  serviceType?: string;
  source?: string;
  sourceId?: string;
  isAllDay?: boolean;
  expectedEndDate?: string;
  createdAt?: string;
  updatedAt?: string;
  
  // Job source related properties
  jobSourceId?: string;
  jobSourceName?: string;
  
  // Contractor related properties
  contractorId?: string;
  contractorName?: string;
  
  // Category and other properties
  category?: string;
  
  // Cancellation related
  cancellationReason?: string;
  
  // Parts and inventory
  parts?: any[];
  
  // Job priority
  priority?: JobPriority;
  
  // Additional field to match jobs.ts
  jobNumber?: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export type PaymentMethod = "cash" | "credit" | "check" | "invoice" | "other" | "";

export type JobStatus = 
  | "scheduled"
  | "in-progress" 
  | "in_progress"
  | "completed" 
  | "canceled" 
  | "cancelled"
  | "rescheduled"
  | "reschedule"
  | "estimate";

export type JobPriority = "low" | "medium" | "high" | "urgent";

export type JobTab = "all" | "scheduled" | "in-progress" | "completed" | "canceled";

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
