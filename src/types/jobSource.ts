
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
  
  // Additional properties needed by components
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  contractorName?: string;
  
  // Finance related properties
  expenses?: number;
  companyProfit?: number;
  category?: string;
  description?: string;
  phoneNumber?: string;
  contactName?: string;
  address?: string;
}
