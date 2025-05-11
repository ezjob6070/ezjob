export interface JobSource {
  id: string;
  name: string;
  type: string;
  paymentType: "fixed" | "percentage";
  paymentValue: number;
  isActive: boolean;
  profit: number;
  createdAt: string;
  totalJobs: number;
  totalRevenue: number;
  // Add missing properties
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
}
