
export type JobStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  clientName: string;
  title: string;
  status: JobStatus;
  date: Date;
  technicianName?: string;
  address: string;
  amount: number;
  description?: string;
  notes?: string;
}
