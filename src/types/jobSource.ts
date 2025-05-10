
export interface JobSource {
  id: string;
  name: string;
  type: string;
  paymentType: "fixed" | "percentage";
  paymentValue: number;
  active: boolean;
  isActive?: boolean; // Keep this for backward compatibility
  totalJobs: number;
  totalRevenue: number;
  profit: number;
  createdAt: string;
  
  // Add missing properties that are being used
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  contractorName?: string;
}
