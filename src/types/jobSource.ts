
export type JobSourcePaymentType = "percentage" | "fixed";

export interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType: JobSourcePaymentType;
  paymentValue: number;
  isActive: boolean;
  profit: number;
  createdAt: string | Date;
  totalJobs: number;
  totalRevenue: number;
}
