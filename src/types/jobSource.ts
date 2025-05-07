
export type JobSource = {
  id: string;
  name: string;
  type: string;
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  paymentType: "percentage" | "fixed";
  paymentValue: number;
  isActive: boolean;
  totalJobs: number;
  totalRevenue: number;
  profit: number;
  expenses?: number;
  companyProfit?: number;
  createdAt: Date;
  notes?: string;
};
