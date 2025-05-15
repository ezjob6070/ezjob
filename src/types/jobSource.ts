
export interface JobSource {
  id: string;
  name: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  status?: "active" | "inactive";
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  
  // Financial properties
  totalRevenue?: number;
  expenses?: number;
  companyProfit?: number;
  totalJobs?: number;
  profit?: number;
  paymentType?: "fixed" | "percentage";
  paymentValue?: number;
  isActive?: boolean;
  category?: string;
  revenue?: number;
}
