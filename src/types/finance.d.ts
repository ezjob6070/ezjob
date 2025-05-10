
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
  // Extra fields from codebase
  type?: string;
  paymentType?: "fixed" | "percentage";
  paymentValue?: number;
  profit?: number;
  createdAt?: string;
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

// Adding Technician interface to fix type errors
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string;
  role?: string;
  subRole?: string; 
  specialty?: string;
  initials?: string;
  hourlyRate?: number;
  paymentRate?: number;
  paymentType?: string;
  ssn?: string;
  driverLicense?: string;
  idNumber?: string;
  documents?: any[];
}

// Adding Job interface to address type errors
export interface Job {
  id: string;
  title: string;
  clientName: string;
  amount: number;
  status: string;
  technicianId?: string;
  technicianName?: string;
  date: string | Date;
  scheduledDate?: string | Date;
  clientId?: string;
  jobSourceId?: string;
  jobSourceName?: string;
  clientPhone?: string;
  clientEmail?: string;
  description?: string;
  contractorId?: string;
  contractorName?: string;
  actualAmount?: number;
}
