
export interface Technician {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  specialty?: string;
  notes?: string;
  salary?: number;
  paymentType?: string;
  paymentRate?: number;
  hourlyRate?: number;
  employmentType?: string;
  category?: string;
  totalRevenue?: number;
  
  // Add missing properties
  role?: string;
  subRole?: string;
  incentiveType?: string;
  incentiveAmount?: number;
  salaryBasis?: string;
  documents?: any[];
  initials?: string;
  completedJobs?: number;
  cancelledJobs?: number;
  earnings?: number;
  jobCount?: number;
}
