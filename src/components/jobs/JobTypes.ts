
export type JobStatus = "scheduled" | "in-progress" | "completed" | "cancelled";

export type Job = {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  technicianName: string;
  technicianId: string;
  scheduledDate: Date;
  status: JobStatus;
  amount: number;
  description: string;
  createdAt: Date;
};
