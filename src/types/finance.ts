export interface FinancialTransaction {
  id: string;
  amount: number;
  date: string;
  description?: string;
  category: "payment" | "expense" | "refund";
  status: string;
  paymentMethod?: "cash" | "credit" | "check" | "bank transfer" | "other";
  technicianName?: string;
  technicianRate?: number;
  technicianRateIsPercentage?: boolean;
  jobSourceName?: string;
  clientName?: string;
  invoiceId?: string;
  quoteStatus?: "pending" | "completed" | "overdue";
}

export interface JobSource {
  id: string;
  name: string;
  totalJobs?: number;
  totalRevenue?: number;
  expenses?: number;
  companyProfit?: number;
  category?: string;
  source?: string;
  status?: string;
  costPerLead?: number;
}
