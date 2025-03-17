
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type PaymentMethod = "credit_card" | "check" | "cash" | "zelle" | "other" | string;

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  title?: string; // Optional now
  status: JobStatus;
  date: Date;
  scheduledDate?: Date;
  technicianName?: string;
  technicianId?: string;
  address: string;
  amount?: number; // Optional as it's only an estimate
  actualAmount?: number; // Added for when a job is completed
  paymentMethod?: PaymentMethod;
  description?: string;
  notes?: string;
  createdAt?: Date;
  clientPhone?: string;
  clientEmail?: string;
  jobSourceId?: string;
  jobSourceName?: string;
}

// Utility types for job filtering
export type JobsByDate = {
  [date: string]: Job[];
};

export type FilteredJobs = {
  scheduled: Job[];
  in_progress: Job[];
  completed: Job[];
  cancelled: Job[];
  all: Job[];
};
