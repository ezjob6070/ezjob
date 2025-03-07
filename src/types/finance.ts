
export type TimeFrame = "day" | "week" | "month" | "year" | "custom";

export type FinancialTransaction = {
  id: string;
  date: Date;
  amount: number;
  clientName: string;
  jobTitle: string;
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  category: "payment" | "expense" | "refund";
  status: "pending" | "completed" | "failed";
  notes?: string;
};

export type FinancialReport = {
  timeFrame: TimeFrame;
  startDate: Date;
  endDate: Date;
  totalRevenue: number;
  totalExpenses: number;
  companyProfit: number;
  technicianPayments: number;
  transactions: FinancialTransaction[];
};
