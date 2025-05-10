
export interface FinancialTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  paymentMethod?: string;
  status?: 'completed' | 'pending' | 'failed';
  relatedEntityId?: string;
  relatedEntityType?: 'job' | 'project' | 'technician' | 'office';
}

export interface JobSource {
  id: string;
  name: string;
  totalJobs: number;
  totalRevenue: number;
  expenses?: number;
  companyProfit?: number;
  active: boolean;
  // Additional fields that might be used in the app
  website?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  notes?: string;
  isActive?: boolean; // For backward compatibility
}

export interface OfficeExpense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod?: string;
  recurring?: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
}
