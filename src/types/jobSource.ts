
export type JobSource = {
  id: string;
  name: string;
  website?: string;
  logoUrl?: string;
  paymentType: "percentage" | "fixed";
  paymentValue: number;
  isActive: boolean;
  totalJobs: number;
  totalRevenue: number;
  profit: number;
  createdAt: Date;
};
