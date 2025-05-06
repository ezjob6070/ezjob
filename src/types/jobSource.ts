
export type JobSourcePaymentType = "percentage" | "fixed";

export interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType: JobSourcePaymentType;
  paymentValue: number;
  isActive: boolean;
  profit: number;
  createdAt: string | Date; // Allow both string and Date to accommodate different usages
  totalJobs: number;
  totalRevenue: number;
}
