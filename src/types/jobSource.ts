
export interface JobSource {
  id: string;
  name: string;
  description?: string;
  type: string;
  active: boolean; 
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
  paymentType?: string;
  paymentValue?: number;
  logoUrl?: string;
  // Properties needed for components that used to have build errors
  role?: string;
  subRole?: string;
  technicianId?: string;
  date?: string | Date;
  // For other components
  isActive?: boolean;
  contractorName?: string;
}
