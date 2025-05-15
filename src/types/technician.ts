
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
  
  // Add missing properties that caused errors
  role?: string;
  subRole?: string;
  incentiveType?: string;
  incentiveAmount?: number;
  salaryBasis?: string;
  documents?: any[];
  
  // Add properties used in technician components
  initials?: string;
  completedJobs?: number;
  cancelledJobs?: number;
  earnings?: number;
  jobCount?: number;
}
