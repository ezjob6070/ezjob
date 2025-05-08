
export type JobSourcePaymentType = "fixed" | "percentage";

export interface JobSource {
  id: string;
  name: string;
  type: string;
  paymentType: JobSourcePaymentType;
  paymentValue: number;
  isActive: boolean;
  totalJobs: number;
  totalRevenue: number;
  profit: number;
  createdAt: string | Date;
}
