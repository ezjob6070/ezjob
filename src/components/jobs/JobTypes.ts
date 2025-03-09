
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type PaymentMethod = "credit_card" | "check" | "cash" | "zelle" | "other" | string;

export interface Job {
  id: string;
  clientName: string;
  clientId?: string;
  title: string;
  status: JobStatus;
  date: Date;
  scheduledDate?: Date;
  technicianName?: string;
  technicianId?: string;
  address: string;
  amount: number;
  paymentMethod?: PaymentMethod;
  description?: string;
  notes?: string;
  createdAt?: Date;
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
