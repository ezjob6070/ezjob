
export interface JobSource {
  id: string;
  name: string;
  type?: string;
  paymentType?: string;
  paymentValue?: number;
  isActive?: boolean;
  active?: boolean;  // Adding both isActive and active to ensure compatibility
  totalJobs?: number;
  totalRevenue?: number;
  profit?: number;
  createdAt?: string;
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  address?: string;
}
