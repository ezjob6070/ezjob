export type JobStatus = "pending" | "in_progress" | "completed" | "cancelled" | "rescheduled";

export type PaymentMethod = "cash" | "credit" | "check" | "other";

export type Job = {
  id: string;
  clientId?: string;
  clientName: string;
  title?: string;
  technicianId: string;
  technicianName: string;
  date: Date;
  scheduledDate: Date;
  isAllDay: boolean;
  status: JobStatus;
  address: string;
  amount?: number;
  notes?: string;
  clientEmail?: string;
  clientPhone?: string;
  parts?: string[];
  signature?: string;
  completedDate?: Date;
  hasImages?: boolean;
  imageCount?: number;
  jobSourceId?: string;
  jobSourceName?: string;
  assignedTechnicians?: { id: string; name: string }[];
  additionalJobSources?: { id: string; name: string }[];
};
