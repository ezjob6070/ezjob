
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  clientName: string;
  clientId?: string; // Add this for CreateJobModal
  title: string;
  status: JobStatus;
  date: Date;
  scheduledDate?: Date; // Add this for useJobFilters
  technicianName?: string;
  technicianId?: string; // Add this for useJobFilters
  address: string;
  amount: number;
  description?: string;
  notes?: string;
}
