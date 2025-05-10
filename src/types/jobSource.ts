
export interface JobSource {
  id: string;
  name: string;
  description?: string;
  type: string;
  active: boolean;
  isActive?: boolean; // For compatibility with code using isActive instead of active
  createdAt: string;
  phoneNumber?: string;
  email?: string;
  contactName?: string;
  address?: string;
  website?: string;
  notes?: string;
  totalJobs?: number;
  totalRevenue?: number;
  expenses?: number;
  companyProfit?: number;
  category?: string;
  // Additional properties needed by existing components
  profit?: number;
  phone?: string;
  paymentType?: string | "percentage" | "fixed";
  paymentValue?: number;
  logoUrl?: string;
  // Properties needed for components that used to have build errors
  role?: string;
  subRole?: string;
  technicianId?: string;
  date?: string | Date;
  // For other components
  contractorName?: string;
}
