
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
