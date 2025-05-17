
export type JobStatus = "scheduled" | "in_progress" | "completed" | "canceled" | "cancelled" | "rescheduled";

export type JobType = {
  id: string;
  title: string;
  clientName: string;
  clientId?: string;
  address: string;
  phoneNumber?: string;
  date?: Date | string;
  scheduledDate?: Date | string;
  scheduledTime?: string;
  estimatedDuration?: number;
  status: JobStatus;
  technicianId?: string;
  technicianName?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  amount?: number;
  actualAmount?: number;
  paymentStatus?: "paid" | "pending" | "partial";
  paymentMethod?: "cash" | "credit_card" | "check" | "online" | "invoice";
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  category?: string;
  type?: string;
  notes?: string;
  serviceItems?: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  images?: string[];
};
