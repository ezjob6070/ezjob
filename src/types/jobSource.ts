
export interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType?: "percentage" | "fixed"; // Using specific union types
  paymentValue?: number;
  isActive?: boolean;
  active?: boolean;  // Adding both isActive and active to ensure compatibility
  totalJobs?: number;
  totalRevenue?: number;
  profit?: number;
  createdAt?: string | Date; // Allow both string and Date types
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  address?: string;
  
  // Adding missing properties needed by finance components
  expenses?: number;
  companyProfit?: number;
  category?: string;
}
