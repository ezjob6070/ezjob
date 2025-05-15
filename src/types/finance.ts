
import { DateRange } from "react-day-picker";
import { JobSource } from "./jobSource";
import { Technician } from "./technician";

export type TransactionType = "income" | "expense" | "refund" | "payment";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type TransactionCategory = 
  | "job_payment" 
  | "materials" 
  | "equipment" 
  | "salary" 
  | "technician_payment"
  | "contractor_payment"
  | "office"
  | "marketing"
  | "utilities"
  | "rent"
  | "fuel"
  | "vehicle"
  | "insurance"
  | "other";

export type TimeFrame = "day" | "week" | "month" | "year" | "custom";

export type DateFilterType = "today" | "week" | "month" | "year" | "custom";

export interface FinancialFilters {
  dateRange: DateRange | null;
  technicians: string[];
  jobSources: string[];
  categories: string[];
  searchTerm: string;
}

export interface FinancialTransaction {
  id: string;
  date: Date;
  amount: number;
  description: string;
  category: string;
  type: TransactionType;
  status: PaymentStatus;
  reference?: string;
  jobId?: string;
  technicianId?: string;
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  jobSourceId?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ExpenseCategory {
  name: string;
  amount: number;
  percentage: number;
  color: string;
}

export interface FinancialReport {
  timeFrame: TimeFrame;
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  companyProfit: number;
  technicianPayments: number;
  transactions: FinancialTransaction[];
}

// Define the JobSource interface with all financial properties
export interface JobSource extends Omit<import('./jobSource').JobSource, 'totalRevenue' | 'expenses' | 'companyProfit'> {
  totalRevenue: number;
  expenses: number;
  companyProfit: number;
  totalJobs: number;
  category?: string;
}
