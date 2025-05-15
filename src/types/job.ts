
export interface Job {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled";
  priority?: "low" | "medium" | "high" | "urgent";
  date: string;
  scheduledDate?: string;
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
}
