
export interface Job {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled" | "in_progress" | "canceled" | "rescheduled" | "estimate";
  priority?: "low" | "medium" | "high" | "urgent";
  date: string | Date;
  scheduledDate?: string | Date;
  amount: number;
  actualAmount?: number;
  technicianId?: string;  // Reference to the technician assigned to the job
  clientId?: string;
  source?: string;
  projectId?: string;
  category?: string;
  type?: string;
  notes?: string;
  clientName?: string;
  location?: string;
  color?: string;
  
  // Additional properties needed by other components
  jobSourceId?: string;
  jobSourceName?: string;
  technicianName?: string;
  isAllDay?: boolean;
  paymentStatus?: "paid" | "unpaid" | "partial";
  cancellationReason?: string;
  contractorName?: string;
  contractorId?: string;
}
