
import { DateRange } from "react-day-picker";

export interface Job {
  id: string;
  clientName: string;
  clientPhone?: string;
  clientEmail?: string;
  address: string;
  status: "scheduled" | "in progress" | "completed" | "canceled" | "rescheduled" | string;
  scheduledDate: string;
  amount: number;
  description?: string;
  technician?: string;
  technicianName?: string;
  paymentMethod?: string;
  notes?: string;
  
  // Adding missing properties
  date?: string | Date;
  technicianId?: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export type PaymentMethod = "cash" | "credit" | "check" | "invoice" | "other" | "";
