
import { JobSource } from "./jobSource";

export interface FinancialTransaction {
  id: string;
  date: Date;
  amount: number;
  category: "payment" | "expense" | "refund";
  description: string;
  status: "pending" | "completed" | "cancelled";
  clientName?: string;
  jobId?: string;
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  notes?: string;
  jobTitle?: string;
  jobSourceId?: string;
  jobSourceName?: string;
}

export interface FinancialReport {
  timeFrame: "day" | "week" | "month" | "year" | "custom";
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  companyProfit: number;
  technicianPayments: number;
  transactions: FinancialTransaction[];
}

export interface JobSourceFinance extends JobSource {
  // Extending the JobSource type to ensure compatibility
  type: string;
}

export interface FinancePage {
  activeTab: string;
  dateRange: {
    from: Date;
    to: Date;
  };
}

// Add types for other finance features
export type TimeFrame = "day" | "week" | "month" | "year" | "custom";

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  amount: number;
  percentage: number;
}

export interface OfficeExpense {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
  description?: string;
  recurring: boolean;
  paidBy?: string;
}

export type FinanceEntityType = "technician" | "jobSource" | "contractor" | "employee" | "salesman";
